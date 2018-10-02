import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import CRMStyle from 'styles/indicators/crm-popup.css';
import AuthorizationIntegrationPopup from 'components/pages/indicators/AuthorizationIntegrationPopup';

export default class StripeAutomaticPopup extends Component {

  style = style;
  styles = [CRMStyle];

  constructor(props) {
    super(props);
  }

  open() {
    this.refs.authPopup.open();
  }

  afterDataRetrieved = (data) => {
    return new Promise((resolve, reject) => {
      this.props.setDataAsState(data);
      resolve();
    });
  };

  render(){
    return <div style={{ width: '100%' }}>
      <div>
        <AuthorizationIntegrationPopup ref='authPopup'
                                       api='stripeapi'
                                       afterDataRetrieved={this.afterDataRetrieved}/>
      </div>
    </div>
  }

}