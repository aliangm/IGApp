import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import Select from 'components/controls/Select';
import style from 'styles/onboarding/onboarding.css';
import Button from 'components/controls/Button';
import serverCommunication from 'data/serverCommunication';
import CRMStyle from 'styles/indicators/crm-popup.css';

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

  close() {
    this.setState({hidden: true});
  }

  getAuthorization() {
    const win = window.open(this.state.url);

    const timer = setInterval(() => {
      if (win.closed) {
        clearInterval(timer);
        const code = localStorage.getItem('code');
        if (code) {
          localStorage.removeItem('code');
          this.setState({code: code});
          serverCommunication.serverRequest('post', 'linkedinapi', JSON.stringify({code: code}), localStorage.getItem('region'))
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

  getUserData() {
    serverCommunication.serverRequest('put', 'linkedinapi', JSON.stringify({accountId: this.state.selectedAccount}), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.props.setDataAsState(data);
              this.close();
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

  render(){
    const selects = {
      account: {
        label: 'Account',
        select: {
          name: 'account',
          options: this.state.accounts
            .map(account => {
              return {value: account.id, label: account.name}
            })
        }
      }
    };
    return <div style={{ width: '100%' }}>
      <div hidden={this.state.hidden}>
        { this.state.accounts.length > 0 ?
          <Page popup={ true } width={'340px'}>
            <div className={ this.classes.row }>
              <Select { ... selects.account } selected={ this.state.selectedAccount}
                      onChange={ this.handleChangeAccount.bind(this) }/>
            </div>
            <div className={ this.classes.footer }>
              <div className={ this.classes.footerLeft }>
                <Button type="normal" style={{ width: '100px' }} onClick={ this.close.bind(this) }>Cancel</Button>
              </div>
              <div className={ this.classes.footerRight }>
                <Button type="primary2" style={{ width: '100px' }} onClick={ this.getUserData.bind(this) }>Done</Button>
              </div>
            </div>
          </Page>
          : null }
      </div>
    </div>
  }

}