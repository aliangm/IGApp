import React from 'react';
import Component from 'components/Component';
import Button from 'components/controls/Button';
import style from 'styles/campaigns/comment-text-area.css';

export default class CommentTextArea extends Component {

  style=style;

  constructor(props) {
    super(props);
    this.state = {
      comment: props.comment
    };
  };

  static defaultProps = {
    comment: ''
  };

  handleChange(event) {
    this.setState({comment: event.target.value})
  }

  handleKeyPress(e) {
    if (e.key == 'Enter' && e.shiftKey) {
      e.preventDefault();
      this.addOrEditComment();
    }
  }

  addOrEditComment() {
    this.props.addOrEditComment(this.state.comment, this.props.index);
    this.setState({comment: ''});
  }

  render() {
    return <div>
      <textarea className={ this.classes.addComment } placeholder="Write a comment..." value={ this.state.comment }
                onChange={ this.handleChange.bind(this) }
                onKeyPress={ this.handleKeyPress.bind(this) } required/>
      <div className={ this.classes.post }>
        <Button type="accent2" style={{width: '72px'}}
                onClick={ this.addOrEditComment.bind(this) }>POST</Button>
        <div className={ this.classes.shortcut }>
          (shift + enter)
        </div>
      </div>
    </div>
  }
}