import React from 'react';
import Component from 'components/Component';

import style from 'styles/profile/choose-button.css';

export default class Button extends Component {
  style = style;

  render() {
    const className = this.props.selected ?
      this.classes.selectedButton : this.classes.button;

    const textLen = this.props.text.length;
    let textStyle;

    if (textLen > 9) {
      textStyle = {
        fontSize: '12px'
      };
    } else if (textLen > 8) {
      textStyle = {
        fontSize: '13px'
      };
    } else if (textLen > 7) {
      textStyle = {
        fontSize: '14px'
      };
    }

    return <div className={ className } onClick={ this.props.onClick }>
      <div className={ this.classes.icon } data-icon={ this.props.icon || null } />
      <div className={ this.classes.text } style={ textStyle }>
        { this.props.text }
      </div>
    </div>
  }
}