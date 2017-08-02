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
import GoogleAutomaticPopup from 'components/pages/indicators/GoogleAutomaticPopup';
import HubspotAutomaticPopup from 'components/pages/indicators/HubspotAutomaticPopup';
import FacebookAutomaticPopup from 'components/pages/indicators/FacebookAutomaticPopup';
import SalesforceAutomaticPopup from 'components/pages/indicators/SalesforceAutomaticPopup';
import CRMPopup from 'components/pages/indicators/CRMPopup';
import LinkedinAutomaticPopup from 'components/pages/indicators/LinkedinAutomaticPopup';
import TwitterAutomaticPopup from 'components/pages/indicators/TwitterAutomaticPopup';

export default class Indicators extends Component {
  style = style;
  styles = [indiStyle];

  static defaultProps = {
    actualIndicators: {}
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  validate() {
    return this.props.actualIndicators.facebookLikes != undefined &&
      this.props.actualIndicators.facebookEngagement != undefined &&
      this.props.actualIndicators.twitterFollowers != undefined &&
      this.props.actualIndicators.twitterEngagement != undefined &&
      this.props.actualIndicators.linkedinFollowers != undefined &&
      this.props.actualIndicators.linkedinEngagement != undefined &&
      this.props.actualIndicators.instagramFollowers != undefined &&
      this.props.actualIndicators.instagramEngagement != undefined &&
      this.props.actualIndicators.googlePlusFollowers != undefined &&
      this.props.actualIndicators.googlePlusEngagement != undefined &&
      this.props.actualIndicators.pinterestFollowers != undefined &&
      this.props.actualIndicators.pinterestEngagement != undefined &&
      this.props.actualIndicators.youtubeSubscribers != undefined &&
      this.props.actualIndicators.youtubeEngagement != undefined &&
      this.props.actualIndicators.LTV != undefined &&
      this.props.actualIndicators.CAC != undefined &&
      this.props.actualIndicators.users != undefined &&
      this.props.actualIndicators.activeUsersRate != undefined &&
      this.props.actualIndicators.trialUsers != undefined &&
      this.props.actualIndicators.MCL != undefined &&
      this.props.actualIndicators.MQL != undefined &&
      this.props.actualIndicators.SQL != undefined &&
      this.props.actualIndicators.opps != undefined &&
      this.props.actualIndicators.googleMentions != undefined &&
      this.props.actualIndicators.sessions != undefined &&
      this.props.actualIndicators.averageSessionDuration != undefined &&
      this.props.actualIndicators.bounceRate != undefined &&
      this.props.actualIndicators.blogVisits != undefined &&
      this.props.actualIndicators.blogSubscribers != undefined &&
      this.props.actualIndicators.MRR != undefined &&
      this.props.actualIndicators.churnRate != undefined &&
      this.props.actualIndicators.ARPA != undefined;
  }

  handleChange(name, value){
    let update = Object.assign({}, this.props.actualIndicators);
    value = parseInt(value);
    if (!isNaN(value)) {
      update[name] = value;
      this.props.updateState({actualIndicators: update});
    }
  }

  showGooglePopup() {
    this.setState({showGooglePopup: true});
  }

  showHubspotPopup() {
    this.setState({showHubspotPopup: true});
  }

  showFacebookPopup() {
    this.setState({showFacebookPopup: true});
  }

  showSalesforcePopup() {
    this.setState({showSalesforcePopup: true});
  }

  showCRMPopup() {
    this.setState({showCRMPopup: true});
  }

  showLinkedinPopup() {
    this.setState({showLinkedinPopup: true});
  }

  showTwitterPopup() {
    this.setState({showTwitterPopup: true});
  }

  isFunnelAuto(indicator) {
    return (this.props.hubspotAuto && this.props.hubspotAuto.mapping[indicator]) || (this.props.salesforceAuto && this.props.salesforceAuto.mapping[indicator]);
  }

  render() {
    return <div>
      <Page popup={ isPopupMode() } width={isPopupMode() ? 'initial' : '1051px'}>
        <Title title="Metrics" subTitle="Marketing is great, but without measuring the impact on your metrics, there is no real point in it." />
        <div className={ this.classes.error }>
          <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our support. </label>
        </div>
        <GoogleAutomaticPopup hidden={ !this.state.showGooglePopup } setDataAsState={ this.props.setDataAsState } close={ ()=>{ this.setState({showGooglePopup: false}) }}/>
        <HubspotAutomaticPopup hidden={ !this.state.showHubspotPopup } setDataAsState={ this.props.setDataAsState } close={ ()=>{ this.setState({showHubspotPopup: false}) }}/>
        <FacebookAutomaticPopup hidden={ !this.state.showFacebookPopup } setDataAsState={ this.props.setDataAsState } close={ ()=>{ this.setState({showFacebookPopup: false}) }}/>
        <SalesforceAutomaticPopup hidden={ !this.state.showSalesforcePopup } setDataAsState={ this.props.setDataAsState } close={ ()=>{ this.setState({showSalesforcePopup: false}) }}/>
        <LinkedinAutomaticPopup hidden={ !this.state.showLinkedinPopup } setDataAsState={ this.props.setDataAsState } close={ ()=>{ this.setState({showLinkedinPopup: false}) }}/>
        <TwitterAutomaticPopup hidden={ !this.state.showTwitterPopup } setDataAsState={ this.props.setDataAsState } close={ ()=>{ this.setState({showTwitterPopup: false}) }}/>
        <CRMPopup hidden={ !this.state.showCRMPopup } showSalesforcePopup={ this.showSalesforcePopup.bind(this) } showHubspotPopup={ this.showHubspotPopup.bind(this) } close={ ()=>{ this.setState({showCRMPopup: false}) } }/>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:facebook" title="Facebook Likes" name="facebookLikes" updateIndicator={ this.handleChange } defaultStatus = { this.props.actualIndicators.facebookLikes } maxValue={50000} description="The number of likes in your Facebook page." showAutomaticPopup={ this.showFacebookPopup.bind(this) } automaticIndicators={ this.props.isFacebookAuto }/>
              <Item icon="indicator:facebookEngagement" link='fb' title="Facebook Engagement" name="facebookEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.facebookEngagement } maxValue={100} isPercentage = {true} description="Your Facebook engagement rate, measures your brand’s effectiveness at engaging your audience through Facebook." showAutomaticPopup={ this.showFacebookPopup.bind(this) } automaticIndicators={ this.props.isFacebookAuto }/>
              <Item icon="indicator:twitter" title="Twitter Followers" name="twitterFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.twitterFollowers }  maxValue={30000} description="The number of followers on your Twitter page." showAutomaticPopup={ this.showTwitterPopup.bind(this) } automaticIndicators={ this.props.isTwitterAuto }/>
              <Item icon="indicator:twitterEngagement" link='twtr' title="Twitter Engagement" name="twitterEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.twitterEngagement } maxValue={100} isPercentage = {true} description="Your Twitter engagement rate, measures your brand’s effectiveness at engaging your audience through Twitter." showAutomaticPopup={ this.showTwitterPopup.bind(this) } automaticIndicators={ this.props.isTwitterAuto }/>
              <Item icon="indicator:linkedin" title="LinkedIn Followers" name="linkedinFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.linkedinFollowers } maxValue={12000} description="The number of followers on your LinkedIn page." showAutomaticPopup={ this.showLinkedinPopup.bind(this) } automaticIndicators={ this.props.isLinkedinAuto }/>
              <Item icon="indicator:linkedinEngagement" link='in' title="LinkedIn Engagement" name="linkedinEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.linkedinEngagement } maxValue={100} isPercentage = {true} description="Your LinkedIn engagement rate, measures your brand’s effectiveness at engaging your audience through LinkedIn." showAutomaticPopup={ this.showLinkedinPopup.bind(this) } automaticIndicators={ this.props.isLinkedinAuto }/>
              <Item icon="indicator:instagram" title="Instagram Followers" name="instagramFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.instagramFollowers } maxValue={20000} description="The number of followers on your Instagram page."/>
              <Item icon="indicator:instagramEngagement" link='inst' title="Instagram Engagement" name="instagramEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.instagramEngagement } maxValue={100} isPercentage = {true} description="Your Instagram engagement rate, measures your brand’s effectiveness at engaging your audience through Instagram."/>
              <Item icon="indicator:google" title="Google+ Followers" name="googlePlusFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.googlePlusFollowers } maxValue={16000} description="The number of followers on your Google+ page."/>
              <Item icon="indicator:googleEngagement" link='gp' title="Google+ Engagement" name="googlePlusEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.googlePlusEngagement } maxValue={100} isPercentage = {true} description="Your Google+ engagement rate, measures your brand’s effectiveness at engaging your audience through Google+."/>
              <Item icon="indicator:pinterest" title="Pinterest Followers" name="pinterestFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.pinterestFollowers } maxValue={10000} description="The number of followers on your Instagram page."/>
              <Item icon="indicator:pinterestEngagement" link='pin' title="Pinterest Engagement" name="pinterestEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.pinterestEngagement } maxValue={100} isPercentage = {true} description="Your Pinterest engagement rate, measures your brand’s effectiveness at engaging your audience through Pinterest."/>
              <Item icon="indicator:youtube" title="Youtube Subscribers" name="youtubeSubscribers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.youtubeSubscribers } maxValue={5000} description="The number of subscribers on your Youtube page."/>
              <Item icon="indicator:youtubeEngagement" link='utu' title="Youtube Engagement" name="youtubeEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.youtubeEngagement } maxValue={100} isPercentage = {true} description="Your Youtube engagement rate, measures your brand’s effectiveness at engaging your audience through Youtube."/>
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:mcl" title="Leads" name="MCL" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.MCL } maxValue={10000} isFunnel={true} description="Think of leads as those folks who know about you and have opted in to hear from you periodically, or those which have shown some interest in what you offer. Typically a lead has filled out a form with more than just an email address. We see companies use the lead lifecycle stage for what we think of as general, broadly appealing, or top of the funnel offers. As each lead demonstrates a higher degree of sales readiness and qualification, they will move to further stages." showAutomaticPopup={ this.showCRMPopup.bind(this) } automaticIndicators={ this.isFunnelAuto('MCL') }/>
              <Item icon="indicator:mql" title="Marketing Qualified Leads" name="MQL" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.MQL } maxValue={5000} isFunnel={true} description="Marketing Qualified Leads, commonly known as MQLs, are those people who have raised their hands (metaphorically speaking) and identified themselves as more deeply engaged, sales-ready contacts than your usual leads, but who have not yet become fully fledged opportunities. Ideally, you should only allow certain, designated forms to trigger the promotion of a lead to the MQL stage, specifically those that gate bottom of the funnel offers like demo requests, buying guides, and other sales-ready calls to action." showAutomaticPopup={ this.showCRMPopup.bind(this) } automaticIndicators={ this.isFunnelAuto('MQL') }/>
              <Item icon="indicator:sql" title="Sales Qualified Leads" name="SQL" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.SQL } maxValue={2000} isFunnel={true} description="Sales Qualified Leads, commonly known as SQLs, are those that your sales team has accepted as worthy of a direct sales follow up. Using this stage will help your sales and marketing teams stay firmly on the same page in terms of the quality and volume of leads that you are handing over to your sales team." showAutomaticPopup={ this.showCRMPopup.bind(this) } automaticIndicators={ this.isFunnelAuto('SQL') }/>
              <Item icon="indicator:opps" title="Opportunities" name="opps" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.opps } maxValue={1000} isFunnel={true} description="Opportunities are contacts who have become real sales opportunities in your CRM." showAutomaticPopup={ this.showCRMPopup.bind(this) } automaticIndicators={ this.isFunnelAuto('opps') }/>
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:ltv" title="Life Time Value" name="LTV" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.LTV } maxValue={400000} isDollar={true} description="Measures the profit your business makes from any given customer." formula="Formula – ARPA / Churn Rate (10% is equal to 0.1)."/>
              <Item icon="indicator:cac" title="Customer Acquisition Cost" name="CAC" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.CAC } maxValue={20000} isDirectionDown= { true } isDollar={true} description="Refers to the resources that a business must allocate (financial or otherwise) in order to acquire an additional customer. It includes every single effort necessary to introduce your products and services to potential customers, and then convince them to buy and become active customers." formula="Formula - Total Sales & Marketing expenses / # of New Account (Paying Customers)."/>
              {/** <Item icon="indicator:numberOfSales" title="Number Of Sales" name="numberOfSales" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.numberOfSales } />
               <Item icon="indicator:sales" title="Sales Revenue" name="salesRevenue" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.salesRevenue } /> **/}
              <Item icon="indicator:trialUsers" title="Trial Users" name="trialUsers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.trialUsers } maxValue={2500} description="The number of trial users the company currently has."/>
              <Item icon="indicator:users" title="Paying Accounts" name="users" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.users } maxValue={7000} description="The numbers of paying customers the company currently has (an account can have multiple users)." showAutomaticPopup={ this.showCRMPopup.bind(this) } automaticIndicators={ this.isFunnelAuto('users') }/>
              <Item icon="indicator:activeUsers" title="Active Users Rate" name="activeUsersRate" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.activeUsersRate } maxValue={100} isPercentage = {true} description="How many of your current users/accounts are active (actively using your product / service)?"/>
              {/**<Item icon="indicator:customerRetentionRate" title="Customer Retention Rate" name="customerRetentionRate" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.customerRetentionRate } isPercentage = 'true' />**/}
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:googleMentions" title="Google Mentions" name="googleMentions" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.googleMentions } maxValue={200000} description="# of mentions when typing your company name in quotes (“Company name”)."/>
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:sessions" title="Sessions" name="sessions" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.sessions } maxValue={300000} description="Website total visits during the last 30 days." showAutomaticPopup={ this.showGooglePopup.bind(this) } automaticIndicators={ this.props.isGoogleAuto }/>
              <Item icon="indicator:averageSessionDuration" title="Average Session Duration" name="averageSessionDuration" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.averageSessionDuration } maxValue={500} description="Measured in seconds (last 30 days)." showAutomaticPopup={ this.showGooglePopup.bind(this) } automaticIndicators={ this.props.isGoogleAuto }/>
              <Item icon="indicator:bounceRate" title="Bounce Rate" name="bounceRate" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.bounceRate } isPercentage = {true} maxValue={100} isDirectionDown= { true } description="The percentage of visitors to a particular website who navigate away from the site after viewing only one page." showAutomaticPopup={ this.showGooglePopup.bind(this) } automaticIndicators={ this.props.isGoogleAuto }/>
              <Item icon="indicator:blogVisits" title="Blog Visits" name="blogVisits" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.blogVisits } maxValue={25000} description="Blog total visits during the last 30 days."/>
              <Item icon="indicator:blogSubscribers" title="Blog Subscribers" name="blogSubscribers" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.blogSubscribers } maxValue={ 7000 } description="The number of blog subscriber the company currently has."/>
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:mrr" title="MRR" name="MRR" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.MRR } maxValue={1000000} isDollar={true} description="Monthly Recurrent Revenue." formula="Formula - SUM(Paying customers monthly fee)."/>
              <Item icon="indicator:churnRate" title="Churn Rate" name="churnRate" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.churnRate } isPercentage = { true } maxValue={ 18 } isDirectionDown= { true } description="The number or percentage of subscribers to a service that discontinue their subscription to that service in a given time period." formula="Formula - # of accounts who churned / Last month total # of accounts."/>
              <Item icon="indicator:arpa" title="ARPA (monthly)" name="ARPA" updateIndicator = { this.handleChange } defaultStatus = { this.props.actualIndicators.ARPA } maxValue={17000} isDollar={true} description="Average Revenue Per Account. a measure of the revenue generated per account, per month (sometimes known as ARPU – average revenue per user)." formula="Formula – ARPA = MRR / # of accounts (paying customers)."/>
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
            <div className={ this.classes.almostFooter }>
              <label hidden={ !this.state.validationError} style={{ color: 'red' }}>Please fill all the required fields</label>
            </div>
            <BackButton onClick={() => {
              this.props.updateUserMonthPlan({actualIndicators: this.props.actualIndicators}, this.props.region, this.props.planDate)
                .then(() => {
                  history.push('/preferences');
                });
            }} />
            <div style={{ width: '30px' }} />
            <PlanButton onClick={() => {
              if (this.validate()){
                this.props.updateUserMonthPlan({actualIndicators: this.props.actualIndicators}, this.props.region, this.props.planDate)
                  .then(() => {
                    history.push('/plan');
                  });
              }
              else {
                this.setState({validationError: true});
              }
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