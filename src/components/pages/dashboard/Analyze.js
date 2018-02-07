import React from "react";
import Component from "components/Component";
import style from "styles/onboarding/onboarding.css";
import { XAxis, Tooltip, AreaChart, Area, YAxis, CartesianGrid } from "recharts";
import dashboardStyle from "styles/dashboard/dashboard.css";
import Select from 'components/controls/Select';
import { getIndicatorsWithNicknames } from 'components/utils/indicators';
import { formatBudget, formatBudgetShortened } from 'components/utils/budget';
import merge from 'lodash/merge';
import { getChannelsWithNicknames, getNickname as getChannelNickname, getTitle as getChannelTitle } from 'components/utils/channels';
import { getNickname as getIndicatorNickname } from 'components/utils/indicators';
import AnalyzeTable from 'components/pages/dashboard/AnalyzeTable';
import { FeatureToggle } from 'react-feature-toggles';
import Toggle from 'components/controls/Toggle';
import Label from 'components/ControlsLabel';
import { timeFrameToDate } from 'components/utils/objective';
import history from 'history';
import { formatDate } from 'components/utils/date';
import { PieChart, Pie, Cell } from "recharts";

export default class Analyze extends Component {

  style = style;
  styles = [dashboardStyle];

  static defaultProps = {
    previousData: []
  };

  constructor(props) {
    super(props);

    this.state = {
      historicalPerformanceIndicator: 'SQL',
      attributionTableIndicator: 'MCL',
      conversionIndicator: 'MCL',
      attributionTableRevenueMetric: 'revenue',
      months: props.previousData.length - 1,
      showChannels: true,
      soryBy: 'webVisits',
      isDesc: 1
    };
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

  getObjectiveFormattedDate(dateStr) {
    if (dateStr) {
      const date = timeFrameToDate(dateStr);
      const monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
      ];
      return monthNames[date.getMonth()] + '/' + date.getDate() + '/' + date.getFullYear().toString().substr(2, 2);
    }
    return null;
  }

  sortBy(param) {
    if (this.state.sortBy === param) {
      this.setState({isDesc: this.state.isDesc * -1});
    }
    else {
      this.setState({sortBy: param});
    }
  }

  render() {
    const COLORS = [
      '#289df5',
      '#40557d',
      '#f0b499',
      '#ffd400',
      '#3373b4',
      '#72c4b9',
      '#04E762',
      '#FB5607',
      '#FF006E',
      '#8338EC',
      '#76E5FC',
      '#036D19'
    ];
    const { previousData, attribution, campaigns } = this.props;
    const attributionCampaigns = attribution.campaigns || [];
    const indicatorsOptions = getIndicatorsWithNicknames();

    const months = previousData.map((item, index) => {
      return {value: index, label: formatDate(item.planDate)}
    });
    let indicatorsData = {};
    const sortedPreviousData = previousData.sort((a, b) => {
      const planDate1 = a.planDate.split("/");
      const planDate2 = b.planDate.split("/");
      const date1 = new Date(planDate1[1], planDate1[0] - 1).valueOf();
      const date2 = new Date(planDate2[1], planDate2[0] - 1).valueOf();
      return (isFinite(date1) && isFinite(date2) ? (date1 > date2) - (date1 < date2) : NaN);
    });
    sortedPreviousData.forEach(item => {
      const displayDate = this.getDateString(item.planDate);
      Object.keys(item.actualIndicators).forEach(indicator => {
        if (!indicatorsData[indicator]) {
          indicatorsData[indicator] = [];
        }
        const value = item.actualIndicators[indicator];
        indicatorsData[indicator].push({name: displayDate, value: value > 0 ? value : 0});
      })
    });

    const relevantData = sortedPreviousData.slice(this.state.months);
    const budgets = relevantData.map(item => item.approvedBudgets && item.approvedBudgets.length > 0 && item.approvedBudgets[0] ? item.approvedBudgets[0] : {});
    const totalCost = budgets.reduce((sum, item) => sum + Object.keys(item).reduce((monthSum, channel) => item[channel] + monthSum, 0) + sum, 0);
    let sumedBudgets = {};
    budgets.forEach(month => {
      Object.keys(month).forEach(channel => {
        if (!sumedBudgets[channel]) {
          sumedBudgets[channel] = 0;
        }
        sumedBudgets[channel] += month[channel];
      })
    });
    let grow = 0;
    if (indicatorsData[this.state.historicalPerformanceIndicator]) {
      const current = indicatorsData[this.state.historicalPerformanceIndicator] && indicatorsData[this.state.historicalPerformanceIndicator][indicatorsData[this.state.historicalPerformanceIndicator].length - 1] && indicatorsData[this.state.historicalPerformanceIndicator][indicatorsData[this.state.historicalPerformanceIndicator].length - 1].value;
      const previous = indicatorsData[this.state.historicalPerformanceIndicator] && indicatorsData[this.state.historicalPerformanceIndicator][(this.state.months !== undefined ? this.state.months : 0)] && indicatorsData[this.state.historicalPerformanceIndicator][(this.state.months !== undefined ? this.state.months : 0)].value;
      if (current) {
        if (previous) {
          grow = Math.round((current - previous) / previous * 100)
        }
        else grow = Infinity;
      }
    }
    const CEVsArray = relevantData.map(item => item.CEVs || {});
    const totalRevenue = CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs.revenue ? Object.keys(CEVs.revenue).reduce((channelsSum, item) => channelsSum + CEVs.revenue[item], 0) : 0) + sum, 0);
    const metrics = [
      {value: 'MCL', label: getIndicatorNickname('MCL')},
      {value: 'MQL', label: getIndicatorNickname('MQL')},
      {value: 'SQL', label: getIndicatorNickname('SQL')},
      {value: 'opps', label: getIndicatorNickname('opps')},
      {value: 'users', label: getIndicatorNickname('users')},
    ];
    const headlines = [
      <div style={{ fontWeight: 'bold', fontSize: '22px', textAlign: 'left', cursor: 'pointer' }} onClick={this.sortBy.bind(this, 'label')}>
        { this.state.showChannels ? 'Channel' : 'campaign' }
      </div>,
      <div onClick={this.sortBy.bind(this, 'budget')} style={{ cursor: 'pointer' }}>
        Cost
      </div>,
      <div style={{display: 'inline-flex', cursor: 'pointer'}} onClick={this.sortBy.bind(this, 'revenueMetric')}>
        { this.state.editRevenueMetric ?
          <Select
            selected={this.state.attributionTableRevenueMetric}
            select={{
              options: [{value: 'revenue', label: 'Revenue'}, {value: 'pipeline', label: 'Pipeline'}]
            }}
            onChange={(e) => {
              this.setState({attributionTableRevenueMetric: e.value})
            }}
            style={{ width: '100px', fontWeight: 'initial', fontSize: 'initial', color: 'initial', textAlign: 'initial' }}
          />
          :
          this.state.attributionTableRevenueMetric === 'revenue' ? 'Revenue' : 'Pipeline'
        }
        <div className={dashboardStyle.locals.metricEdit} onClick={() => {
          this.setState({editRevenueMetric: !this.state.editRevenueMetric})
        }}>
          { this.state.editRevenueMetric ? 'Done' : 'Edit' }
        </div>
      </div>,
      <div onClick={this.sortBy.bind(this, 'ROI')} style={{ cursor: 'pointer' }}>
        ROI
      </div>,
      <div onClick={this.sortBy.bind(this, 'webVisits')} style={{ cursor: 'pointer' }}>
        Web Visits
      </div>,
      <div onClick={this.sortBy.bind(this, 'conversion')} style={{ cursor: 'pointer' }}>
        <Label
          style={{ width: 'auto', marginBottom: 'initial', letterSpacing: 'initial', fontSize: '18px', fontWeight: '600', color: '#354052', justifyContent: 'center', textTransform: 'capitalize' }}
          question={['']}
          description={['number of times the channel/campaign led to a direct online conversion event on your website or landing pages.']}>
          Conversions
        </Label>
      </div>,
      <div style={{display: 'inline-flex', cursor: 'pointer'}} onClick={this.sortBy.bind(this, 'funnelIndicator')}>
        { this.state.editMetric ?
          <Select
            selected={this.state.attributionTableIndicator}
            select={{
              options: metrics
            }}
            onChange={(e) => {
              this.setState({attributionTableIndicator: e.value})
            }}
            style={{ width: '100px', fontWeight: 'initial', fontSize: 'initial', color: 'initial', textAlign: 'initial' }}
          />
          :
          getIndicatorNickname(this.state.attributionTableIndicator)
        }
        <div className={dashboardStyle.locals.metricEdit} onClick={() => {
          this.setState({editMetric: !this.state.editMetric})
        }}>
          { this.state.editMetric ? 'Done' : 'Edit' }
        </div>
      </div>,
      <div onClick={this.sortBy.bind(this, 'CPX')} style={{ cursor: 'pointer' }}>
        <Label
          style={{ width: 'auto', marginBottom: 'initial', letterSpacing: 'initial', fontSize: '18px', fontWeight: '600', color: '#354052', justifyContent: 'center' }}
          question={['']}
          description={['Click per ' + getIndicatorNickname(this.state.attributionTableIndicator)]}>
          {"CP" + getIndicatorNickname(this.state.attributionTableIndicator).charAt(0)}
        </Label>
      </div>
    ];
    if (!this.state.showChannels) {
      headlines.push('Channels');
    }
    const headRow = this.getTableRow(null, headlines, {
      className: dashboardStyle.locals.headRow
    });

    const channelsArray = getChannelsWithNicknames();
    channelsArray.push({value: 'direct', label: 'Direct'});

    const channelsWithData = channelsArray.map(item => {
      const json =  {
        channel: item.value,
        label: item.label,
        budget: sumedBudgets[item.value] || 0,
        revenueMetric: CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs[this.state.attributionTableRevenueMetric] ? CEVs[this.state.attributionTableRevenueMetric][item.value] : 0) + sum, 0),
        webVisits: CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["webVisits"] ? CEVs["webVisits"][item.value] : 0) + sum, 0),
        conversion: CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["conversion"] ? CEVs["conversion"][item.value] : 0) + sum, 0),
        funnelIndicator: CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs[this.state.attributionTableIndicator] ? CEVs[this.state.attributionTableIndicator][item.value] : 0) + sum, 0),
      };
      json.ROI = json.budget ? json.revenueMetric / json.budget : 0;
      json.CPX = json.funnelIndicator ? json.budget / json.funnelIndicator : 0;
      return json;
    }) ;

    const campaignsWithData = attributionCampaigns.map(campaignObj => {
      const campaignUTM = Object.keys(campaignObj)[0];
      const campaign = campaignObj[campaignUTM];
      let budget = 0;
      const platformCampaignIndex = campaigns.findIndex(campaign => (campaign.name === campaignUTM || (campaign.tracking && campaign.tracking.campaignUTM === campaignUTM)) && !campaign.isArchived);
      const platformCampaign = campaigns[platformCampaignIndex];
      if (platformCampaign) {
        if (campaign.isOneTime) {
          if (campaign.dueDate && timeFrameToDate(campaign.dueDate).getMonth() === new Date().getMonth()) {
            budget = platformCampaign.actualSpent || platformCampaign.budget || 0;
          }
        }
        else {
          if (!campaign.dueDate || (campaign.dueDate && timeFrameToDate(campaign.dueDate) < new Date())) {
            budget = platformCampaign.actualSpent || platformCampaign.budget || 0;
          }
        }
      }
      const json = {
        label: campaignUTM,
        budget: budget,
        revenueMetric: campaign[this.state.attributionTableRevenueMetric],
        webVisits: campaign.webVisits,
        conversion: campaign.conversion,
        funnelIndicator: campaign[this.state.attributionTableIndicator],
        channels: campaign.channels,
        platformCampaignIndex: platformCampaignIndex
      };
      json.ROI = json.budget ? json.revenueMetric / json.budget : 0;
      json.CPX = json.budget ? json.funnelIndicator / json.budget : 0;
      return json;
    });

    const rows = this.state.showChannels ?
      channelsWithData
        .sort((item1, item2) =>
          (item2[this.state.sortBy] - item1[this.state.sortBy]) * this.state.isDesc
        )
        .map(item => {
          const { channel, label, budget, revenueMetric, webVisits, conversion, funnelIndicator, ROI, CPX } = item;
          return (funnelIndicator || conversion || webVisits) ?
            this.getTableRow(null,
              [
                <div style={{ display: 'flex' }}>
                  <div className={dashboardStyle.locals.channelIcon} data-icon={"plan:" + channel}/>
                  <div className={dashboardStyle.locals.channelTable}>
                    {label}
                  </div>
                </div>,
                '$' + formatBudget(budget),
                '$' + formatBudget(revenueMetric),
                Math.round(ROI * 100) + '%',
                webVisits,
                conversion,
                Math.round(funnelIndicator * 100) / 100,
                '$' + formatBudget(Math.round(CPX))
              ], {
                key: channel,
                className: dashboardStyle.locals.tableRow
              })
            : null
        })
      :
      campaignsWithData
        .sort((item1, item2) =>
          (item2[this.state.sortBy] - item1[this.state.sortBy]) * this.state.isDesc
        )
        .map(item => {
            const { label, budget, revenueMetric, webVisits, conversion, funnelIndicator, ROI, CPX, channels, platformCampaignIndex } = item;
            return (funnelIndicator || conversion || webVisits) ?
              this.getTableRow(null,
                [
                  <div className={dashboardStyle.locals.channelTable} data-link={ platformCampaignIndex !== -1 ? true : null} onClick={() => { if (platformCampaignIndex !== -1) {
                    history.push({
                      pathname: '/campaigns',
                      query: { campaign: platformCampaignIndex }
                    });
                  } }}>
                    {label}
                  </div>,
                  '$' + formatBudget(budget),
                  '$' + formatBudget(revenueMetric),
                  Math.round(ROI * 100) + '%',
                  webVisits,
                  conversion,
                  Math.round(funnelIndicator),
                  '$' + formatBudget(Math.round(CPX)),
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {channels.map(channel =>
                      <div key={channel} title={getChannelNickname(channel)} className={dashboardStyle.locals.channelIcon} data-icon={"plan:" + channel}/>
                    )}
                  </div>
                ], {
                  key: label,
                  className: dashboardStyle.locals.tableRow
                })
              : null;
          }
        );

    const objectivesHeadRow = this.getTableRow(null, [
      <div style={{ fontWeight: 'bold', fontSize: '22px' }}>
        Objective
      </div>,
      'Date',
      'Target',
      'Actual',
      'Delta'
    ], {
      className: dashboardStyle.locals.objectivesHeadRow
    });

    const objectivesRows = this.props.objectives.map((objective, index) => {
      const grow = Math.round(this.props.actualIndicators[objective.indicator] - objective.target);
      const objectiveDate = timeFrameToDate(objective.timeFrame);
      if (objectiveDate <= new Date()) {
        return this.getTableRow(null, [
          getIndicatorNickname(objective.indicator),
          this.getObjectiveFormattedDate(objective.timeFrame),
          objective.target,
          this.props.actualIndicators[objective.indicator],
          <div>
            {grow ?
              <div style={{display: 'flex'}}>
                <div className={dashboardStyle.locals.historyArrow} data-decline={grow < 0 ? true : null}/>
                <div className={dashboardStyle.locals.historyGrow} data-decline={grow < 0 ? true : null}
                     style={{marginRight: '0'}}>
                  {Math.abs(grow)}
                </div>
              </div>
              :
              <div className={dashboardStyle.locals.checkMark}/>
            }
          </div>,
        ], {
          key: index,
          className: dashboardStyle.locals.objectivesTableRow
        })
      }
    });

    const CEV = CEVsArray.reduce((mergedItem, CEVs) => merge(mergedItem, CEVs && CEVs[this.state.conversionIndicator]), {});
    const fatherChannelsWithBudgets = [];
    let fatherChannelsSum = 0;
    Object.keys(CEV).forEach(channel => {
      const channelTitle = getChannelTitle(channel);
      if (channelTitle && CEV[channel]) {
        fatherChannelsSum += CEV[channel];
        const fatherChannel = channelTitle.split('/')[0];
        const existsFather = fatherChannelsWithBudgets.find(item => item.name === fatherChannel);
        if (existsFather) {
          existsFather.value += CEV[channel];
        }
        else {
          fatherChannelsWithBudgets.push({name: fatherChannel, value: CEV[channel]});
        }
      }
    });

    const usersArray = relevantData.map(item => item.attribution && item.attribution.users || {});
    const users = usersArray.reduce((mergedItem, monthUsers) => merge(mergedItem, monthUsers), []);
    const journeys = [];
    users.forEach(user => {
      const journey = user.journey
        .filter(item => item.channel && item.channel !== 'direct' && item.funnelStage === this.state.conversionIndicator)
        .map(item => item.channel);
      if (journey && journey.length > 0) {
        const alreadyExists = journeys.find(item => item.channels.length === journey.length && item.channels.every((item, index) => item === journey[index]));
        if (alreadyExists) {
          alreadyExists.count++;
        }
        else {
          journeys.push({
            channels: journey,
            count: 1
          })
        }
      }
    });

    const journeysUI = journeys
      .sort((a, b) => b.count - a.count)
      .map((item, index) =>
      <div key={index} className={dashboardStyle.locals.journeyRow}>
        <div style={{ width: '78%' }}>
          <div className={dashboardStyle.locals.journey}>
            { item.channels.map(channel =>
              <div className={dashboardStyle.locals.channelBox}>
                <div className={dashboardStyle.locals.channelIcon} data-icon={"plan:" + channel} style={{ margin: '0 5px' }}/>
                <div className={dashboardStyle.locals.channelText}>
                  {getChannelNickname(channel)}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          {item.count}
        </div>
        <div style={{ marginLeft: '48px' }}>
          {Math.round(item.count / journeys.length * 100)}%
        </div>
      </div>
    );

    return <div className={dashboardStyle.locals.wrap}>
      <div className={dashboardStyle.locals.upperPanel}>
        <div className={dashboardStyle.locals.historyConfigText}>
          Date range:
        </div>
        <Select
          selected={this.state.months}
          select={{
            options: months
          }}
          onChange={(e) => {
            this.setState({months: e.value})
          }}
          style={{ width: '75px', margin: '0 8px' }}
        />
        <div className={dashboardStyle.locals.historyConfigText} style={{ fontWeight: 'bold' }}>
          - {formatDate(this.props.planDate)}
        </div>
      </div>
      <div className={this.classes.cols} style={{width: '825px'}}>
        <div className={this.classes.colLeft}>
          <div className={dashboardStyle.locals.item}>
            <div className={dashboardStyle.locals.text}>
              Channels
            </div>
            <div className={dashboardStyle.locals.number}>
              {Object.keys(budgets.reduce((sum, item) => merge(sum, item), {})).length}
            </div>
          </div>
        </div>
        <div className={this.classes.colCenter}>
          <div className={dashboardStyle.locals.item}>
            <div className={dashboardStyle.locals.text}>
              Total Cost
            </div>
            <div className={dashboardStyle.locals.number}>
              ${formatBudgetShortened(totalCost)}
            </div>
          </div>
        </div>
        <div className={this.classes.colCenter}>
          <div className={dashboardStyle.locals.item}>
            <div className={dashboardStyle.locals.text}>
              Total Revenue
            </div>
            <div className={dashboardStyle.locals.number}>
              ${formatBudgetShortened(totalRevenue)}
            </div>
          </div>
        </div>
        <div className={this.classes.colRight}>
          <div className={dashboardStyle.locals.item}>
            <div className={dashboardStyle.locals.text}>
              ROI
            </div>
            <div className={dashboardStyle.locals.number}>
              {Math.round(totalRevenue / totalCost * 100)}%
            </div>
          </div>
        </div>
      </div>
      <FeatureToggle featureName="attribution">
        <div className={ dashboardStyle.locals.item } style={{ height: '459px', width: '1110px', overflow: 'visible', padding: '15px 0' }}>
          <Toggle
            leftText="channels"
            rightText="campaigns"
            leftActive={ this.state.showChannels }
            leftClick={ ()=>{ this.setState({showChannels: true}) } }
            rightClick={ ()=>{ this.setState({showChannels: false}) } }
            type="grey"
          />
          <table className={dashboardStyle.locals.table}>
            <thead>
            {headRow}
            </thead>
            <tbody className={dashboardStyle.locals.tableBody}>
            {rows}
            </tbody>
          </table>
        </div>
      </FeatureToggle>
      <FeatureToggle featureName="attribution">
        <div className={ dashboardStyle.locals.item } style={{ height: '387px', width: '1110px' }}>
          <div className={dashboardStyle.locals.text}>
            Top Conversion Journeys/Paths
          </div>
          <div>
            <div className={dashboardStyle.locals.conversionGoal}>
              Choose a conversion goal
              <Select
                selected={this.state.conversionIndicator}
                select={{
                  options: metrics
                }}
                onChange={(e) => {
                  this.setState({conversionIndicator: e.value})
                }}
                style={{ width: '143px', marginLeft: '10px' }}
              />
            </div>
          </div>
          <div style={{ position: 'relative', display: 'flex', padding: '10px 0', height: '275px' }}>
            <div style={{ display: 'flex' }}>
              <div className={ dashboardStyle.locals.index }>
                {
                  fatherChannelsWithBudgets.map((element, i) => (
                    <div key={i} style={{ display: 'flex', marginTop: '5px' }}>
                      <div style={{border: '2px solid ' + COLORS[i % COLORS.length], borderRadius: '50%', height: '8px', width: '8px', display: 'inline-flex', marginTop: '2px', backgroundColor: this.state.activeIndex === i ? COLORS[i % COLORS.length] : 'initial'}}/>
                      <div style={{fontWeight: this.state.activeIndex === i ? "bold" : 'initial', display: 'inline', paddingLeft: '4px', fontSize: '14px', width: '135px' }}>
                        {element.name}
                      </div>
                      <div style={{ width: '50px', fontSize: '14px', color: '#7f8fa4' }}>
                        ({Math.round(element.value/fatherChannelsSum*100)}%)
                      </div>
                    </div>
                  ))
                }
              </div>
              <div style={{ marginLeft: '-127px', marginTop: '-30px' }}>
                <PieChart width={429} height={350} onMouseEnter={(d, i) => { this.setState({activeIndex: i})}} onMouseLeave={ () => { this.setState({activeIndex: void 0}) } }>
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
            <div className={dashboardStyle.locals.line}/>
            <div style={{ width: '625px', marginLeft: '-35px' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ marginLeft: '75%' }}>
                  Conv
                </div>
                <div style={{ marginLeft: '20px' }}>
                  % of Total
                </div>
              </div>
              <div style={{ overflowY: 'auto', height: '266px' }}>
                {journeysUI}
              </div>
            </div>
          </div>
        </div>
      </FeatureToggle>
      <div className={this.classes.cols} style={{width: '1110px'}}>
        <div className={this.classes.colLeft}>
          <div className={dashboardStyle.locals.item}
               style={{display: 'inline-block', height: '412px', width: '540px'}}>
            <div className={dashboardStyle.locals.text}>
              Historical Performance
            </div>
            <div style={{ display: 'flex', marginTop: '7px' }}>
              <div className={this.classes.footerLeft}>
                <div className={dashboardStyle.locals.historyConfig}>
                  <div className={dashboardStyle.locals.historyConfigText}>
                    Show
                  </div>
                  <Select selected={this.state.historicalPerformanceIndicator}
                          select={{
                            options: indicatorsOptions
                          }}
                          onChange={(e) => {
                            this.setState({historicalPerformanceIndicator: e.value})
                          }}
                          style={{ width: '172px', marginLeft: '8px' }}
                  />
                </div>
              </div>
              {grow ?
                <div className={this.classes.footerRight}>
                  <div className={dashboardStyle.locals.historyArrow} data-decline={grow < 0 ? true : null}/>
                  <div className={dashboardStyle.locals.historyGrow} data-decline={grow < 0 ? true : null}>
                    {isFinite(grow) ? Math.abs(grow) + '%' : '∞'}
                  </div>
                </div>
                : null}
            </div>
            <div className={dashboardStyle.locals.chart}>
              <AreaChart width={540} height={280}
                         data={indicatorsData[this.state.historicalPerformanceIndicator] ? indicatorsData[this.state.historicalPerformanceIndicator].slice(this.state.months) : []}
                         style={{marginLeft: '-21px'}}>
                <XAxis dataKey="name" style={{fontSize: '12px', color: '#354052', opacity: '0.5'}}/>
                <YAxis style={{fontSize: '12px', color: '#354052', opacity: '0.5'}}/>
                <CartesianGrid vertical={false}/>
                <Tooltip/>
                <Area type='monotone' dataKey='value' stroke='#6BCCFF' fill='#DFECF7' strokeWidth={3}/>
              </AreaChart>
            </div>
          </div>
        </div>
        <div className={this.classes.colRight}>
          <div className={dashboardStyle.locals.item} style={{ display: 'inline-block', height: '412px', width: '540px', overflow: 'auto', padding: '15px 0' }}>
            <div className={dashboardStyle.locals.text}>
              Objectives - planned vs actual
            </div>
            <table className={dashboardStyle.locals.objectivesTable}>
              <thead>
              {objectivesHeadRow}
              </thead>
              <tbody className={dashboardStyle.locals.objectiveTableBody}>
              {objectivesRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <AnalyzeTable { ... this.props}/>
      </div>
    </div>
  }

  getTableRow(title, items, props) {
    return <tr {...props}>
      {title != null ?
        <td className={this.classes.titleCell}>{this.getCellItem(title)}</td>
        : null}
      {
        items.map((item, i) => {
          return <td className={this.classes.valueCell} key={i}>{
            this.getCellItem(item)
          }</td>
        })
      }
    </tr>
  }

  getCellItem(item) {
    let elem;

    if (typeof item !== 'object') {
      elem = <div className={this.classes.cellItem}>{item}</div>
    } else {
      elem = item;
    }

    return elem;
  }

}