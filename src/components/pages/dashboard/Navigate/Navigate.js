import React from 'react';
import Component from 'components/Component';
import PathChart from 'components/pages/dashboard/Navigate/PathChart';
import style from 'styles/dashboard/navigate.css';
import dashboardStyle from 'styles/dashboard/dashboard.css';
import {getChannelIcon, getNickname} from 'components/utils/channels';
import {set} from 'lodash';
import {formatBudget, formatNumber, getCommitedBudgets} from 'components/utils/budget';
import {newFunnelMapping} from 'components/utils/utils';

const formatForecastedIndicators = (forecastedIndicators) => forecastedIndicators.map((month) =>
  Object.keys(month).reduce((res, key) => ({
    ...res,
    [key]: month[key].committed
  }), {})
);

export default class Navigate extends Component {

  style = style;
  styles = [dashboardStyle];

  constructor(props) {
    super(props);
    this.state = {
      currentObjective: 0,
      months: 2
    };
  }

  // componentDidMount() {
  //   const objective = this.formatObjectives()[0];
  //   this.setState({objective, months: objective.months + 1, currentObjective: 0});
  // }

  formatObjectives = () => {
    const {collapsedObjectives, funnelObjectives} = this.props.calculatedData.objectives;
    return collapsedObjectives
      .filter((obj) => funnelObjectives.includes(obj.indicator))
      .map((obj) => {
        return {
          name: obj.indicator,
          target: obj.target
        };
      });
  };

  // channel tooltip just for example
  renderChannelTooltip = ((channel, impacts) => {
  const impact = impacts.find(item => item.key === channel).impact;
    return <div className={this.classes.channelTooltip}>
      <div className={this.classes.channelTooltipHeader}>{getNickname(channel)}</div>
      Impact: {formatNumber(impact)}
    </div>
  });

  renderFutureTooltip = ((channel, impact) => {
    const budget = impact.find(item => item.key === channel).impact;
    return <div className={this.classes.channelTooltip}>
      <div className={this.classes.channelTooltipHeader}>{getNickname(channel)}</div>
      Budget: {formatBudget(budget)}
    </div>
  });

  handleMonthsChange = (months) => this.setState({months});

  handleObjectiveChange = (shift) => () => {
    const objectivesCount = this.formatObjectives().length;

    this.setState(({currentObjective}) => ({
      currentObjective: (currentObjective + shift + objectivesCount) % objectivesCount
    }));
  };

  render() {
    const {forecastedIndicators, attribution: {channelsImpact}, historyData: {channelsImpact: historyChannelsImpact, indicators}, planBudgets, calculatedData: {historyData: {historyDataLength}}} = this.props;
    const {currentObjective, months} = this.state;
    const parseChannelsImpact = (channelsImpact) => {
      const impact = {};
      let sum = 0;
      channelsImpact.forEach(month => {
        month && Object.keys(month).forEach(channel => {
          set(impact, [channel], (impact[channel] || 0) + month[channel]);
          sum += month[channel];
        });
      });
      return Object.keys(impact)
        .map(channel => {
          return {
            key: channel,
            impact: impact[channel],
            score: (impact[channel] / sum) + 1, // from 1 to 2
            icon: getChannelIcon(channel)
          };
        });
    };

    const objectives = this.formatObjectives();

    const objectiveKey = objectives[currentObjective].name;
    const mapping = newFunnelMapping[objectiveKey];

    const channelsPresent = parseChannelsImpact([channelsImpact[mapping]]);
    const channelsPast = parseChannelsImpact(historyChannelsImpact.map(month => month[mapping]).slice(0, months));

    const committedBudgets = getCommitedBudgets(planBudgets);
    const channelFuture = parseChannelsImpact(committedBudgets.slice(0, months));

    return (
      <div className={this.classes.container}>
        <div className={dashboardStyle.locals.wrap}>🚧</div>
        <PathChart
          data={{
            future: formatForecastedIndicators(forecastedIndicators),
            past: indicators
          }}
          channels={{
            future: channelFuture.slice(0, 5),
            past: channelsPast.slice(0, 5),
            present: channelsPresent.slice(0, 5)
          }}
          tooltip={{
            future: (channel) => this.renderFutureTooltip(channel, channelFuture),
            past: (channel) => this.renderChannelTooltip(channel, channelsPast),
            present: (channel) => this.renderChannelTooltip(channel, channelsPresent)
          }}
          handleMonthsChange={this.handleMonthsChange}
          handleObjectiveChange={this.handleObjectiveChange}
          objectives={objectives}
          currentObjective={currentObjective}
          months={months}
          maxMonths={historyDataLength}
        />
      </div>
    );
  }
}
