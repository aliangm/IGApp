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
    const leftSideObjectives = objectivesRatio
      .filter(item => item.ratio !== 0)
      .slice(0, 2)
      .map((item, index) => <div key={index}>
        - <b>{item.nickname}</b> {item.ratio >= 0 ? 'by' : 'only by'} <b>{Math.abs(item.ratio)}%</b> ({(item.projected < 0 ? '-' : '+') + formatBudget(Math.abs(item.projected))})<br/>
      </div>);
    const rightSideObjectives = objectivesRatio
      .filter(item => item.ratio !== 0)
      .slice(1, 2)
      .map((item, index) => <span key={index}>
      , and {Math.abs(item.ratio)}% {item.ratio >= 0 ? 'improve' : 'decline'} in forecasted {item.nickname}
    </span>);
    return <div>
      {currentBudget && suggestedBudget ?
        <div className={this.classes.frame}>
          <div className={this.classes.leftSide}>
            <div className={this.classes.title}>
              Budget Optimization Opportunity
            </div>
            <div className={this.classes.text}>
              {suggestedBudget > currentBudget ? 'Raising' : 'Reducing'} <b>{channelNickname}</b> budget in <b>{dates}</b> by <b>{Math.round((suggestedBudget > currentBudget ? suggestedBudget / currentBudget - 1 : currentBudget / suggestedBudget - 1) * 100)}%</b>, could {suggestedBudget > currentBudget ? 'improve' : 'reduce'} your forecasted<br/>
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
              { findBalancer ?
                <Button className={this.classes.balancerButton} onClick={findBalancer}>
                  <div className={this.classes.balancerIcon}/>
                  Find a balancer
                </Button>
                : null }
            </div>
          </div>
          <div className={this.classes.rightSide}>
            <div className={this.classes.end}>
              <div className={this.classes.investBox}>
                {suggestedBudget > currentBudget ? 'Invest' : 'Save'}
              </div>
            </div>
            <div className={this.classes.summaryTitleContainer}>
              <div className={this.classes.channelIcon} data-icon={"plan:" + channel}/>
              <div className={this.classes.summaryTitle}>
                {Math.abs(objectivesRatio[0] && objectivesRatio[0].ratio)}%
              </div>
            </div>
            <div className={this.classes.summaryText}>
              {(objectivesRatio[0] && objectivesRatio[0].ratio) > 0 ? 'Improve' : 'Decline'} in forecasted {objectivesRatio[0] && objectivesRatio[0].nickname}{rightSideObjectives}
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
              {suggestedBudget ? 'Adding' : 'Removing'} <b>{channelNickname}</b> {suggestedBudget ? 'to' : 'from'} your mix in <b>{dates}</b>, could {suggestedBudget ? 'improve' : 'reduce'} your forecasted<br/>
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
              { findBalancer ?
                <Button className={this.classes.balancerButton} onClick={findBalancer}>
                  <div className={this.classes.balancerIcon}/>
                  Find a balancer
                </Button>
                : null }
            </div>
          </div>
          <div className={this.classes.rightSide} data-green={true}>
            <div className={this.classes.end}>
              <div className={this.classes.investBox}>
                {suggestedBudget > currentBudget ? 'Invest' : 'Save'}
              </div>
            </div>
            <div className={this.classes.summaryTitleContainer}>
              <div className={this.classes.channelIcon} data-icon={"plan:" + channel}/>
              <div className={this.classes.summaryTitle}>
                {Math.abs(objectivesRatio[0] && objectivesRatio[0].ratio)}%
              </div>
            </div>
            <div className={this.classes.summaryText}>
              {(objectivesRatio[0] && objectivesRatio[0].ratio) > 0 ? 'Improve' : 'Decline'} in forecasted {objectivesRatio[0] && objectivesRatio[0].nickname}{rightSideObjectives}
            </div>
          </div>
        </div>
      }
    </div>

  }
}

