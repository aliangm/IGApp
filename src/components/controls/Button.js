import React from 'react';
import Component from 'components/Component';

import style from 'styles/controls/button.css';

export default class Button extends Component {
  style = style;
  static defaultProps = {
    type: 'normal'
  };

  render() {
    let className = [this.classes[this.props.type]];

    if (this.props.className) {
      className.push(this.props.className);
    }

    let contClassName = this.classes.cont;

    if (this.props.contClassName) {
      contClassName += ' ' + this.props.contClassName;
    }

    return <div className={ className.join(' ') }
      role="button"
      tabIndex={ 0 }
      style={ this.props.style }
      onClick={ this.props.onClick }
      data-selected={ this.props.selected || null }
    >
      { this.props.icon ?
        <div className={ this.classes.icon } data-icon={ this.props.icon } />
      : null }
      <div className={ contClassName }>{ this.props.children }</div>
    </div>
  }
}