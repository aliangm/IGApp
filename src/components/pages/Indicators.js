import React from 'react';

import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Label from 'components/ControlsLabel';

import Title from 'components/onboarding/Title';
import ProfileProgress from 'components/pages/profile/Progress';
import ProfileInsights from 'components/pages/profile/Insights';
import BackButton from 'components/pages/profile/BackButton';
import PlanButton from 'components/pages/indicators/PlanButton';
import SaveButton from 'components/pages/profile/SaveButton';
import Item from 'components/pages/indicators/Item';

import style from 'styles/onboarding/onboarding.css';
import indiStyle from 'styles/indicators/indicators.css';

import { isPopupMode, disablePopupMode } from 'modules/popup-mode';
import history from 'history';
import serverCommunication from 'data/serverCommunication';

export default class Indicators extends Component {
  style = style;
  styles = [indiStyle];

  constructor(props) {
    super(props);
    this.state = {actualIndicators: {} };
    this.handleChange = this.handleChange.bind(this);
    this.changeRegion = this.changeRegion.bind(this);
  }

  componentDidMount(){
    this.getUserMonthPlan(localStorage.getItem('region'));
  }

  getUserMonthPlan(region, planDate) {
    let self = this;
    serverCommunication.serverRequest('GET', 'usermonthplan', null, region, planDate)
      .then((response) => {
        response.json()
          .then(function (data) {
            if (data) {
              if (data.error) {
                history.push('/');
              }
              else {
                self.setState({
                  actualIndicators: data.actualIndicators,
                  planDate: data.planDate,
                  region: data.region,
                  isLoaded: true
                });
              }
            }
          })
      })
      .catch(function (err) {
        self.setState({serverDown: true});
        console.log(err);
      });
  }

  changeRegion(region){
    this.getUserMonthPlan(region);
  }

  validate() {
    return this.state.actualIndicators.facebookLikes &&
      this.state.actualIndicators.facebookEngagement &&
      this.state.actualIndicators.twitterFollowers &&
      this.state.actualIndicators.twitterEngagement &&
      this.state.actualIndicators.linkedinFollowers &&
      this.state.actualIndicators.linkedinEngagement &&
      this.state.actualIndicators.instagramFollowers &&
      this.state.actualIndicators.instagramEngagement &&
      this.state.actualIndicators.googlePlusFollowers &&
      this.state.actualIndicators.googlePlusEngagement &&
      this.state.actualIndicators.pinterestFollowers &&
      this.state.actualIndicators.pinterestEngagement &&
      this.state.actualIndicators.youtubeSubscribers &&
      this.state.actualIndicators.youtubeEngagement &&
      this.state.actualIndicators.LTV &&
      this.state.actualIndicators.CAC &&
      this.state.actualIndicators.users &&
      this.state.actualIndicators.activeUsersRate &&
      this.state.actualIndicators.trialUsers &&
      this.state.actualIndicators.MCL &&
      this.state.actualIndicators.MQL &&
      this.state.actualIndicators.SQL &&
      this.state.actualIndicators.googleMentions &&
      this.state.actualIndicators.sessions &&
      this.state.actualIndicators.averageSessionDuration &&
      this.state.actualIndicators.bounceRate &&
      this.state.actualIndicators.blogVisits &&
      this.state.actualIndicators.blogSubscribers &&
      this.state.actualIndicators.MRR &&
      this.state.actualIndicators.churnRate &&
      this.state.actualIndicators.ARPA;
  }

  handleChange(name, value){
    let update = Object.assign({}, this.state.actualIndicators);
    value = parseInt(value);
    if (!isNaN(value)) {
      update[name] = value;
      this.setState({actualIndicators: update});
    }
  }

  render() {
    return <div>
      <Header selectedRegion={this.state.region} changeRegion={ this.changeRegion }/>
      <Sidebar />
      <Page popup={ isPopupMode() } width={isPopupMode() ? 'initial' : '1051px'}>
        <Title title="Metrics" subTitle="Marketing is great, but without measuring the impact on your metrics, there is no real point in it." />
        <div className={ this.classes.error }>
          <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our support. </label>
        </div>
        { this.state.isLoaded ?
          <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:facebook" title="Facebook Likes" name="facebookLikes" updateIndicator={ this.handleChange } defaultStatus = { this.state.actualIndicators.facebookLikes } maxValue={50000} description="The number of likes in your Facebook page."/>
              <Item icon="indicator:facebookEngagement" link='fb' title="Facebook Engagement" name="facebookEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.facebookEngagement } maxValue={100} isPercentage = {true} description="Your Facebook engagement rate, measures your brand’s effectiveness at engaging your audience through Facebook."/>
              <Item icon="indicator:twitter" title="Twitter Followers" name="twitterFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.twitterFollowers }  maxValue={30000} description="The number of followers on your Twitter page."/>
              <Item icon="indicator:twitterEngagement" link='twtr' title="Twitter Engagement" name="twitterEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.twitterEngagement } maxValue={100} isPercentage = {true} description="Your Twitter engagement rate, measures your brand’s effectiveness at engaging your audience through Twitter."/>
              <Item icon="indicator:linkedin" title="LinkedIn Followers" name="linkedinFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.linkedinFollowers } maxValue={12000} description="The number of followers on your LinkedIn page."/>
              <Item icon="indicator:linkedinEngagement" link='in' title="LinkedIn Engagement" name="linkedinEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.linkedinEngagement } maxValue={100} isPercentage = {true} description="Your LinkedIn engagement rate, measures your brand’s effectiveness at engaging your audience through LinkedIn."/>
              <Item icon="indicator:instagram" title="Instagram Followers" name="instagramFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.instagramFollowers } maxValue={20000} description="The number of followers on your Instagram page."/>
              <Item icon="indicator:instagramEngagement" link='inst' title="Instagram Engagement" name="instagramEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.instagramEngagement } maxValue={100} isPercentage = {true} description="Your Instagram engagement rate, measures your brand’s effectiveness at engaging your audience through Instagram."/>
              <Item icon="indicator:google" title="Google+ Followers" name="googlePlusFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.googlePlusFollowers } maxValue={16000} description="The number of followers on your Google+ page."/>
              <Item icon="indicator:googleEngagement" link='gp' title="Google+ Engagement" name="googlePlusEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.googlePlusEngagement } maxValue={100} isPercentage = {true} description="Your Google+ engagement rate, measures your brand’s effectiveness at engaging your audience through Google+."/>
              <Item icon="indicator:pinterest" title="Pinterest Followers" name="pinterestFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.pinterestFollowers } maxValue={10000} description="The number of followers on your Instagram page."/>
              <Item icon="indicator:pinterestEngagement" link='pin' title="Pinterest Engagement" name="pinterestEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.pinterestEngagement } maxValue={100} isPercentage = {true} description="Your Pinterest engagement rate, measures your brand’s effectiveness at engaging your audience through Pinterest."/>
              <Item icon="indicator:youtube" title="Youtube Subscribers" name="youtubeSubscribers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.youtubeSubscribers } maxValue={5000} description="The number of subscribers on your Youtube page."/>
              <Item icon="indicator:youtubeEngagement" link='utu' title="Youtube Engagement" name="youtubeEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.youtubeEngagement } maxValue={100} isPercentage = {true} description="Your Youtube engagement rate, measures your brand’s effectiveness at engaging your audience through Youtube."/>
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:ltv" title="Life Time Value" name="LTV" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.LTV } maxValue={400000} isDollar={true} description="Measures the profit your business makes from any given customer. Formula – ARPA / Churn Rate (10% is equal to 0.1)."/>
              <Item icon="indicator:cac" title="Customer Acquisition Cost" name="CAC" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.CAC } maxValue={20000} isDirectionDown= { true } isDollar={true} description="Refers to the resources that a business must allocate (financial or otherwise) in order to acquire an additional customer. It includes every single effort necessary to introduce your products and services to potential customers, and then convince them to buy and become active customers. Formula - Total Sales & Marketing expenses / # of New Account (Paying Customers)."/>
              {/** <Item icon="indicator:numberOfSales" title="Number Of Sales" name="numberOfSales" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.numberOfSales } />
               <Item icon="indicator:sales" title="Sales Revenue" name="salesRevenue" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.salesRevenue } /> **/}
              <Item icon="indicator:users" title="Accounts" name="users" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.users } maxValue={7000} description="The numbers of paying customers the company currently has (an account can have multiple users)."/>
              <Item icon="indicator:activeUsers" title="Active Users Rate" name="activeUsersRate" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.activeUsersRate } maxValue={100} isPercentage = {true} description="How many of your current users/accounts are active (actively using your product / service)?"/>
              <Item icon="indicator:trialUsers" title="Trial Users" name="trialUsers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.trialUsers } maxValue={2500} description="The number of trial users the company currently has."/>
              {/**<Item icon="indicator:customerRetentionRate" title="Customer Retention Rate" name="customerRetentionRate" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.customerRetentionRate } isPercentage = 'true' />**/}
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:mcl" title="MCL" name="MCL" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.MCL } maxValue={10000} description="Marketing Captured Leads."/>
              <Item icon="indicator:mql" title="MQL" name="MQL" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.MQL } maxValue={5000} description="Marketing Qualified Leads."/>
              <Item icon="indicator:sql" title="SQL" name="SQL" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.SQL } maxValue={2000} description="Sales Qualified Leads."/>
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:googleMentions" title="Google Mentions" name="googleMentions" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.googleMentions } maxValue={200000} description="# of mentions when typing your company name in quotes (“Company name”)."/>
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:sessions" title="Sessions" name="sessions" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.sessions } maxValue={300000} description="Website total visits during the last 30 days."/>
              <Item icon="indicator:averageSessionDuration" title="Average Session Duration" name="averageSessionDuration" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.averageSessionDuration } maxValue={500} description="Measured in seconds (last 30 days)."/>
              <Item icon="indicator:bounceRate" title="Bounce Rate" name="bounceRate" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.bounceRate } isPercentage = {true} maxValue={100} isDirectionDown= { true } description="The percentage of visitors to a particular website who navigate away from the site after viewing only one page."/>
              <Item icon="indicator:blogVisits" title="Blog Visits" name="blogVisits" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.blogVisits } maxValue={25000} description="Blog total visits during the last 30 days."/>
              <Item icon="indicator:blogSubscribers" title="Blog Subscribers" name="blogSubscribers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.blogSubscribers } maxValue={ 7000 } description="The number of blog subscriber the company currently has."/>
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:mrr" title="MRR" name="MRR" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.MRR } maxValue={1000000} isDollar={true} description="Monthly Recurrent Revenue. Formula - SUM(Paying customers monthly fee)."/>
              <Item icon="indicator:churnRate" title="Churn Rate" name="churnRate" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.churnRate } isPercentage = { true } maxValue={ 18 } isDirectionDown= { true } description="The number or percentage of subscribers to a service that discontinue their subscription to that service in a given time period. Formula - # of accounts who churned / Last month total # of accounts."/>
              <Item icon="indicator:arpa" title="ARPA (monthly)" name="ARPA" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.ARPA } maxValue={17000} isDollar={true} description="Average Revenue Per Account. a measure of the revenue generated per account, per month (sometimes known as ARPU – average revenue per user). Formula – ARPA = MRR / # of accounts (paying customers)."/>
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
          : null }

        { isPopupMode() ?

          <div className={ this.classes.footer }>
            <div className={ this.classes.almostFooter }>
              <label hidden={ !this.state.validationError} style={{ color: 'red' }}>Please fill all the required fields</label>
            </div>
            <BackButton onClick={() => {
            serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({actualIndicators: this.state.actualIndicators}), this.state.region, this.state.planDate)
			      .then(function(data){
              history.push('/preferences');
            });
          }} />
            <div style={{ width: '30px' }} />
            <PlanButton onClick={() => {
              if (this.validate()){
          serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({actualIndicators: this.state.actualIndicators}), this.state.region, this.state.planDate)
			      .then(function(data){
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
              let self = this;
              self.setState({saveFail: false, saveSuceess: false});
		serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({actualIndicators: this.state.actualIndicators}), this.state.region, this.state.planDate)
			.then(function(data){
			  self.setState({saveSuceess: true});
			})
			.catch(function(err){
			  self.setState({saveFail: true});
			});
            }} success={ this.state.saveSuceess } fail={ this.state.saveFail }/>
          </div>
        }
      </Page>
    </div>
  }
}