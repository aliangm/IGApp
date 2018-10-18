import React from 'react';
import Component from 'components/Component';

export default class FacebookCampaigns extends Component {
  render() {
    return <div style={{width: '100%'}}>
      <div className={this.props.className} onClick={() => this.refs.popup.open()}/>
      <this.props.popupComponent {...this.props} ref='popup'/>
    </div>;
  }
}