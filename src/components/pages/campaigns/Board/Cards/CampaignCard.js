import React, { PropTypes } from 'react';
import classnames from 'classnames';

import Component from 'components/Component';
import { formatBudget } from 'components/utils/budget';

import style from 'styles/campaigns/card.css';

class CampaignCard extends Component {
	style = style;

	static propTypes = {
		item: PropTypes.object.isRequired,
		channel: PropTypes.string,
		draggingPreview: PropTypes.bool,
		first: PropTypes.bool,
		last: PropTypes.bool,
	};

	render() {
		const { item, onClick, draggingPreview, first, last } = this.props;

		return (
			<div className={classnames(this.classes.campaign,{
				[this.classes.draggingPreview]: draggingPreview,
				[this.classes.firstCampaign]: first,
			})} id={item.id} onClick={onClick}>
				<div className={this.classes.campaignName}>{item.name}</div>
				<div className={this.classes.campaignFooter}>
					<span className={this.classes.campaignBudget}>${formatBudget(item.actualSpent || item.budget)}</span>
					{item.icon && <img src={item.icon} className={ this.classes.campaignIcon } />}
				</div>
			</div>
		);
	}
}

export default CampaignCard