import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import Component from 'components/Component';
import DraggableObjectiveView from './DraggableObjectiveView'
import classnames from 'classnames'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

const OBJECTIVE_HEIGHT = 72;

let flag = -1;
async function updateState(props, objectives){
  props.updateState(objectives);
}
const specs = {
  drop(props, monitor, component) {
    const {objectivesData} = component.state;
    let objectives = [...props.objectives];
    objectivesData.forEach(objective => {
      objectives[objective.monthIndex][objective.indicator].target.priority = objective.priority;
    })
    setTimeout(() => props.updateState({objectives}), 500);
  },
  hover(props, monitor, component) {
    
    const itemOffset = monitor.getClientOffset();
    const itemIndex = Math.floor((itemOffset.y - findDOMNode(component).getBoundingClientRect().y) / OBJECTIVE_HEIGHT);

    if(itemIndex !== flag && itemIndex < props.objectivesData.length){
      console.log(itemIndex);
      let objectivesData = [...component.state.objectivesData]
      let previousItemIndex = objectivesData.indexOf(objectivesData.find(objective => objective.indicator === monitor.getItem().indicator));
      if(objectivesData[itemIndex] === undefined)
        return;
      let temp = objectivesData[itemIndex];
      objectivesData[itemIndex] = objectivesData[previousItemIndex];
      objectivesData[previousItemIndex] = temp;
      temp = objectivesData[itemIndex].priority;
      objectivesData[itemIndex].priority = objectivesData[previousItemIndex].priority;
      objectivesData[previousItemIndex].priority = temp;

      component.setState({objectivesData});
      flag = itemIndex;
    }
  }
};


class Objectives extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool,
    item: PropTypes.object,
    canDrop: PropTypes.bool,
  };

	static contextTypes = {
		container: PropTypes.any,
    containerRect: PropTypes.object,
	};

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount(){
    const {objectivesData} = this.props;
    this.setState({objectivesData});
  }
  componentDidMount() {
    this.elementRect = findDOMNode(this).getBoundingClientRect();
    
    if (this.element) {
      this.elementRect = this.element.getBoundingClientRect()
    }
  }
  componentWillReceiveProps(nextProps) {
    const {objectivesData} = nextProps;
    const objectivesDataInState = this.state.objectivesData.sort((item1, item2) => item1.priority - item2.priority);
    let i = 0;
    for(;i < objectivesData.length;i ++){
      if(objectivesData[i].indicator !== objectivesDataInState[i].indicator)
        break;
    }
    if(i !== objectivesData.length)
      this.setState({objectivesData});
  }
  render() {
    const {editObjective, deleteObjective, connectDropTarget} = this.props
    const {objectivesData} = this.state;
    const objectiveViews = objectivesData
      .sort((item1, item2) => item1.priority - item2.priority)
      .map((item, index) =>
        <DraggableObjectiveView key={index}
                       index={index}
                       item={item}
                       editObjective={() => editObjective(item)}
                       deleteObjective={() => {
                         deleteObjective(item.indicator, item.monthIndex);
                       }}/>);
   
    return connectDropTarget(
      <div>
        {objectiveViews}
      </div>
    );
  }
}

export default DropTarget(['objective'], specs, (connectDragSource, monitor) => ({
	connectDropTarget: connectDragSource.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop(),
	item: monitor.getItem()
}))(Objectives)
