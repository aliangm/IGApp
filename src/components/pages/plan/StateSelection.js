import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/state-selection.css';

export default class StateSelection extends Component {

  style = style;

  static propTypes = {
    currentConstraint: PropTypes.string.isRequired,
    changeConstraint: PropTypes.func.isRequired,
    constraintOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    changeSuggestionBoxOpen: PropTypes.func
  };

  static defaultProps = {};

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
      if (e.target !== this.stateSelectionBox && !this.stateSelectionBox.contains(e.target)){
        this.changeBoxShowing(false);
      }
    }
  };

  changeBoxShowing = (shouldShow) => {
    this.props.changeSuggestionBoxOpen(shouldShow);
    this.setState({
      showBox: shouldShow
    });
  }

  changeReaction = (text) => {
    this.props.changeConstraint(text);
    this.changeBoxShowing(false);
  };

  getReactionIcon = ({key, text}) => {
    return <div
      key={key}
      className={this.classes.reactionIcon}
      onClick={() => this.changeReaction(key)}>

      <label className={this.classes.reactionLabel}>{text}</label>
    </div>;
  }

  render() {
    return <div>
      {this.state.showBox ? <div className={this.classes.stateSelectionBox} ref={(ref) => this.stateSelectionBox = ref}>
        {this.props.constraintOptions.map(item => {
          return this.getReactionIcon(item);
        })}
      </div> : null}
      <div onClick={() => this.changeBoxShowing(true)}>
        {this.props.currentConstraint};
      </div>
    </div>;
  }
}