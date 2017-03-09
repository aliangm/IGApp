import React from 'react';

import Component from 'components/Component';
import _ from 'lodash';
import byChannelTabStyle from 'styles/campaigns/by-channel-tab.css';
import ChannelCampaigns from 'components/pages/campaigns/ChannelCampaigns';
import channelsSchema from 'data/channelsSchema';

export default class ByChannelTab extends Component {

  style = byChannelTabStyle

  constructor(props) {
    super(props);
    this.state = {
    }
    this.updateChannelCampaigns = this.updateChannelCampaigns.bind(this);
  }

  updateChannelCampaigns(channel, channelCampaigns) {
    let campaigns = Object.assign({}, this.props.campaigns);
    campaigns[channel] = channelCampaigns;
    return this.props.saveCampaigns(campaigns);
  }

  getDateString = (stringDate) => {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    var planDate = stringDate.split("/");
    var date = new Date(planDate[1], planDate[0]-1);
    return monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2,2);
  }

  render() {
    if (this.props.isLoaded){
      let channelTitles = {};
      let channelIcons = {};
      let channels = _.merge(this.props.plannedChannelBudgets, this.props.knownChannels, this.props.unknownChannels);
      const channelNames = Object.keys(channels).sort();
      channelNames.forEach(function(channel){
        channelsSchema.properties[channel] ? channelTitles[channel] = channelsSchema.properties[channel].title : channelTitles[channel] = channel;
        let channelHierarchy = channelTitles[channel].split('/').map(item => item.trim());
        channelIcons[channel] = "plan:" + channelHierarchy[channelHierarchy.length-1];
      });
      const page = channelNames.map( (channel) => {
          return <ChannelCampaigns channelTitle = { channelTitles[channel] } channelBudget = { channels[channel] } key = { channel } channel={ channel } campaigns={ this.props.campaigns[channel] } channelIcon={ channelIcons[channel] } updateChannelCampaigns={ this.updateChannelCampaigns }/>
        }
      );
      return <div className={ this.classes.wrap }>
        <div className={ this.classes.title }>
          <div className={ this.classes.titleDate }>
            { this.getDateString(this.props.planDate) } - Campaigns
          </div>
          <div className={ this.classes.titleBudget }>
            Budget left to spend - coming soon
          </div>
        </div>
        { page }
      </div>
    }
    else return null;
  }

}