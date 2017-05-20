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
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  updateChannelCampaigns(channel, channelCampaigns) {
    let campaigns = Object.assign({}, this.state.campaigns);
    campaigns[channel] = channelCampaigns;
    return this.state.updateUserMonthPlan({campaigns: campaigns}, this.state.region, this.state.planDate);
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
    return (
      <div className={ this.classes.wrap }>
        { page }
      </div>
    )
  }

}