import React from 'react';
import Component from 'components/Component';
import Select from 'components/controls/Select';
import style from 'styles/onboarding/onboarding.css';
import serverCommunication from 'data/serverCommunication';
import CRMStyle from 'styles/indicators/crm-popup.css';
import IntegrationPopup from 'components/pages/indicators/IntegrationPopup';

export default class LinkedinAutomaticPopup extends Component {

  style = style;
  styles = [CRMStyle];

  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      selectedAccount: null,
      code: null,
      hidden: true
    };
  }

  componentDidMount() {
    serverCommunication.serverRequest('get', 'linkedinapi')
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.setState({url: data});
            });
        }
        else if (response.status == 401) {
          history.push('/');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  open() {
    this.getAuthorization();
  }

  close = () => {
    this.setState({hidden: true});
  };

  getAuthorization() {
    const win = window.open(this.state.url);

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
                      this.setState({accounts: data.values, hidden: false});
                    }
                    else {
                      this.setState({selectedAccount: data.values[0].id}, this.getUserData);
                    }
                  });
              }
              else if (response.status == 401) {
                history.push('/');
              }
            })
            .catch(function (err) {
              console.log(err);
            });
        }
      }
    }, 1000);
  }

  handleChangeAccount(event) {
    this.setState({selectedAccount: event.value});
  }

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
    return <div style={{width: '100%'}}>
      <div hidden={this.state.hidden}>
        {this.state.accounts.length > 0 ?
          <IntegrationPopup width='340px'
                            isOpen={!this.state.hidden}
                            getDateSuccess={this.props.setDateAsState}
                            close={this.close}
                            serverRequest={() => serverCommunication.serverRequest('put',
                              'linkedinapi',
                              JSON.stringify({accountId: this.state.selectedAccount}),
                              localStorage.getItem('region'))}>
            <div className={this.classes.row}>
              <Select {...selects.account} selected={this.state.selectedAccount}
                      onChange={this.handleChangeAccount.bind(this)}/>
            </div>
          </IntegrationPopup>
          : null}
      </div>
    </div>;
  }

}