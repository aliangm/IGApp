import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import Select from 'components/controls/Select';
import style from 'styles/onboarding/onboarding.css';
import Button from 'components/controls/Button';
import serverCommunication from 'data/serverCommunication';

export default class AutomaticIndicatorPopup extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      profiles: [],
      selectedAccount: null,
      selectedProfile: null,
      code: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hidden && this.props.hidden != nextProps.hidden) {
      serverCommunication.serverRequest('get', 'googleapi')
        .then((response) => {
          if (response.ok) {
            response.json()
              .then((data) => {
                const win = window.open(data);

                const timer = setInterval(() => {
                  if (win.closed) {
                    clearInterval(timer);
                    const code = localStorage.getItem('code');
                    if (code) {
                      localStorage.removeItem('code');
                      this.setState({code: code});
                      serverCommunication.serverRequest('post', 'googleapi', JSON.stringify({code: code}))
                        .then((response) => {
                          if (response.ok) {
                            response.json()
                              .then((data) => {
                                this.setState({accounts: data.accounts, profiles: data.profiles});
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

  handleChangeAccount(event) {
    this.setState({selectedAccount: event.value});
  }

  handleChangeProfile(event) {
    this.setState({selectedProfile: event.value});
  }

  getUserData() {
    serverCommunication.serverRequest('put', 'googleapi', JSON.stringify({profileId: this.state.selectedProfile}), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.props.setDataAsState(data);
              this.props.close();
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
      },
      profile: {
        label: 'Profile',
        select: {
          name: 'profile',
          options: this.state.profiles
            .filter(profile => {
              return profile.accountId == this.state.selectedAccount
            })
            .map(profile => {
              return {value: profile.id, label: profile.name}
            })
        }
      }
    };
    return <div hidden={ this.props.hidden }>
      {this.state.code ? <Page popup={ true } width={'340px'}>
        <div className={ this.classes.row }>
          <Select { ... selects.account } selected={ this.state.selectedAccount}
                  onChange={ this.handleChangeAccount.bind(this) }/>
        </div>
        <div className={ this.classes.row }>
          <Select { ... selects.profile } selected={ this.state.selectedProfile}
                  onChange={ this.handleChangeProfile.bind(this) }/>
        </div>
        <div className={ this.classes.footer }>
          <div className={ this.classes.footerLeft }>
            <Button type="normal" style={{ width: '100px' }} onClick={ this.props.close }>Cancel</Button>
          </div>
          <div className={ this.classes.footerRight }>
            <Button type="primary2" style={{ width: '100px' }} onClick={ this.getUserData.bind(this) }>Done</Button>
          </div>
        </div>
      </Page>
          : null }
    </div>
  }

}