import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/users/users-popup.css';
import ReactCountryFlag from 'react-country-flag';
import { getNickname as getChannelNickname } from 'components/utils/channels';
import { getNickname as getIndicatorNickname } from 'components/utils/indicators';
import Popup from 'components/Popup';

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

  stringifyDate(dateString) {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear() + ' at ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
  }

  render() {
    const {user, close} = this.props;
    const firstTouchPoint = user.journey && user.journey[0] && new Date(user.journey[0].startTime);
    const lastTouchPoint = user.journey && user.journey[user.journey.length-1] && new Date(user.journey[user.journey.length-1].endTime);
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
                </div>
              </div>
            </div>)
          }
        });
      }
      if (item.funnelStage && item.funnelStage.length > 1) {
        events.push(<div className={this.classes.eventLine} key={events.length}>
          <div className={this.classes.iconCircleSmall} data-icon="event:status"/>
          <div className={this.classes.eventText}>
            Status change - <b>{getIndicatorNickname(item.funnelStage[0]) + " > " + getIndicatorNickname(item.funnelStage[item.funnelStage.length - 1])}</b>
            <div className={this.classes.eventTime}>
              {this.stringifyDate(item.startTime)}
            </div>
          </div>
        </div>);
      }
    });
    return <div>
      <Page popup={true} width="934px" contentClassName={ this.classes.content } innerClassName={ this.classes.inner }>
        <div style={{ position: 'relative' }}>
          <div className={ this.classes.topRight }>
            <div className={ this.classes.close } onClick={ close }/>
          </div>
        </div>
        <div className={this.classes.container}>
          <div className={this.classes.icon} style={{ backgroundImage: user.user ? 'url(https://logo.clearbit.com/' + user.user.match('(?<=@).+') + ')' : 'none' }}/>
          <div className={this.classes.headerBigText}>
            { user.accountName ? user.accountName : user.user && user.user.match('(?<=@)[^.]+(?=\\.)') }
            <div className={this.classes.headerSmallText}>{user.user}</div>
          </div>
          <div className={this.classes.headerBigText}>
            Stage Name
            <div className={this.classes.headerSmallText}>{user.funnelStage && getIndicatorNickname(user.funnelStage)}</div>
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
      </Page>
    </div>
  }

}