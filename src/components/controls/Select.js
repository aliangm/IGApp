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
    labelQuestion: false
  }

  render() {
    let label;
    let selected = -1;
    
    if (this.props.label) {
      label = <Label question={ this.props.labelQuestion } description={ this.props.description }>{ this.props.label }</Label>
    }
    
    const select = this.props.select;
	  for(var i = 0; i < select.options.length;i++){
		  if (select.options[i].value == this.props.selected){
			  selected = i;
		  }
	  }
    
    return <div style={ this.props.style } className={ this.props.className }>
      { label }
      <ReactDropdown { ... select } value={ select.options[selected] } onChange= { this.props.onChange } />
    </div>
  }
}