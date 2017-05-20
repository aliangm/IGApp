import React, { Component } from 'react';

import styles from 'styles/campaigns/by-status-tab.css';
import channelsSchema from 'data/channelsSchema';
import Paging from 'components/Paging';
import Board from './Board/Board'

export default class ByChannelTab extends Component {
	static defaultProps = {
		campaigns: {},
	};

	state = {

	};

	render() {
		const { planDate, region, monthBudget } = this.state;

		return (
			<div className={styles.wrap}>
				<div className="board">
					<Board />
				</div>
			</div>
		);
	}
}