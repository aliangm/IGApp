import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/indicators/crm-popup.css';
import CRMStyle from 'styles/indicators/crm-popup.css';
import ImportButton from 'components/pages/campaigns/ImportButton';
import SalesforceCampaignsPopup from 'components/pages/campaigns/importPopups/SalesforceCampaignsPopup';
import AdwordsCampaignsPopup from 'components/pages/campaigns/importPopups/AdwordsCampaignsPopup';
import FacebookCampaignsPopup from 'components/pages/campaigns/importPopups/FacebookCampaignsPopup';
import LinkedinCampaignsPopup from 'components/pages/campaigns/importPopups/LinkedinCampaignsPopup';
import TwitterCampaignsPopup from 'components/pages/campaigns/importPopups/TwitterCampaignPopup';

export default class ImportCampaignsPopup extends Component {

  style = style;
  styles = [CRMStyle];

  render() {
    return <div hidden={this.props.hidden}>
      <Page popup={true} width={'340px'}>
        <div className={this.classes.close} onClick={this.props.close}/>
        <div className={this.classes.title}>
          Choose from where to import your campaigns
        </div>
        <div className={this.classes.inner}>
          <div className={this.classes.row}>
            <ImportButton
              setDataAsState={this.props.setDataAsState}
              close={this.props.close}
              data={this.props.salesforceAuto}
              userAccount={this.props.userAccount}
              popupComponent={SalesforceCampaignsPopup}
              className={CRMStyle.locals.salesforce}
            />
          </div>
          <div className={this.classes.row}>
            <ImportButton
              setDataAsState={this.props.setDataAsState}
              close={this.props.close}
              data={this.props.adwordsapi}
              popupComponent={AdwordsCampaignsPopup}
              className={CRMStyle.locals.adwords}
            />
          </div>
          <div className={this.classes.row}>
            <ImportButton
              setDataAsState={this.props.setDataAsState}
              close={this.props.close}
              data={this.props.facebookadsapi}
              popupComponent={FacebookCampaignsPopup}
              className={CRMStyle.locals.facebookads}
            />
          </div>
          <div className={this.classes.row}>
            <ImportButton
              setDataAsState={this.props.setDataAsState}
              close={this.props.close}
              data={this.props.linkedinadsapi}
              popupComponent={LinkedinCampaignsPopup}
              className={CRMStyle.locals.linkedinads}
            />
          </div>
          <div className={this.classes.row}>
            <ImportButton
              setDataAsState={this.props.setDataAsState}
              close={this.props.close}
              data={this.props.twitteradsapi}
              popupComponent={TwitterCampaignsPopup}
              className={CRMStyle.locals.twitterads}
            />
          </div>
        </div>
      </Page>
    </div>;
  }

}