import React from 'react';
import Component from 'components/Component';
import Select from 'components/controls/Select';
import style from 'styles/onboarding/onboarding.css';
import serverCommunication from 'data/serverCommunication';
import salesForceStyle from 'styles/indicators/salesforce-automatic-popup.css';
import Title from 'components/onboarding/Title';
import CRMStyle from 'styles/indicators/crm-popup.css';
import AuthorizationIntegrationPopup from 'components/common/AuthorizationIntegrationPopup';

export default class AdwordsCampaigns extends Component {

  style = style;
  styles = [salesForceStyle, CRMStyle];

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
    };
  }

  getUserData = () => {
    return new Promise((resolve, reject) => {
      serverCommunication.serverRequest('put',
        'adwordsapi',
        JSON.stringify({customerId: this.state.selectedCustomer}),
        localStorage.getItem('region'))
        .then((response) => {
          if (response.ok) {
            response.json()
              .then((data) => {
                this.props.setDataAsState(data);
                resolve(false);
              });
          }
          else if (response.status == 401) {
            history.push('/');
          }
          else {
            reject('Falied to load adwords campaigns data');
          }
        });
    });
  };

  afterDataRetrieved = (data) => {
    return new Promise((resolve, reject) => {
      this.setState({customers: data});
      resolve(true);
    });
  };

  open = () => {
    this.refs.authPopup.open();
  };

  render() {
    const selects = {
      customers: {
        select: {
          name: 'customers',
          options: this.state.customers
            .map(customer => {
              return {value: customer.customerId, label: customer.descriptiveName + ' (' + customer.customerId + ')'};
            })
        }
      }
    };

    return <AuthorizationIntegrationPopup ref='authPopup'
                                          api='adwordsapi'
                                          afterDataRetrieved={this.afterDataRetrieved}
                                          makeServerRequest={this.getUserData}
                                          width='680px'
                                          innerClassName={salesForceStyle.locals.inner}
                                          contentClassName={salesForceStyle.locals.content}
                                          loadingStarted={this.props.loadingStarted}
                                          loadingFinished={this.props.loadingFinished}
    >
      <Title title="Google AdWords - choose customer"/>
      <div className={this.classes.row}>
        <Select {...selects.customers} selected={this.state.selectedCustomer} onChange={(e) => {
          this.setState({selectedCustomer: e.value});
        }}/>
      </div>
    </AuthorizationIntegrationPopup>;
  }

}