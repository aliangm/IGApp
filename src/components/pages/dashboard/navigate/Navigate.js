import React from 'react';
import Component from 'components/Component';
import PathChart from 'components/pages/dashboard/navigate/PathChart';
import style from 'styles/dashboard/navigate.css';
import dashboardStyle from 'styles/dashboard/dashboard.css';
import {getChannelIcon, getNickname as getChannelNickname} from 'components/utils/channels';
import {set, merge, sum} from 'lodash';
import {formatBudget, formatBudgetShortened, formatNumber, getCommitedBudgets} from 'components/utils/budget';
import {newFunnelMapping} from 'components/utils/utils';
import DashboardStatWithContextSmall from 'components/pages/dashboard/navigate/DashboardStatWithContextSmall';
import {getColor} from 'components/utils/colors';
import {
  getIndicatorDisplaySign,
  getIndicatorsWithProps,
  getNickname as getIndicatorNickname
} from 'components/utils/indicators';
import Objective from 'components/pages/dashboard/Objective';
import Funnel from 'components/pages/dashboard/Funnel';

const MAX_CHANNELS_FOR_PERIOD = 5;

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
      <div className={this.classes.channelTooltipHeader}>{getChannelNickname(channel)}</div>
      <div className={this.classes.channelTooltipBody}>
        Impact: {formatNumber(impact)}
      </div>
    </div>;
  });

  renderFutureTooltip = ((channel, impact) => {
    const budget = impact.find(item => item.key === channel).impact;
    return <div className={this.classes.channelTooltip}>
      <div className={this.classes.channelTooltipHeader}>{getChannelNickname(channel)}</div>
      <div className={this.classes.channelTooltipBody}>
        Budget: {formatBudget(budget)}
      </div>
    </div>;
  });

  handleMonthsChange = (months) => this.setState({months});

  handleObjectiveChange = (shift) => () => {
    const objectivesCount = this.formatObjectives().length;

    this.setState(({currentObjective}) => ({
      currentObjective: (currentObjective + shift + objectivesCount) % objectivesCount
    }));
  };

  render() {
    const {forecastedIndicators, attribution: {channelsImpact}, actualIndicators, historyData: {channelsImpact: historyChannelsImpact, indicators, planBudgets: historyPlanBudgets, unknownChannels: historyUnknownChannels}, planBudgets, calculatedData: {monthlyBudget, committedForecasting, objectives: {collapsedObjectives, funnelFirstObjective}, historyData: {historyDataLength}}} = this.props;
    const {currentObjective, months} = this.state;
    const parseChannelsImpact = (channelsImpact) => {
      const impact = {};
      let sum = 0;
      channelsImpact.forEach(month => {
        month && Object.keys(month)
          .filter(channel => month[channel])
          .forEach(channel => {
            set(impact, [channel], (impact[channel] || 0) + month[channel]);
            sum += month[channel];
          });
      });
      const channelsArray = Object.keys(impact)
        .map(channel => {
          return {
            key: channel,
            impact: impact[channel],
            score: (impact[channel] / sum) + 1, // from 1 to 2
            icon: getChannelIcon(channel)
          };
        });
      return _.sortBy(channelsArray, item => item.score).reverse();
    };

    const objectives = this.formatObjectives();

    const objectiveKey = objectives[currentObjective].name;
    const mapping = newFunnelMapping[objectiveKey];

    const channelsPresent = parseChannelsImpact([channelsImpact[mapping]]);
    const channelsPast = parseChannelsImpact(historyChannelsImpact.map(month => month[mapping]).slice(0, months));

    const committedBudgets = getCommitedBudgets(planBudgets);
    const channelFuture = parseChannelsImpact(committedBudgets.slice(0, months));

    const indicatorsProperties = getIndicatorsWithProps();

    const previousMonthUnknownChannels = historyUnknownChannels[historyDataLength - 1];
    const historyCommittedBudgets = getCommitedBudgets(historyPlanBudgets);
    const previousMonthCommittedBudgets = historyCommittedBudgets[historyDataLength - 1];
    const previousMonthCosts = merge({}, previousMonthCommittedBudgets, previousMonthUnknownChannels);
    const previousMonthBudget = sum(Object.values(previousMonthCosts));

    const previousMonthLTV = indicators[historyDataLength - 1].LTV;
    const previousMonthObjective = indicators[historyDataLength - 1][funnelFirstObjective];

    return (
      <div className={this.classes.container}>
        <div className={this.classes.wrap}>
          <div className={this.classes.metrics}>
            <DashboardStatWithContextSmall value={formatBudgetShortened(monthlyBudget)} name='Budget' sign='$'
                                           stat={`${Math.round(monthlyBudget / previousMonthBudget * 100)}%`}
                                           isNegative={previousMonthBudget > monthlyBudget}/>
            <DashboardStatWithContextSmall value={formatBudgetShortened(actualIndicators.LTV)} name='LTV' sign='$'
                                           stat={`${Math.round(actualIndicators.LTV / previousMonthLTV * 100)}%`}
                                           isNegative={previousMonthLTV > actualIndicators.LTV}/>
            <DashboardStatWithContextSmall value={formatNumber(Math.round(actualIndicators.LTV / monthlyBudget * 100))}
                                           name='ROI'
                                           sign='%'
                                           stat={`${Math.round((actualIndicators.LTV / monthlyBudget) / (previousMonthLTV / previousMonthBudget) * 100)}%`}
                                           isNegative={(previousMonthLTV / previousMonthBudget) > (actualIndicators.LTV / monthlyBudget)}/>
            <DashboardStatWithContextSmall value={formatNumber(actualIndicators[funnelFirstObjective])}
                                           name={getIndicatorNickname(funnelFirstObjective)}
                                           sign={getIndicatorDisplaySign(funnelFirstObjective)}
                                           stat={`${Math.round(actualIndicators[funnelFirstObjective] / previousMonthObjective * 100)}%`}
                                           isNegative={previousMonthObjective > actualIndicators[funnelFirstObjective]}/>
          </div>
          <div className={this.classes.objectives}>
            <div className={this.classes.objectivesTitle}>
              We are going
            </div>
            <div className={this.classes.objectivesLine}>
              {
                collapsedObjectives.slice(0, 2).map((objective, index) => {
                  const target = objective.target;
                  const project = committedForecasting[objective.monthIndex] &&
                    committedForecasting[objective.monthIndex][objective.indicator];
                  return <Objective
                    target={target}
                    value={actualIndicators[objective.indicator]}
                    title={indicatorsProperties[objective.indicator].nickname}
                    project={project}
                    key={index}
                    directionDown={!indicatorsProperties[objective.indicator].isDirectionUp}
                    timeFrame={objective.dueDate}
                    color={getColor(index)}
                    indicator={objective.indicator}
                  />;
                })
              }
            </div>
          </div>
          <div className={this.classes.funnel}>
            <Funnel {
                      ...{
                        MCL: actualIndicators.newMCL,
                        MQL: actualIndicators.newMQL,
                        SQL: actualIndicators.newSQL,
                        opps: actualIndicators.newOpps,
                        users: actualIndicators.newUsers
                      }}
                    columnHeight={179}
                    columnWidth={66}
                    titleStyle={{backgroundColor: '#F5F6FB'}}/>
          </div>
        </div>
        <PathChart
          data={{
            future: formatForecastedIndicators(forecastedIndicators),
            past: indicators
          }}
          channels={{
            future: channelFuture.slice(0, MAX_CHANNELS_FOR_PERIOD),
            past: channelsPast.slice(0, MAX_CHANNELS_FOR_PERIOD),
            present: channelsPresent.slice(0, MAX_CHANNELS_FOR_PERIOD)
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
