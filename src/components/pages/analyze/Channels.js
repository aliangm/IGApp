import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import dashboardStyle from 'styles/dashboard/dashboard.css';
import Select from 'components/controls/Select';
import {formatNumber} from 'components/utils/budget';
import {getChannelsWithNicknames, getMetadata, getNickname as getChannelNickname} from 'components/utils/channels';
import {FeatureToggle} from 'react-feature-toggles';
import ReactTooltip from 'react-tooltip';
import icons from 'styles/icons/plan.css';
import PerformanceGraph from 'components/pages/analyze/PerformanceGraph';
import StageSelector from 'components/pages/analyze/StageSelector';
import {sumBy, get, capitalize} from 'lodash';

export default class Channels extends Component {

  style = style;
  styles = [dashboardStyle, icons];

  constructor(props) {
    super(props);

    this.state = {
      attributionTableIndicator: 'MCL',
      conversionIndicator: 'MCL',
      attributionTableRevenueMetric: 'pipeline',
      sortBy: 'webVisits',
      isDesc: 1,
      firstObjective: 'SQL',
      selectedStageIndex: 0
    };
  }

  initialize(props) {
    //set objective
    this.setState({firstObjective: props.calculatedData.objectives.firstObjective});
  }

  componentDidMount() {
    this.initialize(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  }

  sortBy(param) {
    if (this.state.sortBy === param) {
      this.setState({isDesc: this.state.isDesc * -1});
    }
    else {
      this.setState({sortBy: param});
    }
  }

  formatEffciency(dividend, divisor, indicatorName) {
    const efficiency = Math.round(dividend / divisor);
    if (isFinite(efficiency)) {
      return '$' + formatNumber(efficiency) + '/' + indicatorName;
    }
    if (dividend === 0) {
      return '0';
    }
    return '-';
  }

  render() {
    const {attribution: {channelsImpact, users}, calculatedData: {historyData: {sumBudgets, indicatorsDataPerMonth, months}}, revenueMetrics, revenueMetricsOptions, metricsWithInfluenced, metricsWithInfluencedOptions, metricsWithInfluencedSingular, metricsOptions} = this.props;
    const {firstObjective, selectedStageIndex} = this.state;

    const getInfluencedDataKey = (dataKey) => {
      return `influenced${capitalize(dataKey)}`;
    };

    const stages = [{
      name: 'Visitors',
      dataKey: 'webVisits',
      columns: [
        {title: 'Channel', type: 'row-title'},
        {title: 'Cost', type: 'cost'},
        {title: 'Web Visitors', type: 'stage-indicator'},
        {title: 'Efficiency', type: 'efficiency'}]
    },
      {
        name: 'Leads',
        dataKey: 'MCL',
        columns: [
          {title: 'Channel', type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Influenced/Touched Leads', type: 'stage-indicator'},
          {title: 'Attributed Leads', type: 'influenced-stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'}
        ]
      },
      {
        name: 'MQLs', dataKey: 'MQL', columns: [
          {title: 'Channel', type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Attributed MQLs', type: 'stage-indicator'},
          {title: 'Influenced/Touched MQLs', type: 'influenced-stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'}
        ]
      },
      {
        name: 'SQLs', dataKey: 'SQL', columns: [
          {title: 'Channel', type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Attributed SQLs', type: 'stage-indicator'},
          {title: 'Influenced/Touched SQLs', type: 'influenced-stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'}
        ]
      },
      {
        name: 'Opps', dataKey: 'opps', columns: [
          {title: 'Channel', type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Attributed Opps', type: 'stage-indicator'},
          {title: 'Influenced/Touched Opps', type: 'influenced-stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'}
        ]
      },
      {
        name: 'Customers', dataKey: 'users', columns: [
          {title: 'Channel', type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Attributed Customers', type: 'stage-indicator'},
          {title: 'Influenced/Touched Customers', type: 'influenced-stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'},
          {title: 'Revenue', type:'revenue'}
        ]
      }];

    const selectedStage = stages[selectedStageIndex];

    const headRow = this.getTableRow(null, selectedStage.columns.map(({title}) => {
      return <div onClick={this.sortBy.bind(this, 'budget')} style={{cursor: 'pointer'}}>
        {title}
      </div>;
    }), {className: dashboardStyle.locals.headRow});

    const stageIndicatorKey = selectedStage.dataKey;
    const getChannelCost = (channel) => {
      return sumBudgets[channel] || 0;
    };

    const getMetricNumber = (channel) => {
      return get(channelsImpact, [stageIndicatorKey, channel], 0);
    };
    const getInfluencedMetricNumber = (channel) => {
      return get(channelsImpact, [getInfluencedDataKey(stageIndicatorKey), channel], 0);
    };

    const getChannelRevenue = (channel) => {
      return get(channelsImpact, ['revenue', channel], 0);
    };

    const formatIndicator = (value) => formatNumber(Math.round(value));
    const getColumnData = (channel, columnType) => {
      switch (columnType) {
        case 'row-title': {
          return <div style={{display: 'flex'}}>
            <div className={dashboardStyle.locals.channelIcon} data-icon={'plan:' + channel}/>
            <div className={dashboardStyle.locals.channelTable}>
              {channelsArray.find(item => item.value === channel).label}
            </div>
          </div>;
        }
        case 'cost':
          return '$' + formatNumber(getChannelCost(channel));
        case 'stage-indicator':
          return formatIndicator(getMetricNumber(channel));
        case 'influenced-stage-indicator':
          return formatIndicator(getInfluencedMetricNumber(channel));
        case 'efficiency':
          return this.formatEffciency(getChannelCost(channel), getMetricNumber(channel), selectedStage.name);
        case 'revenue':
          return '$' + formatNumber(getChannelRevenue(channel))
      }
    };

    const getTotalColumnData = (data, columnType) => {
      const channelKeys = data.map(channels => channels.channel);
      const getTotalCost = () => sumBy(channelKeys, getChannelCost);

      const totalIndicatorGenerated = (channelKeys, getChannelData) => Math.round(channelKeys.reduce((sum, item) => sum + getChannelData(item), 0) * 100) /
        100;

      const totalMetric = () => totalIndicatorGenerated(channelKeys,getMetricNumber);

      switch (columnType) {
        case 'row-title':
          return 'Total';
        case 'cost':
          return '$' + formatNumber(getTotalCost());
        case 'stage-indicator':
          return totalMetric();
        case 'influenced-stage-indicator':
          return totalIndicatorGenerated(channelKeys, getInfluencedMetricNumber);
        case 'efficiency':
          return this.formatEffciency(getTotalCost(), totalMetric(), selectedStage.name);
        case 'revenue':
          return '$' + formatNumber(sumBy(channelKeys,getChannelRevenue))
      }
    };

    // const headRow = this.getTableRow(null, [
    //   <div style={{textAlign: 'left', cursor: 'pointer'}}
    //        onClick={this.sortBy.bind(this, 'label')}>
    //     Channel
    //   </div>,
    //   <div onClick={this.sortBy.bind(this, 'budget')} style={{cursor: 'pointer'}}>
    //     Cost
    //   </div>,
    //   <div style={{display: 'inline-flex'}}>
    //     {this.state.editRevenueMetric ?
    //       <Select
    //         selected={this.state.attributionTableRevenueMetric}
    //         select={{
    //           options: revenueMetricsOptions
    //         }}
    //         onChange={(e) => {
    //           this.setState({attributionTableRevenueMetric: e.value});
    //         }}
    //         style={{width: '100px', fontWeight: 'initial', fontSize: 'initial', color: 'initial', textAlign:
    // 'initial'}} /> : <div onClick={this.sortBy.bind(this, 'revenueMetric')} style={{cursor: 'pointer'}}
    // data-tip={`Attributed ${revenueMetrics[this.state.attributionTableRevenueMetric]}`}>
    // {revenueMetrics[this.state.attributionTableRevenueMetric]} </div> } <div
    // className={dashboardStyle.locals.metricEdit} onClick={() => { this.setState({editRevenueMetric:
    // !this.state.editRevenueMetric}); }}> {this.state.editRevenueMetric ? 'Done' : 'Edit'} </div> </div>, <div
    // onClick={this.sortBy.bind(this, 'ROI')} style={{cursor: 'pointer'}}> ROI </div>, <div
    // onClick={this.sortBy.bind(this, 'webVisits')} style={{cursor: 'pointer'}}> Web Visits </div>, <div
    // onClick={this.sortBy.bind(this, 'conversion')} style={{cursor: 'pointer', display: 'flex'}} data-tip="number
    // of
    // times the channel/campaign led to a direct online conversion event on your website or landing pages."> Conv.
    // </div>, <div style={{display: 'inline-flex'}}> {this.state.editMetric ? <Select
    // selected={this.state.attributionTableIndicator} select={{ options: metricsWithInfluencedOptions }}
    // onChange={(e) => { this.setState({attributionTableIndicator: e.value}); }} style={{width: '100px', fontWeight:
    // 'initial', fontSize: 'initial', color: 'initial', textAlign: 'initial'}} /> : <div
    // onClick={this.sortBy.bind(this, 'funnelIndicator')} style={{cursor: 'pointer'}} data-tip={`Attributed
    // ${metricsWithInfluenced[this.state.attributionTableIndicator]}`}>
    // {metricsWithInfluenced[this.state.attributionTableIndicator]} </div> } <div
    // className={dashboardStyle.locals.metricEdit} onClick={() => { this.setState({editMetric:
    // !this.state.editMetric}); }}> {this.state.editMetric ? 'Done' : 'Edit'} </div> </div>, <div
    // onClick={this.sortBy.bind(this, 'CPX')} style={{cursor: 'pointer', display: 'flex'}} data-tip={'Cost per ' +
    // metricsWithInfluencedSingular[this.state.attributionTableIndicator]}> Efficiency </div> ], { className:
    // dashboardStyle.locals.headRow });

    const channelsArray = getChannelsWithNicknames();
    channelsArray.push({value: 'direct', label: 'Direct'});

    const stagesData = stages.map(stage => {
      return {
        stageName: stage.name,
        number: formatNumber(Math.round(sumBy(channelsArray,
          channel => get(channelsImpact, [stage.dataKey, channel.value], 0)))),
        previousMonth: 300
      };
    });

    let channelsWithData = channelsArray.map(item => {
      const json = {
        channel: item.value,
        label: item.label,
        budget: sumBudgets[item.value] || 0,
        revenueMetric: (channelsImpact &&
          channelsImpact[this.state.attributionTableRevenueMetric] &&
          channelsImpact[this.state.attributionTableRevenueMetric][item.value])
          ? channelsImpact[this.state.attributionTableRevenueMetric][item.value]
          : 0,
        webVisits: (channelsImpact && channelsImpact['webVisits'] && channelsImpact['webVisits'][item.value])
          ? channelsImpact['webVisits'][item.value]
          : 0,
        conversion: (channelsImpact && channelsImpact['conversion'] && channelsImpact['conversion'][item.value])
          ? channelsImpact['conversion'][item.value]
          : 0,
        funnelIndicator: (channelsImpact &&
          channelsImpact[this.state.attributionTableIndicator] &&
          channelsImpact[this.state.attributionTableIndicator][item.value])
          ? channelsImpact[this.state.attributionTableIndicator][item.value]
          : 0
      };
      json.ROI = json.budget ? json.revenueMetric / json.budget : 0;
      json.CPX = json.budget / json.funnelIndicator;
      return json;
    });

    channelsWithData =
      channelsWithData.filter(
        item => item.funnelIndicator || item.conversion || item.webVisits || item.revenueMetric);

    const rows = channelsWithData
      .sort((item1, item2) =>
        (item2[this.state.sortBy] - item1[this.state.sortBy]) * this.state.isDesc
      )
      .map(item => {
        const {channel} = item;
        return this.getTableRow(null,
          selectedStage.columns.map(column => getColumnData(channel, column.type)), {
            key: channel,
            className: dashboardStyle.locals.tableRow
          });
      });

    const footRow = this.getTableRow(null,
      selectedStage.columns.map(column => getTotalColumnData(channelsWithData, column.type)),
      {
        className: dashboardStyle.locals.footRow
      });

    // const footRow = this.getTableRow(null, [
    //   'Total',
    //   '$' + formatNumber(totalBudget),
    //   '$' + formatNumber(sumData.reduce((sum, item) => sum + item.revenueMetric, 0)),
    //   Math.round(sumData.reduce((sum, item) => sum + item.ROI, 0) / sumData.length * 100) + '%',
    //   formatNumber(sumData.reduce((sum, item) => sum + item.webVisits, 0)),
    //   formatNumber(sumData.reduce((sum, item) => sum + item.conversion, 0)),
    //   totalIndicatorGenerated,
    //   this.formatEffciency(totalBudget,
    //     totalIndicatorGenerated,
    //     metricsWithInfluencedSingular[this.state.attributionTableIndicator])
    // ], {
    //   className: dashboardStyle.locals.footRow
    // });

    const convIndicatorImpact = channelsImpact && channelsImpact[this.state.conversionIndicator];
    const fatherChannelsWithBudgets = [];
    let fatherChannelsSum = 0;
    convIndicatorImpact && Object.keys(convIndicatorImpact).forEach(channel => {
      const channelCategory = getMetadata('category', channel);
      if (channelCategory && convIndicatorImpact[channel]) {
        fatherChannelsSum += convIndicatorImpact[channel];
        const existsFather = fatherChannelsWithBudgets.find(item => item.name === channelCategory);
        if (existsFather) {
          existsFather.value += convIndicatorImpact[channel];
        }
        else {
          fatherChannelsWithBudgets.push({name: channelCategory, value: convIndicatorImpact[channel]});
        }
      }
    });

    const journeys = [];
    let journeysSum = 0;
    users.forEach(user => {
      const journey = user.journey
        .filter(item => item.channel &&
          item.channel !==
          'direct' &&
          item.funnelStage.includes(this.state.conversionIndicator))
        .map(item => item.channel);
      if (journey && journey.length > 0) {
        journeysSum++;
        const alreadyExists = journeys.find(item => item.channels.length ===
          journey.length &&
          item.channels.every((item, index) => item === journey[index]));
        if (alreadyExists) {
          alreadyExists.count++;
        }
        else {
          journeys.push({
            channels: journey,
            count: 1
          });
        }
      }
    });

    const journeysUI = journeys
      .sort((a, b) => b.count - a.count)
      .map((item, index) =>
        <div key={index} className={dashboardStyle.locals.journeyRow}>
          <div style={{width: '78%'}}>
            <div className={dashboardStyle.locals.journey}>
              {item.channels.map((channel, index) => {
                const channelNickname = getChannelNickname(channel);
                return <div className={dashboardStyle.locals.channelBox} key={index}>
                  <div className={dashboardStyle.locals.channelIcon} data-icon={'plan:' + channel}
                       style={{margin: '0 5px'}}/>
                  <div className={dashboardStyle.locals.channelText} data-tip={channelNickname}>
                    {channelNickname}
                  </div>
                </div>;
              })}
            </div>
          </div>
          <div>
            {item.count}
          </div>
          <div style={{marginLeft: '48px'}}>
            {Math.round(item.count / journeysSum * 100)}%
          </div>
        </div>
      );

    return <div>
      <div className={this.classes.wrap}>
        <div>
          <FeatureToggle featureName="attribution">
            <div className={dashboardStyle.locals.item}
                 style={{height: '459px', width: '1110px', overflow: 'visible', padding: '15px 0'}}>
              <StageSelector stages={stagesData} selectedIndex={selectedStageIndex}
                             selectStage={(index) => this.setState({selectedStageIndex: index})}/>
              <table className={dashboardStyle.locals.table}>
                <thead className={dashboardStyle.locals.tableHead}>
                {headRow}
                </thead>
                <tbody className={dashboardStyle.locals.tableBody}>
                {rows}
                </tbody>
                <tfoot>
                {footRow}
                </tfoot>
              </table>
            </div>
          </FeatureToggle>
          <FeatureToggle featureName="attribution">
            <div className={dashboardStyle.locals.item} style={{height: '387px', width: '1110px'}}>
              <div className={dashboardStyle.locals.text}>
                Top Conversion Journeys
              </div>
              <div style={{display: 'flex'}}>
                <div className={dashboardStyle.locals.conversionGoal}>
                  Choose a conversion goal
                  <Select
                    selected={this.state.conversionIndicator}
                    select={{
                      options: metricsOptions
                    }}
                    onChange={(e) => {
                      this.setState({conversionIndicator: e.value});
                    }}
                    style={{width: '143px', marginLeft: '10px'}}
                  />
                </div>
              </div>
              <div style={{position: 'relative', display: 'flex', padding: '10px 0', height: '275px'}}>
                <div style={{overflow: 'auto'}}>
                  {
                    fatherChannelsWithBudgets
                      .sort((a, b) => b.value - a.value)
                      .map((element, i) => (
                        <div key={i} className={dashboardStyle.locals.fatherChannelBox}>
                          <div className={dashboardStyle.locals.fatherChannelBoxFill}
                               style={{width: Math.round(element.value / fatherChannelsSum * 400) + 'px'}}/>
                          <div className={dashboardStyle.locals.fatherChannelTitle}>
                            {element.name}
                          </div>
                          <div className={dashboardStyle.locals.fatherChannelValue}>
                            {Math.round(element.value)} ({Math.round(element.value / fatherChannelsSum * 100)}%)
                          </div>
                        </div>
                      ))
                  }
                </div>
                <div className={dashboardStyle.locals.line}/>
                <div style={{width: '625px', marginLeft: '30px'}}>
                  <div style={{display: 'flex'}}>
                    <div style={{marginLeft: '75%'}}>
                      Conv
                    </div>
                    <div style={{marginLeft: '20px'}}>
                      % of Total
                    </div>
                  </div>
                  <div style={{overflowY: 'auto', height: '266px'}}>
                    {journeysUI}
                  </div>
                </div>
              </div>
            </div>
          </FeatureToggle>
        </div>
        <div>
          <PerformanceGraph isPast={true} months={months ? months.length : 1} data={indicatorsDataPerMonth}
                            defaultIndicator={firstObjective}/>
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