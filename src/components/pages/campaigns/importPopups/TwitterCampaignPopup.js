import React from 'react';
import Component from 'components/Component';
import CampignsImportPopup from 'components/pages/campaigns/importPopups/CampignsImportPopup';

export default class TwitterCampaignsPopup extends Component {

  open = () => {
    this.refs.campignImportRef.open();
  };

  render() {
    return <CampignsImportPopup ref='campignImportRef'
                                api='twitteradsapi'
                                title='Choose Twitter Account'
                                setDataAsState={this.props.setDataAsState}
                                loadingStarted={this.props.loadingStarted}
                                loadingFinished={this.props.loadingFinished}
    />;
  }
}