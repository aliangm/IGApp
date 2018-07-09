import React from "react";
import Component from "components/Component";
import style from "styles/onboarding/onboarding.css";
import { PieChart, Pie, Cell } from "recharts";
import dashboardStyle from "styles/dashboard/dashboard.css";
import Objective from 'components/pages/dashboard/Objective';
import Funnel from 'components/pages/dashboard/Funnel';
import { getIndicatorsWithProps, getNickname as getIndicatorNickname, getMetadata as getIndicatorMetadata } from 'components/utils/indicators';
import { getChannelsWithProps, getMetadata as getChannelMetadata } from 'components/utils/channels';
import { formatBudget, formatBudgetShortened } from 'components/utils/budget';
import CampaignsByFocus from 'components/pages/dashboard/CampaignsByFocus';
import { timeFrameToDate } from 'components/utils/objective';
import Steps from 'components/pages/dashboard/Steps';
import Label from 'components/ControlsLabel';
import merge from 'lodash/merge';
import { formatDate } from 'components/utils/date';
import PlanPopup, {
  TextContent as PopupTextContent
} from 'components/pages/plan/Popup';
import Select from 'components/controls/Select';
import { getDates } from 'components/utils/date';
import PerformanceGraph from 'components/pages/analyze/PerformanceGraph';
import TopX from 'components/pages/dashboard/TopX';
import DashboardStatWithContext from 'components/pages/dashboard/DashboardStatWithContext.js';
import { getExtarpolateRatio } from 'utils';

export default class CMO extends Component {

  style = style;
  styles = [dashboardStyle];

  static defaultProps = {
    approvedBudgets: [],
    approvedBudgetsProjection: [],
    actualIndicators: {
      MCL: 0,
      MQL: 0,
      SQL: 0,
      opps: 0,
      users: 0
    },
    unfilteredCampaigns: {},
    objectives: [],
    annualBudgetArray: []
  };

  constructor() {
    super();

    this.state = {
      activeIndex: void 0,
      onlyThisMonth: true,
      advancedIndicator: 'SQL'
    };
    this.onPieEnter = this.onPieEnter.bind(this);
  }

  initialize(props) {
    if (this.state.months === undefined && props.previousData) {
      this.setState({months: props.previousData.length});
    }

    //set objective
    const firstObjective = props.objectives
      .find(item => item.isArchived !== true && timeFrameToDate(item.timeFrame) >= new Date());
    if (firstObjective){
      this.setState({advancedIndicator: firstObjective.indicator});
    }
  }

  componentDidMount() {
    this.initialize(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  }

  onPieEnter(data, index) {
    this.setState({
      activeIndex: index,
    });
  }

  getDateString(stringDate) {
    if (stringDate) {
      const monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
      ];
      const planDate = stringDate.split("/");
      const date = new Date(planDate[1], planDate[0] - 1);

      return monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2);
    }

    return null;
  }

  render() {
    const { planDate, approvedBudgets, approvedBudgetsProjection, actualIndicators, campaigns, objectives, annualBudgetArray, planUnknownChannels, previousData, attribution, CEVs, annualBudget, calculatedData: {annualBudgetLeftToPlan, monthlyBudget, monthlyBudgetLeftToInvest, monthlyExtarpolatedMoneySpent, monthlyExtapolatedTotalSpending}} = this.props;
    const { months, isPast, advancedIndicator, showAdvanced } = this.state;
    const merged = merge(approvedBudgets, planUnknownChannels);
    const fatherChannelsWithBudgets = [];
    Object.keys(merged && merged[0])
      .filter(channel => merged[0][channel])
      .forEach(channel => {
        const category = getChannelMetadata('category', channel);
        const alreadyExistItem = fatherChannelsWithBudgets.find(item => item.name === category);
        if (!alreadyExistItem) {
          fatherChannelsWithBudgets.push({name: category, value: merged[0][channel]})
        }
        else {
          alreadyExistItem.value += merged[0][channel];
        }
      });

    const numberOfActiveCampaigns = campaigns
      .filter(campaign => campaign.isArchived !== true && campaign.status !== 'Completed').length;

    const monthlyOnTrackSpending =  monthlyBudget * getExtarpolateRatio(new Date(), planDate);
    const isOnTrack = Math.abs(monthlyOnTrackSpending - monthlyExtarpolatedMoneySpent) < monthlyOnTrackSpending*0.07;

    const ratioCalc = (LTV, CAC) => (LTV/CAC).toFixed(2) || 0;
    const ratioCanBeCalculated = (actualIndicators) => (actualIndicators && actualIndicators.LTV !== 0 && actualIndicators.CAC !== 0);
    const ratio = ratioCanBeCalculated(actualIndicators) ? ratioCalc(actualIndicators.LTV, actualIndicators.CAC) : null;
    const previousMonthData = (previousData && previousData.length > 1) ? previousData[previousData.length-2] : {actualIndicators: {LTV: 0, CAC: 0}};
    const lastMonthRatio = ratioCanBeCalculated(previousMonthData.actualIndicators) ? ratioCalc(previousMonthData.actualIndicators.LTV, previousMonthData.actualIndicators.CAC) : undefined;
    const ratioContextStat = (ratio && lastMonthRatio) ? Math.round((ratio / lastMonthRatio) * 100) - 100 : undefined;

    const COLORS = [
      '#189aca',
      '#3cca3f',
      '#a8daec',
      '#70d972',
      '#56b5d9',
      '#8338EC',
      '#40557d',
      '#f0b499',
      '#ffd400',
      '#3373b4',
      '#72c4b9',
      '#FB5607',
      '#FF006E',
      '#76E5FC',
      '#036D19'
    ];
    const funnel = [];
    if (actualIndicators.MCL !== -2){
      funnel.push({ name: 'Leads', value: actualIndicators.MCL });
    }
    if (actualIndicators.MQL !== -2) {
      funnel.push({ name: 'MQL', value: actualIndicators.MQL });
    }
    if (actualIndicators.SQL !== -2) {
      funnel.push({ name: 'SQL', value: actualIndicators.SQL });
    }
    if (actualIndicators.opps !== -2) {
      funnel.push({ name: 'Opps', value: actualIndicators.opps });
    }

    const funnelRatios = [];
    for (let i=0; i< funnel.length - 1; i++) {
      funnelRatios.push({ name: funnel[i].name + ':' + funnel[i+1].name, value: funnel[i+1].value / funnel[i].value });
    }
    const minRatio = Math.min(... funnelRatios.map(item => item.value));
    const minRatioTitle = funnelRatios
      .filter(item => item.value == minRatio)
      .map(item => item.name);

    const funnelMetricsValues = this.state.onlyThisMonth ?
      {
        MCL: actualIndicators.newMCL,
        MQL: actualIndicators.newMQL,
        SQL: actualIndicators.newSQL,
        opps: actualIndicators.newOpps,
        users: actualIndicators.newUsers
      }
      :
      {
        MCL: actualIndicators.MCL,
        MQL: actualIndicators.MQL,
        SQL: actualIndicators.SQL,
        opps: actualIndicators.opps,
        users: actualIndicators.users
      };

    const indicatorsProperties = getIndicatorsWithProps();
    const objectivesGauges = objectives.map((objective, index) => {
      if (!objective.isArchived) {
        const delta = objective.isPercentage ? objective.amount * (objective.currentValue || 0) / 100 : objective.amount;
        const target = Math.round(objective.direction === "equals" ? objective.amount : (objective.direction === "increase" ? delta + (objective.currentValue || 0) : (objective.currentValue || 0) - delta));
        const month = timeFrameToDate(objective.timeFrame).getMonth();
        const project = approvedBudgetsProjection[month] && approvedBudgetsProjection[month][objective.indicator];
        return <Objective
          target={target}
          value={actualIndicators[objective.indicator]}
          title={indicatorsProperties[objective.indicator].nickname}
          project={project}
          key={index}
          directionDown={objective.direction === "decrease"}
          timeFrame={objective.timeFrame}
          color={COLORS[index % COLORS.length]}
          isDollar={indicatorsProperties[objective.indicator].isDollar}
          isPercentage={indicatorsProperties[objective.indicator].isPercentage}
        />
      }
    });

    const funnelPossibleObjectives = ['newMCL', 'newMQL', 'newSQL', 'newOpps', 'newUsers'];
    const funnelObjectives = objectives
      .filter(item => item.isArchived !== true && timeFrameToDate(item.timeFrame) >= new Date() && funnelPossibleObjectives.includes(item.indicator))
      .map(item => item.indicator);

    const firstFunnelObjective = funnelObjectives && funnelObjectives.length > 0 ? funnelObjectives[0] : 'newMQL';

    const futureBudget = approvedBudgets.slice(0, months).reduce((sum, month) => Object.keys(month).reduce((monthSum, channel) => month[channel] + monthSum, 0) + sum, 0);
    const futureLTV = approvedBudgetsProjection.slice(0, months).reduce((sum, item) => sum + item.LTV, 0);
    const furureObjective = approvedBudgetsProjection.slice(0, months).reduce((sum, item) => sum + item[firstFunnelObjective], 0);

    const relevantPreviousData = previousData && previousData.slice(previousData.length - months);
    const pastBudget = relevantPreviousData && relevantPreviousData.reduce((sum, item) => Object.keys(item.approvedBudgets && item.approvedBudgets[0]).reduce((monthSum, channel) => item.approvedBudgets[0][channel] + monthSum, 0) + sum, 0);
    const pastLTV = relevantPreviousData && relevantPreviousData.reduce((sum, item) => (item.actualIndicators.LTV || 0) + sum, 0);
    const pastObjective = relevantPreviousData && relevantPreviousData.reduce((sum, item) => (item.actualIndicators[firstFunnelObjective] || 0) + sum, 0);

    const relativePastData = previousData && previousData.slice(previousData.length - (2 * months), previousData.length - months);
    const relativePastBudget = relativePastData && relativePastData.reduce((sum, item) => Object.keys(item.approvedBudgets && item.approvedBudgets[0]).reduce((monthSum, channel) => item.approvedBudgets[0][channel] + monthSum, 0) + sum, 0);
    const relativePastLTV = relativePastData && relativePastData.reduce((sum, item) => (item.actualIndicators.LTV || 0) + sum, 0);
    const relativePastObjective = relativePastData && relativePastData.reduce((sum, item) => (item.actualIndicators[firstFunnelObjective] || 0) + sum, 0);

    const monthsOptions = previousData && previousData.map((item, index) => {
      return {value: index + 1, label: index + 1}
    });

    const futureDates = getDates(this.props.planDate);

    const weights = {
      newMCL: 1,
      newMQL: 1,
      newSQL: 1,
      newOpps: 1,
      newUsers: 1
    };

    Object.keys(weights).forEach(indicator => {
      const objectiveIndex = funnelObjectives.findIndex(function (objective) {
        return objective === indicator;
      });
      switch (objectiveIndex) {
        case 0:
          weights[indicator] = 2;
          break;
        case 1:
          weights[indicator] = 1.5;
          break;
        case 2:
          weights[indicator] = 1.25;
          break;
      }
    });

    const channelsWithProps = getChannelsWithProps();
    const topChannels = Object.keys(channelsWithProps).map(channel => {
      const score = Math.round(CEVs.MCL[channel] * weights.newMCL
        + CEVs.MQL[channel] * weights.newMQL
        + CEVs.SQL[channel] * weights.newSQL
        + CEVs.opps[channel] * weights.newOpps
        + CEVs.users[channel] * weights.newUsers);
      return {title: channelsWithProps[channel].nickname, score: score, icon: "plan:" + channel};
    });

    const topCampaigns = Object.keys(attribution.campaigns).map(campaign => {
      const campaignData = attribution.campaigns[campaign];
      const score = Math.round(campaignData.MCL * weights.newMCL
        + campaignData.MQL * weights.newMQL
        + campaignData.SQL * weights.newSQL
        + campaignData.opps * weights.newOpps
        + campaignData.users * weights.newUsers);
      return {title: campaign, score: score, icon: campaignData.channels.length > 0 ? campaignData.channels.length === 1 ? 'plan:' + campaignData.channels[0] : 'plan:multiChannel' : null};
    });

    const topContent = attribution.pages.map(item => {
      const score = Math.round(item.MCL * weights.newMCL
        + item.MQL * weights.newMQL
        + item.SQL * weights.newSQL
        + item.opps * weights.newOpps
        + item.users * weights.newUsers);
      return {title: item.title, score: score, icon: 'plan:' + item.channel};
    });

    const data = isPast ?
      relevantPreviousData.map(month => {
        const json = {
          name: formatDate(month.planDate)
        };
        month.approvedBudgets && Object.keys(month.approvedBudgets[0]).forEach(channel => {
          json[channel] = month.approvedBudgets[0][channel];
        });

        json['total'] = month.approvedBudgets && Object.keys(month.approvedBudgets[0]).reduce((sum, channel) =>
          sum + month.approvedBudgets[0][channel], 0);

        Object.keys(month.actualIndicators).forEach(indicator => {
          json[indicator] = month.actualIndicators[indicator];
        });

        return json;
      })
      :
      approvedBudgets.slice(0, months).map((month, index) => {
        const json = {
          name: futureDates[index]
        };
        Object.keys(month).forEach(channel => {
          json[channel] = month[channel];
        });

        json['total'] = Object.keys(month).reduce((sum, channel) =>
          sum + month[channel], 0);

        Object.keys(approvedBudgetsProjection[index]).forEach(indicator => {
          json[indicator] = approvedBudgetsProjection[index][indicator];
        });
        return json;
      });

    return <div className={ dashboardStyle.locals.wrap }>
      <Steps {... this.props}/>
      <div className={ this.classes.cols }>
        <div className={ this.classes.colLeft }>
          <div className={ dashboardStyle.locals.item } style={{ height: '300px', width: '1110px', display: 'flex', padding: '12px', overflow: 'visible' }}>
            <div className={ dashboardStyle.locals.column } data-border={true} data-selected={(showAdvanced && isPast) ? true : null}>
              <div className={ dashboardStyle.locals.columnHeader }>
                <div className={ dashboardStyle.locals.timeText }>
                  Last {months} Months
                </div>
                <div className={ dashboardStyle.locals.text } style={{ borderBottom: 'none' }}>
                  Past
                </div>
                <div className={ dashboardStyle.locals.advanced } onClick={ ()=>{ this.setState({showAdvanced: !showAdvanced, isPast: true }) }}/>
                <div style={{ position: 'relative' }}>
                  <div className={ dashboardStyle.locals.settings } onClick={ ()=>{ this.refs.pastSettingsPopup.open() }}/>
                  <PlanPopup ref="pastSettingsPopup" style={{
                    width: 'max-content',
                    top: '20px',
                    left: '-110px'
                  }} title="Settings">
                    <PopupTextContent>
                      <div>
                        Past/Future number of months
                        <Select
                          selected={this.state.months}
                          select={{
                            options: monthsOptions
                          }}
                          onChange={(e) => {
                            this.setState({months: e.value});
                            this.refs.pastSettingsPopup.close();
                          }}
                          style={{ width: '100px', marginTop: '10px' }}
                        />
                      </div>
                    </PopupTextContent>
                  </PlanPopup>
                </div>
              </div>
              <div style={{ marginTop: '18px' }}>
                <div className={dashboardStyle.locals.quarter1}>
                  <div className={ dashboardStyle.locals.quarterNumber }>
                    {Math.round(pastLTV / pastBudget * 100)}%
                    <div className={dashboardStyle.locals.center} style={{ visibility: (relativePastBudget && isFinite(relativePastBudget) && relativePastLTV && isFinite(relativePastLTV) && ((pastLTV / pastBudget) / (relativePastLTV / relativePastBudget) - 1)) ? 'visible' : 'hidden'}}>
                      <div className={dashboardStyle.locals.historyArrow} data-decline={((pastLTV / pastBudget) / (relativePastLTV / relativePastBudget) - 1) < 0 ? true : null}/>
                      <div className={dashboardStyle.locals.historyGrow} data-decline={((pastLTV / pastBudget) / (relativePastLTV / relativePastBudget) - 1) < 0 ? true : null} style={{marginRight: '0'}}>
                        {Math.round(((pastLTV / pastBudget) / (relativePastLTV / relativePastBudget) - 1) * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className={ dashboardStyle.locals.quarterText }>
                    ROI
                  </div>
                </div>
                <div className={dashboardStyle.locals.quarter2}>
                  <div className={ dashboardStyle.locals.quarterNumber }>
                    ${formatBudgetShortened(pastBudget)}
                    <div className={dashboardStyle.locals.center} style={{ visibility: (relativePastBudget && isFinite(relativePastBudget) && (pastBudget / relativePastBudget - 1)) ? 'visible' : 'hidden'}}>
                      <div className={dashboardStyle.locals.historyArrow} data-decline={(pastBudget / relativePastBudget - 1) < 0 ? true : null}/>
                      <div className={dashboardStyle.locals.historyGrow} data-decline={(pastBudget / relativePastBudget - 1) < 0 ? true : null} style={{marginRight: '0'}}>
                        {Math.round((pastBudget / relativePastBudget - 1) * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className={ dashboardStyle.locals.quarterText }>
                    Spend
                  </div>
                </div>
                <div className={dashboardStyle.locals.quarter3}>
                  <div className={ dashboardStyle.locals.quarterNumber }>
                    ${formatBudgetShortened(pastLTV)}
                    <div className={dashboardStyle.locals.center} style={{ visibility: (relativePastLTV && isFinite(relativePastLTV) && (pastLTV / relativePastLTV - 1)) ? 'visible' : 'hidden'}}>
                      <div className={dashboardStyle.locals.historyArrow} data-decline={(pastLTV / relativePastLTV - 1) < 0 ? true : null}/>
                      <div className={dashboardStyle.locals.historyGrow} data-decline={(pastLTV / relativePastLTV - 1) < 0 ? true : null} style={{marginRight: '0'}}>
                        {Math.round((pastLTV / relativePastLTV - 1) * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className={ dashboardStyle.locals.quarterText }>
                    LTV
                  </div>
                </div>
                <div className={dashboardStyle.locals.quarter4}>
                  <div className={ dashboardStyle.locals.quarterNumber }>
                    {formatBudgetShortened(pastObjective)}
                    <div className={dashboardStyle.locals.center} style={{ visibility: (relativePastObjective && isFinite(relativePastObjective) && (pastObjective / relativePastObjective - 1)) ? 'visible' : 'hidden'}}>
                      <div className={dashboardStyle.locals.historyArrow} data-decline={(pastObjective / relativePastObjective - 1) < 0 ? true : null}/>
                      <div className={dashboardStyle.locals.historyGrow} data-decline={(pastObjective / relativePastObjective - 1) < 0 ? true : null} style={{marginRight: '0'}}>
                        {Math.round((pastObjective / relativePastObjective - 1) * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className={ dashboardStyle.locals.quarterText }>
                    {getIndicatorNickname(firstFunnelObjective)}
                  </div>
                </div>
              </div>
            </div>
            <div className={ dashboardStyle.locals.column } data-border={true}>
              <div className={ dashboardStyle.locals.text }>
                Snapshot
              </div>
              <div style={{ padding: '15px' }}>
                <div className={dashboardStyle.locals.miniFunnelRow}>
                  <div className={dashboardStyle.locals.miniFunnelText}>
                    {getIndicatorNickname('MCL')}
                  </div>
                  <div className={dashboardStyle.locals.miniFunnelStageContainer}>
                    <div className={dashboardStyle.locals.miniFunnelMcl}>
                      {actualIndicators.newMCL}
                    </div>
                    <div className={dashboardStyle.locals.miniFunnelConv} style={{ left: '157px' }}>
                      <div className={dashboardStyle.locals.curvedArrow}/>
                      {actualIndicators.leadToMQLConversionRate}%
                    </div>
                  </div>
                </div>
                <div className={dashboardStyle.locals.miniFunnelRow}>
                  <div className={dashboardStyle.locals.miniFunnelText}>
                    {getIndicatorNickname('MQL')}
                  </div>
                  <div className={dashboardStyle.locals.miniFunnelStageContainer}>
                    <div className={dashboardStyle.locals.miniFunnelMql}>
                      {actualIndicators.newMQL}
                    </div>
                    <div className={dashboardStyle.locals.miniFunnelConv} style={{ left: '142px' }}>
                      <div className={dashboardStyle.locals.curvedArrow}/>
                      {actualIndicators.MQLToSQLConversionRate}%
                    </div>
                  </div>
                </div>
                <div className={dashboardStyle.locals.miniFunnelRow}>
                  <div className={dashboardStyle.locals.miniFunnelText}>
                    {getIndicatorNickname('SQL')}
                  </div>
                  <div className={dashboardStyle.locals.miniFunnelStageContainer}>
                    <div className={dashboardStyle.locals.miniFunnelSql}>
                      {actualIndicators.newSQL}
                    </div>
                    <div className={dashboardStyle.locals.miniFunnelConv} style={{ left: '125px' }}>
                      <div className={dashboardStyle.locals.curvedArrow}/>
                      {actualIndicators.SQLToOppConversionRate}%
                    </div>
                  </div>
                </div>
                <div className={dashboardStyle.locals.miniFunnelRow}>
                  <div className={dashboardStyle.locals.miniFunnelText}>
                    {getIndicatorNickname('opps')}
                  </div>
                  <div className={dashboardStyle.locals.miniFunnelStageContainer}>
                    <div className={dashboardStyle.locals.miniFunnelOpps}>
                      {actualIndicators.newOpps}
                    </div>
                    <div className={dashboardStyle.locals.miniFunnelConv} style={{ left: '109px' }}>
                      <div className={dashboardStyle.locals.curvedArrow}/>
                      {actualIndicators.OppToAccountConversionRate}%
                    </div>
                  </div>
                </div>
                <div className={dashboardStyle.locals.miniFunnelRow}>
                  <div className={dashboardStyle.locals.miniFunnelText}>
                    {getIndicatorNickname('users')}
                  </div>
                  <div className={dashboardStyle.locals.miniFunnelStageContainer}>
                    <div className={dashboardStyle.locals.miniFunnelUsers}>
                      {actualIndicators.newUsers}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div className={ dashboardStyle.locals.column } style={{ padding: '10px 20px 0 0', width: 'auto', marginRight: 'auto' }}>
                    <div className={ dashboardStyle.locals.snapshotNumber }>
                      {formatBudgetShortened(actualIndicators.sessions)}
                    </div>
                    <div className={ dashboardStyle.locals.snapshotText }>
                      Sessions
                    </div>
                  </div>
                  <div className={ dashboardStyle.locals.column } style={{ padding: '10px 20px 0 0', width: 'auto', marginRight: 'auto' }}>
                    <div className={ dashboardStyle.locals.snapshotNumber }>
                      ${formatBudgetShortened(monthlyBudget)}
                    </div>
                    <div className={ dashboardStyle.locals.snapshotText }>
                      Budget
                    </div>
                  </div>
                  <div className={ dashboardStyle.locals.column } style={{ padding: '10px 0 0 0', width: 'auto' }}>
                    <div className={ dashboardStyle.locals.snapshotNumber }>
                      ${formatBudgetShortened(actualIndicators.MRR)}
                    </div>
                    <div className={ dashboardStyle.locals.snapshotText }>
                      MRR
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={ dashboardStyle.locals.column } data-border={true} data-selected={(showAdvanced && !isPast) ? true : null}>
              <div className={ dashboardStyle.locals.columnHeader }>
                <div className={ dashboardStyle.locals.timeText }>
                  Next {months} Months
                </div>
                <div className={ dashboardStyle.locals.text } style={{ borderBottom: 'none' }}>
                  Future
                </div>
                <div className={ dashboardStyle.locals.advanced } onClick={ ()=>{ this.setState({showAdvanced: !showAdvanced, isPast: false }) }}/>
                <div style={{ position: 'relative' }}>
                  <div className={ dashboardStyle.locals.settings } onClick={ ()=>{ this.refs.futureSettingsPopup.open() }}/>
                  <PlanPopup ref="futureSettingsPopup" style={{
                    width: 'max-content',
                    top: '20px',
                    left: '-110px'
                  }} title="Settings">
                    <PopupTextContent>
                      <div>
                        Past/Future number of months
                        <Select
                          selected={this.state.months}
                          select={{
                            options: monthsOptions
                          }}
                          onChange={(e) => {
                            this.setState({months: e.value});
                            this.refs.futureSettingsPopup.close();
                          }}
                          style={{ width: '100px', marginTop: '5px' }}
                        />
                      </div>
                    </PopupTextContent>
                  </PlanPopup>
                </div>
              </div>
              <div style={{ marginTop: '18px' }}>
                <div className={dashboardStyle.locals.quarter1}>
                  <div className={ dashboardStyle.locals.quarterNumber }>
                    {Math.round(futureLTV / futureBudget * 100)}%
                    <div className={dashboardStyle.locals.center}  style={{ visibility: (pastBudget && isFinite(pastBudget) && pastLTV && isFinite(pastLTV) && ((futureLTV / futureBudget) / (pastLTV / pastBudget) - 1)) ? 'visible' : 'hidden'}}>
                      <div className={dashboardStyle.locals.historyArrow} data-decline={((futureLTV / futureBudget) / (pastLTV / pastBudget) - 1) < 0 ? true : null}/>
                      <div className={dashboardStyle.locals.historyGrow} data-decline={((futureLTV / futureBudget) / (pastLTV / pastBudget) - 1) < 0 ? true : null} style={{marginRight: '0'}}>
                        {Math.round(((futureLTV / futureBudget) / (pastLTV / pastBudget) - 1) * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className={ dashboardStyle.locals.quarterText }>
                    ROI
                  </div>
                </div>
                <div className={dashboardStyle.locals.quarter2}>
                  <div className={ dashboardStyle.locals.quarterNumber }>
                    ${formatBudgetShortened(futureBudget)}
                    <div className={dashboardStyle.locals.center}  style={{ visibility: (pastBudget && isFinite(pastBudget) && (futureBudget / pastBudget - 1)) ? 'visible' : 'hidden'}}>
                      <div className={dashboardStyle.locals.historyArrow} data-decline={(futureBudget / pastBudget - 1) < 0 ? true : null}/>
                      <div className={dashboardStyle.locals.historyGrow} data-decline={(futureBudget / pastBudget - 1) < 0 ? true : null} style={{marginRight: '0'}}>
                        {Math.round((futureBudget / pastBudget - 1) * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className={ dashboardStyle.locals.quarterText }>
                    Budget
                  </div>
                </div>
                <div className={dashboardStyle.locals.quarter3}>
                  <div className={ dashboardStyle.locals.quarterNumber }>
                    {formatBudgetShortened(futureLTV)}
                    <div className={dashboardStyle.locals.center} style={{ visibility: (pastLTV && isFinite(pastLTV) && (futureLTV / pastLTV - 1)) ? 'visible' : 'hidden'}}>
                      <div className={dashboardStyle.locals.historyArrow} data-decline={(futureLTV / pastLTV - 1) < 0 ? true : null}/>
                      <div className={dashboardStyle.locals.historyGrow} data-decline={(futureLTV / pastLTV - 1) < 0 ? true : null} style={{marginRight: '0'}}>
                        {Math.round((futureLTV / pastLTV - 1) * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className={ dashboardStyle.locals.quarterText }>
                    LTV
                  </div>
                </div>
                <div className={dashboardStyle.locals.quarter4}>
                  <div className={ dashboardStyle.locals.quarterNumber }>
                    {formatBudgetShortened(furureObjective)}
                    <div className={dashboardStyle.locals.center} style={{ visibility: (pastObjective && isFinite(pastObjective) && (furureObjective / pastObjective - 1)) ? 'visible' : 'hidden'}}>
                      <div className={dashboardStyle.locals.historyArrow} data-decline={(furureObjective / pastObjective - 1) < 0 ? true : null}/>
                      <div className={dashboardStyle.locals.historyGrow} data-decline={(furureObjective / pastObjective - 1) < 0 ? true : null} style={{marginRight: '0'}}>
                        {Math.round((furureObjective / pastObjective - 1) * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className={ dashboardStyle.locals.quarterText }>
                    {getIndicatorNickname(firstFunnelObjective)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      { showAdvanced ?
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <PerformanceGraph isPast={isPast} months={months} data={data} defaultIndicator={advancedIndicator}/>
          </div>
        </div>
        : null }
      { objectivesGauges.length > 0 ?
        <div className={ this.classes.cols } style={{ maxWidth: '1140px' }}>
          <div className={ this.classes.colLeft }>
            <div className={ dashboardStyle.locals.item } style={{ height: 'auto', width: 'auto' }}>
              <div className={ dashboardStyle.locals.text }>
                Objectives
              </div>
              <div className={ dashboardStyle.locals.chart } style={{ justifyContent: 'center', display: 'block', marginTop: '0' }}>
                {objectivesGauges}
              </div>
            </div>
          </div>
        </div>
        : null }
      <div className={ this.classes.cols } style={{ width: '825px' }}>
        <DashboardStatWithContext
          title="Annual Budget"
          stat={'$'+ formatBudgetShortened(annualBudget)}
          contextStat={'$' + formatBudgetShortened(annualBudgetLeftToPlan)}
          contextText="left to plan"
          isPositive={annualBudgetLeftToPlan > 0}
        />
        <DashboardStatWithContext
          title="Monthly Budget"
          stat={'$' + formatBudgetShortened(monthlyBudget)}
          contextStat={isOnTrack ? 'On-Track' : 'Not On-Track'}
          contextText=''
          isPositive={isOnTrack}
          tooltipText={isOnTrack ? 'Actual spend on-track' : 'Actual spend off-track. Forecasted: ' + '$' + formatBudgetShortened(monthlyExtapolatedTotalSpending)}
          statWithArrow={false}
        />
        <DashboardStatWithContext
          title="Active Campaigns"
          stat={numberOfActiveCampaigns}
          contextStat={'$' + formatBudgetShortened(monthlyBudgetLeftToInvest)}
          contextText="left to invest"
          isPositive={monthlyBudgetLeftToInvest > 0}
          statWithArrow={false}
        />
        <div className={ this.classes.colRight } style={{ paddingLeft: 0 }}>
          <DashboardStatWithContext
            title="LTV:CAC Ratio"
            stat={ratio}
            contextStat={ratioContextStat ? ratioContextStat + '%' : undefined}
            contextText={ratioContextStat ? 'from last month' : undefined}
            isPositive={ratioContextStat ? ratioContextStat > 0 : undefined}
            emptyStatMessage={'Oh… It seems that the relevant metrics (LTV + CAC) are missing. Please update your data.'}
            showEmptyStat={ratio === null}
            statWithArrow={true}
          />
        </div>
      </div>
      <div className={ this.classes.cols } style={{ width: '825px' }}>
        <div className={ this.classes.colLeft }>
          <div className={ dashboardStyle.locals.item } style={{ height: '412px', width: '825px' }}>
            <div style={{ display: 'flex', position: 'relative' }}>
              <Label
                checkbox={!this.state.onlyThisMonth}
                onChange={ () => { this.setState({onlyThisMonth: !this.state.onlyThisMonth}) } }
                style={{ margin: '0', alignSelf: 'center', textTransform: 'capitalize', fontSize: '12px', position: 'absolute' }}
              >
                show all-time
              </Label>
              <div className={ dashboardStyle.locals.text }>
                Funnel
              </div>
            </div>
            <div className={ dashboardStyle.locals.chart } style={{ justifyContent: 'center' }}>
              <Funnel {... funnelMetricsValues}/>
            </div>
          </div>
        </div>
        <div className={ this.classes.colRight } style={{ paddingLeft: 0 }}>
          <div className={ dashboardStyle.locals.item } style={{ marginTop: '30px' }}>
            <div className={ dashboardStyle.locals.text }>
              {(minRatioTitle.length > 0 ? minRatioTitle : "Funnel") + ' Ratio'}
            </div>
            { minRatio && isFinite(minRatio) ?
              <div className={dashboardStyle.locals.number}>
                {Math.round(minRatio * 10000) / 100}%
              </div>
              :
              <div>
                <div className={dashboardStyle.locals.center}>
                  <div className={dashboardStyle.locals.sadIcon}/>
                </div>
                <div className={dashboardStyle.locals.noMetrics}>
                  Oh… It seems that the relevant metrics (funnel metrics) are missing. Please update your data.
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      <div className={ this.classes.cols } style={{ width: '825px' }}>
        <div className={ this.classes.colLeft }>
          <div className={ dashboardStyle.locals.item } style={{ height: '350px', width: '540px'}}>
            <div className={ dashboardStyle.locals.text }>
              Campaigns by Focus
            </div>
            <div className={ dashboardStyle.locals.chart }>
              <CampaignsByFocus campaigns={campaigns}/>
            </div>
          </div>
        </div>
        <div className={ this.classes.colRight }>
          <div className={ dashboardStyle.locals.item } style={{ display: 'inline-block', height: '350px', width: '540px'}}>
            <div className={ dashboardStyle.locals.text }>
              Monthly Marketing Mix Summary
            </div>
            <div className={ dashboardStyle.locals.chart }>
              <div className={ this.classes.footerLeft }>
                <div className={ dashboardStyle.locals.index }>
                  {
                    fatherChannelsWithBudgets.map((element, i) => (
                      <div key={i} style={{ display: 'flex', marginTop: '5px' }}>
                        <div style={{border: '2px solid ' + COLORS[i % COLORS.length], borderRadius: '50%', height: '8px', width: '8px', display: 'inline-flex', marginTop: '2px', backgroundColor: this.state.activeIndex === i ? COLORS[i % COLORS.length] : 'initial'}}/>
                        <div style={{fontWeight: this.state.activeIndex === i ? "bold" : 'initial', display: 'inline', paddingLeft: '4px', fontSize: '14px', width: '135px', textTransform: 'capitalize' }}>
                          {element.name}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', width: '70px' }}>
                          ${formatBudget(element.value)}
                        </div>
                        <div style={{ width: '50px', fontSize: '14px', color: '#7f8fa4' }}>
                          ({Math.round(element.value / monthlyBudget * 100)}%)
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className={ this.classes.footerRight } style={{ marginTop: '-30px', width: '315px' }}>
                <PieChart width={429} height={350} onMouseEnter={this.onPieEnter} onMouseLeave={ () => { this.setState({activeIndex: void 0}) } }>
                  <Pie
                    data={fatherChannelsWithBudgets}
                    cx={250}
                    cy={150}
                    labelLine={true}
                    innerRadius={75}
                    outerRadius={100}
                    isAnimationActive={false}
                  >
                    {
                      fatherChannelsWithBudgets .map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={index}/>)
                    }
                  </Pie>
                </PieChart>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={ this.classes.cols } style={{ width: '1140px' }}>
        <div className={ this.classes.colLeft }>
          <TopX title='channel' data={topChannels}/>
        </div>
        <div className={ this.classes.colCenter }>
          <TopX title='campaign' data={topCampaigns}/>
        </div>
        <div className={ this.classes.colRight }>
          <TopX title='content' data={topContent}/>
        </div>
      </div>
    </div>
  }
}