import React from 'react';
import Component from 'components/Component';

import style from 'styles/page.css';

export default class Page extends Component {
  style = style;

  static defaultProps = {
    sidebar: true
  }

  render() {
    let className = this.props.popup ?
      this.classes.popup : this.classes.static;

    if (this.props.className) {
      className += ' ' + this.props.className;
    }

    let boxStyle;

    if (this.props.width) {
      boxStyle = {
        maxWidth: this.props.width
      };
    }

    if (this.props.centered) {
      boxStyle || (boxStyle = {});
      boxStyle.margin = '0 auto';
    }

    let contentClassName = this.classes.content;

    if (this.props.contentClassName) {
      contentClassName += ' ' + this.props.contentClassName;
    }

    return <div
      className={ className }
      style={ this.props.style }
      data-sidebar={ this.props.sidebar }
    >
      <div className={ this.classes.box } style={ boxStyle }>
        <div className={ this.classes.inner }>
          <div className={ contentClassName }>
            { this.props.children }
          </div>
        </div>
      </div>
    </div>
  }
}