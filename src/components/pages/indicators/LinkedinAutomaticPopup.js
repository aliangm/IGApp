import React from 'react';
import Component from 'components/Component';
import Select from 'components/controls/Select';
import style from 'styles/onboarding/onboarding.css';
import serverCommunication from 'data/serverCommunication';
import CRMStyle from 'styles/indicators/crm-popup.css';
import AuthorizationIntegrationPopup from 'components/pages/indicators/AuthorizationIntegrationPopup';

export default class LinkedinAutomaticPopup extends Component {

  style = style;
  styles = [CRMStyle];

  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      selectedAccount: null,
      code: null,
    };
  }

  initialServerRequest = () => {
    return new Promise((resolve, reject) => {
      serverCommunication.serverRequest('get', 'linkedinapi')
        .then((response) => {
          if (response.ok) {
            response.json()
              .then((data) => {
                this.setState({url: data});
                resolve();
              });
          }
          else if (response.status == 401) {
            history.push('/');
          }
          else {
            reject(new Error('Error getting LinkedIn data'));
          }
        })
        .catch(function (err) {
          reject(err);
        });
    });
  };

  open() {
    this.refs.authPopup.open();
  }

  close() {
    this.refs.authPopup.close();
  }

  getAuthorization = () => {
    const win = window.open(this.state.url);

    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        if (win.closed) {
          clearInterval(timer);
          const code = localStorage.getItem('code');
          if (code) {
            localStorage.removeItem('code');
            this.setState({code: code});
            serverCommunication.serverRequest('post',
              'linkedinapi',
              JSON.stringify({code: code}),
              localStorage.getItem('region'))
              .then((response) => {
                if (response.ok) {
                  response.json()
                    .then((data) => {
                      if (data.values.length > 1) {
                        this.setState({accounts: data.values});
                        resolve(true);
                      }
                      else {
                        this.setState({selectedAccount: data.values[0].id},
                          this.getUserData()
                          .then(() => resolve(false)));
                      }
                    });
                }
                else if (response.status == 401) {
                  history.push('/');
                }
                else {
                  reject(new Error('error retrieving data from LinkedIn'));
                }
              })
          }
        }
      }, 1000);
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
        })
    })
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
                                          initialServerRequest={this.initialServerRequest}
                                          getAuthorization={this.getAuthorization}
                                          doneServerRequest={this.getUserData()}
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