import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/suggestion.css';
import { getNickname } from 'components/utils/channels';
import { formatBudget } from 'components/utils/budget';

export default class Suggestion extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      showIcon: null
    }
  }

  approve() {
    this.setState({showIcon: 'approve'}, () => {
      this.props.approveChannel();
    });
  }

  decline() {
    this.setState({showIcon: 'decline'}, () => {
      this.props.declineChannel();
    });
  }

  render() {
    const {suggested, current, channel} = this.props;
    return <div>
      { this.state.showIcon ?
        <div className={ this.classes.iconShell }>
          <div className={this.classes.actionSuccess} data-action={this.state.showIcon}/>
        </div>
        :
        <div className={this.classes.itemInner}>
          <div className={this.classes.title}>
            {getNickname(channel)}
          </div>
          <div className={this.classes.center}>
            <div className={this.classes.channelIcon} data-icon={"plan:" + channel}/>
          </div>
          <div className={this.classes.budgets}>
            <div className={this.classes.current}>
              ${formatBudget(current)}
            </div>
            {" -> "}
            <div className={this.classes.suggested}>
              ${formatBudget(suggested)}
            </div>
          </div>
          <div className={this.classes.actions}>
            <div className={this.classes.decline} onClick={this.decline.bind(this)}/>
            <div className={this.classes.approve} onClick={this.approve.bind(this)}/>
          </div>
        </div>
      }
    </div>
  }
}