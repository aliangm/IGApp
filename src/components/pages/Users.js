import React from 'react';
import Component from 'components/Component';
import style from 'styles/users/users.css';
import ReactCountryFlag from 'react-country-flag';
import {getNickname} from 'components/utils/indicators';
import icons from 'styles/icons/plan.css';
import uniq from 'lodash/uniq';
import UsersPopup from 'components/pages/users/UsersPopup';
import Toggle from 'components/controls/Toggle';
import Table from 'components/controls/Table';

const GROUP_BY = {
  USERS: 0,
  ACCOUNT: 1
};

export default class Users extends Component {

  style = style;
  styles = [icons];

  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      groupBy: GROUP_BY.USERS
    };
  }

  toggleUsersAccount = (newValue) => {
    this.setState({
      groupBy: newValue
    });
  };

  timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval + ' years ago';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + ' months ago';
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + ' days ago';
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + ' hours ago';
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + ' minutes ago';
    }
    return Math.floor(seconds) + ' seconds ago';
  }

  mode(array) {
    if (array.length === 0)
      return null;
    const modeMap = {};
    let maxEl = array[0], maxCount = 1;
    for (let i = 0; i < array.length; i++) {
      const el = array[i];
      if (modeMap[el] == null)
        modeMap[el] = 1;
      else
        modeMap[el]++;
      if (modeMap[el] > maxCount) {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    return maxEl;
  }

  showPopup(user) {
    this.setState({showPopup: true, selectedUser: user});
  }

  render() {

    const {attribution: {usersByEmail, usersByAccount}} = this.props;

    const headRow = [
      'User',
      'Channels',
      'Stage',
      '# of sessions',
      'Country',
      'First touch',
      'Last touch',
      'Device'
    ];

    const stagesOrder = {
      blogSubscribers: 0,
      MCL: 1,
      MQL: 2,
      SQL: 3,
      opps: 4,
      users: 5
    };

    const usersData = this.state.groupBy === GROUP_BY.USERS ? usersByEmail : usersByAccount;

    const rows = usersData
      .sort((user1, user2) => {
        const lastTouchPoint1 = new Date(user1.sessions[user1.sessions.length - 1].endTime);
        const lastTouchPoint2 = new Date(user2.sessions[user2.sessions.length - 1].endTime);
        return lastTouchPoint2 - lastTouchPoint1;
      })
      .map((user, index) => {
        const firstTouchPoint = new Date(user.sessions[0].startTime);
        const lastTouchPoint = new Date(user.sessions[user.sessions.length - 1].endTime);
        const timeSinceFirst = this.timeSince(firstTouchPoint);
        const timeSinceLast = this.timeSince(lastTouchPoint);
        const uniqChannels = uniq(user.sessions.map(item => item.channel));
        const emails = uniq(user.sessions.map(item => item.email));
        const domain = this.mode(user.sessions.map(item => {
          const domain = item.email && item.email.match('(?<=@).+');
          return domain && domain[0];
        }));
        const devices = uniq(user.sessions.map(item => item.device).filter(item => !!item));
        const countries = uniq(user.sessions.map(item => item.country).filter(item => !!item));
        const displayName = user.accountName ? user.accountName : domain && domain.match('[^.]+(?=\\.)') && domain.match('[^.]+(?=\\.)')[0];
        const domainIcon = 'url(https://logo.clearbit.com/' + domain + ')';
        const maxFunnelStageIndex = Math.max(... Object.keys(user.funnelStages).map(stage => stagesOrder[stage]));
        const funnelStage = Object.keys(stagesOrder)[maxFunnelStageIndex];
        return {
          items: [
            <div className={this.classes.container}>
              <div className={this.classes.icon} style={{
                backgroundImage: domainIcon,
                width: '25px',
                height: '25px'
              }}/>
              <div className={this.classes.account}>
                {displayName}
                <div className={this.classes.email}>{emails.length <= 1 ? emails && emails[0] : 'multiple users'}</div>
              </div>
            </div>,
            <div className={this.classes.container}>
              {uniqChannels.map(item => <div key={item} className={this.classes.icon} data-icon={'plan:' + item}/>)}
            </div>,
            getNickname(funnelStage, true),
            user.sessions.length,
            <div className={this.classes.container}>
              {countries && countries.length > 0 && countries.map(item => <div key={item}
                                                                               className={this.classes.container}>
                <ReactCountryFlag code={item} svg/>
                <div style={{marginLeft: '5px'}}>{item}</div>
              </div>)}
            </div>,
            timeSinceFirst,
            timeSinceLast,
            <div className={this.classes.container}>
              {devices && devices.length > 0 && devices.map(item => <div key={item} className={this.classes.icon}
                                                                         data-icon={'device:' + item}/>)}
            </div>
          ], props: {
            style: {cursor: 'pointer'},
            onClick: this.showPopup.bind(this, {
              ...user,
              devices,
              countries,
              timeSinceFirst,
              timeSinceLast,
              emails,
              displayName,
              domainIcon
            })
          }
        };
      });

    return <div>
      <div className={this.classes.toggle}>
        <Toggle
          options={[{
            text: 'People',
            value: GROUP_BY.USERS
          },
            {
              text: 'Accounts',
              value: GROUP_BY.ACCOUNT
            }
          ]}
          selectedValue={this.state.groupBy}
          onClick={(value) => {
            this.toggleUsersAccount(value);
          }}/>
      </div>
      <div className={this.classes.inner}>
        <Table headRowData={{items: headRow}}
               rowsData={rows}/>
      </div>
      <div hidden={!this.state.showPopup}>
        <UsersPopup user={this.state.selectedUser} close={() => {
          this.setState({showPopup: false, selectedUser: {}});
        }}/>
      </div>
    </div>;
  }
}