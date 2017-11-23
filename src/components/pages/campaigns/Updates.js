import React from 'react';
import Component from 'components/Component';

import Comment from 'components/pages/campaigns/Comment';
import AuthService from 'components/utils/AuthService';
import CommentTextArea from 'components/pages/campaigns/CommentTextArea';

import style from 'styles/campaigns/updates.css';

export default class Updates extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      ... props,
      comment: ''
    };
  };

  componentDidMount() {
    const lock = new AuthService();
    this.setState({UID: lock.getProfile().user_id, adminUID: lock.getProfile().app_metadata.UID});
  }

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

  getName(UID) {
    let name;
    this.props.teamMembers.some(member => {
      if (member.userId == UID) {
        name = member.name;
      }
    });
    if (name){
      return name;
    }
    else return this.props.firstName + ' ' + this.props.lastName;
  }

  getMembersNames() {
    let names = this.props.teamMembers.map(member => {return {display: member.name, id: member.userId} });
    names.push({display: this.props.firstName + ' ' + this.props.lastName, id: this.state.adminUID});
    return names
  }

  addComment(comment) {
    if (comment) {
      let update = Object.assign({}, this.props.campaign);
      update.comments.push({user: this.state.UID, comment: comment, time: new Date()});
      this.props.updateState({campaign: update, unsaved: false});
      this.props.updateCampaign(update);
    }
  }

  editComment(comment, index) {
    if (comment) {
      let update = Object.assign({}, this.props.campaign);
      update.comments[index].comment = comment;
      update.comments[index].time = new Date();
      this.props.updateState({campaign: update, unsaved: false});
      this.props.updateCampaign(update);
    }
  }

  deleteComment(index) {
    let update = Object.assign({}, this.props.campaign);
    update.comments.splice(index, 1);
    this.props.updateState({campaign: update, unsaved: false});
    this.props.updateCampaign(update);
  }

  render() {
    const comments = this.props.campaign.comments
      .sort((a, b) => {
        return new Date(b.time) - new Date(a.time)
      })
      .map((comment, index) => {
        const initials = this.getInitials(comment.user);
        const name = this.getName(comment.user);
        return <Comment key={ index } name={ name } comment={ comment.comment } time={ comment.time } initials={ initials } index={ index } editComment={ this.editComment.bind(this) } deleteComment={ this.deleteComment.bind(this,index) }/>
      });
    return <div>
      <CommentTextArea addOrEditComment={ this.addComment.bind(this) } users={this.getMembersNames()}/>
      { comments.length > 0 ?
        <div>
          <div className={ this.classes.line }/>
          {comments}
        </div>
        :
        <div className={ this.classes.noComments }>
          No updates yet...
        </div>
      }
    </div>
  }
}