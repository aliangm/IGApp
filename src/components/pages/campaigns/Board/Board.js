import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import faker from 'faker'

import CardsContainer from './Cards/CardsContainer';
import CustomDragLayer from './CustomDragLayer';

class Board extends Component {
  state = {
  	isScrolling: false,
		lists: [ ],
  };

  componentWillMount() {
    this.getLists(10);
  }

	getLists = (quantity) => {
		setTimeout(() => {
			const lists = [];
			let count = 0;

			for (let i = 0; i < quantity; i++) {
				const cards = [];
				const randomQuantity = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
				for (let ic = 0; ic < randomQuantity; ic++) {
					cards.push({
						id: count,
						firstName: faker.name.firstName(),
						lastName: faker.name.lastName(),
						title: faker.name.jobTitle()
					});
					count = count + 1;
				}
				lists.push({
					id: i,
					name: faker.commerce.productName(),
					cards
				});
			}

			this.setState({ lists })
		}, 1000); // fake delay
	};

	moveList = (listId, nextX) => {
		const { lastX } = this.findList(listId);
		const newLists = this.state.lists.slice();
		const t = newLists.splice(lastX, 1)[0];

		newLists.splice(nextX, 0, t);

		this.setState({ lists: newLists })
	};

	moveCard = (lastX, lastY, nextX, nextY) => {
		const newLists = this.state.lists.slice();

		if (lastX === nextX) {
			newLists[lastX].cards.splice(nextY, 0, newLists[lastX].cards.splice(lastY, 1)[0]);
		} else {
			// move element to new place
			newLists[nextX].cards.splice(nextY, 0, newLists[lastX].cards[lastY]);
			// delete element from old place
			newLists[lastX].cards.splice(lastY, 1);
		}

		this.setState({ lists: newLists })
	};

  findList = (id) => {
    const { lists } = this.props;
    const list = lists.filter(l => l.id === id)[0];

    return {
      list,
      lastX: lists.indexOf(list)
    };
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
		function scroll() {
			document.querySelector('.board').scrollLeft += 10;
		}
		this.scrollInterval = setInterval(scroll, 10);
	};

	scrollLeft = () => {
		function scroll() {
			document.querySelector('.board').scrollLeft -= 10;
		}
		this.scrollInterval = setInterval(scroll, 10);
	};

	stopScrolling = () => {
		this.setState({ isScrolling: false }, clearInterval(this.scrollInterval));
	};

  render() {
    const { lists } = this.state;

    return (
      <div style={{ height: '100%' }}>
        <CustomDragLayer snapToGrid={false} />
        {lists.map((item, i) =>
          <CardsContainer
            key={item.id}
            id={item.id}
            item={item}
            moveCard={this.moveCard}
            moveList={this.moveList}
            startScrolling={this.startScrolling}
            stopScrolling={this.stopScrolling}
            isScrolling={this.state.isScrolling}
            x={i}
          />
        )}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Board)