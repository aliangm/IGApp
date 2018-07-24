import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/table-cell.css';
import StateSelection from 'components/pages/plan/StateSelection';
import {formatBudgetWithDollar, stripNumberFromBudget} from 'components/utils/budget';

const CONSTRAINT_MAPPING = {
  'none': {
    constraintData: {isConstraint: false},
    displayOptions: {text: 'None', icon: 'plan:none'}
  },
  'soft': {
    constraintData: {isConstraint: true, isSoft: true},
    displayOptions: {text: 'Soft', icon: 'plan:like'}
  },
  'hard': {
    constraintData: {isConstraint: true, isSoft: false},
    displayOptions: {text: 'Hard', icon: 'plan:lock'}
  }
};

const EDIT_MODE = {
  ANY: 0,
  NONE: 1,
  TEMP_STATE: 2,
  FROM_PROP: 3
};

export default class TableCell extends Component {

  style = style;

  static propTypes = {
    primaryValue: PropTypes.number.isRequired,
    secondaryValue: PropTypes.number,
    isConstraitsEnabled: PropTypes.bool,
    constraintChange: PropTypes.func,
    isConstraint: PropTypes.bool,
    isSoft: PropTypes.bool,
    isEditMode: PropTypes.bool,
    onChange: PropTypes.func,
    dragEnter: PropTypes.func,
    commitDrag: PropTypes.func,
    dragStart: PropTypes.func,
    isDragging: PropTypes.bool,
    approveSuggestion: PropTypes.func,
    enableActionButtons: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      suggestionBoxOpen: false,
      hoverCell: false,
      isEditing: false,
      editValue: this.props.primaryValue
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.primaryValue != null) {
      this.setState({
        editValue: newProps.primaryValue
      });
    }
  }

  getConstraint = () => {
    return !this.props.isConstraint ? 'none' :
      this.props.isSoft ? 'soft' : 'hard';
  };

  changeConstraint = (changeTo) => {
    const typeOptions = CONSTRAINT_MAPPING[changeTo].constraintData;
    this.props.constraintChange(typeOptions.isConstraint, typeOptions.isSoft);
  };

  changeSuggestionBoxOpen = (isOpen) => {
    this.setState({suggestionBoxOpen: isOpen});
  };

  getConstraintsDisplayInfo = () => {
    const displayInfo = {};

    Object.keys(CONSTRAINT_MAPPING).forEach(key => {
      displayInfo[key] = CONSTRAINT_MAPPING[key].displayOptions;
    });

    return displayInfo;
  };

  isCellActive = () => {
    return this.state.hoverCell || this.state.suggestionBoxOpen;
  };

  isEditModeType = (editModeType) => {
    switch (editModeType) {
      case(EDIT_MODE.ANY):
        return this.state.isEditing || this.props.isEditMode;
      case(EDIT_MODE.TEMP_STATE):
        return this.state.isEditing;
      case(EDIT_MODE.FROM_PROP):
        return this.props.isEditMode;
      case(EDIT_MODE.NONE):
        return !this.state.isEditing && !this.props.isEditMode;
    }
  };

  showSuggestion = () => {
    return this.props.secondaryValue
      && (this.props.secondaryValue !== this.props.primaryValue)
      && this.isCellActive();
  };

  approveEdit = () => {
    this.props.onChange(this.state.editValue);
    this.setState({editValue: null, isEditing: false});
  };

  declineEdit = () => {
    this.setState({editValue: null, isEditing: false});
  };

  onInputValueChange = (e) => {
    const value = stripNumberFromBudget(e.target.value);

    if (value != null) {
      if (this.isEditModeType(EDIT_MODE.FROM_PROP)) {
        this.props.onChange(value);
      }
      else {
        this.setState({editValue: value});
      }
    }
  };

  getActionButtons = () => {
    return <div className={this.classes.buttons}>
      {this.isEditModeType(EDIT_MODE.TEMP_STATE) ?
        <div className={this.classes.innerButtons}>
          <div className={this.classes.icon}
               data-icon="plan:approveEdit"
               onClick={this.approveEdit}/>
          <div className={this.classes.icon}
               data-icon="plan:declineEdit"
               onClick={this.declineEdit}/>
        </div> : null}

      {this.showSuggestion() ?
        <div onClick={this.props.approveSuggestion}
             className={this.classes.icon}
             data-icon='plan:acceptSuggestion'/>
        : null}
      {(this.props.isConstraitsEnabled
        && !this.isEditModeType(EDIT_MODE.TEMP_STATE)
        && (this.getConstraint() !== 'none' || this.isCellActive()))
        ? <StateSelection currentConstraint={this.getConstraint()}
                          constraintOptions={this.getConstraintsDisplayInfo()}
                          changeConstraint={this.changeConstraint}
                          changeSuggestionBoxOpen={this.changeSuggestionBoxOpen}
        />
        : null}
      {this.isCellActive() && this.isEditModeType(EDIT_MODE.NONE) ? <div
        onClick={() => this.setState({isEditing: true, editValue: this.props.primaryValue})}
        className={this.classes.icon}
        data-icon="plan:edit"/> : null}
    </div>;
  };

  render() {
    return <td className={this.classes.valueCell}
               onMouseEnter={() => {
                 this.setState({hoverCell: true});
               }}
               onMouseLeave={() => {
                 this.setState({hoverCell: false});
               }}>
      <div className={this.classes.cellItem}>
        <div>
          {this.isEditModeType(EDIT_MODE.ANY) ?
            <input className={this.classes.editCell}
                   type="text"
                   value={formatBudgetWithDollar(this.state.editValue)}
                   onChange={this.onInputValueChange}/>
            : <div>{formatBudgetWithDollar(this.props.primaryValue)}</div>}
          {this.showSuggestion() ?
            <div className={this.classes.secondaryValue}>
              {formatBudgetWithDollar(this.props.secondaryValue)}
            </div> : null}
        </div>
        {this.props.enableActionButtons ? this.getActionButtons() : null}
      </div>
    </td>;
  }
};