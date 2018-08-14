import Component from 'components/Component';
import Textfield from 'components/controls/Textfield';
import React from 'react';
import style from 'styles/plan/plan-optimization-popup.css';

export default class ConstraintStep extends Component {
  style = style;

  constructor(props) {
    super(props);

    this.state = {
      channelLimit: 2,
      setClicked: false
    };
  }

  render() {
    return <div className={this.classes.constraintStep}>
      <span className={this.classes.constraintText}>Don't touch more than</span>
      {this.state.setClicked ? <div>{this.state.channelLimit}</div>
        : <Textfield type="number" value={this.state.channelLimit}
                     onChange={(e) => this.setState({channelLimit: e.target.value})} min="2"/>
      }
      <span className={this.classes.constraintText}>channels</span>
      <div className={this.classes.constraintText} onClick={() => {
        if (!this.state.setClicked) {
          this.setState({setClicked: true});
          this.props.triggerNextStep({
            value: this.state.channelLimit,
            trigger: '7'
          });
        }
      }}>
        Set
      </div>
    </div>;
  }
}