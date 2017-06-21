import React from 'react';

import Component from 'components/Component';
import byChannelTabStyle from 'styles/campaigns/by-channel-tab.css';
import ChannelCampaigns from 'components/pages/campaigns/ChannelCampaigns';
import ReactDOM from 'react-dom';

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
  }

  componentDidMount() {
    if (this.props.location.query.hash) {
      const domElement = ReactDOM.findDOMNode(this.refs[this.props.location.query.hash]);
      if (domElement) {
        domElement.scrollIntoView();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

	updateChannelCampaigns = (channel, channelCampaigns) => {
		let campaigns = { ...this.state.campaigns, [channel]: channelCampaigns };

		return this.props.updateCampaigns(campaigns);
	};

  updateCampaignsTemplates = (templateName, template) => {
    let campaignsTemplates = { ...this.state.campaignsTemplates, [templateName]: template };

    return this.props.updateCampaignsTemplates(campaignsTemplates);
  };

  render() {
    const { processedChannels: channels } = this.props;
    const { campaigns, teamMembers, campaignsTemplates } = this.state;

    const page = channels.names.map((channel) => (
      <ChannelCampaigns
        channelTitle = { channels.titles[channel] }
        channelBudget = { channels.budgets[channel] }
        key = { channel }
        channel={ channel }
        campaigns={ campaigns[channel] }
        channelIcon={ channels.icons[channel] }
        updateChannelCampaigns={ this.updateChannelCampaigns }
        teamMembers={ teamMembers }
        ref={ channel }
        campaignsTemplates={ campaignsTemplates }
        updateCampaignsTemplates={ this.updateCampaignsTemplates }
      />
    ));

    return (
      <div className={ this.classes.wrap }>
        { page }
      </div>
    )
  }

}