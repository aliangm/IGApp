import React from 'react';
import Component from 'components/Component';

// import style from 'styles/profile/next-button.css';
import style from 'styles/profile/profile.css';

import Button from 'components/controls/Button';

export default class NextButton extends Component {
  style = style;

  render() {
    return <Button type="accent2" style={{
      width: '120px',
      letterSpacing: 0.075
    }} onClick={ this.props.onClick }>
      NEXT
      <div className={ this.classes.nextIcon }></div>
    </Button>;
  }
}