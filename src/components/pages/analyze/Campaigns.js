import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import dashboardStyle from 'styles/dashboard/dashboard.css';
import Select from 'components/controls/Select';
import {formatNumber} from 'components/utils/budget';
import {getNickname as getChannelNickname} from 'components/utils/channels';
import {FeatureToggle} from 'react-feature-toggles';
import {timeFrameToDate} from 'components/utils/objective';
import history from 'history';
import ReactTooltip from 'react-tooltip';
import icons from 'styles/icons/plan.css';
import {get, sumBy} from 'lodash';
import StageSelector from 'components/pages/analyze/StageSelector';

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
      isDesc: 1,
      selectedStageIndex: 0
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
    const {attribution: {campaigns: attributionCampaigns, users}, campaigns, metricsOptions, formatEffciency, formatAverage, getInfluencedDataKey} = this.props;
    const {selectedStageIndex} = this.state;

    const stages = [{
      name: 'Visitors',
      dataKey: 'webVisits',
      columns: [
        {title: 'Campaign', type: 'row-title'},
        {title: 'Cost', type: 'cost'},
        {title: 'Web Visitors', type: 'stage-indicator'},
        {title: 'Efficiency', type: 'efficiency'},
        {title: 'Channels', type: 'channels'}
      ]
    },
      {
        name: 'Leads',
        dataKey: 'MCL',
        columns: [
          {title: 'Campaign', type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Influenced/Touched Leads', type: 'stage-indicator'},
          {title: 'Attributed Leads', type: 'influenced-stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'},
          {title: 'Channels', type: 'channels'}
        ]
      },
      {
        name: 'MQLs', dataKey: 'MQL', columns: [
          {title: 'Campaign', type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Attributed MQLs', type: 'stage-indicator'},
          {title: 'Influenced/Touched MQLs', type: 'influenced-stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'},
          {title: 'Channels', type: 'channels'}
        ]
      },
      {
        name: 'SQLs', dataKey: 'SQL', columns: [
          {title: 'Campaign', type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Attributed SQLs', type: 'stage-indicator'},
          {title: 'Influenced/Touched SQLs', type: 'influenced-stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'},
          {title: 'Channels', type: 'channels'}
        ]
      },
      {
        name: 'Opps', dataKey: 'opps', columns: [
          {title: 'Campaign', type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Attributed Opps', type: 'stage-indicator'},
          {title: 'Influenced/Touched Opps', type: 'influenced-stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'},
          {title: 'Channels', type: 'channels'}
        ]
      },
      {
        name: 'Customers', dataKey: 'users', columns: [
          {title: 'Campaign', type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Attributed Customers', type: 'stage-indicator'},
          {title: 'Influenced/Touched Customers', type: 'influenced-stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'},
          {title: 'Channels', type: 'channels'},
          {title: 'Revenue', type: 'revenue'},
          {title: 'ARPA', type: 'arpa'},
          {title: 'ROI', type: 'roi'}
        ]
      }];

    const selectedStage = stages[selectedStageIndex];

    const headRow = this.getTableRow(null, selectedStage.columns.map(({title}) => {
      return <div onClick={this.sortBy.bind(this, 'budget')} style={{cursor: 'pointer'}}>
        {title}
      </div>;
    }), {className: dashboardStyle.locals.headRow});

    const stageIndicatorKey = selectedStage.dataKey;

    const getPlatformCampaignIndex = (campaignIndex) => {
      const campaignName = attributionCampaigns[campaignIndex].name;
      return campaigns.findIndex(campaign => (campaign.name ===
        campaignName ||
        (campaign.tracking && campaign.tracking.campaignUTM === campaignName)) && !campaign.isArchived);
    };

    const getPlatformCampaign = (campaignIndex) => campaigns[getPlatformCampaignIndex(campaignIndex)];

    const getCampaignCost = (campaignIndex) => {
      let budget = 0;
      const platformCampaign = getPlatformCampaign(campaignIndex);
      if (platformCampaign) {
        if (platformCampaign.isOneTime) {
          if (platformCampaign.dueDate &&
            timeFrameToDate(platformCampaign.dueDate).getMonth() ===
            new Date().getMonth()) {
            budget = platformCampaign.actualSpent || platformCampaign.budget || 0;
          }
        }
        else {
          if (!platformCampaign.dueDate ||
            (platformCampaign.dueDate && timeFrameToDate(platformCampaign.dueDate) < new Date())) {
            budget = platformCampaign.actualSpent || platformCampaign.budget || 0;
          }
        }
      }

      return budget;
    };

    const getMetricNumber = (campaignIndex) => {
      return get(attributionCampaigns, [campaignIndex, stageIndicatorKey], 0);
    };
    const getInfluencedMetricNumber = (campaignIndex) => {
      return get(attributionCampaigns, [campaignIndex, getInfluencedDataKey(stageIndicatorKey)], 0);
    };

    const getCampaignRevenue = (campaignIndex) => {
      return get(attributionCampaigns, [campaignIndex, 'revenue'], 0);
    };

    const formatIndicator = (value) => formatNumber(Math.round(value));

    const getColumnData = (campaignIndex, columnType) => {
      switch (columnType) {
        case 'row-title': {
          const platformCampaignIndex = getPlatformCampaignIndex(campaignIndex);
          return <div className={dashboardStyle.locals.channelTable}
                      data-link={platformCampaignIndex !== -1 ? true : null}
                      onClick={() => {
                        if (platformCampaignIndex !== -1) {
                          history.push({
                            pathname: '/campaigns/by-channel',
                            query: {campaign: platformCampaignIndex}
                          });
                        }
                      }}>
            {attributionCampaigns[campaignIndex].name}
          </div>;
        }
        case 'cost':
          return '$' + formatNumber(getCampaignCost(campaignIndex));
        case 'stage-indicator':
          return formatIndicator(getMetricNumber(campaignIndex));
        case 'influenced-stage-indicator':
          return formatIndicator(getInfluencedMetricNumber(campaignIndex));
        case 'efficiency':
          return formatEffciency(getCampaignCost(campaignIndex), getMetricNumber(campaignIndex), selectedStage.name);
        case 'revenue':
          return '$' + formatNumber(getCampaignRevenue(campaignIndex));
        case 'arpa':
          return formatAverage(getCampaignRevenue(campaignIndex), getMetricNumber(campaignIndex));
        case 'roi':
          return formatAverage(getCampaignRevenue(campaignIndex), getCampaignCost(campaignIndex));
        case 'channels':
          return <div style={{display: 'flex'}}>
            <ReactTooltip/>
            {attributionCampaigns[campaignIndex].channels.map(channel =>
              <div key={channel} data-tip={getChannelNickname(channel)} className={dashboardStyle.locals.channelIcon}
                   data-icon={'plan:' + channel}/>
            )}
          </div>;
      }
    };

    const getTotalColumnData = (campagins, columnType) => {
      const campaignIndices = campagins.map(campagin => campagin.campaignIndex);
      const getTotalCost = () => sumBy(campaignIndices, getCampaignCost);

      const totalIndicatorGenerated = (campaignIndices, getCampaginData) => Math.round(campaignIndices.reduce((sum,
                                                                                                               item) => sum +
        getCampaginData(item), 0) * 100) /
        100;

      const totalMetric = () => totalIndicatorGenerated(campaignIndices, getMetricNumber);

      const totalRevenue = () => sumBy(campaignIndices, getCampaignRevenue);

      switch (columnType) {
        case 'row-title':
          return 'Total';
        case 'cost':
          return '$' + formatNumber(getTotalCost());
        case 'stage-indicator':
          return totalMetric();
        case 'influenced-stage-indicator':
          return totalIndicatorGenerated(campaignIndices, getInfluencedMetricNumber);
        case 'efficiency':
          return formatEffciency(getTotalCost(), totalMetric(), selectedStage.name);
        case 'revenue':
          return '$' + formatNumber(totalRevenue());
        case 'arpa':
          return formatAverage(totalRevenue(), totalMetric());
        case 'roi':
          return formatAverage(totalRevenue(), getTotalCost());
        case 'channels':
          return '';
      }
    };

    let campaignsWithData = attributionCampaigns.map((campaign, index) => {
      const campaignName = campaign.name;
      let budget = 0;
      const platformCampaignIndex = campaigns.findIndex(campaign => (campaign.name ===
        campaignName ||
        (campaign.tracking && campaign.tracking.campaignUTM === campaignName)) && !campaign.isArchived);
      const platformCampaign = campaigns[platformCampaignIndex];
      if (platformCampaign) {
        if (platformCampaign.isOneTime) {
          if (platformCampaign.dueDate &&
            timeFrameToDate(platformCampaign.dueDate).getMonth() ===
            new Date().getMonth()) {
            budget = platformCampaign.actualSpent || platformCampaign.budget || 0;
          }
        }
        else {
          if (!platformCampaign.dueDate ||
            (platformCampaign.dueDate && timeFrameToDate(platformCampaign.dueDate) < new Date())) {
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
        platformCampaignIndex: platformCampaignIndex,
        campaignIndex: index
      };
      json.ROI = json.budget ? json.revenueMetric / json.budget : 0;
      json.CPX = json.budget / json.funnelIndicator;
      return json;
    });

    const stagesData = stages.map(stage => {
      return {
        stageName: stage.name,
        number: formatNumber(Math.round(sumBy(attributionCampaigns,
          campaign => get(campaign, stage.dataKey, 0)))),
        previousMonth: 300
      };
    });

    campaignsWithData =
      campaignsWithData.filter(item => item.funnelIndicator || item.conversion || item.webVisits || item.revenueMetric);

    const rows = campaignsWithData
      .sort((item1, item2) =>
        (item2[this.state.sortBy] - item1[this.state.sortBy]) * this.state.isDesc
      ).map(({campaignIndex}) => {
          return this.getTableRow(null,
            selectedStage.columns.map(column => getColumnData(campaignIndex, column.type)), {
              key: campaignIndex,
              className: dashboardStyle.locals.tableRow
            });
        }
      );

    const footRow = this.getTableRow(null,
      selectedStage.columns.map(column => getTotalColumnData(campaignsWithData, column.type)),
      {
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
        const alreadyExists = journeys.find(item => item.journey.length ===
          journey.length &&
          item.journey.every((item, index) => item.campaign ===
            journey[index].campaign &&
            item.channel ===
            journey[index].channel));
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
            <div>
              <div style={{width: '1110px', margin: '15px'}}>
                <StageSelector stages={stagesData}
                               selectedIndex={selectedStageIndex}
                               selectStage={(index) => this.setState({selectedStageIndex: index})}/>
              </div>
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
    }
    else {
      elem = item;
    }

    return elem;
  }

}