import React from 'react';

import Component from 'components/Component';
import channelRectangleStyle from 'styles/campaigns/channel-rectangle.css';

export default class ChannelRectangle extends Component {

  style = channelRectangleStyle

  render() {
    return <div className={ this.classes.pure }>
      <div className={ this.classes.icon } data-icon={ this.props.channelIcon }/>
      {this.props.channelTitle} - ${this.props.channelBudget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
    </div>
  }

}