import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import salesForceStyle from 'styles/indicators/salesforce-automatic-popup.css';
import CRMStyle from 'styles/indicators/crm-popup.css';
import SalesforceCampaignsPopup from 'components/pages/campaigns/importPopups/SalesforceCampaignsPopup'

export default class SalesforceCampaigns extends Component {

  style = style;
  styles = [salesForceStyle, CRMStyle];

  render(){
    return <div style={{ width: '100%' }}>
      <div className={ CRMStyle.locals.salesforce } onClick={ () => this.refs.popup.open() }/>
      <SalesforceCampaignsPopup {...this.props} ref='popup'/>
    </div>
  }
}