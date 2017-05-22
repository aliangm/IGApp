import React, { PropTypes } from 'react';
import Component from 'components/Component';

import style from 'styles/campaigns/card.css';

class CampaignCard extends Component {
	style = style;

	static propTypes = {
		item: PropTypes.object.isRequired,
		channel: PropTypes.string,
	};

	render() {
		const { item, onClick } = this.props;

		return (
			<div className={this.classes.campaign} id={item.id} onClick={onClick}>
				<span className={this.classes.campaignName}>{item.name}</span>
				<span className={this.classes.campaignBudget}>{item.budget}</span>
			</div>
		);
	}
}

export default CampaignCard