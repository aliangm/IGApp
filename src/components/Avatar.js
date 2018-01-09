import React from 'react';
import Component from 'components/Component';
import style from 'styles/avatar.css';

export default class Avatar extends Component {

  style = style;

  getInitials() {
    const member = this.props.member;
    const [firstName = '', lastName = ''] = member.name.split(' ');
    return firstName[0] + lastName[0];
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
    const member = this.props.member;
    let className = (member && member.pictureUrl) ? this.classes.picture : this.classes.initials;

    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    return member ?
      member.pictureUrl ?
        <div className={className}
             style={{backgroundImage: 'url(' + member.pictureUrl + ')'}}/>
        :
        <div className={className}
             style={{backgroundColor: "#" + this.intToRGB(this.hashCode(member.name))}}>
          {this.getInitials()}
        </div>
      : null;
  }
}