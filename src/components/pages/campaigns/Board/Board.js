import React  from 'react';
import Component from 'components/Component';

import Cards from './Cards/Cards';
import CustomDragLayer from './CustomDragLayer';
import CampaignPopup from 'components/pages/campaigns/CampaignPopup';

import style from 'styles/campaigns/board.css';

class Board extends Component {
	style = style;

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

	moveCard = (lastX, lastY, nextX, nextY) => {
		const newLists = this.state.lists.slice();
		const card = newLists[lastX].cards[lastY];

		if (lastX === nextX) {
			newLists[lastX].cards.splice(nextY, 0, newLists[lastX].cards.splice(lastY, 1)[0]);

			this.setState({ lists: newLists })
		} else {
			// move element to new place
			newLists[nextX].cards.splice(nextY, 0, newLists[lastX].cards[lastY]);
			// delete element from old place
			newLists[lastX].cards.splice(lastY, 1);

			if (card.campaigns.length > 0) {
				this.props.onCampaignsUpdate(card.campaigns.map(campaign => ({
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

	renderColumn = (item, i) => {
		return (
			<div className={this.classes.desk}>
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

				<button className={ this.classes.addButton } onClick={ () => { this.setState({ showPopup: true }) }}>
					Add Compaign
				</button>
			</div>
		);
	};

  render() {
    const { lists } = this.state;

    return (
      <div className={this.classes.board} style={{ height: '100%' }} ref={ref => this.board = ref}>
        <CustomDragLayer snapToGrid={false} />
        {lists.map(this.renderColumn)}
				<div hidden={!this.state.showPopup}>
					<CampaignPopup
						updateCampaign={ this.props.onCampaignUpdate }
						close={ () => { this.setState({ showPopup: false }) } }
						teamMembers={ this.props.teamMembers }
					/>
				</div>
      </div>
    );
  }
}

export default Board