import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/users/users.css';
import ReactCountryFlag from 'react-country-flag';
import planStyle from 'styles/plan/plan.css';
import { getNickname } from 'components/utils/indicators';
import icons from 'styles/icons/plan.css';
import uniq from 'lodash/uniq';
import UsersPopup from 'components/pages/users/UsersPopup';
import FirstPageVisit from 'components/pages/FirstPageVisit';
import dashboardStyle from "styles/dashboard/dashboard.css";
import { formatDate } from 'components/utils/date';
import Select from 'components/controls/Select';

export default class Users extends Component {

  style = style;
  styles = [planStyle, icons, dashboardStyle];

  constructor(props) {
    super(props);
    this.state = {
      showPopup: false
    }
  }

  timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  showPopup(user) {
    this.setState({showPopup: true, selectedUser: user});
  }

  render() {

    const { attribution, previousData } = this.props;
    const { users } = attribution;
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

    const rows = users.map((user, index) => {
      const firstTouchPoint = new Date(user.journey[0].startTime);
      const lastTouchPoint = new Date(user.journey[user.journey.length-1].endTime);
      const uniqChannels = uniq(user.journey.map(item => item.channel));
      return this.getTableRow(null, [
        <div className={this.classes.container}>
          <div className={this.classes.icon} style={{ backgroundImage: 'url(https://logo.clearbit.com/' + user.user.match('(?<=@).+') + ')', width: '25px', height: '25px' }}/>
          <div className={this.classes.account}>
            { user.accountName ? user.accountName : <div>{user.user.match('(?<=@)[^.]+(?=\\.)')}<div className={this.classes.email}>{user.user}</div></div> }
          </div>
        </div>,
        <div className={this.classes.container}>
          { uniqChannels.map(item => <div key={item} className={this.classes.icon} data-icon={"plan:" + item}/> )}
        </div>,
        getNickname(user.funnelStage[user.funnelStage.length-1]),
        user.journey.length,
        <div className={this.classes.container}>
          { user.countries.map(item => <div key={item.code} className={this.classes.container}><ReactCountryFlag code={item.code} svg/><div style={{ marginLeft: '5px' }}>{item.code}</div></div>) }
        </div>,
        this.timeSince(firstTouchPoint),
        this.timeSince(lastTouchPoint),
        <div className={this.classes.container}>
          { user.devices.map(item => <div key={item} className={this.classes.icon} data-icon={"device:" + item}/>) }
        </div>
      ], {
        key: index,
        className: this.classes.tableRow,
        onClick: this.showPopup.bind(this, user)
      })
    });

    const months = previousData.map((item, index) => {
      return {value: index, label: formatDate(item.planDate)}
    });

    return <div>
      <Page contentClassName={ planStyle.locals.content } innerClassName={ planStyle.locals.pageInner } width="100%">
        <div className={ planStyle.locals.head }>
          <div className={ planStyle.locals.headTitle }>Audiences</div>
        </div>
        { this.props.userAccount.pages && this.props.userAccount.pages.users ?
          <div className={planStyle.locals.wrap}>
            <div className={dashboardStyle.locals.upperPanel}>
              <div className={dashboardStyle.locals.historyConfigText}>
                Date range:
              </div>
              <Select
                selected={this.props.months === undefined ? previousData.length - 1 : this.props.months}
                select={{
                  options: months
                }}
                onChange={(e) => {
                   this.props.calculateAttributionData(months.length - e.value - 1)
                }}
                style={{ width: '75px', margin: '0 8px' }}
              />
              <div className={dashboardStyle.locals.historyConfigText} style={{ fontWeight: 'bold' }}>
                - {formatDate(this.props.planDate)}
              </div>
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
          </div>
          :
          <FirstPageVisit
            title="Analyze your audiences’ full journeys, one by one"
            content="Weather if it’s for ABM, or just to understand individuals’ journeys to see behind the numbers, sometimes you want to analyze users’ journeys, one by one."
            action="Let’s dig in >"
            icon="step:users"
            onClick={() => {
              this.props.updateUserAccount({'pages.users': true})
            }}
          />
        }
      </Page>
      <div hidden={!this.state.showPopup}>
        <UsersPopup user={this.state.selectedUser} close={ () => { this.setState({showPopup: false, selectedUser: {}}) } }/>
      </div>
    </div>
  }

  getTableRow(title, items, props) {
    return <tr {... props}>
      { title != null ?
        <td className={ this.classes.titleCell }>{ this.getCellItem(title) }</td>
        : null }
      {
        items.map((item, i) => {
          return <td className={ this.classes.valueCell } key={ i }>{
            this.getCellItem(item)
          }</td>
        })
      }
    </tr>
  }

  getCellItem(item) {
    let elem;

    if (typeof item !== 'object' ) {
      elem = <div className={ this.classes.cellItem }>{ item }</div>
    } else {
      elem = item;
    }

    return elem;
  }
}