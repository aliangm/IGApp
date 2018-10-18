import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/indicators/crm-popup.css';
import SalesforceCampaigns from 'components/pages/campaigns/SalesforceCampaigns';
import AdwordsCampaigns from 'components/pages/campaigns/AdwordsCampaigns';
import FacebookCampaigns from 'components/pages/campaigns/FacebookCampaigns';
import LinkedinCampaigns from 'components/pages/campaigns/LinkedinCampaigns';
import TwitterCampaigns from 'components/pages/campaigns/TwitterCampaigns';

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
            <SalesforceCampaigns
              setDataAsState={ this.props.setDataAsState }
              close={ this.props.close }
              data={this.props.salesforceAuto}
              userAccount={this.props.userAccount}
            />
          </div>
          <div className={ this.classes.row }>
            <AdwordsCampaigns
              setDataAsState={ this.props.setDataAsState }
              close={ this.props.close }
              data={this.props.adwordsapi}
            />
          </div>
          <div className={ this.classes.row }>
            <FacebookCampaigns
              setDataAsState={ this.props.setDataAsState }
              close={ this.props.close }
              data={this.props.facebookadsapi}
            />
          </div>
          <div className={ this.classes.row }>
            <LinkedinCampaigns
              setDataAsState={ this.props.setDataAsState }
              close={ this.props.close }
              data={this.props.linkedinadsapi}
            />
          </div>
          <div className={ this.classes.row }>
            <TwitterCampaigns
              setDataAsState={ this.props.setDataAsState }
              close={ this.props.close }
              data={this.props.twitteradsapi}
            />
          </div>
        </div>
      </Page>
    </div>
  }

}