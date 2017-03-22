import React from 'react';

import Component from 'components/Component';
import style from 'styles/header.css';

import Button from 'components/controls/Button';
import Popup from 'components/Popup';
import global from 'global';
import serverCommunication from 'data/serverCommunication';
import history from 'history';

export default class Header extends Component {
  style = style
  state = {
    dropmenuVisible: false
  };

  static defaultProps = {
    user: true
  }

  openSidebar = () => {
    global.dispatchEvent('sidebar:open');
  }

  showDropmenu = () => {
    this.setState({
      dropmenuVisible: true
    });
  }

  get menuBig() {
    const hasUser = this.props.user;

    return <div className={ this.classes.menuBig }>
      <div className={ this.classes.itemsBox }>
        { hasUser ?
          <div className={ this.classes.item }>
            <Button type="normalAccent" onClick={ this.logout } style={{
              width: '120px'
            }}>
              Log Out
              <div className={ this.classes.logOutIcon } data-icon="header:log-out" />
            </Button>
          </div>
          : null }
        { hasUser ?
          <a className={ this.classes.link } href="#welcome">
            <div className={ this.classes.settings } data-icon="header:settings" />
          </a>
          : null }
        <a className={ this.classes.linkText } href="http://infinigrow.com/company/" target="_blank">About</a>
        {/** <a className={ this.classes.linkText } href="#">Chat</a> **/}
        <a className={ this.classes.linkText } href="http://infinigrow.com/contact/" target="_blank">Contact</a>
        <a className={ this.classes.linkText } href="mailto:support@infinigrow.com?&subject=Support Request" target="_blank">Support</a>
      </div>

      { hasUser ?
        <div className={ this.classes.userBox }>
          <div className={ this.classes.logged }>
            {this.state.userCompany}
            <div className={ this.classes.user }>{this.state.userFirstName} {this.state.userLastName}</div>
          </div>
          <div className={ this.classes.userLogo } style={{ backgroundImage: this.state.logoURL ? 'url(' + this.state.logoURL + ')' : '' }} />
        </div>
      : null }
    </div>
  }

  get menuSmall() {
    const hasUser = this.props.user;

    return <div className={ this.classes.menuSmall }>
      <div className={ this.classes.itemsBox }>
        { hasUser ?
          <div className={ this.classes.logoutItemOutside }>
            <Button type="normalAccent" onClick={ this.logout } style={{
              width: '120px'
            }}>
              Log Out
              <div className={ this.classes.logOutIcon } data-icon="header:log-out" />
            </Button>
          </div>
          : null }
        <div className={ this.classes.dropmenuButton }
             data-selected={ this.state.dropmenuVisible ? true : null }
             role="button"
             onClick={ this.showDropmenu }
        >
          <div className={ this.classes.dropmenuIcon } />
          <Popup className={ this.classes.dropmenuPopup }
                 hidden={ !this.state.dropmenuVisible } onClose={() => {
            this.setState({
              dropmenuVisible: false
            });
          }}
          >
            { hasUser ?
              <div className={ this.classes.userBoxInside }>
                <div className={ this.classes.userLogo } style={{ backgroundImage: this.state.logoURL ? 'url(' + this.state.logoURL + ')' : '' }} />
                <div className={ this.classes.logged }>
                  {this.state.userCompany}
                  <div className={ this.classes.user }>{this.state.userFirstName} {this.state.userLastName}</div>
                </div>
              </div>
            : null }
            { hasUser ?
              <a className={ this.classes.linkText } href="#welcome">
                Settings
              </a>
              : null }
            <a className={ this.classes.linkText } href="http://infinigrow.com/company/" target="_blank">About</a>
            {/** <a className={ this.classes.linkText } href="#">Chat</a> **/}
            <a className={ this.classes.linkText } href="http://infinigrow.com/contact/" target="_blank">Contact</a>
            <a className={ this.classes.linkText } href="mailto:support@infinigrow.com?&subject=Support Request" target="_blank">Support</a>
            { hasUser ?
              <div className={ this.classes.logoutItemInside }>
                <Button type="normalAccent" onClick={ this.logout } style={{
                  width: '120px'
                }}>
                  Log Out
                  <div className={ this.classes.logOutIcon } data-icon="header:log-out" />
                </Button>
              </div>
              : null }
          </Popup>
        </div>
      </div>

       {hasUser ?
        <div className={ this.classes.userBoxOutside }>
          <div className={ this.classes.userLogo } style={{ backgroundImage: this.state.logoURL ? 'url(' + this.state.logoURL + ')' : '' }} />
          <div className={ this.classes.logged }>
            {this.state.userCompany}
            <div className={ this.classes.user }>{this.state.userFirstName} {this.state.userLastName}</div>
          </div>
        </div>
      :null}
    </div>
  }

  logout() {
    serverCommunication.serverRequest('GET', 'logout')
      .then(function(data){
        history.push('/');
      });
  }

  componentDidMount(){
    if (!this.state.isLoaded) {
      let self = this;
      serverCommunication.serverRequest('GET', 'useraccount')
        .then((response) => {
          response.json()
            .then(function (data) {
              if (data) {
                self.setState({
                  userFirstName: data.firstName,
                  userLastName: data.lastName,
                  userCompany: data.companyName,
                  logoURL: data.companyWebsite ? "https://logo.clearbit.com/" + data.companyWebsite : '',
                  isLoaded: true
                });
              }
            })
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }

  render() {
    return <div className={ this.classes.box }>
      <div className={ this.classes.logoMenu } onClick={ this.openSidebar } />
      <div className={ this.classes.logo }></div>
      { this.menuBig }
      { this.menuSmall }
    </div>
  }
}