import React from "react";
import Component from "components/Component";
import style from "styles/onboarding/onboarding.css";
import { XAxis, Tooltip, AreaChart, Area, YAxis, CartesianGrid } from "recharts";
import dashboardStyle from "styles/dashboard/dashboard.css";
import Select from 'components/controls/Select';
import { getIndicatorsWithNicknames } from 'components/utils/indicators';
import { formatBudget, formatBudgetShortened } from 'components/utils/budget';
import _ from 'lodash';
import { getNickname as getChannelNickname } from 'components/utils/channels';
import { getNickname as getIndicatorNickname } from 'components/utils/indicators';
import AnalyzeTable from 'components/pages/dashboard/AnalyzeTable';
import { FeatureToggle } from 'react-feature-toggles';
import Toggle from 'components/controls/Toggle';

export default class Analyze extends Component {

  style = style;
  styles = [dashboardStyle];

  static defaultProps = {
    previousData: []
  };

  constructor() {
    super();

    this.state = {
      historicalPerformanceIndicator: 'SQL',
      attributionTableIndicator: 'MCL',
      months: 0,
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

  render() {
    const { previousData, campaigns } = this.props;

    const indicatorsOptions = getIndicatorsWithNicknames();

    const months = previousData.map((item, index) => {
      return {value: index, label: index + 1}
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

    const relevantData = sortedPreviousData.slice(sortedPreviousData.length - this.state.months - 1);
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
      const previous = indicatorsData[this.state.historicalPerformanceIndicator] && indicatorsData[this.state.historicalPerformanceIndicator][(this.state.months !== undefined ? indicatorsData[this.state.historicalPerformanceIndicator].length - this.state.months - 1 : 0)] && indicatorsData[this.state.historicalPerformanceIndicator][(this.state.months !== undefined ? indicatorsData[this.state.historicalPerformanceIndicator].length - this.state.months - 1 : 0)].value;
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
    const headRow = this.getTableRow(null, [
      <div style={{ fontWeight: 'bold', fontSize: '22px' }}>
        { this.state.showChannels ? 'Channel' : 'campaign' }
      </div>,
      'Cost',
      'Conversions',
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
            style={{ width: '80px', fontWeight: 'initial', fontSize: 'initial', color: 'initial' }}
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
      "CP" + getIndicatorNickname(this.state.attributionTableIndicator).charAt(0)
    ], {
      className: dashboardStyle.locals.headRow
    });

    const rows = this.state.showChannels ?
      Object.keys(sumedBudgets).map(item => {
        const budget = sumedBudgets[item];
        const conversion =CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["conversion"] ? CEVs["conversion"][item] : 0) + sum, 0);
        const funnelIndicator = CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs[this.state.attributionTableIndicator] ? CEVs[this.state.attributionTableIndicator][item] : 0) + sum, 0);
        return sumedBudgets[item] && (funnelIndicator || conversion) ?
          this.getTableRow(null,
            [
              <div className={dashboardStyle.locals.channelTable}>
                {getChannelNickname(item)}
              </div>,
              '$' + formatBudget(budget),
              conversion,
              Math.round(funnelIndicator * 100) / 100,
              funnelIndicator ? '$' + formatBudget(Math.round(sumedBudgets[item] / funnelIndicator)) : 0,
            ], {
              key: item,
              className: dashboardStyle.locals.tableRow
            })
          : null
      })
      :
      campaigns
        .filter(campaign => campaign.isArchived !== true)
        .map((campaign, index) => {
            const budget = campaign.budget || campaign.actualSpent;
            const conversion = campaign.attribution && campaign.attribution.conversion;
            const funnelIndicator = campaign.attribution && campaign.attribution[this.state.attributionTableIndicator];
            return (funnelIndicator || conversion) ?
              this.getTableRow(null,
                [
                  <div className={dashboardStyle.locals.channelTable}>
                    {campaign.name}
                  </div>,
                  '$' + formatBudget(budget),
                  conversion,
                  Math.round(funnelIndicator),
                  budget ? Math.round(funnelIndicator / budget) : 0,
                ], {
                  key: index,
                  className: dashboardStyle.locals.tableRow
                })
              : null;
          }
        );

    return <div className={dashboardStyle.locals.wrap}>
      <div className={dashboardStyle.locals.upperPanel}>
        <div className={dashboardStyle.locals.historyConfigText}>
          Date range: last
        </div>
        <Select
          selected={this.state.months}
          select={{
            options: months
          }}
          onChange={(e) => {
            this.setState({months: e.value})
          }}
          style={{ width: '55px', margin: '0 8px' }}
          innerClassName={dashboardStyle.locals.select }
        />
        <div className={dashboardStyle.locals.historyConfigText}>
          months
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
        <div className={ dashboardStyle.locals.item } style={{ height: '459px', width: '1110px', overflow: 'auto', padding: '15px 0' }}>
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
      <div className={this.classes.cols} style={{width: '825px'}}>
        <div className={this.classes.colLeft}>
          <div className={dashboardStyle.locals.item}
               style={{display: 'inline-block', height: '412px', width: '825px'}}>
            <div className={dashboardStyle.locals.text}>
              Historical Performance
            </div>
            <div style={{display: 'flex'}}>
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
              <AreaChart width={825} height={280}
                         data={indicatorsData[this.state.historicalPerformanceIndicator] ? indicatorsData[this.state.historicalPerformanceIndicator].slice(indicatorsData[this.state.historicalPerformanceIndicator].length - this.state.months - 1, indicatorsData[this.state.historicalPerformanceIndicator].length) : []}
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