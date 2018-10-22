import React from 'react';
import Component from 'components/Component';
import CampignsImportPopup from 'components/importCampaignsPopups/CampignsImportPopup';

export default class AdwordsCampaignsPopup extends Component {

  open = () => {
    this.refs.campignImportRef.open();
  };

  render() {
    return <CampignsImportPopup ref='campignImportRef'
                                title='Google AdWords - choose customer'
                                api='adwordsapi'
                                accountIdPropertyName='customerId'
                                accountLabelPropertyName='descriptiveName'
                                {...this.props}
    />;
  }
}