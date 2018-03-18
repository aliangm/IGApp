import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/indicators/crm-popup.css';
import SalesforceCampaignsPopup from 'components/pages/campaigns/SalesforceCampaignsPopup';
import AdwordsCampaignsPopup from 'components/pages/campaigns/AdwordsCampaignsPopup';
import FacebookCampaignsPopup from 'components/pages/campaigns/FacebookCampaignsPopup';
import LinkedinCampaignsPopup from 'components/pages/campaigns/LinkedinCampaignsPopup';

export default class ImportCampaignsPopup extends Component {

  style = style;

  render(){
    return <div hidden={ this.props.hidden }>
        <Page popup={ true } width={'340px'}>
          <div className={ this.classes.close } onClick={ this.props.close }/>
          <div className={ this.classes.title }>
            Choose from where to import your campaigns
          </div>
          <div className={ this.classes.inner }>
            <div className={ this.classes.row }>
              <SalesforceCampaignsPopup
                setDataAsState={ this.props.setDataAsState }
                close={ this.props.close }
                data={this.props.salesforceAuto}
                userAccount={this.props.userAccount}
              />
            </div>
            <div className={ this.classes.row }>
              <AdwordsCampaignsPopup
                setDataAsState={ this.props.setDataAsState }
                close={ this.props.close }
                data={this.props.adwordsapi}
              />
            </div>
            <div className={ this.classes.row }>
              <FacebookCampaignsPopup
                setDataAsState={ this.props.setDataAsState }
                close={ this.props.close }
                data={this.props.facebookadsapi}
                />
            </div>
            <div className={ this.classes.row }>
              <LinkedinCampaignsPopup
                setDataAsState={ this.props.setDataAsState }
                close={ this.props.close }
                data={this.props.linkedinadsapi}
              />
            </div>
          </div>
        </Page>
      </div>
  }

}