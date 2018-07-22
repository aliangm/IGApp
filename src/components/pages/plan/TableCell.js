import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/table-cell.css';
import EditableCell from 'components/pages/plan/EditableCell';
import planStyle from 'styles/plan/plan.css';
import StateSelection from 'components/pages/plan/StateSelection';
import {formatBudget} from 'components/utils/budget';

const CONSTRAINT_MAPPING = {
  'none': {isConstraint: false, text: 'None', icon: 'plan:none'},
  'soft': {isConstraint: true, isSoft: true, text: 'Soft', icon: 'plan:like'},
  'hard': {isConstraint: true, isSoft: false, text: 'Hard', icon: 'plan:lock'}
};

export default class TableCell extends Component {

  style = style;
  styles = [planStyle];

  static propTypes = {
    primaryValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    secondaryValue: PropTypes.string,
    isConstraitsEnabled: PropTypes.bool,
    key: PropTypes.number,
    constraintChange: PropTypes.func,
    isConstraint: PropTypes.bool,
    isSoft: PropTypes.bool,
    className: PropTypes.string,
    isEditMode: PropTypes.bool,
    onChange: PropTypes.func,
    dragEnter: PropTypes.func,
    commitDrag: PropTypes.func,
    dragStart: PropTypes.func,
    isDragging: PropTypes.bool,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      suggestionBoxOpen: false,
      hoverCell: false,
      isEditing: false
    };
  }

  getConstraint = () => {
    return !this.props.isConstraint ? 'none' :
      this.props.isSoft ? 'soft' : 'hard';
  };

  changeConstraint = (changeTo) => {
    const typeOptions = CONSTRAINT_MAPPING[changeTo];
    this.props.constraintChange(typeOptions.isConstraint, typeOptions.isSoft);
  };

  changeSuggestionBoxOpen = (isOpen) => {
    this.setState({suggestionBoxOpen: isOpen});
  };

  showExtraInfo = () => {
    return this.state.hoverCell || this.state.suggestionBoxOpen;
  };

  getConstraintsDisplayInfo = () => {
    const displayInfo = {};

    Object.keys(CONSTRAINT_MAPPING).forEach(key => {
      displayInfo[key] = {...CONSTRAINT_MAPPING[key], isConstraint: undefined, isSoft: undefined};
    });

    return displayInfo;
  };

  getActionButtons = (showSuggestion) => {
    return <div className={this.classes.buttons}>
      {this.state.isEditing ?
        <div className={this.classes.icon}
             data-icon="plan:approveEdit"
             onClick={this.finishEdit} /> : null}
      {showSuggestion && this.showExtraInfo()
        ?
        <div onClick={() => this.props.onChange(this.props.secondaryValue)}
             className={this.classes.icon}
             data-icon='plan:acceptSuggestion'/>
        : null}
      {this.props.isConstraitsEnabled ?
        <StateSelection currentConstraint={this.getConstraint()}
                        constraintOptions={this.getConstraintsDisplayInfo()}
                        changeConstraint={this.changeConstraint}
                        changeSuggestionBoxOpen={this.changeSuggestionBoxOpen}
        />
        : null}
      {this.showExtraInfo() && !this.state.isEditing ? <div onClick={() => this.setState({isEditing: true, editValue: this.props.primaryValue})}
                                   className={this.classes.icon}
                                   data-icon="plan:edit"/> : null}
    </div>;
  };

  finishEdit = () => {
    this.props.onChange(this.state.editValue);

    this.setState({editValue: null, isEditing: false});
  }

  onInputValueChange = (e) => {
    this.setState({editValue: e.target.value});
  };

  render() {
    const showSuggestion = this.props.secondaryValue && (this.props.secondaryValue !== this.props.primaryValue);
    return <td className={this.classes.valueCell}
               onMouseEnter={() => {
                 this.setState({hoverCell: true});
               }}
               onMouseLeave={() => {
                 this.setState({hoverCell: false});
               }}
               style={this.props.style}
               key={this.props.key}>
      <div className={this.classes.cellItem}>
        <div>
          {this.props.isEditMode || this.state.isEditing ?
            <input className={this.classes.editCell}
                   type="text"
                   value={this.state.editValue}
                   onChange={this.onInputValueChange}/>
            : <div>${formatBudget(this.props.primaryValue)}</div>}
          {showSuggestion && this.showExtraInfo() ?
            <div className={this.classes.secondaryValue}>
              ${formatBudget(this.props.secondaryValue)}
            </div> : null}
        </div>
        {this.getActionButtons(showSuggestion)}
      </div>
    </td>;
  }
};