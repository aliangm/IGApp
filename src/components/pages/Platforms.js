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
import MozAutomaticPopup from "./indicators/MozAutomaticPopup";
import ReactDOM from "react-dom";
import Button from 'components/controls/Button';
import ReactTooltip from 'react-tooltip';

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
      let childrenArray = [ ... domElement.children ];
      childrenArray.forEach(child => {
        isHidden = isHidden && child.hidden;
      });
    }
    return isHidden;
  };

  render() {
    return <div>
      <Page popup={isPopupMode()} contentClassName={ platformsStyle.locals.content } className={!isPopupMode() ? this.classes.static : null} width="100%">
        <ReactTooltip place='bottom' effect='solid' id='platforms' data-multiline='true' />
        {isPopupMode() ? <Title title="Integrations"/> : null}
        <div>
          <SalesforceAutomaticPopup setDataAsState={ this.props.setDataAsState } data={this.props.salesforceAuto} ref="salesforce"/>
          <HubspotAutomaticPopup setDataAsState={ this.props.setDataAsState } data={this.props.hubspotAuto} updateState={ this.props.updateState } ref="hubspot"/>
          <GoogleAutomaticPopup setDataAsState={ this.props.setDataAsState } data={this.props.googleAuto} ref="googleAnalytics"/>
          <LinkedinAutomaticPopup setDataAsState={ this.props.setDataAsState } ref="linkedin"/>
          <FacebookAutomaticPopup setDataAsState={ this.props.setDataAsState } ref="facebook"/>
          <TwitterAutomaticPopup setDataAsState={ this.props.setDataAsState } ref="twitter"/>
          <YoutubeAutomaticPopup setDataAsState={ this.props.setDataAsState } ref="youtube"/>
          <StripeAutomaticPopup setDataAsState={ this.props.setDataAsState } ref="stripe"/>
          <MozAutomaticPopup setDataAsState={ this.props.setDataAsState } defaultUrl={ this.props.mozapi ? this.props.mozapi.url : this.props.userAccount.companyWebsite } ref="moz"/>
          <GoogleSheetsAutomaticPopup setDataAsState={ this.props.setDataAsState } data={this.props.googleSheetsAuto} ref="googleSheets"/>
          <Button type="reverse" style={{
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
            <div style={{ display: 'flex' }} ref="crm">
              <Platform connected={this.props.salesforceAuto} title="Salesforce" icon="platform:salesforce" open={() => {this.refs.salesforce.open()}} hidden={this.isHidden('salesforce')}/>
              <Platform connected={this.props.hubspotAuto} title="Hubspot" icon="platform:hubspot" open={() => {this.refs.hubspot.open()}} hidden={this.isHidden('hubspot')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.webAnalytics}>
            <div className={platformsStyle.locals.platformTitle}>
              Web Analytics
            </div>
            <div style={{ display: 'flex' }} ref="webAnalytics">
              <Platform connected={this.props.googleAuto} title="Google Analytics" icon="platform:googleAnalytics" open={() => {this.refs.googleAnalytics.open()}} hidden={this.isHidden('googleAnalytics')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.social}>
            <div className={platformsStyle.locals.platformTitle}>
              Social
            </div>
            <div style={{ display: 'flex' }} ref="social">
              <Platform connected={this.props.isLinkedinAuto} title="LinkedIn" icon="platform:linkedin" open={() => {this.refs.linkedin.open()}} hidden={this.isHidden('linkedin')}/>
              <Platform connected={this.props.isFacebookAuto} title="Facebook" icon="platform:facebook" open={() => {this.refs.facebook.open()}} hidden={this.isHidden('facebook')}/>
              <Platform connected={this.props.isTwitterAuto} title="Twitter" icon="platform:twitter" open={() => {this.refs.twitter.open()}} hidden={this.isHidden('twitter')}/>
              <Platform connected={this.props.isYoutubeAuto} title="Youtube" icon="platform:youtube" open={() => {this.refs.youtube.open()}} hidden={this.isHidden('youtube')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.payment}>
            <div className={platformsStyle.locals.platformTitle}>
              Payment Providers
            </div>
            <div style={{ display: 'flex' }} ref="payment">
              <Platform connected={this.props.isStripeAuto} title="Stripe" icon="platform:stripe" open={() => {this.refs.stripe.open()}} hidden={this.isHidden('stripe')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.productivity}>
            <div className={platformsStyle.locals.platformTitle}>
              Productivity
            </div>
            <div style={{ display: 'flex' }} ref="productivity">
              <Platform connected={this.props.googleSheetsAuto} title="Google Sheets" icon="platform:googleSheets" open={() => {this.refs.googleSheets.open()}} hidden={this.isHidden('googleSheets')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.seo}>
            <div className={platformsStyle.locals.platformTitle}>
              SEO
            </div>
            <div style={{ display: 'flex' }} ref="seo">
              <Platform connected={this.props.mozapi} title="Moz" icon="platform:moz" open={() => {this.refs.moz.open()}} hidden={this.isHidden('moz')}/>
            </div>
          </div>
        </div>
        { isPopupMode() ?
          <div className={ this.classes.footer }>
            <BackButton onClick={ () => {
              history.push('/profile/technology-stack');
            } }/>
            <div style={{ width: '30px' }} />
            <NextButton onClick={ () => {
              history.push('/settings/profile/preferences');
            } }/>
          </div>
          :
          <div style={{ paddingBottom: '60px' }}/>
        }
      </Page>
    </div>
  }
}