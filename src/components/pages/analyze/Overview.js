import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import {
  XAxis,
  Tooltip,
  AreaChart,
  Area,
  YAxis,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
  BarChart,
  Bar,
  LabelList
} from 'recharts';
import dashboardStyle from 'styles/dashboard/dashboard.css';
import Select from 'components/controls/Select';
import {getIndicatorsWithNicknames} from 'components/utils/indicators';
import {formatBudget, formatBudgetShortened} from 'components/utils/budget';
import merge from 'lodash/merge';
import {getChannelsWithProps, getMetadata, getNickname as getChannelNickname} from 'components/utils/channels';
import {getNickname as getIndicatorNickname} from 'components/utils/indicators';
import ReactTooltip from 'react-tooltip';
import {flattenObjectives} from 'components/utils/objective';
import {getDatesSpecific} from 'components/utils/date';
import RechartBarLabel from 'components/controls/RechartBarLabel';
import {getColor} from 'components/utils/colors';
import SumBy from 'lodash/SumBy';
import SmallTable from 'components/controls/SmallTable';

export default class Overview extends Component {

  style = style;
  styles = [dashboardStyle];

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
        'Jan', 'Feb', 'Mar',
        'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct',
        'Nov', 'Dec'
      ];
      const planDate = stringDate.split('/');
      const date = new Date(planDate[1], planDate[0] - 1);

      return monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2);
    }

    return null;
  }

  getObjectiveFormattedDate(dueDate) {
    const monthNames = [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct',
      'Nov', 'Dec'
    ];
    return monthNames[dueDate.getMonth()] +
      '/' +
      dueDate.getDate() +
      '/' +
      dueDate.getFullYear().toString().substr(2, 2);
  }

  render() {
    const {attribution: {channelsImpact, campaigns: attributionCampaigns, pages: attributionPages}, historyData: {objectives, indicators}, planDate, indicatorsData, calculatedData: {historyData: {committedBudgets, months, sumBudgets, totalCost, historyDataWithCurrentMonth: {indicators: indicatorsForDisplay}}}} = this.props;
    const indicatorsOptions = getIndicatorsWithNicknames();
    const flattenHistoryObjectives = flattenObjectives(objectives,
      indicators,
      getDatesSpecific(planDate, objectives.length, 0),
      false);

    let grow = 0;
    if (indicatorsData[this.state.historicalPerformanceIndicator]) {
      const current = indicatorsData[this.state.historicalPerformanceIndicator] &&
        indicatorsData[this.state.historicalPerformanceIndicator][indicatorsData[this.state.historicalPerformanceIndicator].length -
        1] &&
        indicatorsData[this.state.historicalPerformanceIndicator][indicatorsData[this.state.historicalPerformanceIndicator].length -
        1].value;
      const previous = indicatorsData[this.state.historicalPerformanceIndicator] &&
        indicatorsData[this.state.historicalPerformanceIndicator][(this.props.months !== undefined
          ? this.props.months
          : 0)] &&
        indicatorsData[this.state.historicalPerformanceIndicator][(this.props.months !== undefined
          ? this.props.months
          : 0)].value;
      if (current) {
        if (previous) {
          grow = Math.round((current - previous) / previous * 100);
        }
        else {
          grow = Infinity;
        }
      }
    }
    const totalRevenue = (channelsImpact && channelsImpact[this.state.attributionTableRevenueMetric]
      ? Object.keys(channelsImpact[this.state.attributionTableRevenueMetric])
        .reduce((channelsSum, item) => channelsSum + channelsImpact[this.state.attributionTableRevenueMetric][item], 0)
      : 0);

    const revenueByChannel = channelsImpact ? channelsImpact.revenue : {};
    delete revenueByChannel.direct;

    const revenueByChannelRows = Object.keys(revenueByChannel).map(channel => {
      return {
        items: [getChannelNickname(channel), formatBudget(revenueByChannel[channel])]
      };
    });

    const revenueByCategory = {};
    Object.keys(revenueByChannel).forEach(channel => {
      const category = getMetadata('category', channel);
      if (!revenueByCategory[category]) {
        revenueByCategory[category] = 0;
      }
      revenueByCategory[category] += revenueByChannel[channel];
    });

    const revenueByCategoryRows = Object.keys(revenueByCategory).map(category => {
      return {
        items: [<div style={{textTransform: 'capitalize'}}>{category}</div>, formatBudget(revenueByCategory[category])]
      };
    });

    const revenueByCampaignRows = attributionCampaigns.map(campaign => {
      return {
        items: [campaign.name, formatBudget(campaign.revenue)]
      };
    });

    const revenueByContentRows = attributionPages.map(page => {
      return {
        items: [page.title, formatBudget(page.revenue)]
      };
    });

    const objectivesHeadRow = this.getTableRow(null, [
      <div style={{fontWeight: 'bold', fontSize: '22px'}}>
        Objective
      </div>,
      'Date',
      'Target',
      'Actual',
      'Delta'
    ], {
      className: dashboardStyle.locals.objectivesHeadRow
    });

    const objectivesRows = flattenHistoryObjectives.map((objective, index) => {
      const grow = Math.round(objective.value - objective.target);
      return this.getTableRow(null, [
        getIndicatorNickname(objective.indicator),
        this.getObjectiveFormattedDate(objective.dueDate),
        objective.target,
        objective.value,
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
        </div>
      ], {
        key: index,
        className: dashboardStyle.locals.objectivesTableRow
      });
    });

    const channelCategoriesPerMonth = indicatorsForDisplay.slice(this.props.monthsExceptThisMonth).map((month) => {
      const mergedObject = {};
      const channelsWithProps = getChannelsWithProps();
      Object.keys(channelsWithProps).forEach(channel => {
        const totalValue = ((channelsImpact && channelsImpact.MCL && channelsImpact.MCL[channel]) ?
          channelsImpact.MCL[channel] *
          month.leadToAccountConversionRate /
          100 *
          month.LTV
          : 0)
          +
          ((channelsImpact && channelsImpact.MQL && channelsImpact.MQL[channel]) ?
            channelsImpact.MQL[channel] *
            month.MQLToSQLConversionRate /
            100 *
            month.SQLToOppConversionRate /
            100 *
            month.OppToAccountConversionRate /
            100 *
            month.LTV
            : 0)
          +
          ((channelsImpact && channelsImpact.SQL && channelsImpact.SQL[channel]) ?
            channelsImpact.SQL[channel] *
            month.SQLToOppConversionRate /
            100 *
            month.OppToAccountConversionRate /
            100 *
            month.LTV
            : 0);
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
      return {name: category, value: channelCategoriesForPeriod[category]};
    });

    const data = channelCategoriesPerMonth.map((month, index) => {

      month.name = months[index];
      return month;
    });

    const CustomizedLabel = React.createClass({
      render() {
        const {x, y, index: monthIndex, 'data-key': channel, height, width} = this.props;

        return <RechartBarLabel x={x}
                                y={y}
                                height={height}
                                width={width}
                                label={'$' + formatBudgetShortened(channelCategoriesPerMonth[monthIndex][channel])}/>;
      }
    });

    const bars = channelCategoriesForPeriod && Object.keys(channelCategoriesForPeriod).map((channel, index) =>
      <Bar key={index} yAxisId="left" dataKey={channel} stackId="channels" fill={getColor(index)}
           isAnimationActive={false} onMouseEnter={() => {
        this.setState({activeIndex: index});
      }} onMouseLeave={() => {
        this.setState({activeIndex: void 0});
      }}>
        <LabelList data-key={channel} content={<CustomizedLabel/>}/>
      </Bar>
    );

    const funnel = {
      MCL: 'newMCL',
      MQL: 'newMQL',
      SQL: 'newSQL',
      opps: 'newOpps',
      users: 'newUsers'
    };

    const costPerX = Object.keys(funnel).map(indicator => {
      const newIndicator = funnel[indicator];
      const indicatorSum = SumBy(indicatorsData[newIndicator], item => item.value || 0);
      return <div className={this.classes.colCenter}>
        <div className={dashboardStyle.locals.item}>
          <div className={dashboardStyle.locals.text}>
            Cost per {getIndicatorNickname(indicator, true)}
          </div>
          <div className={dashboardStyle.locals.number}>
            {indicatorSum ? formatBudget(Math.round(totalCost / indicatorSum)) : '-'}
          </div>
        </div>
      </div>;
    });

    return <div>
      <div className={this.classes.wrap}>
        <div>
          <div className={this.classes.cols} style={{width: '825px'}}>
            <div className={this.classes.colLeft}>
              <div className={dashboardStyle.locals.item}>
                <div className={dashboardStyle.locals.text}>
                  Channels
                </div>
                <div className={dashboardStyle.locals.number}>
                  {Object.keys(committedBudgets.reduce((sum, item) => merge(sum, item), {})).length}
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
                  Total Pipeline Revenue
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
                  {/* Two digits after comma */}
                  {(Math.round(totalRevenue / totalCost * 100) / 100).toFixed(2)}X
                </div>
              </div>
            </div>
          </div>
          <div className={this.classes.cols} style={{width: '825px'}}>
            {costPerX}
          </div>
          <div className={this.classes.cols}>
            <div className={this.classes.colLeft}>
              <div className={dashboardStyle.locals.item} style={{height: '387px', width: '1110px'}}>
                <div className={dashboardStyle.locals.text}
                     data-tip="(Estimated) Impact across funnel. Sum of each funnel stage X the likability to convert to a paying account X estimated LTV.">
                  Business Impact across funnel
                </div>
                <div style={{display: 'flex'}}>
                  <div className={dashboardStyle.locals.chart} style={{width: '443px', alignItems: 'center'}}>
                    <div className={this.classes.footerLeft} style={{zIndex: 2}}>
                      <div className={dashboardStyle.locals.index}>
                        {
                          channelCategories.map((element, i) => (
                            <div key={i} style={{display: 'flex', marginTop: '5px'}}>
                              <div style={{
                                border: '2px solid ' + getColor(i),
                                borderRadius: '50%',
                                height: '8px',
                                width: '8px',
                                display: 'inline-flex',
                                marginTop: '2px',
                                backgroundColor: this.state.activeIndex === i ? getColor(i) : 'initial'
                              }}/>
                              <div style={{
                                fontWeight: this.state.activeIndex === i ? 'bold' : 'initial',
                                display: 'inline',
                                paddingLeft: '4px',
                                fontSize: '14px',
                                width: '100px',
                                textTransform: 'capitalize'
                              }}>
                                {element.name}
                              </div>
                              <div style={{fontSize: '14px', fontWeight: '600', width: '30px'}}
                                   data-tip={'$' + formatBudgetShortened(element.value)}>
                                {Math.round(element.value / channelCategoriesSum * 100)}%
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <div className={this.classes.footerRight}
                         style={{width: '274px', marginLeft: '-25px'}}>
                      <PieChart width={274} height={332} onMouseEnter={(d, i) => {
                        this.setState({activeIndex: i});
                      }} onMouseLeave={() => {
                        this.setState({activeIndex: void 0});
                      }}>
                        <Pie
                          data={channelCategories}
                          cx='50%'
                          cy='50%'
                          labelLine={true}
                          innerRadius={75}
                          outerRadius={100}
                          isAnimationActive={false}
                        >
                          {
                            channelCategories.map((entry, index) => <Cell fill={getColor(index)}
                                                                          key={index}/>)
                          }
                        </Pie>
                      </PieChart>
                    </div>
                  </div>
                  <div className={dashboardStyle.locals.line} style={{left: '443px', bottom: '17px', height: '80%'}}/>
                  <div style={{marginLeft: '33px'}}>
                    <BarChart width={700} height={350} data={data} maxBarSize={85}>
                      <CartesianGrid vertical={false} horizontal={false}/>
                      <XAxis dataKey="name" axisLine={false} tickLine={false}/>
                      <YAxis yAxisId="left" axisLine={false} tickLine={false}
                             tickFormatter={v => '$' + formatBudgetShortened(v)}/>
                      {bars}
                    </BarChart>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={this.classes.cols} style={{width: '1110px'}}>
            <div className={this.classes.colCenter}>
              <div className={dashboardStyle.locals.item}
                   style={{display: 'inline-block', height: '412px', width: '540px', overflow: 'auto'}}>
                <div className={dashboardStyle.locals.text}>
                  Revenue by Category
                </div>
                <SmallTable headRowData={{items: ['Category', 'Revenue']}}
                            rowsData={revenueByCategoryRows}/>
              </div>
            </div>
            <div className={this.classes.colCenter}>
              <div className={dashboardStyle.locals.item}
                   style={{display: 'inline-block', height: '412px', width: '540px', overflow: 'auto'}}>
                <div className={dashboardStyle.locals.text}>
                  Revenue by Channel
                </div>
                <SmallTable headRowData={{items: ['Channel', 'Revenue']}}
                            rowsData={revenueByChannelRows}/>
              </div>
            </div>
          </div>
          <div className={this.classes.cols} style={{width: '1110px'}}>
            <div className={this.classes.colCenter}>
              <div className={dashboardStyle.locals.item}
                   style={{display: 'inline-block', height: '412px', width: '540px', overflow: 'auto'}}>
                <div className={dashboardStyle.locals.text}>
                  Revenue by Campaign
                </div>
                <SmallTable headRowData={{items: ['Campaign', 'Revenue']}}
                            rowsData={revenueByCampaignRows}/>
              </div>
            </div>
            <div className={this.classes.colCenter}>
              <div className={dashboardStyle.locals.item}
                   style={{display: 'inline-block', height: '412px', width: '540px', overflow: 'auto'}}>
                <div className={dashboardStyle.locals.text}>
                  Revenue by Content
                </div>
                <SmallTable headRowData={{items: ['Content', 'Revenue']}}
                            rowsData={revenueByContentRows}/>
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
                                this.setState({historicalPerformanceIndicator: e.value});
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
                             data={indicatorsData[this.state.historicalPerformanceIndicator]
                               ? indicatorsData[this.state.historicalPerformanceIndicator].slice(this.props.months)
                               : []}
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
    </div>;
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
          }</td>;
        })
      }
    </tr>;
  }

  getCellItem(item) {
    let elem;

    if (typeof item !== 'object') {
      elem = <div className={this.classes.cellItem}>{item}</div>;
    }
    else {
      elem = item;
    }

    return elem;
  }

}