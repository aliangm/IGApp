import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import salesForceStyle from 'styles/indicators/salesforce-automatic-popup.css';
import CRMStyle from 'styles/indicators/crm-popup.css';
import LinkedinCampaignsPopup from 'components/pages/campaigns/importPopups/LinkedinCampaignsPopup';

export default class LinkedinCampaigns extends Component {

  style = style;
  styles = [salesForceStyle, CRMStyle];


  render() {
    return <div style={{width: '100%'}}>
      <div className={CRMStyle.locals.linkedinads} onClick={() => this.refs.popup.open()}/>
      <LinkedinCampaignsPopup {...this.props} ref='popup'/>
    </div>;
  }

}