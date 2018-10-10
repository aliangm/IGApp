import React from 'react';
import Component from 'components/Component';
import Select from 'components/controls/Select';
import style from 'styles/onboarding/onboarding.css';
import serverCommunication from 'data/serverCommunication';
import CRMStyle from 'styles/indicators/crm-popup.css';
import AuthorizationIntegrationPopup from 'components/common/AuthorizationIntegrationPopup';

export default class LinkedinAutomaticPopup extends Component {

  style = style;
  styles = [CRMStyle];

  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      selectedAccount: null,
    };
  }

  open() {
    this.refs.authPopup.open();
  }

  close() {
    this.refs.authPopup.close();
  }

  afterDataRetrieved = (data) => {
    return new Promise((resolve, reject) => {
      if (data.values.length > 1) {
        this.setState({accounts: data.values});
        resolve(true);
      }
      else {
        this.setState({selectedAccount: data.values[0].id},
          () => this.getUserData()
            .then(() => resolve(false))
            .catch((error) => reject(error)));
      }
    });
  };

  handleChangeAccount(event) {
    this.setState({selectedAccount: event.value});
  }

  getUserData = () => {
    return new Promise((resolve, reject) => {
      serverCommunication.serverRequest('put',
        'linkedinapi',
        JSON.stringify({accountId: this.state.selectedAccount}),
        localStorage.getItem('region'))
        .then((response) => {
          if (response.ok) {
            response.json()
              .then((data) => {
                this.props.setDataAsState(data);
                resolve();
              });
          }
          else if (response.status == 401) {
            history.push('/');
          }
          else {
            reject(new Error('error to get LinkedIn data'));
          }
        });
    });
  };

  render() {
    const selects = {
      account: {
        label: 'Account',
        select: {
          name: 'account',
          options: this.state.accounts
            .map(account => {
              return {value: account.id, label: account.name};
            })
        }
      }
    };
    return <AuthorizationIntegrationPopup ref='authPopup'
                                          api='linkedinapi'
                                          afterDataRetrieved={this.afterDataRetrieved}
                                          doneServerRequest={this.getUserData}
                                          width='340px'
    >
      {this.state.accounts.length > 0
        ? <div>
          <div className={this.classes.row}>
            <Select {...selects.account} selected={this.state.selectedAccount}
                    onChange={this.handleChangeAccount.bind(this)}/>
          </div>
        </div>
        : null}
    </AuthorizationIntegrationPopup>;
  }
};