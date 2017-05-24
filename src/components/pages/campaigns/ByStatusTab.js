import React, { Component } from 'react';
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'

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
		this.setState({
			lists: this.getLists()
		});
	}

	componentWillReceiveProps(nextProps) {
		const isChannelsEqual = isEqual(nextProps.processedChannels, this.props.processedChannels);
		const isCampaignsEqual = isEqual(nextProps.campaigns, this.props.campaigns);

		if (!isChannelsEqual || !isCampaignsEqual) {
			const newState = { };

			if (isCampaignsEqual) {
				this.setState({
					lists: this.getLists(nextProps)
				});
			} else {
				this.setState({
					campaigns: nextProps.campaigns,
					lists: this.getLists(nextProps, nextProps.campaigns)
				});
			}
		}
	}

	get campaigns() {
		return this.state.campaigns || this.props.campaigns; // TODO - for testing - remove it
	}

	getLists(props = this.props, campaigns = this.campaigns) {
		const { processedChannels } = props;
		const lists = [
			{
				id: 'new',
				name: 'New',
				cards: processedChannels.names.map(name => ({
					id: name,
					status: 'New',
					name,
					budget: processedChannels.budgets[name],
					title: processedChannels.titles[name],
					icon: processedChannels.icons[name],
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
							status: campaign.status,
							name: channelName,
							title: processedChannels.titles[channelName],
							icon: processedChannels.icons[channelName],
							budget: processedChannels.budgets[channelName],
							campaigns: [extendedCampaign]
						});
					}
				}
			})
		});

		return lists
	}

	updateCampaigns(campaigns) {
		this.setState({
			campaigns: campaigns,
			lists: this.getLists(this.props, campaigns)
		});
		return this.props.updateCampaigns(campaigns);
	}

	handleCampaignsStatusChange = (updates) => {
		const newCampaigns = cloneDeep(this.campaigns);

		updates.forEach(({ id, status }) => {
			const [channel, campaignName] = id.split('::');
			const campaign = newCampaigns[channel].find(cmgn => cmgn.name === campaignName);

			if (campaign) {
				campaign.status = status;
			}
		});

		return this.updateCampaigns(newCampaigns);
	};

	handleCampaignUpdate = (campaign, index = -1, channel) => {
		if (!campaign || !channel) {
			return;
		}

		const { id, ...campaignFields } = campaign;

		const newCampaigns = cloneDeep(this.campaigns);
		const channelCampaigns = newCampaigns[channel];

		if (!channelCampaigns) {
			newCampaigns[channel] = [campaignFields];
		} else if (index > -1) {
			channelCampaigns.splice(index, 1, campaignFields);
		} else {
			const existedCompaignIndex = channelCampaigns.findIndex(cmpgn => cmpgn.name === campaignFields.name);

			if (existedCompaignIndex > -1) {
				channelCampaigns.splice(existedCompaignIndex, 1, campaignFields);
			} else {
				channelCampaigns.push(campaignFields);
			}
		}

		return this.updateCampaigns(newCampaigns);
	};

	render() {
		return (
			<div className={styles.wrap}>
				<Board
					lists={this.state.lists}
					onCampaignsStatusChange={this.handleCampaignsStatusChange}
					onCampaignUpdate={this.handleCampaignUpdate}
					teamMembers={ this.props.teamMembers }
				/>
			</div>
		);
	}
}