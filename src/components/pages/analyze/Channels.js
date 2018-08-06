import React from "react";
import Component from "components/Component";
import style from "styles/onboarding/onboarding.css";
import dashboardStyle from "styles/dashboard/dashboard.css";
import Select from 'components/controls/Select';
import { formatNumber } from 'components/utils/budget';
import merge from 'lodash/merge';
import { getChannelsWithNicknames, getMetadata, getNickname as getChannelNickname } from 'components/utils/channels';
import { getNickname as getIndicatorNickname } from 'components/utils/indicators';
import { FeatureToggle } from 'react-feature-toggles';
import { formatDate } from 'components/utils/date';
import ReactTooltip from 'react-tooltip';
import icons from 'styles/icons/plan.css';
import PerformanceGraph from 'components/pages/analyze/PerformanceGraph';

export default class Channels extends Component {

  style = style;
  styles = [dashboardStyle, icons];

  static defaultProps = {
    previousData: []
  };

  constructor(props) {
    super(props);

    this.state = {
      attributionTableIndicator: 'MCL',
      conversionIndicator: 'MCL',
      attributionTableRevenueMetric: 'pipeline',
      sortBy: 'webVisits',
      isDesc: 1,
      firstObjective: 'SQL'
    };
  }

  initialize(props) {
    //set objective
    this.setState({firstObjective: this.props.calculatedData.objectives.firstObjective});
  }

  componentDidMount() {
    this.initialize(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
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

  sortBy(param) {
    if (this.state.sortBy === param) {
      this.setState({isDesc: this.state.isDesc * -1});
    }
    else {
      this.setState({sortBy: param});
    }
  }

  formatEffciency(dividend, divisor, indicatorName){
    const efficiency =  Math.round(dividend/divisor);
    if(isFinite(efficiency)){
      return '$' + formatNumber(efficiency) + "/" + indicatorName;
    }
    if(dividend == 0){
      return '0';
    }
    return '-';
  }

  render() {
    const { previousData, attribution, CEVs } = this.props;
    const { firstObjective } = this.state;

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
    let sumedBudgets = {};
    budgets.forEach(month => {
      Object.keys(month).forEach(channel => {
        if (!sumedBudgets[channel]) {
          sumedBudgets[channel] = 0;
        }
        sumedBudgets[channel] += month[channel];
      })
    });

    const data = relevantData.map(month => {
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
      });

    const metrics = [
      {value: 'MCL', label: getIndicatorNickname('MCL')},
      {value: 'MQL', label: getIndicatorNickname('MQL')},
      {value: 'SQL', label: getIndicatorNickname('SQL')},
      {value: 'opps', label: getIndicatorNickname('opps')},
      {value: 'users', label: getIndicatorNickname('users')},
    ];
    const attributionModels = [
      {value: false, label: 'Full Journey'},
      {value: 'firsttouch', label: 'Introducer'},
      {value: 'lasttouch', label: 'Converter'}
    ];

    const headRow = this.getTableRow(null, [
      <div style={{ fontWeight: 'bold', fontSize: '22px', textAlign: 'left', cursor: 'pointer' }} onClick={this.sortBy.bind(this, 'label')}>
        Channel
      </div>,
      <div onClick={this.sortBy.bind(this, 'budget')} style={{ cursor: 'pointer' }}>
        Cost
      </div>,
      <div style={{display: 'inline-flex'}}>
        { this.state.editRevenueMetric ?
          <Select
            selected={this.state.attributionTableRevenueMetric}
            select={{
              options: [{value: 'revenue', label: 'revenue'}, {value: 'pipeline', label: 'pipeline'}, {value: 'LTV', label: 'LTV'}]
            }}
            onChange={(e) => {
              this.setState({attributionTableRevenueMetric: e.value})
            }}
            style={{ width: '100px', fontWeight: 'initial', fontSize: 'initial', color: 'initial', textAlign: 'initial' }}
          />
          :
          <div onClick={this.sortBy.bind(this, 'revenueMetric')} style={{ cursor: 'pointer' }} data-tip={`Attributed ${this.state.attributionTableRevenueMetric}`}>
            {this.state.attributionTableRevenueMetric}
          </div>
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
      <div onClick={this.sortBy.bind(this, 'conversion')} style={{ cursor: 'pointer', display: 'flex' }} data-tip="number of times the channel/campaign led to a direct online conversion event on your website or landing pages.">
        Conv.
      </div>,
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
            style={{ width: '100px', fontWeight: 'initial', fontSize: 'initial', color: 'initial', textAlign: 'initial' }}
          />
          :
          <div onClick={this.sortBy.bind(this, 'funnelIndicator')} style={{ cursor: 'pointer' }} data-tip={`Attributed ${getIndicatorNickname(this.state.attributionTableIndicator)}`}>
            {getIndicatorNickname(this.state.attributionTableIndicator)}
          </div>
        }
        <div className={dashboardStyle.locals.metricEdit} onClick={() => {
          this.setState({editMetric: !this.state.editMetric})
        }}>
          { this.state.editMetric ? 'Done' : 'Edit' }
        </div>
      </div>,
      <div onClick={this.sortBy.bind(this, 'CPX')} style={{ cursor: 'pointer', display: 'flex' }} data-tip={'Cost per ' + getIndicatorNickname(this.state.attributionTableIndicator, true)}>
        Efficiency
      </div>
    ], {
      className: dashboardStyle.locals.headRow
    });

    const channelsArray = getChannelsWithNicknames();
    channelsArray.push({value: 'direct', label: 'Direct'});

    let channelsWithData = channelsArray.map(item => {
      const json =  {
        channel: item.value,
        label: item.label,
        budget: sumedBudgets[item.value] || 0,
        revenueMetric:(CEVs && CEVs[this.state.attributionTableRevenueMetric] ? CEVs[this.state.attributionTableRevenueMetric][item.value] : 0),
        webVisits: (CEVs && CEVs["webVisits"] ? CEVs["webVisits"][item.value] : 0),
        conversion: (CEVs && CEVs["conversion"] ? CEVs["conversion"][item.value] : 0),
        funnelIndicator: (CEVs && CEVs[this.state.attributionTableIndicator] ? CEVs[this.state.attributionTableIndicator][item.value] : 0),
      };
      json.ROI = json.budget ? json.revenueMetric / json.budget : 0;
      json.CPX = json.budget / json.funnelIndicator;
      return json;
    }) ;

    channelsWithData = channelsWithData.filter(item => item.funnelIndicator || item.conversion || item.webVisits || item.revenueMetric);

    const rows = channelsWithData
      .sort((item1, item2) =>
        (item2[this.state.sortBy] - item1[this.state.sortBy]) * this.state.isDesc
      )
      .map(item => {
        const { channel, label, budget, revenueMetric, webVisits, conversion, funnelIndicator, ROI, CPX } = item;
        return this.getTableRow(null,
          [
            <div style={{ display: 'flex' }}>
              <div className={dashboardStyle.locals.channelIcon} data-icon={"plan:" + channel}/>
              <div className={dashboardStyle.locals.channelTable}>
                {label}
              </div>
            </div>,
            '$' + formatNumber(budget),
            '$' + formatNumber(revenueMetric),
            Math.round(ROI * 100) + '%',
            formatNumber(webVisits),
            formatNumber(conversion),
            Math.round(funnelIndicator * 100) / 100,
            this.formatEffciency(budget, funnelIndicator, getIndicatorNickname(this.state.attributionTableIndicator, true))
          ], {
            key: channel,
            className: dashboardStyle.locals.tableRow
          })
      });

    const sumData = channelsWithData;

    const totalBudget = sumData.reduce((sum, item) => sum + item.budget, 0);
    const totalIndicatorGenerated = Math.round(sumData.reduce((sum, item) => sum + item.funnelIndicator, 0) * 100) / 100;
    const footRow = this.getTableRow(null, [
      'Total',
      '$' + formatNumber(totalBudget),
      '$' + formatNumber(sumData.reduce((sum, item) => sum + item.revenueMetric, 0)),
      Math.round(sumData.reduce((sum, item) => sum + item.ROI, 0) / sumData.length * 100) + '%',
      formatNumber(sumData.reduce((sum, item) => sum + item.webVisits, 0)),
      formatNumber(sumData.reduce((sum, item) => sum + item.conversion, 0)),
      totalIndicatorGenerated,
      this.formatEffciency(totalBudget, totalIndicatorGenerated, getIndicatorNickname(this.state.attributionTableIndicator, true))
    ], {
      className: dashboardStyle.locals.footRow
    });

    const CEV = CEVs && CEVs[this.state.conversionIndicator];
    const fatherChannelsWithBudgets = [];
    let fatherChannelsSum = 0;
    Object.keys(CEV).forEach(channel => {
      const channelCategory = getMetadata('category', channel);
      if (channelCategory && CEV[channel]) {
        fatherChannelsSum += CEV[channel];
        const existsFather = fatherChannelsWithBudgets.find(item => item.name === channelCategory);
        if (existsFather) {
          existsFather.value += CEV[channel];
        }
        else {
          fatherChannelsWithBudgets.push({name: channelCategory, value: CEV[channel]});
        }
      }
    });

    const users = attribution && attribution.users;
    const journeys = [];
    let journeysSum = 0;
    users.forEach(user => {
      const journey = user.journey
        .filter(item => item.channel && item.channel !== 'direct' && item.funnelStage.includes(this.state.conversionIndicator))
        .map(item => item.channel);
      if (journey && journey.length > 0) {
        journeysSum++;
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
              { item.channels.map((channel, index) =>
                <div className={dashboardStyle.locals.channelBox} key={index}>
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
            {Math.round(item.count / journeysSum * 100)}%
          </div>
        </div>
      );

    return <div>
      <div className={ this.classes.wrap }>
        <div>
          <FeatureToggle featureName="attribution">
            <div className={dashboardStyle.locals.item}
                 style={{height: '459px', width: '1110px', overflow: 'visible', padding: '15px 0'}}>
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
              <div style={{ display: 'flex' }}>
                <div>
                  <Select
                    selected={this.props.attributionModel ? this.props.attributionModel : false}
                    select={{
                      options: attributionModels
                    }}
                    onChange={(e) => {
                      this.props.calculateAttributionData(this.props.months ? previousData.length - this.props.months - 1 : 0, e.value)
                    }}
                    style={{ width: '130px', marginTop: '13px', position: 'absolute', marginLeft: '20px' }}
                  />
                </div>
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
                          <div className={dashboardStyle.locals.fatherChannelBoxFill} style={{ width: Math.round(element.value / fatherChannelsSum * 400) + 'px' }}/>
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
          <PerformanceGraph isPast={true} months={this.props.months || 1} data={data} defaultIndicator={firstObjective}/>
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