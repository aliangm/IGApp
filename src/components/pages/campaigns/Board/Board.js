import React, { PropTypes }  from 'react';
import Component from 'components/Component';

import Cards from './Cards/Cards';
import CustomDragLayer from './CustomDragLayer';
import CampaignPopup from 'components/pages/campaigns/CampaignPopup';

import style from 'styles/campaigns/board.css';

class Board extends Component {
	style = style;

	static childContextTypes = {
		onCampaignUpdate: PropTypes.func,
	};

	getChildContext() {
		return {
			onCampaignUpdate: this.props.onCampaignUpdate
		};
	}

	constructor(props) {
		super(props);

		this.state = {
			isScrolling: false,
			showPopup: false,
			lists: props.lists
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.lists !== this.props.lists) {
			this.setState({
				lists: nextProps.lists
			});
		}
	}

	moveCard = (lastX, lastY, nextX, nextY, meta) => {
		const newLists = this.state.lists.slice();
		const card = newLists[lastX].cards[lastY];

		if (meta.type === 'campaign' && lastX !== nextX) {
			this.props.onCampaignsStatusChange([{
				id: meta.item.id,
				status: this.state.lists[nextX].name
			}]);

			return;
		}

		if (lastX === nextX) {
			newLists[lastX].cards.splice(nextY, 0, newLists[lastX].cards.splice(lastY, 1)[0]);

			this.setState({ lists: newLists })
		} else {
			// move element to new place
			newLists[nextX].cards.splice(nextY, 0, newLists[lastX].cards[lastY]);
			// delete element from old place
			newLists[lastX].cards.splice(lastY, 1);

			if (card.campaigns.length > 0) {
				this.props.onCampaignsStatusChange(card.campaigns.map(campaign => ({
					id: campaign.id,
					status: this.state.lists[nextX].name
				})))
			}
		}
	};

	startScrolling = (direction) => {
		// if (!this.state.isScrolling) {
		switch (direction) {
			case 'toLeft':
				this.setState({ isScrolling: true }, this.scrollLeft());
				break;
			case 'toRight':
				this.setState({ isScrolling: true }, this.scrollRight());
				break;
			default:
				break;
		}
		// }
	};

	scrollRight = () => {
		const scroll = () => {
			this.board.scrollLeft += 10;
		};

		this.scrollInterval = setInterval(scroll, 10);
	};

	scrollLeft = () => {
		const scroll = () => {
			this.board.scrollLeft -= 10;
		};

		this.scrollInterval = setInterval(scroll, 10);
	};

	stopScrolling = () => {
		this.setState({ isScrolling: false }, clearInterval(this.scrollInterval));
	};

	openPopup = (x) => {
		this.setState({
			showPopup: true,
			selectedColumn: x,
		})
	};

	closePopup = () => {
		this.setState({
			showPopup: false,
			selectedColumn: -1,
		})
	};

	renderColumn = (item, i) => {
		return (
			<div className={this.classes.desk} key={item.name}>
				<div className={this.classes.deskHead}>
					<div className={this.classes.deskName}>{item.name}</div>
				</div>
				<Cards
					moveCard={this.moveCard}
					x={i}
					cards={item.cards}
					startScrolling={this.startScrolling}
					stopScrolling={this.stopScrolling}
					isScrolling={this.state.isScrolling}
				/>

				<button className={ this.classes.addButton } onClick={ () => { this.openPopup(i) }}>
					Add Campaign
				</button>
			</div>
		);
	};

  render() {
    const { lists, selectedColumn } = this.state;

    return (
      <div className={this.classes.board} style={{ height: '100%' }} ref={ref => this.board = ref}>
        <CustomDragLayer snapToGrid={false} />
        {lists.map(this.renderColumn)}
				{
					this.state.showPopup &&
					<CampaignPopup
						updateCampaign={ this.props.onCampaignUpdate }
						close={this.closePopup}
						teamMembers={ this.props.teamMembers }
						campaign={{status: lists[selectedColumn].name}}
					/>
				}
      </div>
    );
  }
}

export default Board