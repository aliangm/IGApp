import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import EditableCell from 'components/pages/plan/EditableCell';
import planStyle from 'styles/plan/plan.css';
import cellStyle from 'styles/plan/plan-cell.css';
import StateSelection from 'components/pages/plan/StateSelection';

const CONSTRAINT_MAPPING = {
  'none': {isConstraint: false, text: 'None'},
  'soft': {isConstraint: true, isSoft: true, text: 'Soft'},
  'hard': {isConstraint: true, isSoft: false, text: 'Hard'}
};

export default class TableCell extends Component {

  style = style;
  styles = [cellStyle, planStyle];

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
    acceptSuggestion: PropTypes.func,
    dragEnter: PropTypes.func,
    commitDrag: PropTypes.func,
    dragStart: PropTypes.func,
    isDragging: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      hoverCell: false
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

  render() {
    const showSuggestion = this.props.secondaryValue && (this.props.secondaryValue !== this.props.primaryValue);

    return this.props.isEditMode ?
      <td className={this.classes.valueCell} key={this.props.key}>
        <EditableCell value={this.props.primaryValue}
                      onChange={this.props.onChange}
                      drop={this.props.commitDrag}
                      dragStart={this.props.dragStart}
                      dragEnter={this.props.dragEnter}
                      isDragging={this.props.isDragging}
        />
      </td>
      : <td className={this.classes.valueCell}
            onMouseEnter={() => {
              this.setState({hoverCell: true});
            }}
            onMouseLeave={() => {
              this.setState({hoverCell: false});
            }}
            style={this.props.style}
            key={this.props.key}>

        <div hidden={!this.state.hoverCell}>
          {this.props.isConstraitsEnabled ?
            <StateSelection currentConstraint={this.getConstraint()}
                            constraintOptions={Object.keys(CONSTRAINT_MAPPING).map(key => {
                              return {key: key, text: CONSTRAINT_MAPPING[key].text};
                            })}
                            changeConstraint={this.changeConstraint}
            />
            : null}
        </div>
        <div className={this.classes.cellItem} style={{color: this.state.hoverCell ? '#D75A4A' : '#1991eb'}}>
          {!this.state.hoverCell && showSuggestion ? '*' : ''}{this.props.primaryValue}
          {showSuggestion ?
            <div>
              <div hidden={!this.state.hoverCell} className={cellStyle.locals.budget} style={{color: '#25AE88'}}>
                ({this.props.secondaryValue})
              </div>
              <div className={planStyle.locals.right}>
                <div className={cellStyle.locals.accept} onClick={this.props.acceptSuggestion}/>
              </div>
            </div> : null}
        </div>
      </td>;
  }
}