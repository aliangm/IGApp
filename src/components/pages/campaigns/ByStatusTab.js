import React, { Component } from 'react';
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'

import Board from './Board/Board'

import styles from 'styles/campaigns/by-status-tab.css';

export default class ByChannelTab extends Component {

  static defaultProps = {
    filteredCampaigns: [],
  };

  state = {
    lists: [],
  };

  componentDidMount() {
    this.setState({
      lists: this.getLists()
    });
  }

  componentWillReceiveProps(nextProps) {
    const isChannelsEqual = isEqual(nextProps.processedChannels, this.props.processedChannels);
    const isCampaignsEqual = isEqual(nextProps.filteredCampaigns, this.props.filteredCampaigns);

    if (!isChannelsEqual || !isCampaignsEqual) {
      this.setState({
        lists: this.getLists(nextProps)
      });
    }
  }

  get campaigns() {
    return this.props.filteredCampaigns;
  }

  getLists(props = this.props) {
    console.log('GET LISTS')
    const { processedChannels, filteredCampaigns: campaigns } = props;
    const cards = processedChannels.names.map(name => ({
      id: name,
      status: 'New',
      name,
      budget: processedChannels.budgets[name],
      title: processedChannels.titles[name],
      icon: processedChannels.icons[name],
      campaigns: []
    }));
    cards.splice(0, 1, {
      id: "multi channel",
      status: 'New',
      name: null,
      budget: 0,
      title: "Multi Channel Campaigns",
      icon: "plan:multiChannel",
      campaigns: []
    });
    const lists = [
      {
        id: 'new',
        name: 'New',
        cards: cards
      },
      {
        id: 'assigned',
        name: 'Assigned',
        cards: []
      },
      {
        id: 'in-progress',
        name: 'In Progress',
        cards: []
      },
      {
        id: 'in-review',
        name: 'In Review',
        cards: []
      },
      {
        id: 'approved',
        name: 'Approved',
        cards: []
      },
      {
        id: 'completed',
        name: 'Completed',
        cards: []
      },
      {
        id: 'on-hold',
        name: 'On-Hold',
        cards: []
      },
      {
        id: 'new',
        name: 'Rejected',
        cards: []
      },
    ];

    campaigns.forEach(campaign => {
      const extendedCampaign = { ...campaign, id: `${campaign.index}`};
      const list = lists.find(l => l.name === campaign.status);
      if (campaign.source.length > 1) {
        if (list) {
          const channelInList = list.cards.find(chnl => chnl.name === null);

          if (channelInList) {
            channelInList.campaigns.push(extendedCampaign);
          } else {
            list.cards.push({
              id: "multi channel",
              status: campaign.status,
              name: null,
              title: "Multi Channel Campaigns",
              icon: "plan:multiChannel",
              budget: 0,
              campaigns: [extendedCampaign]
            });
          }
        }
      }
      campaign.source.forEach(source => {
        if (list) {
          const channelInList = list.cards.find(chnl => chnl.name === source);

          if (channelInList) {
            channelInList.campaigns.push(extendedCampaign);
          } else {
            list.cards.push({
              id: source,
              status: campaign.status,
              name: source,
              title: processedChannels.titles[source],
              icon: processedChannels.icons[source],
              budget: processedChannels.budgets[source],
              campaigns: [extendedCampaign]
            });
          }
        }
      });
    });

    return lists
  }

  updateCampaignsTemplates = (templateName, template) => {
    let campaignsTemplates = { ...this.props.campaignsTemplates, [templateName]: template };

    return this.props.updateCampaignsTemplates(campaignsTemplates);
  };

  handleCampaignsStatusChange = (updates) => {
    const newCampaigns = cloneDeep(this.props.filteredCampaigns);

    updates.forEach(({ id, status }) => {
      const campaign = newCampaigns.find(cmgn => cmgn.index === parseInt(id));

      if (campaign) {
        campaign.status = status;
      }
    });

    return this.props.updateCampaigns(newCampaigns);
  };

  render() {
    return (
      <div className={styles.wrap}>
        <Board
          lists={this.state.lists}
          onCampaignsStatusChange={this.handleCampaignsStatusChange}
          showCampaign={this.props.showCampaign}
          addNewCampaign={this.props.addNewCampaign}
          userAccount={this.props.userAccount}
          auth={this.props.auth}
        />
      </div>
    );
  }
}