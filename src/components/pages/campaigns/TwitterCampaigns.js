import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import salesForceStyle from 'styles/indicators/salesforce-automatic-popup.css';
import CRMStyle from 'styles/indicators/crm-popup.css';
import TwitterCampaignsPopup from 'components/pages/campaigns/importPopups/TwitterCampaignPopup';

export default class TwitterCampaigns extends Component {

  style = style;
  styles = [salesForceStyle, CRMStyle];

  render() {
    return <div style={{width: '100%'}}>
      <div className={CRMStyle.locals.twitterads} onClick={() => this.refs.popup.open()}/>
      <TwitterCampaignsPopup ref='popup'
                             {...this.props}
      />
    </div>;
  }
}