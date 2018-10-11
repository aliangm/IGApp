import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/onboarding/onboarding.css';
import platformsStyle from 'styles/indicators/platforms.css';
import BackButton from 'components/pages/profile/BackButton';
import NextButton from 'components/pages/profile/NextButton';
import history from 'history';
import Title from 'components/onboarding/Title';
import Platform from 'components/pages/indicators/Platform';
import {isPopupMode} from 'modules/popup-mode';
import SalesforceAutomaticPopup from 'components/pages/indicators/SalesforceAutomaticPopup';
import HubspotAutomaticPopup from 'components/pages/indicators/HubspotAutomaticPopup';
import GoogleAutomaticPopup from 'components/pages/indicators/GoogleAutomaticPopup';
import LinkedinAutomaticPopup from 'components/pages/indicators/LinkedinAutomaticPopup';
import FacebookAutomaticPopup from 'components/pages/indicators/FacebookAutomaticPopup';
import TwitterAutomaticPopup from 'components/pages/indicators/TwitterAutomaticPopup';
import YoutubeAutomaticPopup from 'components/pages/indicators/YoutubeAutomaticPopup';
import StripeAutomaticPopup from 'components/pages/indicators/StripeAutomaticPopup';
import GoogleSheetsAutomaticPopup from 'components/pages/indicators/GoogleSheetsAutomaticPopup';
import MozAutomaticPopup from './indicators/MozAutomaticPopup';
import ReactDOM from 'react-dom';
import Button from 'components/controls/Button';
import ReactTooltip from 'react-tooltip';

const PLATFORM_INDICATORS_MAPPING = {
  'Hubspot': ['MCL', 'MQL', 'SQL', 'opps', 'users', 'blogSubscribers'],
  'Salesforce': ['MCL', 'MQL', 'SQL', 'opps', 'users', 'CAC', 'MRR', 'ARPA', 'newMCL', 'newMQL', 'newSQL', 'newOpps', 'newUsers'],
  'Google Analytics': ['sessions', 'bounceRate', 'averageSessionDuration', 'blogVisits'],
  'LinkedIn': ['linkedinEngagement', 'linkedinFollowers'],
  'Facebook': ['facebookEngagement', 'facebookLikes'],
  'Twitter': ['twitterFollowers', 'twitterEngagement'],
  'Youtube': ['youtubeSubscribers', 'youtubeEngagement'],
  'Stripe': ['MRR', 'LTV', 'churnRate'],
  'Google Sheets': ['MRR', 'LTV', 'CAC', 'churnRate'],
  'Moz': ['domainAuthority']
};

export default class Platforms extends Component {

  style = style;
  styles = [platformsStyle];

  constructor(props) {
    super(props);
    this.state = {
      visibleSections: {}
    };
  }

  componentDidMount() {
    const sections = ['crm', 'webAnalytics', 'social', 'payment', 'productivity', 'seo'];
    const visibleSections = {};
    sections.forEach(section => {
      visibleSections[section] = this.isTitleHidden(section);
    });
    this.setState({visibleSections: visibleSections});
  }

  isHidden(platform) {
    return !this.props.technologyStack.includes(platform);
  }

  isTitleHidden = (title) => {
    const domElement = ReactDOM.findDOMNode(this.refs[title]);
    let isHidden = true;
    if (domElement) {
      let childrenArray = [...domElement.children];
      childrenArray.forEach(child => {
        isHidden = isHidden && child.hidden;
      });
    }
    return isHidden;
  };

  render() {
    return <div>
      <Page popup={isPopupMode()}
            className={!isPopupMode() ? this.classes.static : null}
            contentClassName={this.classes.content}
            innerClassName={this.classes.pageInner}
            width='100%'>
        <ReactTooltip place='right' effect='solid' id='platforms' html={true}/>
        <Title title="Integrations"/>
        <div>
          <SalesforceAutomaticPopup setDataAsState={this.props.setDataAsState} data={this.props.salesforceAuto}
                                    ref="salesforce" affectedIndicators={PLATFORM_INDICATORS_MAPPING.Salesforce}
                                    actualIndicators={this.props.actualIndicators}/>
          <HubspotAutomaticPopup setDataAsState={this.props.setDataAsState} data={this.props.hubspotAuto}
                                 updateState={this.props.updateState} ref="hubspot"
                                 affectedIndicators={PLATFORM_INDICATORS_MAPPING.Hubspot}
                                 actualIndicators={this.props.actualIndicators}/>
          <GoogleAutomaticPopup setDataAsState={this.props.setDataAsState} data={this.props.googleAuto}
                                ref="googleAnalytics"
                                affectedIndicators={PLATFORM_INDICATORS_MAPPING['Google Analytics']}
                                actualIndicators={this.props.actualIndicators}/>
          <LinkedinAutomaticPopup setDataAsState={this.props.setDataAsState} ref="linkedin"
                                  affectedIndicators={PLATFORM_INDICATORS_MAPPING.LinkedIn}
                                  actualIndicators={this.props.actualIndicators}/>
          <FacebookAutomaticPopup setDataAsState={this.props.setDataAsState} ref="facebook"
                                  affectedIndicators={PLATFORM_INDICATORS_MAPPING.Facebook}
                                  actualIndicators={this.props.actualIndicators}/>
          <TwitterAutomaticPopup setDataAsState={this.props.setDataAsState} ref="twitter"
                                 affectedIndicators={PLATFORM_INDICATORS_MAPPING.Twitter}
                                 actualIndicators={this.props.actualIndicators}/>
          <YoutubeAutomaticPopup setDataAsState={this.props.setDataAsState} ref="youtube"
                                 affectedIndicators={PLATFORM_INDICATORS_MAPPING.Youtube}
                                 actualIndicators={this.props.actualIndicators}/>
          <StripeAutomaticPopup setDataAsState={this.props.setDataAsState} ref="stripe"
                                affectedIndicators={PLATFORM_INDICATORS_MAPPING.Stripe}
                                actualIndicators={this.props.actualIndicators}/>
          <MozAutomaticPopup setDataAsState={this.props.setDataAsState}
                             defaultUrl={this.props.mozapi ? this.props.mozapi.url : this.props.userAccount.companyWebsite}
                             ref="moz" affectedIndicators={PLATFORM_INDICATORS_MAPPING.Moz}
                             actualIndicators={this.props.actualIndicators}/>
          <GoogleSheetsAutomaticPopup setDataAsState={this.props.setDataAsState} data={this.props.googleSheetsAuto}
                                      ref="googleSheets"
                                      affectedIndicators={PLATFORM_INDICATORS_MAPPING['Google Sheets']}
                                      actualIndicators={this.props.actualIndicators}/>
          <Button type="secondary" style={{
            width: '193px',
            marginLeft: 'auto'
          }} onClick={() => {
            history.push('/profile/technology-stack');
          }}>
            Add more platforms
          </Button>
          <div hidden={this.state.visibleSections.crm}>
            <div className={platformsStyle.locals.platformTitle}>
              CRM
            </div>
            <div style={{display: 'flex'}} ref="crm">
              <Platform connected={this.props.salesforceAuto} title="Salesforce"
                        indicators={PLATFORM_INDICATORS_MAPPING['Salesforce']} icon="platform:salesforce" open={() => {
                this.refs.salesforce.open();
              }} hidden={this.isHidden('salesforce')}/>
              <Platform connected={this.props.hubspotAuto} title="Hubspot"
                        indicators={PLATFORM_INDICATORS_MAPPING['Hubspot']} icon="platform:hubspot" open={() => {
                this.refs.hubspot.open();
              }} hidden={this.isHidden('hubspot')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.webAnalytics}>
            <div className={platformsStyle.locals.platformTitle}>
              Web Analytics
            </div>
            <div style={{display: 'flex'}} ref="webAnalytics">
              <Platform connected={this.props.googleAuto} title="Google Analytics"
                        indicators={PLATFORM_INDICATORS_MAPPING['Google Analytics']} icon="platform:googleAnalytics"
                        open={() => {
                          this.refs.googleAnalytics.open();
                        }} hidden={this.isHidden('googleAnalytics')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.social}>
            <div className={platformsStyle.locals.platformTitle}>
              Social
            </div>
            <div style={{display: 'flex'}} ref="social">
              <Platform connected={this.props.isLinkedinAuto} title="LinkedIn"
                        indicators={PLATFORM_INDICATORS_MAPPING['LinkedIn']} icon="platform:linkedin" open={() => {
                this.refs.linkedin.open();
              }} hidden={this.isHidden('linkedin')}/>
              <Platform connected={this.props.isFacebookAuto} title="Facebook"
                        indicators={PLATFORM_INDICATORS_MAPPING['Facebook']} icon="platform:facebook" open={() => {
                this.refs.facebook.open();
              }} hidden={this.isHidden('facebook')}/>
              <Platform connected={this.props.isTwitterAuto} title="Twitter"
                        indicators={PLATFORM_INDICATORS_MAPPING['Twitter']} icon="platform:twitter" open={() => {
                this.refs.twitter.open();
              }} hidden={this.isHidden('twitter')}/>
              <Platform connected={this.props.isYoutubeAuto} title="Youtube"
                        indicators={PLATFORM_INDICATORS_MAPPING['Youtube']} icon="platform:youtube" open={() => {
                this.refs.youtube.open();
              }} hidden={this.isHidden('youtube')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.payment}>
            <div className={platformsStyle.locals.platformTitle}>
              Payment Providers
            </div>
            <div style={{display: 'flex'}} ref="payment">
              <Platform connected={this.props.isStripeAuto} title="Stripe"
                        indicators={PLATFORM_INDICATORS_MAPPING['Stripe']} icon="platform:stripe" open={() => {
                this.refs.stripe.open();
              }} hidden={this.isHidden('stripe')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.productivity}>
            <div className={platformsStyle.locals.platformTitle}>
              Productivity
            </div>
            <div style={{display: 'flex'}} ref="productivity">
              <Platform connected={this.props.googleSheetsAuto} title="Google Sheets"
                        indicators={PLATFORM_INDICATORS_MAPPING['Google Sheets']} icon="platform:googleSheets"
                        open={() => {
                          this.refs.googleSheets.open();
                        }} hidden={this.isHidden('googleSheets')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.seo}>
            <div className={platformsStyle.locals.platformTitle}>
              SEO
            </div>
            <div style={{display: 'flex'}} ref="seo">
              <Platform connected={this.props.mozapi} title="Moz" indicators={PLATFORM_INDICATORS_MAPPING['Moz']}
                        icon="platform:moz" open={() => {
                this.refs.moz.open();
              }} hidden={this.isHidden('moz')}/>
            </div>
          </div>
        </div>
        {isPopupMode() ?
          <div className={this.classes.footer}>
            <BackButton onClick={() => {
              history.push('/profile/technology-stack');
            }}/>
            <div style={{width: '30px'}}/>
            <NextButton onClick={() => {
              history.push('/settings/attribution/setup');
            }}/>
          </div>
          :
          <div style={{paddingBottom: '60px'}}/>
        }
      </Page>
    </div>;
  }
}