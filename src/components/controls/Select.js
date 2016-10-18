import React from 'react';
import Component from 'components/Component';

import ReactDropdown from 'react-dropdown';
import dropdownStyle from 'styles/global/dropdown.css';

import Label from 'components/ControlsLabel';

import style from 'styles/controls/select.css';

export default class Select extends Component {
  style = style;
  styles = [dropdownStyle];

  static defaultProps = {
    labelQuestion: true
  }

  render() {
    let label;

    if (this.props.label) {
      label = <Label question={ this.props.labelQuestion }>{ this.props.label }</Label>
    }

    const select = this.props.select;

    return <div style={ this.props.style } className={ this.props.className }>
      { label }
      <ReactDropdown { ... select } value={ this.props.selected || select.options[0] } />
    </div>
  }
}