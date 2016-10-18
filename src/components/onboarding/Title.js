import React from 'react';
import Component from 'components/Component';

import style from 'styles/onboarding/title.css';

export default class Title extends Component {
  style = style;

  render() {
    const title = this.props.title;
    let className;

    /*if (title.length > 10) {
      className = this.classes.verticalBox;
    } else {
      className = this.classes.box;
    }*/

    if (this.props.vertical) {
      className = this.classes.verticalBox;
    } else {
      className = this.classes.box;
    }

    if (this.props.className) {
      className += ' ' + this.props.className;
    }

    let subText;

    if (this.props.subTitle) {
      subText = <div className={ this.classes.text }>{ this.props.subTitle }</div>
    }

    return <div className={ className } style={ this.props.style }>
      <div className={ this.classes.title }>{ title }</div>
      { subText }
    </div>
  }
}