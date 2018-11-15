import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/users/users.css';
import ReactCountryFlag from 'react-country-flag';
import planStyle from 'styles/plan/plan.css';
import {getNickname} from 'components/utils/indicators';
import icons from 'styles/icons/plan.css';
import uniq from 'lodash/uniq';
import UsersPopup from 'components/pages/users/UsersPopup';
import dashboardStyle from 'styles/dashboard/dashboard.css';
import {formatDate} from 'components/utils/date';
import Select from 'components/controls/Select';
import Toggle from 'components/controls/Toggle';

const GROUP_BY = {
  USERS: 0,
  ACCOUNT: 1
};

export default class Users extends Component {

  style = style;
  styles = [planStyle, icons, dashboardStyle];

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

    const {attribution} = this.props;

    const headRow = this.getTableRow(null, [
      'User',
      'Channels',
      'Stage',
      '# of sessions',
      'Country',
      'First touch',
      'Last touch',
      'Device'
    ], {
      className: this.classes.headRow
    });

    const stagesOrder = {
      blogSubscribers: 0,
      MCL: 1,
      MQL: 2,
      SQL: 3,
      opps: 4,
      users: 5
    };

    const usersData = [];
    const usersCopy = JSON.parse(JSON.stringify(attribution.users));
    usersCopy.forEach(user => {
      const funnelStage = Object.keys(stagesOrder)[Math.max(... user.funnelStage.map(item => stagesOrder[item]))];
      user.funnelStage = [funnelStage];
      if (this.state.groupBy == GROUP_BY.USERS) {
        if (user.accountName !== null) {
          const accountUsers = {};
          user.journey.forEach(item => {
            if (!accountUsers[item.email]) {
              accountUsers[item.email] = user;
              accountUsers[item.email].journey = [];
            }
            accountUsers[item.email].journey.push(item);
          });
          Object.keys(accountUsers).forEach(accountUser => {
            usersData.push(accountUsers[accountUser]);
          });
        }
        else {
          const alreadyExists = usersData.findIndex(item => item.user === user.user);
          if (alreadyExists !== -1) {
            const journey = JSON.parse(JSON.stringify(usersData[alreadyExists].journey));
            usersData[alreadyExists].journey = [];
            usersData[alreadyExists].journey = journey.concat(user.journey);
            if (!usersData[alreadyExists].funnelStage.includes(user.funnelStage[0])) {
              usersData[alreadyExists].funnelStage.push(user.funnelStage[0]);
            }
          }
          else {
            usersData.push(user);
          }
        }
      }
      else {
        if (user.accountName === null) {
          const domain = this.mode(user.journey.map(item => {
            const domain = item.email && item.email.match('(?<=@).+');
            return domain && domain[0];
          }));
          const alreadyExists = usersData.findIndex(user => this.mode(user.journey.map(item => item.email && item.email.match('(?<=@).+')[0])) === domain);
          if (alreadyExists !== -1) {
            const journey = JSON.parse(JSON.stringify(usersData[alreadyExists].journey));
            usersData[alreadyExists].journey = [];
            usersData[alreadyExists].journey = journey.concat(user.journey);
            usersData[alreadyExists].journey.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
            if (!usersData[alreadyExists].funnelStage.includes(user.funnelStage[0])) {
              usersData[alreadyExists].funnelStage.push(user.funnelStage[0]);
            }
          }
          else {
            usersData.push(user);
          }
        }
        else {
          usersData.push(user);
        }
      }
    });
    const rows = usersData
      .sort((user1, user2) => {
        const lastTouchPoint1 = new Date(user1.journey[user1.journey.length - 1].endTime);
        const lastTouchPoint2 = new Date(user2.journey[user2.journey.length - 1].endTime);
        return lastTouchPoint2 - lastTouchPoint1;
      })
      .map((user, index) => {
        const firstTouchPoint = new Date(user.journey[0].startTime);
        const lastTouchPoint = new Date(user.journey[user.journey.length - 1].endTime);
        const uniqChannels = uniq(user.journey.map(item => item.channel));
        const emails = uniq(user.journey.map(item => item.email));
        const domain = this.mode(user.journey.map(item => {
          const domain = item.email && item.email.match('(?<=@).+');
          return domain && domain[0];
        }));
        const devices = uniq(user.journey.reduce((mergedItem, item) => [...mergedItem, ...item.devices], []));
        const countries = uniq(user.journey.reduce((mergedItem, item) => [...mergedItem, ...item.countries], []));
        return this.getTableRow(null, [
          <div className={this.classes.container}>
            <div className={this.classes.icon} style={{
              backgroundImage: 'url(https://logo.clearbit.com/' + domain + ')',
              width: '25px',
              height: '25px'
            }}/>
            <div className={this.classes.account}>
              {user.accountName ? user.accountName : domain && domain.match('[^.]+(?=\\.)') && domain.match('[^.]+(?=\\.)')[0]}
              <div className={this.classes.email}>{emails.length <= 1 ? emails && emails[0] : 'multiple users'}</div>
            </div>
          </div>,
          <div className={this.classes.container}>
            {uniqChannels.map(item => <div key={item} className={this.classes.icon} data-icon={'plan:' + item}/>)}
          </div>,
          getNickname(user.funnelStage[user.funnelStage.length - 1], true),
          user.journey.length,
          <div className={this.classes.container}>
            {countries && countries.length > 0 && countries.map(item => <div key={item} className={this.classes.container}>
              <ReactCountryFlag code={item} svg/>
              <div style={{marginLeft: '5px'}}>{item}</div>
            </div>)}
          </div>,
          this.timeSince(firstTouchPoint),
          this.timeSince(lastTouchPoint),
          <div className={this.classes.container}>
            {devices && devices.length > 0 && devices.map(item => <div key={item} className={this.classes.icon}
                                                 data-icon={'device:' + item}/>)}
          </div>
        ], {
          key: index,
          className: this.classes.tableRow,
          onClick: this.showPopup.bind(this, {...user, devices: devices, countries: countries})
        });
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
        <table className={this.classes.table}>
          <thead>
          {headRow}
          </thead>
          <tbody>
          {rows}
          </tbody>
        </table>
      </div>
      <div hidden={!this.state.showPopup}>
        <UsersPopup user={this.state.selectedUser} close={() => {
          this.setState({showPopup: false, selectedUser: {}});
        }}/>
      </div>
    </div>;
  }

  getTableRow(title, items, props) {
    return <tr {...props}>
      {title != null ?
        <td className={this.classes.titleCell}>{this.getCellItem(title)}</td>
        : null}
      {
        items.map((item, i) => {
          return <td className={this.classes.valueCell} key={i}>{
            this.getCellItem(item)
          }</td>;
        })
      }
    </tr>;
  }

  getCellItem(item) {
    let elem;

    if (typeof item !== 'object') {
      elem = <div className={this.classes.cellItem}>{item}</div>;
    } else {
      elem = item;
    }

    return elem;
  }
}