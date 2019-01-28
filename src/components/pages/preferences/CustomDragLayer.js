import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';
import ObjectiveView from './ObjectiveView';
import { findDOMNode } from 'react-dom';

 
function getItemStyles(props) {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }

  let { x, y } = currentOffset;

  if (props.snapToGrid) {
		// x -= initialOffset.x;
		// y -= initialOffset.y;
    [x, y] = snapToGrid(x, y);
    x += initialOffset.x;
    y += initialOffset.y;
  }

  const transform = `translate(${initialOffset.x}px, ${y}px)`;
  return {
    WebkitTransform: transform,
    transform
  };
}



class CustomDragLayer extends Component {

  static propTypes = {
    item: PropTypes.object,
    itemType: PropTypes.string,
    initialOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    isDragging: PropTypes.bool.isRequired,
  };


  layerStyles = () => {
    
    return{
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    pointerEvents: 'none',
    zIndex: 100000
    }
  };
  
  componentDidMount(){
  }

  renderItem(type, item) {
    switch (type) {
      case 'card':
        return (
          <ChannelCardDragPreview card={item} />
        );
			case 'campaignCard':
				return (
          <CampaignCardDragPreview card={item} />
				);
      default:
        return null;
    }
  }

  render() {
    const { item, isDragging, } = this.props;

    if (!isDragging) {
      return null;
    }


    return (
      <div style={this.layerStyles()}>
        <div style={getItemStyles(this.props)}>
          <ObjectiveView {...item} />
        </div>
      </div>
    );
  }
}

export default DragLayer((monitor) => ({
	item: monitor.getItem(),
	itemType: monitor.getItemType(),
	initialOffset: monitor.getInitialSourceClientOffset(),
	currentOffset: monitor.getSourceClientOffset(),
	isDragging: monitor.isDragging()
}))(CustomDragLayer)