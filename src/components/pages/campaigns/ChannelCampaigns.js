import React from 'react';

import Component from 'components/Component';

import CampaignSummary from 'components/pages/campaigns/CampaignSummary';
import ChannelRectangle from 'components/pages/campaigns/ChannelRectangle';
import CampaignPopup from 'components/pages/campaigns/CampaignPopup';

import style from 'styles/campaigns/channel-campaigns.css';

export default class ChannelCampaigns extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      showPopup: false
    };
    this.updateCampaign = this.updateCampaign.bind(this);
  }

  updateCampaign(campaign, index) {
    let channelCampaigns = this.props.campaigns ? this.props.campaigns.slice() : [];
    if (index !== undefined)
    {
      channelCampaigns[index] = campaign;
    }
    else {
      channelCampaigns.push(campaign);
    }
    return this.props.updateChannelCampaigns(this.props.channel, channelCampaigns);
  }

  render() {
    const campaigns = this.props.campaigns;
    const runningCampaigns = campaigns ?
      campaigns.map((campaign, index) => {
        return <CampaignSummary key={this.props.channel + index} index={index} campaign={ campaign } channelTitle={ this.props.channelTitle } channelIcon={ this.props.channelIcon } channel={ this.props.channel } updateCampaign={ this.updateCampaign } teamMembers={ this.props.teamMembers } campaignsTemplates={ this.props.campaignsTemplates } updateCampaignsTemplates={ this.props.updateCampaignsTemplates } firstName={ this.props.firstName } lastName={ this.props.lastName }/>
      })
      : null ;
    const numberOfCampaigns = runningCampaigns ? runningCampaigns.length : 0;
    return <div>
      <ChannelRectangle channelTitle = { this.props.channelTitle } channelBudget = { this.props.channelBudget } channelIcon={ this.props.channelIcon } onClick={ ()=> { this.setState({showCampaigns: !this.state.showCampaigns}) } } numberOfCampaigns={ numberOfCampaigns }/>
      <div hidden={ !this.state.showCampaigns }>
        <div>
          { runningCampaigns }
          <div className={ this.classes.plusBox }>
            <div className={ this.classes.plus } onClick={ () => { this.setState({showPopup: true}) }}>
              +
            </div>
          </div>
        </div>
        <div hidden={!this.state.showPopup}>
          <CampaignPopup updateCampaign={ this.updateCampaign } channelTitle={ this.props.channelTitle } channel={ this.props.channel } closePopup={ () => { this.setState({showPopup: false}) } } teamMembers={ this.props.teamMembers } campaignsTemplates={ this.props.campaignsTemplates } updateCampaignsTemplates={ this.props.updateCampaignsTemplates } firstName={ this.props.firstName } lastName={ this.props.lastName }/>
        </div>
      </div>
    </div>
  }

}
