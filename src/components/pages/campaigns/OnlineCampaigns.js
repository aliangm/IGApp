import React from 'react';
import Component from 'components/Component';
import style from 'styles/campaigns/online-campaigns.css';
import {formatNumber} from 'components/utils/budget';
import Select from 'components/controls/Select';
import {getNickname as getChannelNickname} from 'components/utils/channels';
import {getNickname as getIndicatorNickname} from 'components/utils/indicators';
import Avatar from 'components/Avatar';

export default class OnlineCampaigns extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      editMetric: false,
      selectedAttributionMetric: 'MCL',
      soryBy: 'impressions',
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
    const {filteredCampaigns: campaigns, attribution: {campaigns: attributionCampaigns}} = this.props;
    const {selectedAttributionMetric, editMetric} = this.state;

    const metrics = [
      {value: 'conversion', label: 'Conversions'},
      {value: 'webVisits', label: 'Web Visits'},
      {value: 'MCL', label: getIndicatorNickname('MCL')},
      {value: 'MQL', label: getIndicatorNickname('MQL')},
      {value: 'SQL', label: getIndicatorNickname('SQL')},
      {value: 'opps', label: getIndicatorNickname('opps')},
      {value: 'users', label: getIndicatorNickname('users')},
      {value: 'pipeline', label: 'Pipeline'},
      {value: 'revenue', label: 'Revenue'}
    ];

    const headRow = this.getTableRow(null, [
      'Status',
      'Channel',
      <div onClick={this.sortBy.bind(this, 'name')} style={{cursor: 'pointer'}}>
        Campaign Name
      </div>,
      'Owner',
      <div onClick={this.sortBy.bind(this, 'impressions')} style={{cursor: 'pointer'}}>
        Impressions
      </div>,
      <div onClick={this.sortBy.bind(this, 'clicks')} style={{cursor: 'pointer'}}>
        Clicks
      </div>,
      <div onClick={this.sortBy.bind(this, 'conversions')} style={{cursor: 'pointer'}}>
        Conv.
      </div>,
      <div onClick={this.sortBy.bind(this, 'actualSpent')} style={{cursor: 'pointer'}}>
        Ad Spend
      </div>,
      <div style={{display: 'inline-flex'}}>
        {editMetric ?
          <Select
            selected={selectedAttributionMetric}
            select={{
              options: metrics
            }}
            onChange={(e) => {
              this.setState({selectedAttributionMetric: e.value});
            }}
            style={{width: '160px', fontWeight: 'initial', fontSize: 'initial', color: 'initial', textAlign: 'initial'}}
          />
          :
          <div onClick={this.sortBy.bind(this, selectedAttributionMetric)} style={{cursor: 'pointer'}}>
            {metrics.find(item => item.value === selectedAttributionMetric).label}
          </div>
        }
        <div className={this.classes.metricEdit} onClick={() => {
          this.setState({editMetric: !editMetric});
        }}>
          {editMetric ? 'Done' : 'Edit'}
        </div>
      </div>
    ], {
      className: this.classes.headRow
    });

    const campaignsWithAttribution = campaigns
      .map((campaign, index) => {
        const attributionData = attributionCampaigns && attributionCampaigns.find(item =>
          item.name === campaign.name || (campaign.tracking && campaign.tracking.campaignUTM && item.name === campaign.tracking.campaignUTM)
        );
        const user = campaign.owner && this.props.teamMembers.find(user => user.userId === campaign.owner);
        const clicksObj = campaign.objectives.find(objective => objective.kpi.toLowerCase() === 'clicks');
        const impressionsObj = campaign.objectives.find(objective => objective.kpi.toLowerCase() === 'impressions');
        const conversionsObj = campaign.objectives.find(objective => objective.kpi.toLowerCase() === 'conversions');
        return {
          impressions: impressionsObj ? impressionsObj.actualGrowth : 0,
          clicks: clicksObj ? clicksObj.actualGrowth : 0,
          conversions: conversionsObj ? conversionsObj.actualGrowth : 0,
          ...attributionData,
          ...campaign,
          user: user,
          platformIndex: index
        };
      })
      .filter(campaign => campaign.adwordsId || campaign.facebookadsId || campaign.linkedinadsId || campaign.twitteradsId);

    const rows = campaignsWithAttribution
      .sort((item1, item2) =>
        ((item2[this.state.sortBy] || 0) - (item1[this.state.sortBy] || 0)) * this.state.isDesc
      )
      .map((campaign, index) =>
        this.getTableRow(null, [
          <div className={this.classes.statusIcon} data-icon={'status:' + campaign.status} title={campaign.status}/>,
          <div>
            {campaign.source.map(channel =>
              <div key={channel} className={this.classes.channelIcon} data-icon={'plan:' + channel}
                   title={getChannelNickname(channel)}/>
            )}
          </div>,
          campaign.name,
          <div title={campaign.user && campaign.user.name}>
            <Avatar member={campaign.user} className={this.classes.icon}/>
          </div>,
          campaign.impressions,
          campaign.clicks,
          campaign.conversions,
          '$' + formatNumber(campaign.actualSpent || 0),
          campaign[selectedAttributionMetric] || 0
        ], {
          key: index,
          className: this.classes.tableRow,
          style: {cursor: 'pointer'},
          onClick: () => {
            this.props.openCampaign(campaign.platformIndex);
          }
        })
      );

    return (
      <div className={this.classes.wrap}>
        <table className={this.classes.table}>
          <thead>
          {headRow}
          </thead>
          <tbody className={this.classes.tableBody}>
          {rows}
          </tbody>
        </table>
      </div>
    );
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