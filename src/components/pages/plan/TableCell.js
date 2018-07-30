import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/table-cell.css';
import budgetsTableStyle from 'styles/plan/budget-table.css';
import StateSelection from 'components/pages/plan/StateSelection';
import {formatBudget, extractNumberFromBudget} from 'components/utils/budget';
import isNil from 'lodash/isNil';

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
  FROM_STATE: 2,
  FROM_PROP: 3
};

export default class TableCell extends Component {

  style = style;
  styles = [budgetsTableStyle];

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

  defaultProps = {
    secondaryValue: null,
    isConstraitsEnabled: false,
    isEditMode: false,
    isDragging: false,
    enableActionButtons: false
  }

  constructor(props) {
    super(props);

    this.state = {
      constraintsBoxOpen: false,
      hoverCell: false,
      isCellEditing: false,
      editValue: this.props.primaryValue
    };
  }

  componentWillReceiveProps(newProps) {
    if (!isNil(newProps.primaryValue)) {
      this.setState({
        editValue: newProps.primaryValue
      });
    }
  }

  getConstraint = () => {
    return !this.props.isConstraint ? 'none'
      : (this.props.isSoft ? 'soft' : 'hard');
  };

  changeConstraint = (changeTo) => {
    const typeOptions = CONSTRAINT_MAPPING[changeTo].constraintData;
    this.props.constraintChange(typeOptions.isConstraint, typeOptions.isSoft);
  };

  changeConstraintsBoxOpen = (isOpen) => {
    this.setState({constraintsBoxOpen: isOpen});
  };

  getConstraintsDisplayInfo = () => {
    const displayInfo = {};

    Object.keys(CONSTRAINT_MAPPING).forEach(key => {
      displayInfo[key] = CONSTRAINT_MAPPING[key].displayOptions;
    });

    return displayInfo;
  };

  isCellActive = () => {
    return this.state.hoverCell || this.state.constraintsBoxOpen;
  };

  isEditModeType = (editModeType) => {
    switch (editModeType) {
      case(EDIT_MODE.ANY):
        return this.state.isCellEditing || this.props.isEditMode;
      case(EDIT_MODE.FROM_STATE):
        return this.state.isCellEditing;
      case(EDIT_MODE.FROM_PROP):
        return this.props.isEditMode;
      case(EDIT_MODE.NONE):
        return !this.state.isCellEditing && !this.props.isEditMode;
    }
  };

  showSuggestion = () => {
    return !isNil(this.props.secondaryValue)
      && (this.props.secondaryValue !== this.props.primaryValue)
      && this.isCellActive();
  };

  approveEdit = () => {
    this.props.onChange(this.state.editValue);
    this.setState({editValue: null, isCellEditing: false});
  };

  declineEdit = () => {
    this.setState({editValue: null, isCellEditing: false});
  };

  onInputValueChange = (e) => {
    const value = extractNumberFromBudget(e.target.value);

    if (!isNil(value)) {
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
      {this.isEditModeType(EDIT_MODE.FROM_STATE) && !this.isEditModeType(EDIT_MODE.FROM_PROP) ?
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
        && !this.isEditModeType(EDIT_MODE.FROM_STATE)
        && (this.getConstraint() !== 'none' || this.isCellActive()))
        ? <StateSelection currentConstraint={this.getConstraint()}
                          constraintOptions={this.getConstraintsDisplayInfo()}
                          changeConstraint={this.changeConstraint}
                          changeConstraintsBoxOpen={this.changeConstraintsBoxOpen}
        />
        : null}
      {this.isCellActive() && this.isEditModeType(EDIT_MODE.NONE) ? <div
        onClick={() => this.setState({isCellEditing: true, editValue: this.props.primaryValue})}
        className={this.classes.icon}
        data-icon="plan:edit"/> : null}
    </div>;
  };

  render() {
    return <td className={budgetsTableStyle.locals.valueCell}
               onMouseEnter={() => {
                 this.setState({hoverCell: true});
               }}
               onMouseLeave={() => {
                 this.setState({hoverCell: false});
               }}>
      <div className={this.classes.cellItem}>
        {this.isEditModeType(EDIT_MODE.ANY) ?
          <input className={this.classes.editCell}
                 type="text"
                 value={formatBudget(this.state.editValue)}
                 onChange={this.onInputValueChange}/>
          : <div>{formatBudget(this.props.primaryValue)}</div>}
        {this.props.enableActionButtons ? this.getActionButtons() : null}
      </div>
      {this.showSuggestion() ?
        <div className={this.classes.secondaryValue} data-in-edit={this.isEditModeType(EDIT_MODE.ANY) ? true : null}>
          {formatBudget(this.props.secondaryValue)}
        </div> : null}
    </td>;
  }
};