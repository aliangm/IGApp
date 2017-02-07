import React from 'react';
import Component from 'components/Component';

import style from 'styles/profile/product-launch-popup.css';
import Button from 'components/controls/Button';
import Dropdown from 'components/controls/Dropdown';

export default class PlanNextMonthPopup extends Component {
  style = style;

  render() {
    const $ = this.classes;
    let style;

    if (this.props.hidden) {
      style = { display: 'none' };
    }

    return <div className={ $.box } style={ style }>
      <div className={ $.title }>
        Are you sure?
      </div>

      <div className={ $.choose }>
        Are you sure you want to optimize your plan for next month? Please do it only after the 20th of the current month (DON’T do it between the 1st and 19th of the current month). This action will overwrite your current plan and move you to the next month so that you can plan ahead.
      </div>

      <div className={ $.nav }>
        <Button type="normal-accent" style={{
          width: '100px',
          marginRight: '20px'
        }} onClick={ this.props.onBack }>
          Cancel
        </Button>
        <Button type="accent" style={{
          width: '100px'
        }} onClick={ this.props.onNext }>
          I'm sure
        </Button>
      </div>
    </div>
  }
}