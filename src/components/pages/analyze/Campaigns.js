import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import dashboardStyle from 'styles/dashboard/dashboard.css';
import Select from 'components/controls/Select';
import {formatNumber} from 'components/utils/budget';
import {getNickname as getChannelNickname} from 'components/utils/channels';
import {getNickname as getIndicatorNickname} from 'components/utils/indicators';
import {FeatureToggle} from 'react-feature-toggles';
import {timeFrameToDate} from 'components/utils/objective';
import history from 'history';
import {formatDate} from 'components/utils/date';
import ReactTooltip from 'react-tooltip';
import icons from 'styles/icons/plan.css';

export default class Campaigns extends Component {

  style = style;
  styles = [dashboardStyle, icons];

  constructor(props) {
    super(props);

    this.state = {
      attributionTableIndicator: 'MCL',
      conversionIndicator: 'MCL',
      attributionTableRevenueMetric: 'pipeline',
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

  render() {
    const {attribution: {campaigns: attributionCampaigns, users}, campaigns} = this.props;

    const metrics = [
      {value: 'MCL', label: getIndicatorNickname('MCL')},
      {value: 'MQL', label: getIndicatorNickname('MQL')},
      {value: 'SQL', label: getIndicatorNickname('SQL')},
      {value: 'opps', label: getIndicatorNickname('opps')},
      {value: 'users', label: getIndicatorNickname('users')}
    ];

    const headRow = this.getTableRow(null, [
      <div style={{textAlign: 'left', cursor: 'pointer'}}
           onClick={this.sortBy.bind(this, 'label')}>
        campaign
      </div>,
      <div onClick={this.sortBy.bind(this, 'budget')} style={{cursor: 'pointer'}}>
        Cost
      </div>,
      <div style={{display: 'inline-flex'}}>
        {this.state.editRevenueMetric ?
          <Select
            selected={this.state.attributionTableRevenueMetric}
            select={{
              options: [{value: 'revenue', label: 'revenue'}, {value: 'pipeline', label: 'pipeline'}, {
                value: 'LTV',
                label: 'LTV'
              }]
            }}
            onChange={(e) => {
              this.setState({attributionTableRevenueMetric: e.value});
            }}
            style={{width: '100px', fontWeight: 'initial', fontSize: 'initial', color: 'initial', textAlign: 'initial'}}
          />
          :
          <div onClick={this.sortBy.bind(this, 'revenueMetric')} style={{cursor: 'pointer'}}
               data-tip={`Attributed ${this.state.attributionTableRevenueMetric}`}>
            {this.state.attributionTableRevenueMetric}
          </div>
        }
        <div className={dashboardStyle.locals.metricEdit} onClick={() => {
          this.setState({editRevenueMetric: !this.state.editRevenueMetric});
        }}>
          {this.state.editRevenueMetric ? 'Done' : 'Edit'}
        </div>
      </div>,
      <div onClick={this.sortBy.bind(this, 'ROI')} style={{cursor: 'pointer'}}>
        ROI
      </div>,
      <div onClick={this.sortBy.bind(this, 'webVisits')} style={{cursor: 'pointer'}}>
        Web Visits
      </div>,
      <div onClick={this.sortBy.bind(this, 'conversion')} style={{cursor: 'pointer', display: 'flex'}}
           data-tip="number of times the campaign led to a direct online conversion event on your website or landing pages.">
        Conv.
      </div>,
      <div style={{display: 'inline-flex'}}>
        {this.state.editMetric ?
          <Select
            selected={this.state.attributionTableIndicator}
            select={{
              options: metrics
            }}
            onChange={(e) => {
              this.setState({attributionTableIndicator: e.value});
            }}
            style={{width: '100px', fontWeight: 'initial', fontSize: 'initial', color: 'initial', textAlign: 'initial'}}
          />
          :
          <div onClick={this.sortBy.bind(this, 'funnelIndicator')} style={{cursor: 'pointer'}}
               data-tip={`Attributed ${getIndicatorNickname(this.state.attributionTableIndicator)}`}>
            {getIndicatorNickname(this.state.attributionTableIndicator)}
          </div>
        }
        <div className={dashboardStyle.locals.metricEdit} onClick={() => {
          this.setState({editMetric: !this.state.editMetric});
        }}>
          {this.state.editMetric ? 'Done' : 'Edit'}
        </div>
      </div>,
      <div onClick={this.sortBy.bind(this, 'CPX')} style={{cursor: 'pointer', display: 'flex'}}
           data-tip={'Cost per ' + getIndicatorNickname(this.state.attributionTableIndicator, true)}>
        Efficiency
      </div>,
      'Channels'
    ], {
      className: dashboardStyle.locals.headRow
    });

    let campaignsWithData = attributionCampaigns.map(campaign => {
      const campaignName = campaign.name;
      let budget = 0;
      const platformCampaignIndex = campaigns.findIndex(campaign => (campaign.name === campaignName || (campaign.tracking && campaign.tracking.campaignUTM === campaignName)) && !campaign.isArchived);
      const platformCampaign = campaigns[platformCampaignIndex];
      if (platformCampaign) {
        if (platformCampaign.isOneTime) {
          if (platformCampaign.dueDate && timeFrameToDate(platformCampaign.dueDate).getMonth() === new Date().getMonth()) {
            budget = platformCampaign.actualSpent || platformCampaign.budget || 0;
          }
        }
        else {
          if (!platformCampaign.dueDate || (platformCampaign.dueDate && timeFrameToDate(platformCampaign.dueDate) < new Date())) {
            budget = platformCampaign.actualSpent || platformCampaign.budget || 0;
          }
        }
      }
      const json = {
        label: campaignName,
        budget: budget,
        revenueMetric: campaign[this.state.attributionTableRevenueMetric],
        webVisits: campaign.webVisits,
        conversion: campaign.conversion,
        funnelIndicator: campaign[this.state.attributionTableIndicator],
        channels: campaign.channels,
        platformCampaignIndex: platformCampaignIndex
      };
      json.ROI = json.budget ? json.revenueMetric / json.budget : 0;
      json.CPX = json.budget / json.funnelIndicator;
      return json;
    });

    campaignsWithData = campaignsWithData.filter(item => item.funnelIndicator || item.conversion || item.webVisits || item.revenueMetric);

    const rows = campaignsWithData
      .sort((item1, item2) =>
        (item2[this.state.sortBy] - item1[this.state.sortBy]) * this.state.isDesc
      )
      .map(item => {
          const {label, budget, revenueMetric, webVisits, conversion, funnelIndicator, ROI, CPX, channels, platformCampaignIndex} = item;
          return this.getTableRow(null,
            [
              <div className={dashboardStyle.locals.channelTable} data-link={platformCampaignIndex !== -1 ? true : null}
                   onClick={() => {
                     if (platformCampaignIndex !== -1) {
                       history.push({
                         pathname: '/campaigns/by-channel',
                         query: {campaign: platformCampaignIndex}
                       });
                     }
                   }}>
                {label}
              </div>,
              '$' + formatNumber(budget),
              '$' + formatNumber(revenueMetric),
              Math.round(ROI * 100) + '%',
              formatNumber(webVisits),
              formatNumber(conversion),
              Math.round(funnelIndicator),
              '$' + (isFinite(CPX) ? formatNumber(Math.round(CPX) + '/' + getIndicatorNickname(this.state.attributionTableIndicator, true)) : 0),
              <div style={{display: 'flex'}}>
                <ReactTooltip/>
                {channels.map(channel =>
                  <div key={channel} data-tip={getChannelNickname(channel)} className={dashboardStyle.locals.channelIcon}
                       data-icon={'plan:' + channel}/>
                )}
              </div>
            ], {
              key: label,
              className: dashboardStyle.locals.tableRow
            });
        }
      );

    const sumData = campaignsWithData;

    const footRow = this.getTableRow(null, [
        'Total',
        '$' + formatNumber(sumData.reduce((sum, item) => sum + item.budget, 0)),
        '$' + formatNumber(sumData.reduce((sum, item) => sum + item.revenueMetric, 0)),
        Math.round(sumData.reduce((sum, item) => sum + item.ROI, 0) / sumData.length * 100) + '%',
        formatNumber(sumData.reduce((sum, item) => sum + item.webVisits, 0)),
        formatNumber(sumData.reduce((sum, item) => sum + item.conversion, 0)),
        Math.round(sumData.reduce((sum, item) => sum + item.funnelIndicator, 0) * 100) / 100,
        '$' + formatNumber(Math.round(sumData.reduce((sum, item) => isFinite(item.CPX) ? sum + item.funnelIndicator * item.CPX : sum, 0) / sumData.reduce((sum, item) => sum + item.funnelIndicator, 0)) + '/' + getIndicatorNickname(this.state.attributionTableIndicator, true)),
        ''
      ]
      , {
        className: dashboardStyle.locals.footRow
      });

    const journeys = [];
    let journeysSum = 0;
    users.forEach(user => {
      const journey = user.journey
        .filter(item => item.campaign && item.funnelStage.includes(this.state.conversionIndicator))
        .map(item => {
          return {channel: item.channel, campaign: item.campaign};
        });
      if (journey && journey.length > 0) {
        journeysSum++;
        const alreadyExists = journeys.find(item => item.journey.length === journey.length && item.journey.every((item, index) => item.campaign === journey[index].campaign && item.channel === journey[index].channel));
        if (alreadyExists) {
          alreadyExists.count++;
        }
        else {
          journeys.push({
            journey: journey,
            count: 1
          });
        }
      }
    });

    let journeyCampaignsSum = 0;
    const journeyCampaigns = attributionCampaigns
      .filter(campaign => campaign[this.state.conversionIndicator])
      .map(campaign => {
        const value = campaign[this.state.conversionIndicator];
        journeyCampaignsSum += value;
        return {name: campaign.name, value: value};
      });

    const journeysUI = journeys
      .sort((a, b) => b.count - a.count)
      .map((item, index) =>
        <div key={index} className={dashboardStyle.locals.journeyRow}>
          <div style={{width: '78%'}}>
            <div className={dashboardStyle.locals.journey}>
              {item.journey.map((journeyItem, index) => {
                const journeyText = journeyItem.campaign;
                return <div className={dashboardStyle.locals.channelBox} key={index} data-tip={journeyText}>
                  <div className={dashboardStyle.locals.channelIcon} data-icon={'plan:' + journeyItem.channel}
                       style={{margin: '0 5px'}}/>
                  <div className={dashboardStyle.locals.channelText}>
                    {journeyText}
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
                      options: metrics
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
                    journeyCampaigns
                      .sort((a, b) => b.value - a.value)
                      .map((element, i) => (
                        <div key={i} className={dashboardStyle.locals.fatherChannelBox}>
                          <div className={dashboardStyle.locals.fatherChannelBoxFill}
                               style={{width: Math.round(element.value / journeyCampaignsSum * 400) + 'px'}}/>
                          <div className={dashboardStyle.locals.fatherChannelTitle}>
                            {element.name}
                          </div>
                          <div className={dashboardStyle.locals.fatherChannelValue}>
                            {Math.round(element.value)} ({Math.round(element.value / journeyCampaignsSum * 100)}%)
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
    } else {
      elem = item;
    }

    return elem;
  }

}