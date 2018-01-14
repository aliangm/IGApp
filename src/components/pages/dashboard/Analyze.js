import React from "react";
import Component from "components/Component";
import style from "styles/onboarding/onboarding.css";
import { XAxis, Tooltip, AreaChart, Area, YAxis, CartesianGrid } from "recharts";
import dashboardStyle from "styles/dashboard/dashboard.css";
import Select from 'components/controls/Select';
import { getIndicatorsWithNicknames } from 'components/utils/indicators';
import { formatBudget, formatBudgetShortened } from 'components/utils/budget';
import _ from 'lodash';
import { getChannelsWithNicknames, getNickname as getChannelNickname } from 'components/utils/channels';
import { getNickname as getIndicatorNickname } from 'components/utils/indicators';
import AnalyzeTable from 'components/pages/dashboard/AnalyzeTable';
import { FeatureToggle } from 'react-feature-toggles';
import Toggle from 'components/controls/Toggle';
import Label from 'components/ControlsLabel';
import { timeFrameToDate } from 'components/utils/objective';
import history from 'history';
import { formatDate } from 'components/utils/date';

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
      months: props.previousData.length - 1,
      showChannels: true
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

  render() {
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
    const metrics = [
      {value: 'MCL', label: getIndicatorNickname('MCL')},
      {value: 'MQL', label: getIndicatorNickname('MQL')},
      {value: 'SQL', label: getIndicatorNickname('SQL')},
      {value: 'opps', label: getIndicatorNickname('opps')},
      {value: 'users', label: getIndicatorNickname('users')},
    ];
    const headlines = [
      <div style={{ fontWeight: 'bold', fontSize: '22px', textAlign: 'left' }}>
        { this.state.showChannels ? 'Channel' : 'campaign' }
      </div>,
      'Cost',
      'Web Visits',
      <Label
        style={{ width: 'auto', marginBottom: 'initial', letterSpacing: 'initial', fontSize: '18px', fontWeight: '600', color: '#354052', justifyContent: 'center', textTransform: 'capitalize' }}
        question={['']}
        description={['number of times the channel/campaign led to a direct online conversion event on your website or landing pages.']}>
        Conversions
      </Label>,
      <div style={{display: 'inline-flex'}}>
        { this.state.editMetric ?
          <Select
            selected={this.state.attributionTableIndicator}
            select={{
              options: metrics
            }}
            onChange={(e) => {
              this.setState({attributionTableIndicator: e.value})
            }}
            style={{ width: '160px', fontWeight: 'initial', fontSize: 'initial', color: 'initial', textAlign: 'initial' }}
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
      <Label
        style={{ width: 'auto', marginBottom: 'initial', letterSpacing: 'initial', fontSize: '18px', fontWeight: '600', color: '#354052', justifyContent: 'center' }}
        question={['']}
        description={['Click per ' + getIndicatorNickname(this.state.attributionTableIndicator)]}>
        {"CP" + getIndicatorNickname(this.state.attributionTableIndicator).charAt(0)}
      </Label>
    ];
    if (!this.state.showChannels) {
      headlines.push('Channels');
    }
    const headRow = this.getTableRow(null, headlines, {
      className: dashboardStyle.locals.headRow
    });

    const rows = this.state.showChannels ?
      getChannelsWithNicknames().map(item => {
        const channel = item.value;
        const budget = sumedBudgets[channel] || 0;
        const webVisits =CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["webVisits"] ? CEVs["webVisits"][channel] : 0) + sum, 0);
        const conversion =CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["conversion"] ? CEVs["conversion"][channel] : 0) + sum, 0);
        const funnelIndicator = CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs[this.state.attributionTableIndicator] ? CEVs[this.state.attributionTableIndicator][channel] : 0) + sum, 0);
        return (funnelIndicator || conversion || webVisits) ?
          this.getTableRow(null,
            [
              <div style={{ display: '-webkit-box' }}>
                <div className={dashboardStyle.locals.channelIcon} data-icon={"plan:" + channel}/>
                <div className={dashboardStyle.locals.channelTable}>
                  {item.label}
                </div>
              </div>,
              '$' + formatBudget(budget),
              webVisits,
              conversion,
              Math.round(funnelIndicator * 100) / 100,
              funnelIndicator ? '$' + formatBudget(Math.round(budget / funnelIndicator)) : 0,
            ], {
              key: channel,
              className: dashboardStyle.locals.tableRow
            })
          : null
      })
      :
      attributionCampaigns
        .map((campaignObj, index) => {
            const campaignUTM = Object.keys(campaignObj)[0];
            const campaign = campaignObj[campaignUTM];
            let budget = 0;
            const platformCampaignIndex = campaigns.findIndex(campaign => campaign.name === campaignUTM || (campaign.tracking && campaign.tracking.campaignUTM === campaignUTM));
            const platformCampaign = campaigns[platformCampaignIndex];
            if (platformCampaign) {
              budget = platformCampaign.actualSpent || platformCampaign.budget;
            }
            const webVisits = campaign.webVisits;
            const conversion = campaign.conversion;
            const funnelIndicator = campaign[this.state.attributionTableIndicator];
            return (funnelIndicator || conversion || webVisits) ?
              this.getTableRow(null,
                [
                  <div className={dashboardStyle.locals.channelTable} data-link={ platformCampaign ? true : null} onClick={() => { if (platformCampaign) {
                    history.push({
                      pathname: '/campaigns',
                      query: { campaign: platformCampaignIndex }
                    });
                  } }}>
                    {campaignUTM}
                  </div>,
                  '$' + formatBudget(budget),
                  webVisits,
                  conversion,
                  Math.round(funnelIndicator),
                  budget ? Math.round(funnelIndicator / budget) : 0,
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {campaign.channels.map(channel =>
                      <div key={channel} title={getChannelNickname(channel)} className={dashboardStyle.locals.channelIcon} data-icon={"plan:" + channel}/>
                    )}
                  </div>
                ], {
                  key: index,
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
        <div className={dashboardStyle.locals.historyConfigText}>
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
              {Object.keys(budgets.reduce((sum, item) => _.merge(sum, item), {})).length}
            </div>
          </div>
        </div>
        <div className={this.classes.colCenter}>
          <div className={dashboardStyle.locals.item}>
            <div className={dashboardStyle.locals.text}>
              Total Cost
            </div>
            <div className={dashboardStyle.locals.number}>
              ${formatBudgetShortened(budgets.reduce((sum, item) => sum + Object.keys(item).reduce((monthSum, channel) => item[channel] + monthSum, 0) + sum, 0))}
            </div>
          </div>
        </div>
        <div className={this.classes.colCenter}>
          <div className={dashboardStyle.locals.item}>
            <div className={dashboardStyle.locals.text}>
              Total Revenue
            </div>
            <div className={dashboardStyle.locals.number}>
              -
            </div>
          </div>
        </div>
        <div className={this.classes.colRight}>
          <div className={dashboardStyle.locals.item}>
            <div className={dashboardStyle.locals.text}>
              ROI
            </div>
            <div className={dashboardStyle.locals.number}>
              -
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