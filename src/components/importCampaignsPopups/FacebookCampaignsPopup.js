import React from 'react';
import Component from 'components/Component';
import CampignsImportPopup from 'components/importCampaignsPopups/CampignsImportPopup';

export default class FacebookCampaignsPopup extends Component {

  open = () => {
    this.refs.campignImportRef.open();
  };

  render() {
    return <CampignsImportPopup ref='campignImportRef'
                                title='Choose Facebook Account'
                                api='facebookadsapi'
                                {...this.props}
    />;
  }
}