import React from 'react';
import Component from 'components/Component';
import style from 'styles/header.css';
import Button from 'components/controls/Button';
import Popup from 'components/Popup';
import global from 'global';
import history from 'history';
import RegionPopup from 'components/RegionPopup';
import Notifications from 'components/pages/header/Notifications';

export default class Header extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      dropmenuVisible: false,
      dropmenuVisibleBig: false,
      regionsVisible: false,
      createNewVisible: false,
      regionsVisibleBig: false,
      regions: []
    };

    this.logout = this.logout.bind(this);
  }

  static defaultProps = {
    user: true,
    regions: [],
    teamMembers: [],
    userAccount: {},
    notifications: []
  };

  readNotifications() {
    let notifications = this.props.notifications.slice();
    notifications
      .filter(notification => notification.UID === this.props.auth.getProfile().user_id)
      .map(notification => {
        notification.isRead = true;
        return notification
      });
    this.props.updateUserMonthPlan({notifications: notifications}, this.state.region, this.state.planDate);
  }

  openSidebar = () => {
    global.dispatchEvent('sidebar:open');
  };

  showDropmenu = () => {
    this.setState({
      dropmenuVisible: true
    });
  };

  toggleDropmenuBig = () => {
    this.setState({
      dropmenuVisibleBig: !this.state.dropmenuVisibleBig
    });
  };

  toggleRegionsBig = () => {
    this.setState({
      regionsVisibleBig: !this.state.regionsVisibleBig
    });
  };

  toggleRegions = () => {
    this.setState({
      regionsVisible: !this.state.regionsVisible
    });
  };

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

    const userNotifications = this.props.notifications.filter(notification => notification.UID === this.props.auth.getProfile().user_id);
    const isUnreadNotifications = userNotifications.some(notification => notification.isRead === false);
    return <div className={ this.classes.menuBig }>
      <div className={ this.classes.itemsBox }>
        { hasUser ?
          <div className={ this.classes.dropmenuButton }
               data-selected={ this.state.notificationsVisible ? true : null }
               role="button"
               onClick={ () => {
                 this.setState({notificationsVisible: !this.state.notificationsVisible});
                 setTimeout(this.readNotifications.bind(this), 20000);
               }}
          >
            <div className={ this.classes.notificationsIcon } data-active={ isUnreadNotifications ? true : null }>
              <Popup className={ this.classes.dropmenuPopup }
                     style={{ padding: '0' }}
                     hidden={ !this.state.notificationsVisible } onClose={() => {
                this.setState({
                  notificationsVisible: false
                });
              }}
              >
                <Notifications {... this.props} userNotifications={userNotifications}/>
              </Popup>
            </div>
          </div>
          : null }
        { hasUser ?
          <div className={ this.classes.dropmenuButton }
               data-selected={ this.state.regionsVisibleBig ? true : null }
               role="button"
               onClick={ this.toggleRegionsBig }
          >
            <div className={ this.classes.locationIcon } >
              <Popup className={ this.classes.dropmenuPopup }
                     hidden={ !this.state.regionsVisibleBig } ref="regionsPopup" onClose={() => {
                this.setState({
                  regionsVisibleBig: false
                });
              }}>
                { regions }
                <a className={ this.classes.linkText } key={ '-1' } onClick={()=>{ this.setState({createNewVisible: true}) }} style={{ fontWeight: 'bold', color: '#1165A3' }}>+ Add new</a>
              </Popup>
            </div>
          </div>
          : null }
        { hasUser ?
          <a className={ this.classes.link } href="#welcome">
            <div className={ this.classes.settings } data-icon="header:settings" />
          </a>
          : null }
        { hasUser ?
          <div className={this.classes.item}>
            <div className={ this.classes.userLogo } style={{ backgroundImage: this.props.logoURL ? 'url(' + this.props.logoURL + ')' : '' }} />
          </div>
          : null }
        <div className={ this.classes.dropmenuButton }
             data-selected={ this.state.dropmenuVisibleBig ? true : null }
             role="button"
             onClick={ this.toggleDropmenuBig }
        >
          <div className={ this.classes.dropmenu } >
            <div className={ this.classes.userLogo } style={{ backgroundImage: user.pictureUrl ? 'url(' + user.pictureUrl + ')' : 'none' }} />
            <div className={ this.classes.user }>
              { user.name }
            </div>
            <div className={ this.classes.triangle }/>
            <Popup className={ this.classes.dropmenuPopup }
                   hidden={ !this.state.dropmenuVisibleBig } onClose={() => {
              this.setState({
                dropmenuVisibleBig: false
              });
            }}
            >
              <a className={ this.classes.linkText } href="http://infinigrow.com/company/" target="_blank">About</a>
              {/** <a className={ this.classes.linkText } href="#">Chat</a> **/}
              <a className={ this.classes.linkText } href="http://infinigrow.com/contact/" target="_blank">Contact</a>
              <a className={ this.classes.linkText } href="mailto:support@infinigrow.com?&subject=Support Request" target="_blank">Support</a>
              <div className={ this.classes.linkText } onClick={ this.logout } style={{ color: '#2571AB' }}>
                Logout
                <div className={ this.classes.logOutIcon } data-icon="header:log-out" />
              </div>
            </Popup>
          </div>
        </div>
      </div>
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
    this.props.updateState({unsaved: false}, () => {
      this.props.auth.logout();
      history.push('/');
    });
  }

  changeRegion(region) {
    localStorage.setItem('region', region);
    this.props.getUserMonthPlan(region);
  }

  render() {
    return <div className={ this.classes.box }>
      <div className={ this.classes.logoMenu } onClick={ this.openSidebar } />
      <div className={ this.classes.logo } onClick={ () => { history.push('/plan') } }/>
      { this.menuBig }
      { this.menuSmall }
      <RegionPopup hidden={ !this.state.createNewVisible } close={()=>{ this.setState({createNewVisible: false}) }} createUserMonthPlan={ this.props.createUserMonthPlan }/>
    </div>
  }
}