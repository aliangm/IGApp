import React, { PropTypes } from 'react';
import Component from 'components/Component';

import CampaignCard from './DraggableCampaignCard'
import CampaignPopup from 'components/pages/campaigns/CampaignPopup';

import style from 'styles/campaigns/card.css';

const propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object
};

class Card extends Component {
	style = style;

	static propTypes = {
		item: PropTypes.object.isRequired,
		style: PropTypes.object
	};

	state = {
		expanded: false,
		showPopup: false,
	};

	handleClick = () => {
		if (this.props.item.campaigns.length > 0) {
			this.setState({
				expanded: !this.state.expanded,
			});
		}
	};

	renderCampaigns() {
		const { campaigns } = this.props.item;

		return campaigns.map(campaign => (
			<CampaignCard key={campaign.id} item={campaign} onClick={() => this.openPopup(campaign)} />
		))
	}

	openPopup = (campaign) => {
		this.setState({
			showPopup: true,
			selectedCampaign: campaign,
		})
	};

	closePopup = () => {
		this.setState({
			showPopup: false,
			selectedCampaign: null,
		})
	};

  render() {
		const {style, item} = this.props;

		return (
      <div style={style} className={this.classes.cardContainer} id={style ? item.id : null}>
				<div className={this.classes.card} onClick={this.handleClick}>
					<div className={this.classes.cardName}>{item.title}</div>
					<div className={this.classes.cardFooter}>
							<span className={this.classes.cardBudget}>${item.budget}</span>
							<div className={this.classes.campaignsCount}>{item.campaigns.length}</div>
						<div className={ this.classes.cardIcon } data-icon={item.icon} />
					</div>
				</div>
				{this.state.expanded && this.renderCampaigns()}
				{
					this.state.expanded && [
						<button className={ this.classes.addButton } onClick={ () => {
							this.openPopup({ status: 'New' }); // TODO - get actual status
						}}>
							Add Compaign
						</button>,
						this.state.showPopup &&
							<CampaignPopup
								channelTitle={item.title}
								channel={item.name}
								updateCampaign={this.props.onCampaignUpdate}
								close={this.closePopup}
								teamMembers={this.props.teamMembers}
								campaign={this.state.selectedCampaign}
							/>
					]
				}
      </div>
		);
	}
}

export default Card
