import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import Card from './CampaignCard';


function getStyles(isDragging) {
	return {
		opacity: isDragging ? 0.5 : 1
	};
}

const cardSource = {
	beginDrag(props, monitor, component) {
		const { item, x, y } = props;
		const { id, title } = item;
		const { clientWidth, clientHeight } = findDOMNode(component);

		return { id, title, item, x, y, clientWidth, clientHeight, type: 'campaign' };
	},
	endDrag(props, monitor) {
		// document.getElementById(monitor.getItem().id).style.display = 'block';
		props.stopScrolling();
	},
	isDragging(props, monitor) {
		return props.item && props.item.id === monitor.getItem().id;
	}
};

// options: 4rd param to DragSource https://gaearon.github.io/react-dnd/docs-drag-source.html
const OPTIONS = {
	arePropsEqual(props, otherProps) {
		return props.item.id === otherProps.item.id &&
			props.x === otherProps.x &&
			props.y === otherProps.y;
	}
};

function collectDragSource(connectDragSource, monitor) {
	return {
		connectDragSource: connectDragSource.dragSource(),
		connectDragPreview: connectDragSource.dragPreview(),
		isDragging: monitor.isDragging()
	};
}

class CardComponent extends Component {
	static propTypes = {
		item: PropTypes.object,
		connectDragSource: PropTypes.func.isRequired,
		connectDragPreview: PropTypes.func.isRequired,
		isDragging: PropTypes.bool.isRequired,
		x: PropTypes.number.isRequired,
		y: PropTypes.number,
		stopScrolling: PropTypes.func
	}

	componentDidMount() {
		this.props.connectDragPreview(getEmptyImage(), {
			captureDraggingState: true
		});
	}

	render() {
		const { isDragging, connectDragSource, item, onClick } = this.props;

		return connectDragSource(
			<div>
				<Card style={getStyles(isDragging)} item={item} onClick={onClick}/>
			</div>
		);
	}
}

export default DragSource('campaignCard', cardSource, collectDragSource, OPTIONS)(CardComponent)