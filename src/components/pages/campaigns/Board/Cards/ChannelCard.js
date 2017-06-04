import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Component from 'components/Component';
import { formatBudget } from 'components/utils/budget';

import { DraggableCampaignCard } from './DraggableCard'
import CampaignPopup from 'components/pages/campaigns/CampaignPopup';

import style from 'styles/campaigns/card.css';

class Card extends Component {
	style = style;

	static propTypes = {
		item: PropTypes.object.isRequired,
		style: PropTypes.object,
		x: PropTypes.number,
		y: PropTypes.number,
		draggingPreview: PropTypes.bool,
	};

	static contextTypes = {
		onCampaignUpdate: PropTypes.func,
		teamMembers: PropTypes.array,
	};

	state = {
		expanded: false,
		showPopup: false,
	};

	handleClick = () => {
		this.setState({
			expanded: !this.state.expanded,
		});
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
				first={index === 0}
				last={index === item.campaigns.length - 1}
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
		const {style, item, draggingPreview} = this.props;

		return (
      <div style={style} className={classnames(this.classes.cardContainer, {
      	[this.classes.expanded]: this.state.expanded,
				[this.classes.noCampaigns]: !item.campaigns || item.campaigns.length === 0,
      	[this.classes.draggingPreview]: draggingPreview,
			})} id={style ? item.id : null}>
				<div className={this.classes.card} onClick={this.handleClick}>
					<div className={this.classes.cardName}>{item.title}</div>
					<div className={this.classes.cardFooter}>
							<span className={this.classes.cardBudget}>${formatBudget(item.budget)}</span>
							<div className={this.classes.campaignsCount}>{item.campaigns.length}</div>
						<div className={ this.classes.cardIcon } data-icon={item.icon} />
					</div>
				</div>
				{this.state.expanded && this.renderCampaigns()}
				{
					this.state.expanded && [
						<button key="button" className={ this.classes.addButton } onClick={ () => {
							this.openPopup();
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
								teamMembers={this.context.teamMembers}
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
