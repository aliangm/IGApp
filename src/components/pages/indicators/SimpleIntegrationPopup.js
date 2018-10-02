import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import Label from 'components/ControlsLabel';
import Textfield from 'components/controls/Textfield';
import IntegrationPopup from 'components/pages/indicators/IntegrationPopup';

export default class SimpleIntegrationPopup extends Component {

  style = style;

  static defaultProps = {
    placeHolder: ''
  };

  render() {
    return <IntegrationPopup {...this.props}>
      <div className={this.classes.row}>
        <Label>{this.props.title}</Label>
      </div>
      <div className={this.classes.row}>
        <Textfield value={this.props.value} onChange={this.props.onChange}
                   placeHolder={this.props.placeHolder}/>
      </div>
    </IntegrationPopup>;
  }
}