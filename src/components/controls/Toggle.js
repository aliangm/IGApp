import React from 'react';
import Component from 'components/Component';
import style from 'styles/controls/toggle.css';

export default class Toggle extends Component {

  style = style;

  render() {

    return <div className={this.classes.inner} style={ this.props.style }>
      <div className={this.classes.box}>
        <div className={this.classes.frame} data-active={this.props.leftActive ? true : null}
             onClick={ this.props.leftClick }>
          <div className={this.classes.frameText}>
            { this.props.leftText }
          </div>
        </div>
        <div className={this.classes.frame} data-active={this.props.leftActive ? null : true}
             onClick={ this.props.rightClick }>
          <div className={this.classes.frameText}>
            { this.props.rightText }
          </div>
        </div>
      </div>
    </div>

  }
}