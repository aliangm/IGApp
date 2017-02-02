import React from 'react';
import ReactDOM from 'react-dom';

import Component from 'components/Component';

import style from 'styles/controls/textfield.css';

export default class Textfield extends Component {
  style = style;

  getValue() {
    const input = ReactDOM.findDOMNode(this.refs.input);
    return input.value;
  }

  focus() {
    ReactDOM.findDOMNode(this.refs.input).focus();
  }

  render() {
    let className;

    if (this.props.className) {
      className = this.classes.box + ' ' + this.props.className;
    } else {
      className = this.classes.box;
    }

    return <div className={ className } style={ this.props.style }>
      <input type= {this.props.type }
        ref="input"
        className={ this.classes.input }
        defaultValue={ this.props.defaultValue }
        value={ this.props.value }
        readOnly={ this.props.readOnly }
        minLength= {this.props.minLength }
        //type={ this.props.type }
        required = {this.props.required }
        onClick={ this.props.onClick }
        onFocus={ this.props.onFocus }
        onBlur={ this.props.onBlur }
        onChange={ this.props.onChange }
        onKeyDown={ this.props.onKeyDown }
        onKeyUp={ this.props.onKeyUp }
        onKeyPress={ this.props.onKeyPress }
        onInput={ this.props.onInput }
      />
    </div>
  }
}