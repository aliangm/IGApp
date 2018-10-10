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

  constructor(props) {
    super(props);
  }

  doneRequest = () => {
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

  render() {
    return <IntegrationPopup width={this.props.width}
                             doneRequest={this.doneRequest}
                             isOpen={this.props.isOpen}
                             close={this.props.close}
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