import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/insights/insights.css';
import planStyle from 'styles/plan/plan.css';
import { timeFrameToDate } from 'components/utils/objective';
import InsightItem from 'components/pages/insights/InsightItem';
import { getNickname as getChannelNickname } from 'components/utils/channels';
import { getNickname as getIndicatorNickname } from 'components/utils/indicators';
import { getDates } from 'components/utils/date';
import FirstPageVisit from 'components/pages/FirstPageVisit';

export default class Insights extends Component {

  style = style;
  styles = [planStyle];

  render() {
    const {projectedPlan, objectives, approvedBudgets, CIM, planDate, approveChannel, declineChannel} = this.props;
    const relevantObjectives = objectives
      .filter(item => item.archived !== true && timeFrameToDate(item.timeFrame) >= new Date())
      .map(item => item.indicator);
    const firstObjective = (relevantObjectives && relevantObjectives[0]) || 'MQL';
    const nextMonthBudgets = projectedPlan[0].plannedChannelBudgets;
    const currentBudgets = Object.keys(approvedBudgets[0]).reduce((sum, current) => sum + approvedBudgets[0][current] * CIM[current][firstObjective], 0);
    const orderedSuggestions = Object.keys(nextMonthBudgets)
      .filter(channel => nextMonthBudgets[channel] !== (approvedBudgets[0][channel] || 0))
      .sort((channel1, channel2) => {
        const budget1 = (nextMonthBudgets[channel1] - (approvedBudgets[0][channel1] || 0)) * CIM[channel1][firstObjective];
        const budget2 = (nextMonthBudgets[channel2] - (approvedBudgets[0][channel2] || 0)) * CIM[channel2][firstObjective];
        return budget2 - budget1;
      })
      .map(channel => {
        const objectivesRatio = relevantObjectives.map(objective => {
          return {
            ratio: Math.round(((nextMonthBudgets[channel] - (approvedBudgets[0][channel] || 0)) * CIM[channel][objective]) / currentBudgets * 100),
            nickname: getIndicatorNickname(objective)
          }
        });
        const dates = getDates(planDate);
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
        />
      });
    return <div>
      <Page contentClassName={ planStyle.locals.content } innerClassName={ planStyle.locals.pageInner } width="100%">
        <div className={ planStyle.locals.head }>
          <div className={ planStyle.locals.headTitle }>Insights & Recommendations</div>
        </div>
        { this.props.userAccount.pages && this.props.userAccount.pages.insights ?
          <div className={ planStyle.locals.wrap }>
            <div className={this.classes.inner}>
              {orderedSuggestions}
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