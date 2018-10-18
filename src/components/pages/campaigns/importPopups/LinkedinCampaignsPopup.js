import React from 'react';
import Component from 'components/Component';
import CampignsImportPopup from 'components/pages/campaigns/importPopups/CampignsImportPopup';

export default class LinkedinCampaignsPopup extends Component {

  open = () => {
    this.refs.campignImportRef.open();
  };

  render() {
    return <CampignsImportPopup ref='campignImportRef'
                                title='Choose Linkedin Ads Account'
                                api='linkedinadsapi'
                                loadingStarted={this.props.loadingStarted}
                                loadingFinished={this.props.loadingFinished}
    />;
  }
}