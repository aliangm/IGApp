import Component from 'components/Component';
import React, {PropTypes} from 'react';
import style from 'styles/plan/plan-optimization-popup.css';
import InsightItem from 'components/pages/plan/suggestionsChatSteps/InsightItem';

export default class InsightStep extends Component {
  style = style;

  static PropTypes = {
    getInsightData: PropTypes.func.isRequired,
    plan: PropTypes.any.isRequired
  };

  componentWillMount() {
    this.insightData = this.props.getInsightData && this.props.getInsightData();
  }

  componentDidMount() {
    // Patch for preventing ReactSimpleChatBot scroll to bottom when a ReactTooltip is added to a component in the step
    this.refs.outerDiv.addEventListener('DOMNodeInserted', this.stopEventPropagation);
  }

  componentWillUnmount() {
    this.refs.outerDiv.removeEventListener('DOMNodeInserted', this.stopEventPropagation);
  }

  stopEventPropagation = (e) => {
    e.stopPropagation();
  };

  render() {
    const {planDate} = this.props;
    const {fromChannels, toChannels, forecastedIndicators, commitPlanBudgets} = this.insightData;
    return <div className={this.classes.optionsWrapper} ref='outerDiv'>
      <InsightItem fromChannels={fromChannels}
                   toChannels={toChannels}
                   planDate={planDate}
                   forecasting={forecastedIndicators}
                   onCommit={() => {
                     commitPlanBudgets()
                       .then(() => this.props.triggerNextStep({trigger: '8'}));
                   }}
                   onDecline={() => {
                     this.props.triggerNextStep({trigger: '11'});
                   }}
      />
    </div>;
  }
}