import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/users/users-popup.css';
import ReactCountryFlag from 'react-country-flag';
import { getNickname as getChannelNickname } from 'components/utils/channels';
import { getNickname as getIndicatorNickname } from 'components/utils/indicators';
import Popup from 'components/Popup';
import uniq from 'lodash/uniq';
import ReactDOM from 'react-dom';

export default class UsersPopup extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      showOtherPagesPopup: false
    };
  }

  static defaultProps = {
    user: {
      user: '',
      accountName: '',
      journey: [],
      countries: []
    }
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.onOutsideClick, true);
    document.addEventListener('touchstart', this.onOutsideClick, true);
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onOutsideClick, true);
    document.removeEventListener('touchstart', this.onOutsideClick, true);
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  onOutsideClick = (e) => {
    const elem = ReactDOM.findDOMNode(this.refs.popup);

    if (elem !== e.target && !elem.contains(e.target)) {
      this.props.close();
    }
  };

  handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      this.props.close();
    }
  };

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

  mode(array) {
    if(array.length === 0)
      return null;
    const modeMap = {};
    let maxEl = array[0], maxCount = 1;
    for(let i = 0; i < array.length; i++)
    {
      const el = array[i];
      if(modeMap[el] == null)
        modeMap[el] = 1;
      else
        modeMap[el]++;
      if(modeMap[el] > maxCount)
      {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    return maxEl;
  }

  stringifyDate(dateString) {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear() + ' at ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
  }

  render() {
    const {user, close} = this.props;
    const firstTouchPoint = user.journey && user.journey[0] && new Date(user.journey[0].startTime);
    const lastTouchPoint = user.journey && user.journey[user.journey.length-1] && new Date(user.journey[user.journey.length-1].endTime);
    const emails = user.journey && uniq(user.journey.map(item => item.email));
    const stagesOrder = {
      MCL: 0,
      MQL: 1,
      SQL: 2,
      opps: 3,
      users: 4
    };
    const funnelStages = {};
    emails && emails.forEach(email => {
      const userFunnelStages = [];
      user.journey
        .filter(item => item.email === email)
        .forEach(item => {
          item.funnelStage.forEach(item => {
            if (!userFunnelStages.includes(stagesOrder[item])) {
              userFunnelStages.push(stagesOrder[item]);
            }
          })
        });
      funnelStages[email] = Object.keys(stagesOrder)[Math.max(... userFunnelStages)];
    });

    const domain = user.journey && this.mode(user.journey.map(item => {
      const domain = item.email && item.email.match('(?<=@).+');
      return domain && domain[0];
    }));
    const channels = user.journey && user.journey.map((item, index) => <div key={index} className={this.classes.channelBox}>
      <div className={this.classes.icon} data-icon={"plan:" + item.channel} style={{ width: '40px', height: '40px', margin: '0 5px' }}/>
      <div>{item.channel === 'direct' ? 'Direct' : getChannelNickname(item.channel)}</div>
    </div>);
    const events = [];
    user.journey && user.journey.forEach(item => {
      if (item.channel !== 'direct') {
        events.push(<div className={this.classes.eventLine} key={events.length}>
          <div className={this.classes.iconCircle} data-icon={"plan:" + item.channel}/>
          <div className={this.classes.eventText}>
            Visited website through <b>{getChannelNickname(item.channel)}</b>
            <div className={this.classes.eventTime}>
              {this.stringifyDate(item.startTime)}
              {emails && emails.length > 1 ? ", " + item.email : null}
            </div>
          </div>
        </div>)
      }
      if (item.page && item.page.length > 0) {
        const otherPages = item.page.slice(1);
        events.push(<div className={this.classes.eventLine} key={events.length}>
          <div className={this.classes.iconCircleSmall} data-icon="event:page"/>
          <div className={this.classes.eventText}>
            {item.page[0] + " "}
            { otherPages && otherPages.length > 0 ?
              <span>
               and other
                <span className={this.classes.otherPages} onClick={()=>{ this.setState({showOtherPagesPopup: true}) }}>
                  {" " + otherPages.length} page/s
                </span>
                <span hidden={!this.state.showOtherPagesPopup} style={{ position: 'relative' }}>
                  <Popup className={this.classes.otherPagesPopup} onClose={() => { this.setState({showOtherPagesPopup: false}) }}>
                    {otherPages.map(item => <div>{item}</div>)}
                  </Popup>
                </span>
              </span>
              : null }
            <div className={this.classes.eventTime}>
              {this.stringifyDate(item.startTime)}
              {emails.length > 1 ? ", " + item.email : null}
            </div>
          </div>
        </div>);
      }
      if (item.event && item.event.length > 0) {
        item.event.forEach(event => {
          if (event) {
            events.push(<div className={this.classes.eventLine} key={events.length}>
              <div className={this.classes.iconCircleSmall} data-icon="event:conversion"/>
              <div className={this.classes.eventText}>
                Conversion Event - <b>{event}</b>
                <div className={this.classes.eventTime}>
                  {this.stringifyDate(item.startTime)}
                  {emails.length > 1 ? ", " + item.email : null}
                </div>
              </div>
            </div>)
          }
        });
      }
      if (item.funnelStage && item.funnelStage.length > 1) {
        item.funnelStage.sort((a, b) => stagesOrder[a] - stagesOrder[b]);
        events.push(<div className={this.classes.eventLine} key={events.length}>
          <div className={this.classes.iconCircleSmall} data-icon="event:status"/>
          <div className={this.classes.eventText}>
            Status change - <b>{getIndicatorNickname(item.funnelStage[0], true) + " > " + getIndicatorNickname(item.funnelStage[item.funnelStage.length - 1], true)}</b>
            <div className={this.classes.eventTime}>
              {this.stringifyDate(item.startTime)}
              {emails.length > 1 ? ", " + item.email : null}
            </div>
          </div>
        </div>);
      }
    });
    return <div>
      <Page popup={true} width="934px" contentClassName={ this.classes.content } innerClassName={ this.classes.inner }>
        <span ref="popup">
          <div style={{ position: 'relative' }}>
            <div className={ this.classes.topRight }>
              <div className={ this.classes.close } onClick={ close }/>
            </div>
          </div>
          <div className={this.classes.container}>
            <div className={this.classes.icon} style={{ backgroundImage: user.user ? 'url(https://logo.clearbit.com/' + user.user.match('(?<=@).+') + ')' : 'none' }}/>
            <div className={this.classes.headerBigText}>
              {user.accountName ? user.accountName : domain && domain.match('[^.]+(?=\\.)') && domain.match('[^.]+(?=\\.)')[0]}
              <div className={this.classes.headerSmallText}>{emails && emails.length === 1 ? emails[0] :
                <span>
                <span className={this.classes.otherPages} onClick={()=>{ this.setState({showEmailsPopup: true}) }}>
                  Users
                </span>
                <span hidden={!this.state.showEmailsPopup} style={{ position: 'relative' }}>
                  <Popup className={this.classes.otherPagesPopup} onClose={() => { this.setState({showEmailsPopup: false}) }}>
                    {emails && emails.map((item, index) => <div key={index}>{item} ({getIndicatorNickname(funnelStages[item], true)})</div>)}
                  </Popup>
                </span>
              </span>
              }</div>
            </div>
            <div className={this.classes.headerBigText}>
              Stage
              <div className={this.classes.headerSmallText}>{user.funnelStage && user.funnelStage.map(item => getIndicatorNickname(item, true)).join(', ')}</div>
            </div>
            <div className={this.classes.headerBigText}>
              First Touch
              <div className={this.classes.headerSmallText}>{this.timeSince(firstTouchPoint)}</div>
            </div>
            <div className={this.classes.headerBigText}>
              Last Touch
              <div className={this.classes.headerSmallText}>{this.timeSince(lastTouchPoint)}</div>
            </div>
            <div className={this.classes.headerBigText}>
              Country
              { user.countries && user.countries.map(item => <div key={item.code} className={this.classes.container} style={{ height: '20px', width: '45px', marginTop: '5px' }}><ReactCountryFlag code={item.code} svg/><div className={this.classes.headerSmallText} style={{ marginLeft: '5px' }}>{item.code}</div></div>) }
            </div>
            <div className={this.classes.headerBigText}>
              Device
              { user.devices && user.devices.map(item => <div key={item} className={this.classes.device} data-icon={"device:" + item}/>) }
            </div>
          </div>
          <div className={this.classes.channels}>
            <div className={this.classes.channelsHeader}>
              Marketing Channels
            </div>
            <div>
              {channels}
            </div>
          </div>
          <div className={this.classes.userJourney}>
            <div className={this.classes.line}/>
            <div className={this.classes.events}>
              { events.reverse() }
            </div>
          </div>
        </span>
      </Page>
    </div>
  }

}