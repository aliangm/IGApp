import React from 'react';
import Component from 'components/Component';
import Button from 'components/controls/Button';
import Comment from 'components/pages/campaigns/Comment';
import style from 'styles/campaigns/updates.css';
import AuthService from 'components/utils/AuthService';

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
    this.setState({UID: lock.getProfile().user_id});
  }

  handleChange(event) {
    this.setState({comment: event.target.value})
  }

  getInitials(UID) {
    let initials;
    this.props.teamMembers.some(member => {
      if (member.userId == UID) {
        const nameArray = member.name.split(' ');
        initials = nameArray[0][0] + nameArray[1][0];
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

  handleKeyPress(e) {
    if (e.key == 'Enter' && e.shiftKey) {
      e.preventDefault();
      this.addComment();
    }
  }

  addComment() {
    if (this.state.comment) {
      let update = Object.assign({}, this.props.campaign);
      update.comments.push({user: this.state.UID, comment: this.state.comment, time: new Date()});
      this.props.updateState({campaign: update, unsaved: false});
      this.props.updateCampaign(this.props.campaign, this.props.index, this.props.channel);
      this.setState({comment: ''});
    }
  }

  render() {
    const comments = this.props.campaign.comments
      .sort((a, b) => {
        return new Date(b.time) - new Date(a.time)
      })
      .map((comment, index) => {
        const initials = this.getInitials(comment.user);
        const name = this.getName(comment.user);
        return <Comment key={ index } name={ name } comment={ comment.comment } time={ comment.time } initials={ initials }/>
      });
    return <div>
      <textarea className={ this.classes.addComment } placeholder="Write a comment..." value={ this.state.comment } onChange={ this.handleChange.bind(this) }
                onKeyPress={ this.handleKeyPress.bind(this) } required/>
      <Button type="accent2" style={{width: '72px', marginTop: '5px'}}
              onClick={ this.addComment.bind(this) }>POST</Button>
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