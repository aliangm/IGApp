import React, { Component } from 'react';
import isEqual from 'lodash/isEqual'
import merge from 'lodash/merge'

import styles from 'styles/campaigns/by-status-tab.css';
import channelsSchema from 'data/channelsSchema';
import Paging from 'components/Paging';
import Board from './Board/Board'

export default class ByChannelTab extends Component {
	static defaultProps = {
		campaigns: {},
	};

	state = {
		lists: [],
	};

	componentDidMount() {
		this.setLists()
	}

	componentWillReceiveProps(nextProps) {
		if (
			!isEqual(nextProps.processedChannels, this.props.processedChannels) ||
			!isEqual(nextProps.campaigns, this.props.campaigns)
		) {
			this.setLists()
		}
	}

	setLists() {
		const { processedChannels, /*campaigns*/ } = this.props;
		const campaigns = this.state.campaigns || this.props.campaigns; // for testing
		const lists = [
			{
				id: 'new',
				name: 'New',
				cards: processedChannels.names.map(name => ({
					id: name,
					name,
					budget: processedChannels.budgets[name],
					title: processedChannels.titles[name],
					campaigns: []
				}))
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

		Object.keys(campaigns).forEach(channelName => {
			const channelCampaigns = campaigns[channelName];

			channelCampaigns.forEach(campaign => {
				const extendedCampaign = { ...campaign, id: `${channelName}::${campaign.name}`};
				const list = lists.find(l => l.name === campaign.status);

				if (list) {
					const channelInList = list.cards.find(chnl => chnl.name === channelName);

					if (channelInList) {
						channelInList.campaigns.push(extendedCampaign);
					} else {
						list.cards.push({
							id: channelName,
							name: channelName,
							title: processedChannels.titles[channelName],
							budget: processedChannels.budgets[channelName],
							campaigns: [extendedCampaign]
						});
					}
				}
			})
		});

		this.setState({ lists })
	}

	handleCampaignsUpdate = (updates) => {
		const newCampaigns = merge({ }, this.props.campaigns);

		updates.forEach(({ id, status }) => {
			const [channel, campaignName] = id.split('::');
			const campaign = newCampaigns[channel].find(cmgn => cmgn.name === campaignName);

			if (campaign) {
				campaign.status = status;
			}
		});

		// TODO - using state for testing - remove it
		this.setState({
			campaigns: newCampaigns,
		});
		// this.props.updateCampaigns(newCampaigns);
	};

	render() {
		console.log('PROPS', this.props.processedChannels, this.props.campaigns, this.state.campaigns);

		return (
			<div className={styles.wrap}>
				<Board lists={this.state.lists} onCampaignsUpdate={this.handleCampaignsUpdate}/>
			</div>
		);
	}
}