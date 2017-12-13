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

export default class Analyze extends Component {

  style = style;
  styles = [dashboardStyle];

  static defaultProps = {
    previousData: []
  };

  constructor() {
    super();

    this.state = {
      indicator: 'SQL',
      months: 0
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
    const { previousData } = this.props;

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
    if (indicatorsData[this.state.indicator]) {
      const current = indicatorsData[this.state.indicator][indicatorsData[this.state.indicator].length - 1].value;
      const previous = indicatorsData[this.state.indicator][(this.state.months !== undefined ? indicatorsData[this.state.indicator].length - this.state.months - 1 : 0)].value;
      if (previous) {
        grow = Math.round((current - previous) / previous * 100)
      }
    }
    const CEVsArray = relevantData.map(item => item.CEVs || {});
    const headRow = this.getTableRow(null, [
      <div style={{ fontWeight: 'bold', fontSize: '22px' }}>
        Channel
      </div>,
      'Cost',
      'Conversions',
      getIndicatorNickname('MCL'),
      "CPL",
      getIndicatorNickname('MQL'),
      "CPM",
      getIndicatorNickname('SQL'),
      "CPS"
    ], {
      className: dashboardStyle.locals.headRow
    });

    const rows = Object.keys(sumedBudgets).map(item =>
      sumedBudgets[item] ?
      this.getTableRow(null,
        [
          <div className={dashboardStyle.locals.channelTable}>
            {getChannelNickname(item)}
          </div>,
          '$' + formatBudget(sumedBudgets[item]),
          Math.round(CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["conversion"] ? CEVs["conversion"][item] : 0) + sum, 0) * 100) / 100,
          Math.round(CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["MCL"] ? CEVs["MCL"][item] : 0) + sum, 0) * 100) / 100,
          CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["MCL"] ? CEVs["MCL"][item] : 0) + sum, 0) ? '$' + formatBudget(Math.round( sumedBudgets[item] / CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["MCL"] ? CEVs["MCL"][item] : 0) + sum, 0))) : 0,
          Math.round(CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["MQL"] ? CEVs["MQL"][item] : 0) + sum, 0) * 100) / 100,
          CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["MQL"] ? CEVs["MQL"][item] : 0) + sum, 0) ? '$' + formatBudget(Math.round( sumedBudgets[item] / CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["MQL"] ? CEVs["MQL"][item] : 0) + sum, 0))) : 0,
          Math.round(CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["SQL"] ? CEVs["SQL"][item] : 0) + sum, 0) * 100) / 100,
          CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["SQL"] ? CEVs["SQL"][item] : 0) + sum, 0) ? '$' + formatBudget(Math.round( sumedBudgets[item] / CEVsArray.reduce((sum, CEVs) => (CEVs && CEVs["SQL"] ? CEVs["SQL"][item] : 0) + sum, 0))) : 0
        ],{
          key: item,
          className: dashboardStyle.locals.tableRow
        })
        : null
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
          style={{ width: '44px' }}
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
      <div className={ dashboardStyle.locals.item } style={{ height: '459px', width: '1110px', overflow: 'auto', padding: '20px' }}>
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
               style={{display: 'inline-block', height: '412px', width: '540px'}}>
            <div className={dashboardStyle.locals.text}>
              Historical Performance
            </div>
            <div style={{display: 'flex'}}>
              <div className={this.classes.footerLeft}>
                <div className={dashboardStyle.locals.historyConfig}>
                  <div className={dashboardStyle.locals.historyConfigText}>
                    Show
                  </div>
                  <Select selected={this.state.indicator}
                          select={{
                            options: indicatorsOptions
                          }}
                          onChange={(e) => {
                            this.setState({indicator: e.value})
                          }}
                          style={{width: '172px'}}
                  />
                </div>
              </div>
              {grow ?
                <div className={this.classes.footerRight}>
                  <div className={dashboardStyle.locals.historyArrow} data-decline={grow < 0 ? true : null}/>
                  <div className={dashboardStyle.locals.historyGrow} data-decline={grow < 0 ? true : null}>
                    {Math.abs(grow)}%
                  </div>
                </div>
                : null}
            </div>
            <div className={dashboardStyle.locals.chart}>
              <AreaChart width={550} height={280}
                         data={indicatorsData[this.state.indicator] ? indicatorsData[this.state.indicator].slice(indicatorsData[this.state.indicator].length - this.state.months - 1, indicatorsData[this.state.indicator].length) : []}
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