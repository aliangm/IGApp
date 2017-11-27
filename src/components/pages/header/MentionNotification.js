import React from 'react';
import Component from 'components/Component';
import style from 'styles/header/notifications.css';
import mentionStyle from 'styles/header/mention-notification.css';
import history from 'history';

export default class MentionNotification extends Component {

  style = style;
  styles = [mentionStyle];

  getInitials(UID) {
    let initials;
    this.props.teamMembers.some(member => {
      if (member.userId === UID) {
        const nameArray = member.name.split(' ');
        initials = (nameArray[0] ? nameArray[0][0] : '') + (nameArray[1] ? nameArray[1][0] : '');
      }
    });
    if (initials) {
      return initials;
    }
    else return this.props.firstName[0] + this.props.lastName[0];
  }

  hashCode(str) { // java String#hashCode
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  intToRGB(i){
    const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }

  render() {
    let tagger = this.props.userFirstName + ' ' + this.props.userLastName;
    let taggerPicture = this.props.userAccount.pictureUrl;
    const user = this.props.teamMembers.find(item => item.userId === this.props.notification.tagger);
    if (user) {
      tagger = user.name;
      taggerPicture = user.pictureUrl;
    }
    return <div className={ this.classes.inner } data-unread={this.props.isRead ? null : true} onClick={ () => { history.push('/campaigns') } }>
      {
        taggerPicture ?
          <div className={this.classes.picture} style={{backgroundImage: 'url(' + taggerPicture + ')'}}/>
          :
          <div className={this.classes.initials}
               style={{backgroundColor: "#" + this.intToRGB(this.hashCode(tagger))}}>
            {this.getInitials(this.props.notification.tagger)}
          </div>
      }
      <div className={ this.classes.textWrap }>
        <div className={ mentionStyle.locals.tagger }>
          { tagger }
        </div>
        <div className={ mentionStyle.locals.text }>
          mentioned you on the campaign
        </div>
        <div className={ mentionStyle.locals.campaign }>
          { this.props.notification.campaignName }.
        </div>
        <div className={ this.classes.time }>
          {this.props.timeSince}
        </div>
      </div>
    </div>
  }
}