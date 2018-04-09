import React from "react";
import Component from "components/Component";
import style from "styles/onboarding/onboarding.css";
import dashboardStyle from "styles/dashboard/dashboard.css";
import Select from 'components/controls/Select';
import { getIndicatorsWithNicknames } from 'components/utils/indicators';
import { formatBudget, formatBudgetShortened } from 'components/utils/budget';
import { getChannelsWithNicknames, getMetadata, getNickname as getChannelNickname } from 'components/utils/channels';
import { getNickname as getIndicatorNickname } from 'components/utils/indicators';
import { FeatureToggle } from 'react-feature-toggles';
import Label from 'components/ControlsLabel';
import { timeFrameToDate } from 'components/utils/objective';
import { formatDate } from 'components/utils/date';
import icons from 'styles/icons/plan.css';

export default class Content extends Component {

  style = style;
  styles = [dashboardStyle, icons];

  static defaultProps = {
    previousData: []
  };

  constructor(props) {
    super(props);

    this.state = {
      attributionTableIndicator: 'MCL',
      attributionTableRevenueMetric: 'revenue',
      sortBy: 'webVisits',
      isDesc: 1
    };
  }

  sortBy(param) {
    if (this.state.sortBy === param) {
      this.setState({isDesc: this.state.isDesc * -1});
    }
    else {
      this.setState({sortBy: param});
    }
  }

  getChannel(page) {
    const siteStructure = this.props.attribution.siteStructure || {};
    if (page.includes(siteStructure.blog)) {
      return 'content_contentCreation_companyBlog';
    }
    if (page.includes(siteStructure.caseStudies)) {
      return 'content_contentCreation_caseStudies';
    }
    return 'web_companyWebsite';
  }

  render() {
    const { previousData, attribution } = this.props;
    const attributionPages = attribution.pages || [];

    const months = previousData.map((item, index) => {
      return {value: index, label: formatDate(item.planDate)}
    });

    const metrics = [
      {value: 'MCL', label: getIndicatorNickname('MCL')},
      {value: 'MQL', label: getIndicatorNickname('MQL')},
      {value: 'SQL', label: getIndicatorNickname('SQL')},
      {value: 'opps', label: getIndicatorNickname('opps')},
      {value: 'users', label: getIndicatorNickname('users')},
    ];

    const headRow = this.getTableRow(null, [
      'Channels',
      'Title',
      <div style={{display: 'inline-flex'}}>
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
          <div onClick={this.sortBy.bind(this, 'revenueMetric')} style={{ cursor: 'pointer' }}>
            {this.state.attributionTableRevenueMetric === 'revenue' ? 'Revenue' : 'Pipeline'}
          </div>
        }
        <div className={dashboardStyle.locals.metricEdit} onClick={() => {
          this.setState({editRevenueMetric: !this.state.editRevenueMetric})
        }}>
          { this.state.editRevenueMetric ? 'Done' : 'Edit' }
        </div>
      </div>,
      <div onClick={this.sortBy.bind(this, 'webVisits')} style={{ cursor: 'pointer' }}>
        Web Visits
      </div>,
      <div onClick={this.sortBy.bind(this, 'conversion')} style={{ cursor: 'pointer', display: 'flex' }}>
        <Label
          style={{ width: 'auto', marginBottom: 'initial', letterSpacing: 'initial', fontSize: '18px', fontWeight: '600', color: '#354052', justifyContent: 'center', textTransform: 'capitalize' }}
          question={['']}
          description={['number of times the content led to a direct online conversion event on your website or landing pages.']}>
          Conv.
        </Label>
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
          <div onClick={this.sortBy.bind(this, 'funnelIndicator')} style={{ cursor: 'pointer' }}>
            {getIndicatorNickname(this.state.attributionTableIndicator)}
          </div>
        }
        <div className={dashboardStyle.locals.metricEdit} onClick={() => {
          this.setState({editMetric: !this.state.editMetric})
        }}>
          { this.state.editMetric ? 'Done' : 'Edit' }
        </div>
      </div>,
      <div onClick={this.sortBy.bind(this, 'readRatio')} style={{ cursor: 'pointer' }}>
        Read ratio
      </div>,
      <div onClick={this.sortBy.bind(this, 'proceedRatio')} style={{ cursor: 'pointer' }}>
        Proceed ratio
      </div>
    ], {
      className: dashboardStyle.locals.headRow
    });

    const pagesData = attributionPages.map(item => {
      return {
        channel: this.getChannel(item.page),
        title: item.title,
        revenueMetric: item[this.state.attributionTableRevenueMetric],
        webVisits: item.webVisits,
        conversion: item.conversion,
        funnelIndicator: item[this.state.attributionTableIndicator],
        readRatio: Math.round(item.totalRead / item.total * 100),
        proceedRatio: Math.round(item.proceed / item.total * 100)
      };
    }) ;

    const rows = pagesData
      .sort((item1, item2) =>
        (item2[this.state.sortBy] - item1[this.state.sortBy]) * this.state.isDesc
      )
      .map((item, index) => {
        const { channel, title, revenueMetric, webVisits, conversion, funnelIndicator, readRatio, proceedRatio } = item;
        return (funnelIndicator || conversion || webVisits) ?
          this.getTableRow(null,
            [
              <div style={{ display: 'flex' }}>
                <div className={dashboardStyle.locals.channelIcon} data-icon={"plan:" + channel}/>
                <div className={dashboardStyle.locals.channelTable}>
                  {getChannelNickname(channel)}
                </div>
              </div>,
              title,
              '$' + formatBudget(revenueMetric),
              webVisits,
              conversion,
              Math.round(funnelIndicator * 100) / 100,
              readRatio + '%',
              proceedRatio + '%'
            ], {
              key: index,
              className: dashboardStyle.locals.tableRow
            })
          : null
      });

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
          <FeatureToggle featureName="attribution">
            <div className={dashboardStyle.locals.item}
                 style={{height: '459px', width: '1110px', overflow: 'visible', padding: '15px 0'}}>
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
        </div>
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