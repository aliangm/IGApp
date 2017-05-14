import React from 'react';

import Component from 'components/Component';
import _ from 'lodash';
import byChannelTabStyle from 'styles/campaigns/by-channel-tab.css';
import ChannelCampaigns from 'components/pages/campaigns/ChannelCampaigns';
import channelsSchema from 'data/channelsSchema';
import Paging from 'components/Paging';

export default class ByChannelTab extends Component {

  style = byChannelTabStyle

  static defaultProps = {
    campaigns: {},
    monthBudget: 0,
    teamMembers: []
  };

  constructor(props) {
    super(props);
    this.state  = props;
    this.updateChannelCampaigns = this.updateChannelCampaigns.bind(this);
    this.pagingUpdateState = this.pagingUpdateState.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

   updateChannelCampaigns(channel, channelCampaigns) {
    let campaigns = Object.assign({}, this.state.campaigns);
    campaigns[channel] = channelCampaigns;
    return this.state.updateUserMonthPlan({campaigns: campaigns}, this.state.region, this.state.planDate);
  }

  pagingUpdateState(data) {
    this.setState({
      planDate: data.planDate,
      region: data.region,
      plannedChannelBudgets: data.projectedPlan.length > 0 ? data.projectedPlan[0].plannedChannelBudgets : {},
      knownChannels: data.actualChannelBudgets && data.actualChannelBudgets.knownChannels || {},
      unknownChannels: data.actualChannelBudgets && data.actualChannelBudgets.unknownChannels || {},
      monthBudget: data.projectedPlan.length > 0 ? data.projectedPlan[0].monthBudget : null,
      campaigns: data.campaigns || {}
    });
  }

  getDateString = (stringDate) => {
    if (stringDate) {
      var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
      ];
      var planDate = stringDate.split("/");
      var date = new Date(planDate[1], planDate[0] - 1);
      return monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2);
    }
    else return null;
  }

  render() {
    let channelTitles = {};
    let budgetLeftToSpend = this.state.monthBudget;
    Object.keys(this.state.campaigns).forEach((channel) => {
      this.state.campaigns[channel].forEach((campaign) => {
        budgetLeftToSpend -= campaign.actualSpent || campaign.budget;
      });
    });
    let channelIcons = {};
    let channels = _.merge(this.state.plannedChannelBudgets, this.state.knownChannels, this.state.unknownChannels);
    const channelNames = Object.keys(channels).sort();
    channelNames.forEach(function(channel){
      channelsSchema.properties[channel] ? channelTitles[channel] = channelsSchema.properties[channel].title : channelTitles[channel] = channel;
      let channelHierarchy = channelTitles[channel].split('/').map(item => item.trim());
      channelIcons[channel] = "plan:" + channelHierarchy[channelHierarchy.length-1];
    });
    const page = channelNames.map( (channel) => {
        return <ChannelCampaigns channelTitle = { channelTitles[channel] } channelBudget = { channels[channel] } key = { channel } channel={ channel } campaigns={ this.state.campaigns[channel] } channelIcon={ channelIcons[channel] } updateChannelCampaigns={ this.updateChannelCampaigns } teamMembers={ this.state.teamMembers }/>
      }
    );
    return <div className={ this.classes.wrap }>
      <Paging month={ this.state.planDate } region={ this.state.region } pagingUpdateState={ this.pagingUpdateState }/>
      <div className={ this.classes.title }>
        <div className={ this.classes.titleDate }>
          { this.getDateString(this.state.planDate) } - Campaigns
        </div>
        <div className={ this.classes.titleBudget }>
          Budget left to spend
          <div className={ this.classes.titleArrow } style={{ color: budgetLeftToSpend >= 0 ? '#2ecc71' : '#ce352d' }}>
            ${ budgetLeftToSpend ? budgetLeftToSpend.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '' }
          </div>
        </div>
      </div>
      { page }
    </div>
  }

}