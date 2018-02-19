import React from 'react';
import Component from 'components/Component';
import style from 'styles/campaigns/online-campaigns.css';
import { formatBudget } from 'components/utils/budget';
import Select from 'components/controls/Select';
import { getNickname as getChannelNickname } from 'components/utils/channels';
import { getNickname as getIndicatorNickname } from 'components/utils/indicators';
import Avatar from 'components/Avatar';

export default class OnlineCampaigns extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      editMetric: false,
      selectedAttributionMetric: 'MQL'
    }
  }

  render() {
    const { filteredCampaigns: campaigns, attribution } = this.props;
    const { selectedAttributionMetric, editMetric } = this.state;

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
      'Campaign Name',
      'Owner',
      'Impressions',
      'Clicks',
      'Conv.',
      'Ad Spend',
      <div style={{display: 'inline-flex'}}>
        { editMetric ?
          <Select
            selected={selectedAttributionMetric}
            select={{
              options: metrics
            }}
            onChange={(e) => {
              this.setState({selectedAttributionMetric: e.value})
            }}
            style={{ width: '160px', fontWeight: 'initial', fontSize: 'initial', color: 'initial', textAlign: 'initial' }}
          />
          :
          <div>
            {metrics.find(item => item.value === selectedAttributionMetric).label}
          </div>
        }
        <div className={this.classes.metricEdit} onClick={() => {
          this.setState({editMetric: !editMetric})
        }}>
          { editMetric ? 'Done' : 'Edit' }
        </div>
      </div>
    ], {
      className: this.classes.headRow
    });

    const rows = campaigns
      .filter(campaign => campaign.adwordsId || campaign.facebookadsId)
      .map((campaign, index) => {
        const attributionData = attribution && attribution.campaigns && attribution.campaigns.find(item => (Object.keys(item)[0] === campaign.name || (item.tracking && item.tracking.campaignUTM === Object.keys(item)[0])));
        const user = campaign.owner && this.props.teamMembers.find(user => user.userId === campaign.owner);
        const clicksObj = campaign.objectives.find(objective => objective.kpi.toLowerCase() === "clicks");
        const impressionsObj = campaign.objectives.find(objective => objective.kpi.toLowerCase() === "impressions");
        const conversionsObj = campaign.objectives.find(objective => objective.kpi.toLowerCase() === "conversions");
        return this.getTableRow(null, [
          <div className={this.classes.statusIcon} data-icon={"status:" + campaign.status} title={campaign.status}/>,
          <div>
            {campaign.source.map(channel =>
              <div key={channel} className={this.classes.channelIcon} data-icon={"plan:" + channel} title={getChannelNickname(channel)}/>
            )}
          </div>,
          campaign.name,
          <div title={user && user.name}>
            <Avatar member={user} className={this.classes.icon}/>
          </div>,
          impressionsObj ? impressionsObj.actualGrowth : 0,
          clicksObj ? clicksObj.actualGrowth : 0,
          conversionsObj ? conversionsObj.actualGrowth : 0,
          '$' + formatBudget(campaign.actualSpent),
          attributionData ? attributionData[Object.keys(attributionData)[0]][selectedAttributionMetric] : 0
        ], {
          key: index,
          className: this.classes.tableRow
        })
      });

    return (
      <div className={ this.classes.wrap }>
        <table className={this.classes.table}>
          <thead>
          {headRow}
          </thead>
          <tbody className={this.classes.tableBody}>
          {rows}
          </tbody>
        </table>
      </div>
    )
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