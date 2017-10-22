import React from 'react';

import Component from 'components/Component';
import Page from 'components/Page';

import Title from 'components/onboarding/Title';
import ProfileProgress from 'components/pages/profile/Progress';
import BackButton from 'components/pages/profile/BackButton';
import PlanButton from 'components/pages/indicators/PlanButton';
import SaveButton from 'components/pages/profile/SaveButton';
import Item from 'components/pages/indicators/Item';

import style from 'styles/onboarding/onboarding.css';
import indiStyle from 'styles/indicators/indicators.css';

import { isPopupMode, disablePopupMode } from 'modules/popup-mode';
import history from 'history';
import FacebookAutomaticPopup from 'components/pages/indicators/FacebookAutomaticPopup';
import CRMPopup from 'components/pages/indicators/CRMPopup';
import AnalyticsPopup from 'components/pages/indicators/AnalyticsPopup';
import FinancePopup from 'components/pages/indicators/FinancePopup';
import SocialPopup from 'components/pages/indicators/SocialPopup';
import TwitterAutomaticPopup from 'components/pages/indicators/TwitterAutomaticPopup';
import Loading from 'components/pages/indicators/Loading';
import { getTitle } from 'components/utils/indicators';

export default class Indicators extends Component {
  style = style;
  styles = [indiStyle];

  static defaultProps = {
    actualIndicators: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(name, value){
    let update = Object.assign({}, this.props.actualIndicators);
    value = parseInt(value);
    if (!isNaN(value)) {
      update[name] = value;
      this.props.updateState({actualIndicators: update});
    }
  }

  showFacebookPopup() {
    this.setState({showFacebookPopup: true});
  }

  showCRMPopup() {
    this.setState({showCRMPopup: true});
  }

  showAnalyticsPopup() {
    this.setState({showAnalyticsPopup: true});
  }

  showFinancePopup() {
    this.setState({showFinancePopup: true});
  }

  showSocialPopup() {
    this.setState({showSocialPopup: true});
  }

  showTwitterPopup() {
    this.setState({showTwitterPopup: true});
  }

  isFunnelAuto(indicator) {
    if (this.props.hubspotAuto && this.props.hubspotAuto.mapping && this.props.hubspotAuto.mapping[indicator]) {
      return "provider:hubspot";
    }
    if (this.props.salesforceAuto && this.props.salesforceAuto.mapping && this.props.salesforceAuto.mapping[indicator]) {
      return "provider:salesforce";
    }
    return false;
  }

  isSheetAuto(indicator) {
    return this.props.googleSheetsAuto && this.props.googleSheetsAuto.mapping && this.props.googleSheetsAuto.mapping[indicator]
  }

  isFinanceAuto(indicator) {
    if (this.isSheetAuto(indicator)) {
      return "provider:sheets";
    }
    if (this.props.isStripeAuto) {
      return "provider:stripe";
    }
    return false;
  }

  isGoogleAuto() {
    return !!this.props.googleAuto;
  }

  isBlogAuto() {
    return this.props.googleAuto && this.props.googleAuto.blogProfileId;
  }

  updateState = (newState) => {
    this.setState(newState);
  };

  render() {
    return <div>
      <Page popup={ isPopupMode() } width={isPopupMode() ? 'initial' : '1051px'}>
        <Title title="Metrics" subTitle="Marketing is great, but without measuring the impact on your metrics, there is no real point in it." />
        <div className={ this.classes.error }>
          <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our support. </label>
        </div>
        <FacebookAutomaticPopup hidden={ !this.state.showFacebookPopup } setDataAsState={ this.props.setDataAsState } close={ ()=>{ this.setState({showFacebookPopup: false}) }}/>
        <TwitterAutomaticPopup hidden={ !this.state.showTwitterPopup } setDataAsState={ this.props.setDataAsState } close={ ()=>{ this.setState({showTwitterPopup: false}) }}/>
        <CRMPopup hidden={ !this.state.showCRMPopup } close={ ()=>{ this.setState({showCRMPopup: false}) } } setDataAsState={ this.props.setDataAsState } updateState={ this.updateState } salesforceAuto={this.props.salesforceAuto} hubspotAuto={this.props.hubspotAuto}/>
        <AnalyticsPopup hidden={ !this.state.showAnalyticsPopup } close={ ()=>{ this.setState({showAnalyticsPopup: false}) } } setDataAsState={ this.props.setDataAsState } googleAuto={this.props.googleAuto}/>
        <FinancePopup hidden={ !this.state.showFinancePopup } close={ ()=>{ this.setState({showFinancePopup: false}) } } setDataAsState={ this.props.setDataAsState } googleSheetsAuto={this.props.googleSheetsAuto}/>
        <SocialPopup hidden={ !this.state.showSocialPopup } close={ ()=>{ this.setState({showSocialPopup: false}) } } setDataAsState={ this.props.setDataAsState }/>
        <Loading hidden={ !this.state.loading }/>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:facebook" title={ getTitle('facebookLikes') } name="facebookLikes" updateIndicator={ this.handleChange } defaultStatus = { this.props.actualIndicators.facebookLikes } maxValue={50000} description="The number of likes in your Facebook page." showAutomaticPopup={ this.showFacebookPopup.bind(this) } automaticIndicators={ this.props.isFacebookAuto }/>
              <Item icon="indicator:facebookEngagement" link='fb' title={ getTitle('facebookEngagement') } name="facebookEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.facebookEngagement } maxValue={100} isPercentage = {true} description="Your Facebook engagement rate, measures your brand’s effectiveness at engaging your audience through Facebook." showAutomaticPopup={ this.showFacebookPopup.bind(this) } automaticIndicators={ this.props.isFacebookAuto }/>
              <Item icon="indicator:twitter" title={ getTitle('twitterFollowers') } name="twitterFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.twitterFollowers }  maxValue={30000} description="The number of followers on your Twitter page." showAutomaticPopup={ this.showTwitterPopup.bind(this) } automaticIndicators={ this.props.isTwitterAuto }/>
              <Item icon="indicator:twitterEngagement" link='twtr' title={ getTitle('twitterEngagement') } name="twitterEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.twitterEngagement } maxValue={100} isPercentage = {true} description="Your Twitter engagement rate, measures your brand’s effectiveness at engaging your audience through Twitter." showAutomaticPopup={ this.showTwitterPopup.bind(this) } automaticIndicators={ this.props.isTwitterAuto }/>
              <Item icon="indicator:linkedin" title={ getTitle('linkedinFollowers') } name="linkedinFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.linkedinFollowers } maxValue={12000} description="The number of followers on your LinkedIn page." showAutomaticPopup={ this.showSocialPopup.bind(this) } automaticIndicators={ this.props.isLinkedinAuto }/>
              <Item icon="indicator:linkedinEngagement" link='in' title={ getTitle('linkedinEngagement') } name="linkedinEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.linkedinEngagement } maxValue={100} isPercentage = {true} description="Your LinkedIn engagement rate, measures your brand’s effectiveness at engaging your audience through LinkedIn." showAutomaticPopup={ this.showSocialPopup.bind(this) } automaticIndicators={ this.props.isLinkedinAuto }/>
              <Item icon="indicator:instagram" title={ getTitle('instagramFollowers') } name="instagramFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.instagramFollowers } maxValue={20000} description="The number of followers on your Instagram page."/>
              <Item icon="indicator:instagramEngagement" link='inst' title={ getTitle('instagramEngagement') } name="instagramEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.instagramEngagement } maxValue={100} isPercentage = {true} description="Your Instagram engagement rate, measures your brand’s effectiveness at engaging your audience through Instagram."/>
              <Item icon="indicator:google" title={ getTitle('googlePlusFollowers') } name="googlePlusFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.googlePlusFollowers } maxValue={16000} description="The number of followers on your Google+ page."/>
              <Item icon="indicator:googleEngagement" link='gp' title={ getTitle('googlePlusEngagement') } name="googlePlusEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.googlePlusEngagement } maxValue={100} isPercentage = {true} description="Your Google+ engagement rate, measures your brand’s effectiveness at engaging your audience through Google+."/>
              <Item icon="indicator:pinterest" title={ getTitle('pinterestFollowers') } name="pinterestFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.pinterestFollowers } maxValue={10000} description="The number of followers on your Instagram page."/>
              <Item icon="indicator:pinterestEngagement" link='pin' title={ getTitle('pinterestEngagement') } name="pinterestEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.pinterestEngagement } maxValue={100} isPercentage = {true} description="Your Pinterest engagement rate, measures your brand’s effectiveness at engaging your audience through Pinterest."/>
              <Item icon="indicator:youtube" title={ getTitle('youtubeSubscribers') } name="youtubeSubscribers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.youtubeSubscribers } maxValue={5000} description="The number of subscribers on your Youtube page."/>
              <Item icon="indicator:youtubeEngagement" link='utu' title={ getTitle('youtubeEngagement') } name="youtubeEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.youtubeEngagement } maxValue={100} isPercentage = {true} description="Your Youtube engagement rate, measures your brand’s effectiveness at engaging your audience through Youtube."/>
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:mcl" title={ getTitle('MCL') } name="MCL" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.MCL } maxValue={10000} isFunnel={true} description="Think of leads as those folks who know about you and have opted in to hear from you periodically, or those which have shown some interest in what you offer. Typically a lead has filled out a form with more than just an email address. We see companies use the lead lifecycle stage for what we think of as general, broadly appealing, or top of the funnel offers. As each lead demonstrates a higher degree of sales readiness and qualification, they will move to further stages." showAutomaticPopup={ this.showCRMPopup.bind(this) } automaticIndicators={ this.isFunnelAuto('MCL') }/>
              <Item icon="indicator:mql" title={ getTitle('MQL') } name="MQL" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.MQL } maxValue={5000} isFunnel={true} description="Marketing Qualified Leads, commonly known as MQLs, are those people who have raised their hands (metaphorically speaking) and identified themselves as more deeply engaged, sales-ready contacts than your usual leads, but who have not yet become fully fledged opportunities. Ideally, you should only allow certain, designated forms to trigger the promotion of a lead to the MQL stage, specifically those that gate bottom of the funnel offers like demo requests, buying guides, and other sales-ready calls to action." showAutomaticPopup={ this.showCRMPopup.bind(this) } automaticIndicators={ this.isFunnelAuto('MQL') }/>
              <Item icon="indicator:sql" title={ getTitle('SQL') } name="SQL" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.SQL } maxValue={2000} isFunnel={true} description="Sales Qualified Leads, commonly known as SQLs, are those that your sales team has accepted as worthy of a direct sales follow up. Using this stage will help your sales and marketing teams stay firmly on the same page in terms of the quality and volume of leads that you are handing over to your sales team." showAutomaticPopup={ this.showCRMPopup.bind(this) } automaticIndicators={ this.isFunnelAuto('SQL') }/>
              <Item icon="indicator:opps" title={ getTitle('opps') } name="opps" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.opps } maxValue={1000} isFunnel={true} description="Opportunities are contacts who have become real sales opportunities in your CRM." showAutomaticPopup={ this.showCRMPopup.bind(this) } automaticIndicators={ this.isFunnelAuto('opps') }/>
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:ltv" title={ getTitle('LTV') } name="LTV" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.LTV } maxValue={400000} isDollar={true} description="Measures the profit your business makes from any given customer." formula="Formula – ARPA / Churn Rate (10% is equal to 0.1)."  showAutomaticPopup={ this.showFinancePopup.bind(this) } automaticIndicators={ this.isFinanceAuto('LTV') }/>
              <Item icon="indicator:cac" title={ getTitle('CAC') } name="CAC" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.CAC } maxValue={20000} isDirectionDown= { true } isDollar={true} description="Refers to the resources that a business must allocate (financial or otherwise) in order to acquire an additional customer. It includes every single effort necessary to introduce your products and services to potential customers, and then convince them to buy and become active customers." formula="Formula - Total Sales & Marketing expenses / # of New Account (Paying Customers)."  showAutomaticPopup={ this.showFinancePopup.bind(this) } automaticIndicators={ this.isSheetAuto('CAC') }/>
              {/** <Item icon="indicator:numberOfSales" title="Number Of Sales" name="numberOfSales" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.numberOfSales } />
               <Item icon="indicator:sales" title="Sales Revenue" name="salesRevenue" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.salesRevenue } /> **/}
              <Item icon="indicator:trialUsers" title={ getTitle('trialUsers') } name="trialUsers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.trialUsers } maxValue={2500} description="The number of trial users the company currently has."/>
              <Item icon="indicator:users" title={ getTitle('users') } name="users" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.users } maxValue={7000} description="The numbers of paying customers the company currently has (an account can have multiple users)." showAutomaticPopup={ this.showCRMPopup.bind(this) } automaticIndicators={ this.isFunnelAuto('users') }/>
              <Item icon="indicator:activeUsers" title={ getTitle('activeUsersRate') } name="activeUsersRate" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.activeUsersRate } maxValue={100} isPercentage = {true} description="How many of your current users/accounts are active (actively using your product / service)?"/>
              {/**<Item icon="indicator:customerRetentionRate" title="Customer Retention Rate" name="customerRetentionRate" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.customerRetentionRate } isPercentage = 'true' />**/}
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:googleMentions" title={ getTitle('googleMentions') } name="googleMentions" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.googleMentions } maxValue={200000} description="# of mentions when typing your company name in quotes (“Company name”)."/>
              <Item icon="indicator:domainAuthority" title={ getTitle('domainAuthority') } name="domainAuthority" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.domainAuthority } maxValue={95} description="Domain Authority (DA) is a search engine ranking score developed by Moz that predicts how well a website will rank on search engine result pages (SERPs). A Domain Authority score ranges from one to 100, with higher scores corresponding to a greater ability to rank. It’s calculated by evaluating linking root domains, number of total links, MozRank, MozTrust, etc."/>
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:sessions" title={ getTitle('sessions') } name="sessions" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.sessions } maxValue={300000} description="Website total visits during the last 30 days." showAutomaticPopup={ this.showAnalyticsPopup.bind(this) } automaticIndicators={ this.isGoogleAuto() }/>
              <Item icon="indicator:averageSessionDuration" title={ getTitle('averageSessionDuration') } name="averageSessionDuration" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.averageSessionDuration } maxValue={500} description="Measured in seconds (last 30 days)." showAutomaticPopup={ this.showAnalyticsPopup.bind(this) } automaticIndicators={ this.isGoogleAuto() }/>
              <Item icon="indicator:bounceRate" title={ getTitle('bounceRate') } name="bounceRate" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.bounceRate } isPercentage = {true} maxValue={100} isDirectionDown= { true } description="The percentage of visitors to a particular website who navigate away from the site after viewing only one page." showAutomaticPopup={ this.showAnalyticsPopup.bind(this) } automaticIndicators={ this.isGoogleAuto() }/>
              <Item icon="indicator:blogVisits" title={ getTitle('blogVisits') } name="blogVisits" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.blogVisits } maxValue={25000} description="Blog total visits during the last 30 days." showAutomaticPopup={ this.showAnalyticsPopup.bind(this) } automaticIndicators={ this.isBlogAuto() }/>
              <Item icon="indicator:blogSubscribers" title={ getTitle('blogSubscribers') } name="blogSubscribers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.blogSubscribers } maxValue={ 7000 } description="The number of blog subscriber the company currently has." automaticIndicators={ this.isFunnelAuto('blogSubscribers') }/>
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:mrr" title={ getTitle('MRR') } name="MRR" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.MRR } maxValue={1000000} isDollar={true} description="Monthly Recurrent Revenue." formula="Formula - SUM(Paying customers monthly fee)." showAutomaticPopup={ this.showFinancePopup.bind(this) } automaticIndicators={ this.isFinanceAuto('MRR') }/>
              <Item icon="indicator:churnRate" title={ getTitle('churnRate') } name="churnRate" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.churnRate } isPercentage = { true } maxValue={ 18 } isDirectionDown= { true } description="The number or percentage of subscribers to a service that discontinue their subscription to that service in a given time period." formula="Formula - # of accounts who churned / Last month total # of accounts." showAutomaticPopup={ this.showFinancePopup.bind(this) } automaticIndicators={ this.isFinanceAuto('churnRate') }/>
              <Item icon="indicator:arpa" title={ getTitle('ARPA') } name="ARPA" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.ARPA } maxValue={17000} isDollar={true} description="Average Revenue Per Account. a measure of the revenue generated per account, per month (sometimes known as ARPU – average revenue per user)." formula="Formula – ARPA = MRR / # of accounts (paying customers)."/>
            </div>
          </div>

          { isPopupMode() ?

            <div className={ this.classes.colRight }>
              <div className={ this.classes.row }>
                <ProfileProgress progress={ 101 } image={
                  require('assets/flower/5.png')
                }
                                 text="Seems you got some new super powers. Now the journey for GROWTH really begins!"/>
              </div>
              {/**
               <div className={ this.classes.row }>
               <ProfileInsights />
               </div>
               **/}
            </div>

            : null }
        </div>

        { isPopupMode() ?

          <div className={ this.classes.footer }>
            <BackButton onClick={() => {
              this.props.updateUserMonthPlan({actualIndicators: this.props.actualIndicators}, this.props.region, this.props.planDate)
                .then(() => {
                  history.push('/preferences');
                });
            }} />
            <div style={{ width: '30px' }} />
            <PlanButton onClick={() => {
              this.props.updateUserMonthPlan({actualIndicators: this.props.actualIndicators}, this.props.region, this.props.planDate)
                .then(() => {
                  history.push('/plan');
                });
            }} />
          </div>

          :
          <div className={ this.classes.footer }>
            <SaveButton onClick={() => {
              this.setState({saveFail: false, saveSuccess: false});
              this.props.updateUserMonthPlan({actualIndicators: this.props.actualIndicators}, this.props.region, this.props.planDate)
                .then(() => {
                  this.setState({saveSuccess: true});
                })
                .catch(() => {
                  this.setState({saveFail: true});
                });
            }} success={ this.state.saveSuccess } fail={ this.state.saveFail }/>
          </div>
        }
      </Page>
    </div>
  }
}