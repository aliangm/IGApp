import React from 'react';
import Component from 'components/Component';
import style from 'styles/campaigns/template-box.css';

export default class TemplateBox extends Component {

  style = style;

  render() {
    return <div className={this.classes.frame} data-white={this.props.isWhite ? true : null} onClick={this.props.onClick} data-selected={this.props.selected ? true : null}>
      <div className={this.classes.inner}>
        <div className={this.props.isCenter ? this.classes.frameTextCenter : this.classes.frameTextTop}>
          { this.props.text }
        </div>
        {
          this.props.number ?
            <div className={this.classes.number}>
              { this.props.number }
            </div>
            : null
        }
      </div>
    </div>
  }

}