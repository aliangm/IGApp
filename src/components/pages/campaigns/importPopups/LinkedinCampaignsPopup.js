import React from 'react';
import Component from 'components/Component';
import Select from 'components/controls/Select';
import style from 'styles/onboarding/onboarding.css';
import serverCommunication from 'data/serverCommunication';
import salesForceStyle from 'styles/indicators/salesforce-automatic-popup.css';
import Title from 'components/onboarding/Title';
import CRMStyle from 'styles/indicators/crm-popup.css';
import AuthorizationIntegrationPopup from 'components/common/AuthorizationIntegrationPopup';

export default class LinkedinCampaignsPopup extends Component {

  style = style;
  styles = [salesForceStyle, CRMStyle];

  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
    };
  }

  getUserData = ()  => {
    return new Promise((resolve, reject) => {
      serverCommunication.serverRequest('put',
        'linkedinadsapi',
        JSON.stringify({accountId: this.state.selectedAccount}),
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
            reject('Error getting linkedin ads data');
          }
        })
    })
  };

  open = () => {
    this.refs.authPopup.open();
  };

  afterDataRetrieved = (data) => {
    return new Promise((resolve, reject) => {
      this.setState({
        accounts: data
      });

      resolve(true);
    });
  };

  render() {
    const selects = {
      accounts: {
        select: {
          name: 'accounts',
          options: this.state.accounts
            .map(account => {
              return {value: account.id, label: account.name + ' (' + account.id + ')'};
            })
        }
      }
    };

    return <AuthorizationIntegrationPopup ref='authPopup'
                                          api='linkedinadsapi'
                                          afterDataRetrieved={this.afterDataRetrieved}
                                          makeServerRequest={this.getUserData}
                                          width='680px'
                                          innerClassName={salesForceStyle.locals.inner}
                                          contentClassName={salesForceStyle.locals.content}
                                          loadingStarted={this.props.loadingStarted}
                                          loadingFinished={this.props.loadingFinished}
    >
      <Title title="Choose Linkedin Ads Account"/>
      <div className={this.classes.row}>
        <Select {...selects.accounts} selected={this.state.selectedAccount} onChange={(e) => {
          this.setState({selectedAccount: e.value});
        }}/>
      </div>
    </AuthorizationIntegrationPopup>;
  }

}