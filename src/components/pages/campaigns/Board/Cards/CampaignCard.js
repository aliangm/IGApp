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
		last: PropTypes.bool
	};

	static contextTypes = {
		userAccount: PropTypes.object,
    auth: PropTypes.object
	};

	getInitials() {
		const { item } = this.props;
    const { userAccount: user = {}, auth } = this.context;

		if (!item.owner) {
			return null;
		}

		let firstName;
		let lastName;
		if (item.owner === auth.getProfile().UID) {

			firstName = user.firstName;
			lastName = user.lastName;

			if (!firstName || !lastName) {
				return null;
			}
		} else {
			if (item.owner === "other") {
        [firstName = '', lastName = ''] = "Other".split(' ');
			}
			else {
        const member = user.teamMembers.find(member => member.userId === item.owner);

        if (!member) {
          return null;
				}

        [firstName = '', lastName = ''] = member.name.split(' ');
      }
		}

		return (firstName[0] || '') + (lastName[0] || '');
	}

	render() {
		const { item, onClick, draggingPreview, first, last } = this.props;
		const initials = this.getInitials();

		return (
			<div className={classnames(this.classes.campaign,{
				[this.classes.draggingPreview]: draggingPreview,
				[this.classes.firstCampaign]: first,
			})} id={item.id} onClick={onClick}>
				<div className={this.classes.campaignName}>{item.name}</div>
				<div className={this.classes.campaignFooter}>
					<span className={this.classes.campaignBudget}>${formatBudget(item.actualSpent || item.budget)}</span>
					{initials && <div className={this.classes.initials}>{initials}</div>}
				</div>
			</div>
		);
	}
}

export default CampaignCard