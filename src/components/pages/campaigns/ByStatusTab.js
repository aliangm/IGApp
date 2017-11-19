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
    const { processedChannels, filteredCampaigns: campaigns } = props;
    const cards = processedChannels.names.map(name => ({
      id: name,
      status: 'New',
      name,
      budget: processedChannels.budgets[name],
      title: processedChannels.titles[name],
      icon: processedChannels.icons[name],
      campaigns: [],
      order: -1,
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

    const initialOrder = -1;

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
              campaigns: [extendedCampaign],
              order: campaign.order !== undefined ? campaign.order : initialOrder
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
              campaigns: [extendedCampaign],
              order: campaign.order !== undefined ? campaign.order : initialOrder
            });
          }
        }
      });
    });

    lists.forEach((list) => {
      list.cards.sort((a, b) => a.order - b.order).forEach((card, index) => {
        if (card.order === initialOrder) {
          card.order = index
        }
      })
    })

    console.log('GET LISTS', lists)
    return lists
  }

  updateCampaignsTemplates = (templateName, template) => {
    let campaignsTemplates = { ...this.props.campaignsTemplates, [templateName]: template };

    return this.props.updateCampaignsTemplates(campaignsTemplates);
  };

  handleCampaignsOrderChange = (updates) => {
    console.log('UPDATES', updates)
    const newCampaigns = cloneDeep(this.props.filteredCampaigns);

    updates.forEach(({ id, status, order }) => {
      const campaign = newCampaigns.find(cmgn => cmgn.index === parseInt(id));

      if (campaign) {
        if (status !== undefined) {
          campaign.status = status;
        }

        if (order !== undefined) {
          campaign.order = order;
        }
      }
    });

    return this.props.updateCampaigns(newCampaigns);
  };

  render() {
    return (
      <div className={styles.wrap}>
        <Board
          lists={this.state.lists}
          onCampaignsOrderChange={this.handleCampaignsOrderChange}
          showCampaign={this.props.showCampaign}
          addNewCampaign={this.props.addNewCampaign}
          userAccount={this.props.userAccount}
          auth={this.props.auth}
        />
      </div>
    );
  }
}