import React from 'react';
import Component from 'components/Component';
import style from 'styles/controls/custom-checkbox.css';

export default class CustomCheckbox extends Component {

  style = style;

  render() {
    return <div className={this.classes.container} style={this.props.style}>
      <div className={this.classes.checkbox} style={this.props.checkboxStyle}
           data-checked={this.props.checked ? true : null}>
        <div className={this.classes.checkMark} hidden={!this.props.checked}/>
        <input type='checkbox' className={this.classes.input} checked={this.props.checked}
               onChange={this.props.onChange}/>
      </div>
      <div className={this.classes.children} data-checked={this.props.checked ? true : null}>
        {this.props.children}
      </div>
    </div>;
  }
}

