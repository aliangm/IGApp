import React from 'react';

import Component from 'components/Component';
import style from 'styles/header.css';

import Button from 'components/controls/Button';
import Popup from 'components/Popup';
import global from 'global';
import history from 'history';
import RegionPopup from 'components/RegionPopup';

export default class Header extends Component {
  style = style

  constructor(props) {
    super(props);
    this.state = {
      dropmenuVisible: false,
      regionsVisible: false,
      createNewVisible: false,
      regions: []
    };

    this.logout = this.logout.bind(this);
  }

  static defaultProps = {
    user: true,
    regions: [],
    teamMembers: [],
    userAccount: {}
  };

  openSidebar = () => {
    global.dispatchEvent('sidebar:open');
  }

  showDropmenu = () => {
    this.setState({
      dropmenuVisible: true
    });
  }

  toggleRegions = () => {
    let currentVisible = this.state.regionsVisible;
    this.setState({
      regionsVisible: !currentVisible
    });
  }

  get menuBig() {
    const hasUser = this.props.user;

    const regions = hasUser ?
      this.props.regions.map((region) => {
        return <div className={ this.classes.linkText } key={ region } data-selected={ region == this.props.region ? true : null } onClick={this.changeRegion.bind(this, region)}>{region}</div>
      })
      :null;
    let user = { name: '', pictureUrl: null };
    if (this.props.auth.getProfile().app_metadata && this.props.auth.getProfile().app_metadata.UID ===  this.props.auth.getProfile().user_id) {
        user.name = this.props.userFirstName + ' ' + this.props.userLastName;
        user.pictureUrl = this.props.userAccount.pictureUrl || null;
      }
      else {
        const member = this.props.teamMembers.find(user => user.userId === this.props.auth.getProfile().user_id);
        if (member) {
          user = member;
        }
      }
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
          <div className={ this.classes.dropmenuButton }
               data-selected={ this.state.regionsVisible ? true : null }
               role="button"
               onClick={ this.toggleRegions }
          >
            <div className={ this.classes.locationIcon } />
            <Popup className={ this.classes.dropmenuPopup }
                   hidden={ !this.state.regionsVisible } ref="regionsPopup">
              { regions }
              <a className={ this.classes.linkText } key={ '-1' } onClick={()=>{ this.setState({createNewVisible: true}) }} style={{ fontWeight: 'bold', color: '#1165A3' }}>+ Add new</a>
            </Popup>
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
            {this.props.userCompany}
            <div className={ this.classes.user }>
              { user.name }
            </div>
          </div>
          <div className={ this.classes.userLogo } style={{ backgroundImage: this.props.logoURL ? 'url(' + this.props.logoURL + ')' : '' }} />
          <div className={ this.classes.userLogo } style={{ backgroundImage: 'url(' + user.pictureUrl + ')' }} />
        </div>
        : null }
    </div>
  }

  get menuSmall() {
    const hasUser = this.props.user;
    const regions = hasUser ?
      this.props.regions.map((region) => {
        return <div className={ this.classes.linkText } key={ region } data-selected={ region == this.props.region ? true : null } onClick={this.changeRegion.bind(this, region)}>{region}</div>
      })
      : null;
    let user = { name: '', pictureUrl: null };
    if (this.props.auth.getProfile().app_metadata && this.props.auth.getProfile().app_metadata.UID ===  this.props.auth.getProfile().user_id) {
      user.name = this.props.userFirstName + ' ' + this.props.userLastName;
      user.pictureUrl = this.props.userAccount.pictureUrl || null;
    }
    else {
      const member = this.props.teamMembers.find(user => user.userId === this.props.auth.getProfile().user_id);
      if (member) {
        user = member;
      }
    }
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
        { hasUser ?
          <div className={ this.classes.dropmenuButton }
               data-selected={ this.state.regionsVisible ? true : null }
               role="button"
               onClick={ this.toggleRegions }
          >
            <div className={ this.classes.locationIcon } />
            <Popup className={ this.classes.dropmenuPopup }
                   hidden={ !this.state.regionsVisible } ref="regionsPopup">
              { regions }
              <a className={ this.classes.linkText } key={ '-1' } onClick={()=>{ this.setState({createNewVisible: true}) }} style={{ fontWeight: 'bold', color: '#1165A3' }}>+ Add new</a>
            </Popup>
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
                <div className={ this.classes.userLogo } style={{ backgroundImage: this.props.logoURL ? 'url(' + this.props.logoURL + ')' : '' }} />
                <div className={ this.classes.userLogo } style={{ backgroundImage: 'url(' + user.pictureUrl + ')' }} />
                <div className={ this.classes.logged }>
                  {this.props.userCompany}
                  <div className={ this.classes.user }>
                    { user.name }
                  </div>
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
          <div className={ this.classes.userLogo } style={{ backgroundImage: this.props.logoURL ? 'url(' + this.props.logoURL + ')' : '' }} />
          <div className={ this.classes.userLogo } style={{ backgroundImage: 'url(' + user.pictureUrl + ')' }} />
          <div className={ this.classes.logged }>
            {this.props.userCompany}
            <div className={ this.classes.user }>
              { user.name }
            </div>
          </div>
        </div>
        :null}
    </div>
  }

  logout() {
    this.props.auth.logout();
    history.push('/');
  }

  changeRegion(region) {
    localStorage.setItem('region', region);
    this.props.getUserMonthPlan(region);
  }

  render() {
    return <div className={ this.classes.box }>
      <div className={ this.classes.logoMenu } onClick={ this.openSidebar } />
      <div className={ this.classes.logo }></div>
      { this.menuBig }
      { this.menuSmall }
      <RegionPopup hidden={ !this.state.createNewVisible } close={()=>{ this.setState({createNewVisible: false}) }} createUserMonthPlan={ this.props.createUserMonthPlan }/>
    </div>
  }
}