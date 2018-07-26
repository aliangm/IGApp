import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/state-selection.css';
import cellStyle from 'styles/plan/table-cell.css';

export default class StateSelection extends Component {

  style = style;
  styles = [cellStyle];

  static propTypes = {
    currentConstraint: PropTypes.string.isRequired,
    changeConstraint: PropTypes.func.isRequired,
    constraintOptions: PropTypes.object.isRequired,
    changeSuggestionBoxOpen: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      showBox: false
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onOutsideClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onOutsideClick, true);
  }

  onOutsideClick = (e) => {
    if (this.state.showBox) {
      if (e.target !== this.stateSelectionBox && !this.stateSelectionBox.contains(e.target)) {
        this.changeBoxShowing(false);
      }
    }
  };

  changeBoxShowing = (shouldShow) => {
    this.props.changeSuggestionBoxOpen(shouldShow);
    this.setState({
      showBox: shouldShow
    });
  };

  changeReaction = (key) => {
    this.props.changeConstraint(key);
    this.changeBoxShowing(false);
  };

  getReactionIcon = ({key, text, icon}) => {
    return <div
      key={key}
      className={this.classes.reactionIcon}
      onClick={() => this.changeReaction(key)}
      data-icon={icon}>

      <label className={this.classes.reactionLabel}>{text}</label>
    </div>;
  };

  render() {
    return <div className={this.classes.stateSelectionWrap}>
      {this.state.showBox ? <div className={this.classes.stateSelectionBox}
                                 ref={(ref) => this.stateSelectionBox = ref}>
        {Object.keys(this.props.constraintOptions).map(key => {
          return this.getReactionIcon({key: key, ...this.props.constraintOptions[key]});
        })}
      </div> : null}
      <div className={cellStyle.locals.icon}
           onClick={() => this.changeBoxShowing(true)}
           data-icon={this.props.constraintOptions[this.props.currentConstraint].icon}/>
    </div>;
  }
}