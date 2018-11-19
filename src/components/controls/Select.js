import React from 'react';
import Component from 'components/Component';
import ReactSelect from 'react-select-plus';
import Label from 'components/ControlsLabel';
import style from 'react-select-plus/dist/react-select-plus.css';
import selectStyle from 'styles/controls/select.css';

export default class Select extends Component {

  style = style;
  styles = [selectStyle];

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

  iconRenderer = (item) =>
    <div style={{display: 'flex'}}>
      <div className={selectStyle.locals.icon} data-icon={this.props.iconFromValue(item.value)}/>
      <div className={selectStyle.locals.text}>
        {item.label}
      </div>
    </div>;

  render() {
    let label;

    if (this.props.label) {
      label =
        <Label question={this.props.labelQuestion} description={this.props.description}>{this.props.label}</Label>;
    }

    const otherProps = {};
    if (this.props.iconRendererOnValue) {
      otherProps.valueRenderer = this.iconRenderer;
    }
    if (this.props.iconRendererOnOptions) {
      otherProps.optionRenderer = this.iconRenderer;
    }

    const select = this.props.select;

    return <div style={this.props.style} className={this.props.className}>
      {label}
      <div style={{display: 'flex', position: 'relative'}}>
        <div style={{flex: 'auto'}}>
          <ReactSelect {...select}
                       {...otherProps}
                       ref="input"
                       openOnFocus={true}
                       value={this.props.selected}
                       onChange={this.onChange.bind(this)}
                       className={this.props.innerClassName}
                       placeholder={this.props.placeholder}
                       disabled={this.props.disabled}
                       clearable={false}
                       style={{
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
    </div>;
  }
}