import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import Select from 'components/controls/Select';
import style from 'styles/onboarding/onboarding.css';
import Button from 'components/controls/Button';
import serverCommunication from 'data/serverCommunication';
import CRMStyle from 'styles/indicators/crm-popup.css';
import Label from 'components/ControlsLabel';

export default class GoogleAutomaticPopup extends Component {

  style = style;
  styles = [CRMStyle];

  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      profiles: [],
      selectedAccount: null,
      selectedProfile: null,
      selectedBlogAccount: null,
      selectedBlogProfile: null,
      code: null,
      isWebsiteEnabled: true,
      isBlogEnabled: false,
      hidden: true
    };
  }

  componentDidMount() {
    if (!this.props.data) {
      serverCommunication.serverRequest('get', 'googleapi')
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      if (nextProps.data.profileId) {
        this.setState({selectedProfile: nextProps.data.profileId});
      }
      if (nextProps.data.blogProfileId) {
        this.setState({selectedBlogProfile: nextProps.data.blogProfileId});
      }
    }
  }

  open() {
    this.getAuthorization();
  }

  getAuthorization() {
    if (!this.props.data) {
      const win = window.open(this.state.url);

      const timer = setInterval(() => {
        if (win.closed) {
          clearInterval(timer);
          const code = localStorage.getItem('code');
          if (code) {
            localStorage.removeItem('code');
            this.setState({code: code});
            this.getAccounts(code);
          }
        }
      }, 1000);
    }
    else {
      this.getAccounts();
    }
  }

  getAccounts(code) {
    serverCommunication.serverRequest('post', 'googleapi', JSON.stringify({code: code}), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.setState({accounts: data.accounts, profiles: data.profiles, hidden: false});
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

  getUserData() {
    serverCommunication.serverRequest('put', 'googleapi', JSON.stringify({profileId: this.state.selectedProfile, blogProfileId: this.state.selectedBlogProfile}), localStorage.getItem('region'))
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

  close() {
    this.setState({hidden: true});
    if (this.props.close) {
      this.props.close();
    }
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
              return profile.accountId === this.state.selectedAccount
            })
            .map(profile => {
              return {value: profile.id, label: profile.name}
            })
        }
      },
      blogProfile: {
        label: 'Profile',
        select: {
          name: 'profile',
          options: this.state.profiles
            .filter(profile => {
              return profile.accountId === this.state.selectedBlogAccount
            })
            .map(profile => {
              return {value: profile.id, label: profile.name}
            })
        }
      }
    };
    return <div style={{ width: '100%' }}>
      <div hidden={this.state.hidden}>
        <Page popup={ true } width={'340px'}>
          <div className={ this.classes.row }>
            <Label style={{ fontSize: '16px', color: '#24B10E'}} checkbox={ this.state.isWebsiteEnabled } onChange={ ()=>{ this.setState({isWebsiteEnabled: !this.state.isWebsiteEnabled}) } }>
              Website
            </Label>
          </div>
          <div className={ this.classes.row }>
            <Select { ... selects.account } selected={ this.state.selectedAccount} disabled={!this.state.isWebsiteEnabled}
                    onChange={ (e)=>{ this.setState({selectedAccount: e.value}); } }/>
          </div>
          <div className={ this.classes.row }>
            <Select { ... selects.profile } selected={ this.state.selectedProfile} disabled={!this.state.isWebsiteEnabled}
                    onChange={ (e)=> { this.setState({selectedProfile: e.value}); } }/>
          </div>
          <div className={ this.classes.row } style={{ marginTop: '55px' }}>
            <Label style={{ fontSize: '16px', color: '#24B10E' }} checkbox={ this.state.isBlogEnabled } onChange={ ()=>{ this.setState({isBlogEnabled: !this.state.isBlogEnabled}) } }>
              Blog
            </Label>
          </div>
          <div className={ this.classes.row }>
            <Select { ... selects.account } selected={ this.state.selectedBlogAccount} disabled={!this.state.isBlogEnabled}
                    onChange={ (e)=>{ this.setState({selectedBlogAccount: e.value}); } }/>
          </div>
          <div className={ this.classes.row }>
            <Select { ... selects.blogProfile } selected={ this.state.selectedBlogProfile} disabled={!this.state.isBlogEnabled}
                    onChange={ (e)=> { this.setState({selectedBlogProfile: e.value}); } }/>
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
      </div>
    </div>
  }

}