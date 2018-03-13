import React from 'react';
import Component from 'components/Component';
import style from 'styles/insights/insight-item.css';
import icons from 'styles/icons/plan.css';
import Button from 'components/controls/Button';
import { formatBudget } from 'components/utils/budget';

export default class InsightItem extends Component {

  style = style;
  styles = [icons];

  render() {
    const {channel, channelNickname, objectivesRatio, dates, currentBudget, suggestedBudget, approveChannel, declineChannel, findBalancer} = this.props;
    const leftSideObjectives = objectivesRatio.slice(0, 2).map((item, index) => <div key={index}>
      - <b>{item.nickname}</b> {item.ratio >= 0 ? 'by' : 'only by'} <b>{Math.abs(item.ratio)}%</b><br/>
    </div>);
    const rightSideObjectives = objectivesRatio.slice(1, 2).map((item, index) => <span key={index}>
      , and {Math.abs(item.ratio)}% {item.ratio >= 0 ? 'improve' : 'decline'} in forecasted {item.nickname}
    </span>);
    return <div>
      {currentBudget ?
        suggestedBudget ?
          <div className={this.classes.frame}>
            <div className={this.classes.leftSide}>
              <div className={this.classes.title}>
                Budget Optimization Opportunity
              </div>
              <div className={this.classes.text}>
                Raising <b>{channelNickname}</b> budget in <b>{dates}</b> by <b>{Math.round(suggestedBudget / currentBudget * 100)}%</b>, could improve your forecasted<br/>
                {leftSideObjectives}
                Suggested budget: <b>${formatBudget(suggestedBudget)}</b>.
              </div>
              <div className={this.classes.buttons}>
                <Button className={this.classes.approveButton} onClick={approveChannel}>
                  <div className={this.classes.approveIcon}/>
                  Approve
                </Button>
                <Button className={this.classes.declineButton} onClick={declineChannel}>
                  <div className={this.classes.declineIcon}/>
                  Decline
                </Button>
              </div>
            </div>
            <div className={this.classes.rightSide}>
              <div className={this.classes.end}>
                <div className={this.classes.investBox}>
                  Invest
                </div>
              </div>
              <div className={this.classes.summaryTitleContainer}>
                <div className={this.classes.channelIcon} data-icon={"plan:" + channel}/>
                <div className={this.classes.summaryTitle}>
                  {objectivesRatio[0] && objectivesRatio[0].ratio}%
                </div>
              </div>
              <div className={this.classes.summaryText}>
                Improve in forecasted {objectivesRatio[0] && objectivesRatio[0].nickname}{rightSideObjectives}
              </div>
            </div>
          </div>
          :
          <div className={this.classes.frame}>
            <div className={this.classes.leftSide}>
              <div className={this.classes.title}>
                Channel Opportunity
              </div>
              <div className={this.classes.text}>
                Removing <b>{channelNickname}</b> from your mix in <b>{dates}</b>, could reduce your forecasted<br/>
                {leftSideObjectives}
                It will save you <b>${formatBudget(currentBudget)}</b> which you can invest in channels with higher
                impact.
              </div>
              <div className={this.classes.buttons}>
                <Button className={this.classes.approveButton} onClick={approveChannel}>
                  <div className={this.classes.approveIcon}/>
                  Approve
                </Button>
                <Button className={this.classes.declineButton} onClick={declineChannel}>
                  <div className={this.classes.declineIcon}/>
                  Decline
                </Button>
                <Button className={this.classes.balancerButton} onClick={findBalancer}>
                  <div className={this.classes.balancerIcon}/>
                  Find a balancer
                </Button>
              </div>
            </div>
            <div className={this.classes.rightSide}>
              <div className={this.classes.end}>
                <div className={this.classes.investBox}>
                  Save
                </div>
              </div>
              <div className={this.classes.summaryTitleContainer}>
                <div className={this.classes.channelIcon} data-icon={"plan:" + channel}/>
                <div className={this.classes.summaryTitle}>
                  {objectivesRatio[0] && objectivesRatio[0].ratio}%
                </div>
              </div>
              <div className={this.classes.summaryText}>
                Decrease in forecasted {objectivesRatio[0] && objectivesRatio[0].nickname}{rightSideObjectives}
              </div>
            </div>
          </div>
        :
        <div className={this.classes.frame}>
          <div className={this.classes.leftSide}>
            <div className={this.classes.title}>
              Channel Opportunity
            </div>
            <div className={this.classes.text}>
              Adding <b>{channelNickname}</b> to your mix in <b>{dates}</b>, could improve your forecasted<br/>
              {leftSideObjectives}
              Suggested budget: <b>${formatBudget(suggestedBudget)}</b>.
            </div>
            <div className={this.classes.buttons}>
              <Button className={this.classes.approveButton} onClick={approveChannel}>
                <div className={this.classes.approveIcon}/>
                Approve
              </Button>
              <Button className={this.classes.declineButton} onClick={declineChannel}>
                <div className={this.classes.declineIcon}/>
                Decline
              </Button>
            </div>
          </div>
          <div className={this.classes.rightSide} data-green={true}>
            <div className={this.classes.end}>
              <div className={this.classes.investBox}>
                Invest
              </div>
            </div>
            <div className={this.classes.summaryTitleContainer}>
              <div className={this.classes.channelIcon} data-icon={"plan:" + channel}/>
              <div className={this.classes.summaryTitle}>
                {objectivesRatio[0] && objectivesRatio[0].ratio}%
              </div>
            </div>
            <div className={this.classes.summaryText}>
              Improve in forecasted {objectivesRatio[0] && objectivesRatio[0].nickname}{rightSideObjectives}
            </div>
          </div>
        </div>
      }
    </div>

  }
}

