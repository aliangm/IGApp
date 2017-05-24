import React, { PropTypes } from 'react';
import Component from 'components/Component';

import { DraggableCampaignCard } from './DraggableCard'
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
		style: PropTypes.object,
		x: PropTypes.number,
		y: PropTypes.number,
	};

	static contextTypes = {
		onCampaignUpdate: PropTypes.func
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
		const { x, y, stopScrolling, item } = this.props;

		return item.campaigns.map((campaign, index) => (
			<DraggableCampaignCard
				key={campaign.id}
				item={campaign}
				onClick={() => this.openPopup(index)}
				x={x}
				y={y}
				stopScrolling={stopScrolling}
			/>
		))
	}

	openPopup = (index) => {
		this.setState({
			showPopup: true,
			selectedCampaignIndex: index,
		})
	};

	closePopup = () => {
		this.setState({
			showPopup: false,
			selectedCampaignIndex: -1,
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
						<button key="button" className={ this.classes.addButton } onClick={ () => {
							this.openPopup({ status: 'New' }); // TODO - get actual status
						}}>
							Add Campaign
						</button>,
						this.state.showPopup &&
							<CampaignPopup
								key="popup"
								channelTitle={item.title}
								channel={item.name}
								updateCampaign={this.context.onCampaignUpdate}
								close={this.closePopup}
								teamMembers={this.props.teamMembers}
								campaign={item.campaigns[this.state.selectedCampaignIndex] || { status: item.status }}
								index={this.state.selectedCampaignIndex}
							/>
					]
				}
      </div>
		);
	}
}

export default Card
