import React from "react";
import Component from "components/Component";
import style from "styles/onboarding/onboarding.css";
import { XAxis, Tooltip, AreaChart, Area, YAxis, CartesianGrid, Pie, PieChart, Cell, BarChart, Bar } from "recharts";
import dashboardStyle from "styles/dashboard/dashboard.css";
import Select from 'components/controls/Select';
import { getIndicatorsWithNicknames } from 'components/utils/indicators';
import { formatBudget, formatBudgetShortened } from 'components/utils/budget';
import merge from 'lodash/merge';
import { getChannelsWithProps, getChannelsWithNicknames, getMetadata } from 'components/utils/channels';
import { getNickname as getIndicatorNickname } from 'components/utils/indicators';
import { timeFrameToDate } from 'components/utils/objective';
import { formatDate } from 'components/utils/date';
import ReactTooltip from 'react-tooltip';

export default class Overview extends Component {

  style = style;
  styles = [dashboardStyle];

  static defaultProps = {
    previousData: []
  };

  constructor(props) {
    super(props);

    this.state = {
      historicalPerformanceIndicator: 'SQL',
      attributionTableRevenueMetric: 'pipeline'
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
    const { previousData, CEVs } = this.props;
    const indicatorsOptions = getIndicatorsWithNicknames();

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
    const months = sortedPreviousData.map((item, index) => {
      return {value: index, label: formatDate(item.planDate)}
    });
    const relevantData = sortedPreviousData.slice(this.props.months || sortedPreviousData.length - 1);
    const budgets = relevantData.map(item => item.approvedBudgets && item.approvedBudgets.length > 0 && item.approvedBudgets[0] ? merge(item.approvedBudgets[0], item.actualChannelBudgets && item.actualChannelBudgets.knownChannels ? item.actualChannelBudgets.knownChannels : {}) : {});
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
      const previous = indicatorsData[this.state.historicalPerformanceIndicator] && indicatorsData[this.state.historicalPerformanceIndicator][(this.props.months !== undefined ? this.props.months : 0)] && indicatorsData[this.state.historicalPerformanceIndicator][(this.props.months !== undefined ? this.props.months : 0)].value;
      if (current) {
        if (previous) {
          grow = Math.round((current - previous) / previous * 100)
        }
        else grow = Infinity;
      }
    }
    const totalRevenue = (CEVs && CEVs[this.state.attributionTableRevenueMetric] ? Object.keys(CEVs[this.state.attributionTableRevenueMetric]).reduce((channelsSum, item) => channelsSum + CEVs[this.state.attributionTableRevenueMetric][item], 0) : 0);

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

    const channelCategoriesPerMonth = relevantData.map((month) => {
      const mergedObject = {};
      const channelsWithProps = getChannelsWithProps();
      Object.keys(channelsWithProps).forEach(channel => {
        const totalValue = month.CEVs.MCL[channel] * month.actualIndicators.leadToAccountConversionRate / 100 * month.actualIndicators.LTV
          + month.CEVs.MQL[channel] * month.actualIndicators.MQLToSQLConversionRate / 100 * month.actualIndicators.SQLToOppConversionRate / 100 * month.actualIndicators.OppToAccountConversionRate / 100 * month.actualIndicators.LTV
          + month.CEVs.SQL[channel] * month.actualIndicators.SQLToOppConversionRate / 100 * month.actualIndicators.OppToAccountConversionRate / 100 * month.actualIndicators.LTV;
        const channelCategory = getMetadata('category', channel);
        if (channelCategory && totalValue) {
          if (!mergedObject[channelCategory]) {
            mergedObject[channelCategory] = 0;
          }
          mergedObject[channelCategory] += Math.round(totalValue);
        }
      });
      return mergedObject;
    });

    const channelCategoriesForPeriod = channelCategoriesPerMonth.reduce((mergedObject, month) => {
      Object.keys(month).forEach(category => {
        if (!mergedObject[category]) {
          mergedObject[category] = 0;
        }
        mergedObject[category] += month[category];
      });
      return mergedObject;
    }, {});

    let channelCategoriesSum = 0;
    const channelCategories = Object.keys(channelCategoriesForPeriod).map(category => {
      channelCategoriesSum += channelCategoriesForPeriod[category];
      return {name: category, value: channelCategoriesForPeriod[category]}
    });

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

    const data = channelCategoriesPerMonth.map((month, index) => {

      month.name = formatDate(relevantData[index].planDate);
      return month;
    });

    const CustomizedLabel = React.createClass({
      render () {
        const {x, y, value} = this.props;
        const val = value[1] - value[0];
        return (val && val / channelCategoriesSum > 0.05) ?
          <svg>
            <rect
              x={x-25}
              y={y+20}
              fill="#979797"
              width={50}
              height={20}
            />
            <text
              x={x}
              y={y}
              dy={34}
              fontSize='11'
              fill='#ffffff'
              textAnchor="middle">
              ${formatBudgetShortened(val)}
            </text>
          </svg>
          : null
      }
    });

    const bars = channelCategoriesForPeriod && Object.keys(channelCategoriesForPeriod).map((channel, index) =>
      <Bar key={index} yAxisId="left" dataKey={channel} stackId="channels" fill={COLORS[(index) % COLORS.length]} label={<CustomizedLabel key={channel}/>}
           isAnimationActive={false} onMouseEnter={ () => { this.setState({activeIndex: index}) } } onMouseLeave={ () => { this.setState({activeIndex: void 0}) } }/>
    );

    return <div>
      <div className={ this.classes.wrap }>
        <div className={dashboardStyle.locals.upperPanel}>
          <div className={dashboardStyle.locals.historyConfigText}>
            Date range:
          </div>
          <Select
            selected={this.props.months === undefined ? previousData.length - 1 : this.props.months}
            select={{
              options: months
            }}
            onChange={(e) => {
              this.props.calculateAttributionData(previousData.length - e.value - 1, this.props.attributionModel)
            }}
            style={{ width: '75px', margin: '0 8px' }}
          />
          <div className={dashboardStyle.locals.historyConfigText} style={{ fontWeight: 'bold' }}>
            - {formatDate(this.props.planDate)}
          </div>
        </div>
        <div>
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
                  Total {this.state.attributionTableRevenueMetric}
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
          <div className={this.classes.cols}>
            <div className={this.classes.colLeft}>
              <div className={dashboardStyle.locals.item} style={{ height: '387px', width: '1110px' }}>
                <div className={ dashboardStyle.locals.text }>
                  Business Impact across funnel
                </div>
                <div style={{ display: 'flex' }}>
                  <div className={ dashboardStyle.locals.chart } style={{ width: '443px' }}>
                    <div className={ this.classes.footerLeft }>
                      <div className={ dashboardStyle.locals.index }>
                        {
                          channelCategories.map((element, i) => (
                            <div key={i} style={{ display: 'flex', marginTop: '5px' }}>
                              <div style={{border: '2px solid ' + COLORS[i % COLORS.length], borderRadius: '50%', height: '8px', width: '8px', display: 'inline-flex', marginTop: '2px', backgroundColor: this.state.activeIndex === i ? COLORS[i % COLORS.length] : 'initial'}}/>
                              <div style={{fontWeight: this.state.activeIndex === i ? "bold" : 'initial', display: 'inline', paddingLeft: '4px', fontSize: '14px', width: '100px', textTransform: 'capitalize' }}>
                                {element.name}
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: '600', width: '30px' }}>
                                {Math.round(element.value/channelCategoriesSum*100)}%
                              </div>
                              <div style={{ width: '50px', fontSize: '14px', color: '#7f8fa4' }}>
                                (${formatBudgetShortened(element.value)})
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <div className={ this.classes.footerRight } style={{ marginTop: '-30px', width: '315px', marginLeft: '-25px' }}>
                      <PieChart width={429} height={350} onMouseEnter={ (d,i) => { this.setState({activeIndex: i}) } } onMouseLeave={ () => { this.setState({activeIndex: void 0}) } }>
                        <Pie
                          data={channelCategories}
                          cx={250}
                          cy={150}
                          labelLine={true}
                          innerRadius={75}
                          outerRadius={100}
                          isAnimationActive={false}
                        >
                          {
                            channelCategories .map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={index}/>)
                          }
                        </Pie>
                      </PieChart>
                    </div>
                  </div>
                  <div className={dashboardStyle.locals.line} style={{ left: '443px', bottom: '17px', height: '80%' }}/>
                  <div style={{marginLeft: '-10px'}}>
                    <BarChart width={700} height={350} data={data} maxBarSize={85}>
                      <CartesianGrid vertical={false} horizontal={false}/>
                      <XAxis dataKey="name" axisLine={false} tickLine={false}/>
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tickFormatter={v => '$' + formatBudgetShortened(v)}/>
                      {bars}
                    </BarChart>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={this.classes.cols} style={{width: '1110px'}}>
            <div className={this.classes.colLeft}>
              <div className={dashboardStyle.locals.item}
                   style={{display: 'inline-block', height: '412px', width: '540px'}}>
                <div className={dashboardStyle.locals.text}>
                  Historical Performance
                </div>
                <div style={{display: 'flex', marginTop: '7px'}}>
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
                              style={{width: '172px', marginLeft: '8px'}}
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
                             data={indicatorsData[this.state.historicalPerformanceIndicator] ? indicatorsData[this.state.historicalPerformanceIndicator].slice(this.props.months) : []}
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
              <div className={dashboardStyle.locals.item} style={{
                display: 'inline-block',
                height: '412px',
                width: '540px',
                overflow: 'auto',
                padding: '15px 0'
              }}>
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
        </div>
      </div>
      <ReactTooltip/>
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