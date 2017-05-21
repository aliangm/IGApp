import React, { PropTypes } from 'react';
import Component from 'components/Component';

import CampaignCard from './DraggableCampaignCard'

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
		expanded: false
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
			<CampaignCard key={campaign.id} item={campaign} />
		))
	}

  render() {
		const {style, item} = this.props;

		return (
      <div style={style} className={this.classes.cardContainer} id={style ? item.id : null}>
				<div className={this.classes.card} onClick={this.handleClick}>
					<div className={this.classes.cardName}>{item.title}</div>
					<div className={this.classes.cardInner}>
						<div className={this.classes.cardContent}>
							<p>{item.budget}</p>
							<p>{item.campaigns.length}</p>
						</div>
					</div>
				</div>
				{this.state.expanded && this.renderCampaigns()}
      </div>
		);
	}
}

export default Card
