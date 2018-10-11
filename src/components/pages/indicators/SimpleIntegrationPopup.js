import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import Label from 'components/ControlsLabel';
import Textfield from 'components/controls/Textfield';
import IntegrationPopup from 'components/common/IntegrationPopup';

export default class SimpleIntegrationPopup extends Component {

  style = style;

  static defaultProps = {
    placeHolder: '',
    width: '400px'
  };

  makeServerRequest = () => {
    return new Promise((resolve, reject) => {
      this.props.serverRequest()
        .then((response) => {
          if (response.ok) {
            response.json()
              .then(data => {
                this.props.getDataSuccess(data);
                resolve();
              });
          }
          else if (response.status == 401) {
            history.push('/');
          }
          else {
            reject(new Error('error getting data'));
          }
        })
        .catch((error) => {
          reject(new Error('error getting data'));
        });
    });
  };

  onDoneServerRequest = (isError) => {
    if (!isError) {
      this.close();
    }
  };

  close = () => {
    this.refs.integrationPopup.close();
  };

  open = () => {
    this.refs.integrationPopup.open();
  };

  render() {
    return <IntegrationPopup ref="integrationPopup"
                             width={this.props.width}
                             makeServerRequest={this.makeServerRequest}
                             onDoneServerRequest={this.onDoneServerRequest}
                             affectedIndicators={this.props.affectedIndicators}
                             actualIndicators={this.props.actualIndicators}
    >
      <div style={{display: 'grid'}}>
        <div className={this.classes.row}>
          <Label>{this.props.title}</Label>
        </div>
        <div className={this.classes.row}>
          <Textfield value={this.props.value} onChange={this.props.onChange}
                     placeHolder={this.props.placeHolder}/>
        </div>
      </div>
    </IntegrationPopup>;
  }
}