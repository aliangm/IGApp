import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import insightsStyle from 'styles/insights/insights.css';
import style from 'styles/insights/insight-item.css';
import planStyle from 'styles/plan/plan.css';
import { timeFrameToDate } from 'components/utils/objective';
import InsightItem from 'components/pages/insights/InsightItem';
import { getNickname as getChannelNickname } from 'components/utils/channels';
import { getNickname as getIndicatorNickname } from 'components/utils/indicators';
import { getDates } from 'components/utils/date';
import FirstPageVisit from 'components/pages/FirstPageVisit';
import merge from 'lodash/merge';
import { formatBudget } from 'components/utils/budget';
import Button from 'components/controls/Button';

export default class Insights extends Component {

  style = style;
  styles = [insightsStyle, planStyle];

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const {projectedPlan, objectives, approvedBudgets, CIM, planDate, approveChannel, declineChannel} = this.props;
    const {showBalancerPopup, channelToRemove, channelToBalance} = this.state;
    const relevantObjectives = objectives
      .filter(item => item.archived !== true && timeFrameToDate(item.timeFrame) >= new Date())
      .map(item => item.indicator);
    const firstObjective = (relevantObjectives && relevantObjectives[0]) || 'MQL';
    const zeroBudgetSuggestions = {};
    Object.keys(approvedBudgets[0]).forEach(key => zeroBudgetSuggestions[key] = 0);
    const nextMonthBudgets = merge(zeroBudgetSuggestions, projectedPlan[0].plannedChannelBudgets);
    const currentBudgets = Object.keys(approvedBudgets[0]).reduce((sum, current) => sum + approvedBudgets[0][current] * CIM[current][firstObjective], 0);
    const orderedSuggestions = Object.keys(nextMonthBudgets)
      .filter(channel => nextMonthBudgets[channel] !== (approvedBudgets[0][channel] || 0))
      .sort((channel1, channel2) => {
        const budget1 = (nextMonthBudgets[channel1] - (approvedBudgets[0][channel1] || 0)) * CIM[channel1][firstObjective];
        const budget2 = (nextMonthBudgets[channel2] - (approvedBudgets[0][channel2] || 0)) * CIM[channel2][firstObjective];
        return budget2 - budget1;
      });
    const cubes = orderedSuggestions.map(channel => {
      const objectivesRatio = relevantObjectives.map(objective => {
        return {
          ratio: Math.round(((nextMonthBudgets[channel] - (approvedBudgets[0][channel] || 0)) * CIM[channel][objective]) / currentBudgets * 100),
          nickname: getIndicatorNickname(objective)
        }
      });
      const dates = getDates(planDate);
      const findBalancer = (channel) => {
        const budget = approvedBudgets[0][channel] || 0;
        const delta = 0.1 * budget;
        const lowerRange = budget - delta;
        const higherRange = budget + delta;
        const relevantChannel = orderedSuggestions
          .filter(item => item !== channel)
          .find(item => nextMonthBudgets[item] > lowerRange && nextMonthBudgets[item] < higherRange);
        if (relevantChannel) {
          this.setState({channelToRemove: channel, channelToBalance: relevantChannel, showBalancerPopup: true});
        }
      };
      return <InsightItem
        key={channel}
        channel={channel}
        channelNickname={getChannelNickname(channel)}
        objectivesRatio={objectivesRatio}
        dates={dates[0]}
        currentBudget={approvedBudgets[0][channel] || 0}
        suggestedBudget={nextMonthBudgets[channel]}
        approveChannel={() => { approveChannel(0, channel, nextMonthBudgets[channel]) }}
        declineChannel={() => { declineChannel(0, channel, (approvedBudgets[0][channel] || 0)) }}
        findBalancer={() => { findBalancer(channel) }}
      />
    });

    return <div>
      <Page contentClassName={ planStyle.locals.content } innerClassName={ planStyle.locals.pageInner } width="100%">
        <div className={ planStyle.locals.head }>
          <div className={ planStyle.locals.headTitle }>Insights & Recommendations</div>
        </div>
        { this.props.userAccount.pages && this.props.userAccount.pages.insights ?
          <div className={ planStyle.locals.wrap }>
            <div className={insightsStyle.locals.inner}>
              {cubes}
              {showBalancerPopup ?
                <Page popup={true} width="825px" contentClassName={insightsStyle.locals.popupContent}>
                  <div className={this.classes.frame} style={{marginBottom: '0', height: '300px'}}>
                    <div className={this.classes.leftSide}>
                      <div className={this.classes.title}>
                        2-Sides Optimization Opportunity
                      </div>
                      <div className={this.classes.text}>
                        Removing <b>{getChannelNickname(channelToRemove)}</b> from your mix
                        in <b>{getDates(planDate)[0]}</b> and instead
                        adding <b>{getChannelNickname(channelToBalance)}</b>, could improve your
                        forecasted<br/>
                        {relevantObjectives.slice(0, 2).map((objective, index) => {
                          const ratio = Math.abs(Math.round((((nextMonthBudgets[channelToBalance] - (approvedBudgets[0][channelToBalance] || 0)) * CIM[channelToBalance][objective]) + ((nextMonthBudgets[channelToRemove] - (approvedBudgets[0][channelToRemove] || 0)) * CIM[channelToRemove][objective])) / currentBudgets * 100));
                          return <div key={index}>
                            - <b>{getIndicatorNickname(objective)}</b> {ratio >= 0 ? 'by' : 'only by'} <b>{ratio}%</b><br/>
                          </div>
                        })
                        }
                        Suggested budget: <b>${formatBudget(nextMonthBudgets[channelToBalance])}</b>.<br/>
                        Saved budget: <b>${formatBudget(approvedBudgets[0][channelToRemove] || 0)}</b>.<br/>
                        Total budget change: <b style={{ color: '#2fae23' }}>${formatBudget((approvedBudgets[0][channelToRemove] || 0) - nextMonthBudgets[channelToBalance])}</b>.
                      </div>
                      <div className={this.classes.buttons} style={{ top: '243px' }}>
                        <Button className={this.classes.approveButton} onClick={ () => {
                          approveChannel(0, channelToRemove, nextMonthBudgets[channelToRemove] || 0);
                          approveChannel(0, channelToBalance, nextMonthBudgets[channelToBalance]);
                          this.setState({channelToRemove: '', channelToBalance: '', showBalancerPopup: false});
                        }
                        }>
                          <div className={this.classes.approveIcon}/>
                          Approve
                        </Button>
                        <Button className={this.classes.declineButton} onClick={ () => {
                          declineChannel(0, channelToRemove, (approvedBudgets[0][channelToRemove] || 0));
                          declineChannel(0, channelToBalance, (approvedBudgets[0][channelToBalance] || 0));
                          this.setState({channelToRemove: '', channelToBalance: '', showBalancerPopup: false});

                        }
                        }>
                          <div className={this.classes.declineIcon}/>
                          Decline
                        </Button>
                      </div>
                    </div>
                    <div className={this.classes.rightSide}>
                      <div className={insightsStyle.locals.closePopup} onClick={ () => { this.setState({channelToRemove: '', channelToBalance: '', showBalancerPopup: false}) } }/>
                      <div className={this.classes.end}>
                        <div className={this.classes.investBox} style={{ width: '94px' }}>
                          Optimize
                        </div>
                      </div>
                      <div className={this.classes.summaryTitleContainer}>
                        <div className={insightsStyle.locals.channelIcons}>
                          <div className={insightsStyle.locals.upperIcon} data-icon={"plan:" + channelToBalance}/>
                          <div className={insightsStyle.locals.lowerIcon} data-icon={"plan:" + channelToRemove}/>
                        </div>
                        <div className={this.classes.summaryTitle}>
                          {relevantObjectives[0] && Math.abs(Math.round((((nextMonthBudgets[channelToBalance] - (approvedBudgets[0][channelToBalance] || 0)) * CIM[channelToBalance][relevantObjectives[0]]) + ((nextMonthBudgets[channelToRemove] - (approvedBudgets[0][channelToRemove] || 0)) * CIM[channelToRemove][relevantObjectives[0]])) / currentBudgets * 100))}%
                        </div>
                      </div>
                      <div className={this.classes.summaryText}>
                        Improve in forecasted {relevantObjectives[0] && getIndicatorNickname(relevantObjectives[0])}{relevantObjectives.slice(1, 2).map((objective, index) => {
                        const ratio = Math.abs(Math.round((((nextMonthBudgets[channelToBalance] - (approvedBudgets[0][channelToBalance] || 0)) * CIM[channelToBalance][objective]) + ((nextMonthBudgets[channelToRemove] - (approvedBudgets[0][channelToRemove] || 0)) * CIM[channelToRemove][objective])) / currentBudgets * 100));
                        return <span key={index}>
                          , and {Math.abs(ratio)}% {ratio >= 0 ? 'improve' : 'decline'} in forecasted {getIndicatorNickname(objective)}
                        </span>
                      })}
                      </div>
                    </div>
                  </div>
                </Page>
                : null
              }
            </div>
          </div>
          :
          <FirstPageVisit
            title="Understand how to allocate your next $"
            content="You have limitless of options of how to manage your marketing spend. Get insights and recommendations on your best next move."
            action="Show me the best next action >"
            icon="step:insights"
            onClick={() => {
              this.props.updateUserAccount({'pages.insights': true})
            }}
          />
        }
      </Page>
    </div>
  }
}