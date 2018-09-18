import React from 'react';
import Component from 'components/Component';
import style from 'styles/controls/button.css';
import icons from 'styles/onboarding/buttons.css';

export default class Button extends Component {

  style = style;
  styles = [icons];

  DISABLED_ICON_SUFFIX = "-disabled";

  static defaultProps = {
    type: 'secondary'
  };

  render() {
    let className = [this.classes[this.props.type]];

    if (this.props.className) {
      className.push(this.props.className);
    }

    let contClassName = this.classes.cont;

    if (this.props.contClassName) {
      contClassName += ' ' + this.props.contClassName;
    }

    return <div className={className.join(' ')}
                role="button"
                tabIndex={0}
                style={this.props.style}
                onClick={this.props.disabled ? null : this.props.onClick}
                data-disabled={this.props.disabled ? true : null}
                data-selected={this.props.selected || null}
    >
      {this.props.icon ?
        <div className={this.classes.icon} data-icon={this.props.icon+ (this.props.disabled ? this.DISABLED_ICON_SUFFIX : '')}/>
        : null}
      <div className={contClassName}>{this.props.children}</div>
    </div>;
  }
}