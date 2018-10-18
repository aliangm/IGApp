import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import salesForceStyle from 'styles/indicators/salesforce-automatic-popup.css';
import CRMStyle from 'styles/indicators/crm-popup.css';
import AdwordsCampaignsPopup from 'components/pages/campaigns/importPopups/AdwordsCampaignsPopup';

export default class AdwordsCampaigns extends Component {

  style = style;
  styles = [salesForceStyle, CRMStyle];

  render() {
    return <div style={{width: '100%'}}>
      <div className={CRMStyle.locals.adwords} onClick={() => this.refs.popup.open()}/>
      <AdwordsCampaignsPopup {...this.props} ref='popup'/>
    </div>;
  }

}