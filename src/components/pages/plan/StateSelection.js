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

  changeReaction = (text) => {
    this.props.changeConstraint(text);

    this.props.changeSuggestionBoxOpen(false);
    this.setState({
      showBox: false
    });
  };

  getReactionIcon({key, text}) {
    return <div className={this.classes.reactionIcon} onClick={() => this.changeReaction(key)}>
      <label className={this.classes.reactionLabel}>{text}</label>
    </div>;
  }

  render() {
    return <div>
      {this.state.showBox ? <div className={this.classes.stateSelectionBox}>
        {this.props.constraintOptions.map(item => {
          return this.getReactionIcon(item);
        })}
      </div> : null}
      <div onClick={() => {
        this.props.changeSuggestionBoxOpen(true);
        this.setState({showBox: true})
      }}>
        {this.props.currentConstraint};
      </div>
    </div>;
  }
}