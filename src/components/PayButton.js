import React, {PropTypes} from 'react';
import Component from 'components/Component';
import Button from 'components/controls/Button';
import style from 'styles/pay-button.css';

export default class PayButton extends Component {

  style = style;

  static propTypes = {
    isPaid: PropTypes.bool,
    trialEnd: PropTypes.string,
    pay: PropTypes.func
  };

  render() {
    const daysLeft = Math.max(Math.ceil((new Date(this.props.trialEnd).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)), 0);
    return !this.props.isPaid ?
      <div className={this.classes.inner}>
        Days left in trial
        <span className={this.classes.timeLeftFrame}>
          <span className={this.classes.timeLeftText}>
          {daysLeft}
          </span>
      </span>
        <Button type='primary' onClick={this.props.pay}>Upgrade</Button>
      </div>
      : null;

  }
}

