import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import Select from 'components/controls/Select';
import style from 'styles/onboarding/onboarding.css';
import Button from 'components/controls/Button';
import serverCommunication from 'data/serverCommunication';
import salesForceStyle from 'styles/indicators/salesforce-automatic-popup.css';
import Title from 'components/onboarding/Title';
import CRMStyle from 'styles/indicators/crm-popup.css';

export default class TwitterCampaignsPopup extends Component {

  style = style;
  styles = [salesForceStyle, CRMStyle];

  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      code: null,
      hidden: true
    };
  }

  componentDidMount() {
    if (!this.props.data) {
      serverCommunication.serverRequest('get', 'twitteradsapi')
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

  getAuthorization = () => {
    if (!this.props.data) {
      const win = window.open(this.state.url);
      const timer = setInterval(() => {
        if (win.closed) {
          clearInterval(timer);
          const code = localStorage.getItem('code');
          if (code) {
            localStorage.removeItem('code');
            this.setState({code: code});
            this.getMapping(code);
          }
        }
      }, 1000);
    }
    else {
      this.getMapping();
    }
  };

  getMapping(code) {
    serverCommunication.serverRequest('post',
      'twitteradsapi',
      JSON.stringify({code: code}),
      localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.setState({accounts: data, hidden: false});
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
    serverCommunication.serverRequest('put',
      'twitteradsapi',
      JSON.stringify({accountId: this.state.selectedAccount}),
      localStorage.getItem('region'))
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
  };

  close() {
    this.setState({hidden: true});
    this.props.close();
  }

  open = () => {
    this.getAuthorization();
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
    return <div hidden={this.state.hidden}>
      <Page popup={true} width={'680px'} innerClassName={salesForceStyle.locals.inner}
            contentClassName={salesForceStyle.locals.content}>
        <Title title="Choose Twitter Account"/>
        <div className={this.classes.row}>
          <Select {...selects.accounts} selected={this.state.selectedAccount} onChange={(e) => {
            this.setState({selectedAccount: e.value});
          }}/>
        </div>
        <div className={this.classes.footer}>
          <div className={this.classes.footerLeft}>
            <Button type="secondary" style={{width: '100px'}} onClick={this.close.bind(this)}>Cancel</Button>
          </div>
          <div className={this.classes.footerRight}>
            <Button type="primary" style={{width: '100px'}} onClick={this.getUserData.bind(this)}>Done</Button>
          </div>
        </div>
      </Page>
    </div>;
  }
}