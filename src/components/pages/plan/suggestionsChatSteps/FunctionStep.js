import Component from 'components/Component';
import {PropTypes} from 'react';
import React from 'react';

export default class FunctionStep extends Component {
  static PropTypes = {
    funcToRun: PropTypes.func.isRequired,
    textForUser: PropTypes.string.isRequired,
    nextStepId: PropTypes.string.isRequired
  };

  componentDidMount() {
    this.props.funcToRun(() => {
      this.props.triggerNextStep({trigger: this.props.nextStepId});
    });
  }

  render() {
    return <div>{this.props.textForUser}</div>;
  }
}