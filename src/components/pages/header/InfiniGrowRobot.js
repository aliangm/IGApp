import React from 'react';
import Component from 'components/Component';
import style from 'styles/header/infinigrow-robot.css';
import { getNickname as getIndicatorNickname } from 'components/utils/indicators';
import { timeFrameToDate } from 'components/utils/objective';

export default class InfiniGrowRobot extends Component {

  style = style;

  static defaultProps = {
    objectives: [],
    comapny: '',
    historyData: {},
    actualIndicators: {}
  };

  render() {
    const {objectives, company, historyData, actualIndicators} = this.props;

    const funnelPossibleObjectives = ['newMCL', 'newMQL', 'newSQL', 'newOpps', 'newUsers'];
    let firstObjective = objectives
      .find(item => item.archived !== true && timeFrameToDate(item.timeFrame) >= new Date() && funnelPossibleObjectives.includes(item.indicator));

    firstObjective = firstObjective ? firstObjective.indicator : 'newSQL';
    const historyValue = historyData && historyData.indicators && historyData.indicators[firstObjective] && historyData.indicators[firstObjective][0];
    const currentValue = actualIndicators[firstObjective];
    return <div className={this.classes.inner}>
      <div className={this.classes.textBubble}>
        Since joining InfiniGrow, {company}'s {getIndicatorNickname(firstObjective)} has grown by {Math.round((currentValue - historyValue) / historyValue * 100)}%!
      </div>
      <div className={this.classes.robot}/>
    </div>
  }

}