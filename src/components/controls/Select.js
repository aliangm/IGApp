import React from 'react';
import Component from 'components/Component';

import ReactSelect from 'react-select-plus';
import Label from 'components/ControlsLabel';

import style from 'react-select-plus/dist/react-select-plus.css';

export default class Select extends Component {
  style = style;

  static defaultProps = {
    labelQuestion: false,
    style: {
      fontSize: '14px'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      validationError: false
    };
  }

  focus() {
    this.refs.input.focus();
  }

  onChange() {
    this.setState({validationError: false});
    this.props.onChange.apply(null, arguments);
  }

  validationError() {
    this.focus();
    this.setState({validationError: true});
  }

  render() {
    let label;

    if (this.props.label) {
      label = <Label question={ this.props.labelQuestion } description={ this.props.description }>{ this.props.label }</Label>
    }

    const select = this.props.select;

    return <div style={ this.props.style } className={ this.props.className }>
      { label }
      <div style={{ display: 'flex', position: 'relative' }}>
        <div style={{ flex: 'auto' }}>
          <ReactSelect { ... select } ref="input" openOnFocus={ true } value={ this.props.selected } onChange= { this.onChange.bind(this) } className={ this.props.innerClassName } placeholder={ this.props.placeholder } disabled={ this.props.disabled } clearable={ false } style={{
            background: 'linear-gradient(to bottom, #ffffff 0%, #f1f3f7 100%)',
            border: '1px solid #ced0da',
            color: '#535b69'
          }}/>
        </div>
        <div hidden={!this.state.validationError} style={{
          background: 'url(/assets/attention.svg) center center no-repeat',
          backgroundSize: 'contain',
          minWidth: '20px',
          minHeight: '20px',
          maxWidth: '20px',
          maxHeight: '20px',
          marginLeft: '15px',
          alignSelf: 'center'
        }}/>
      </div>
    </div>
  }
}