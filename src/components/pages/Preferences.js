import React from 'react';

import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Calendar from 'components/controls/Calendar';
import Label from 'components/ControlsLabel';
import Notice from 'components/Notice';
import MultiRow from 'components/MultiRow';

import Title from 'components/onboarding/Title';
import ProfileProgress from 'components/pages/profile/Progress';
import ProfileInsights from 'components/pages/profile/Insights';
import BackButton from 'components/pages/profile/BackButton';
import NextButton from 'components/pages/profile/NextButton';
import SaveButton from 'components/pages/profile/SaveButton';
import ButtonsSet from 'components/pages/profile/ButtonsSet';
import NotSure from 'components/onboarding/NotSure';

import style from 'styles/onboarding/onboarding.css';
import preferencesStyle from 'styles/preferences/preferences.css';

import { isPopupMode } from 'modules/popup-mode';
import history from 'history';
import serverCommunication from 'data/serverCommunication';

export default class Preferences extends Component {
  style = style
  styles = [preferencesStyle]

  constructor(props) {
    super(props);
    this.state = {
      goals: {
        primary: 'InfiniGrow Recommended',
        secondary: 'InfiniGrow Recommended'
      },
      maxChannels: -1,
      showErrorMessage: [false, false, false]
    };
    //this.state.targetAudience = { };
    this.handleChangeGoals = this.handleChangeGoals.bind(this);
    this.rowRemoved = this.rowRemoved.bind(this);
  }

  validate() {
    return this.state.annualBudget;
  }

  componentDidMount(){
    let self = this;
    if (isPopupMode()){
      self.setState({isLoaded: true});
    }
    else {
      serverCommunication.serverRequest('GET', 'usermonthplan')
        .then((response) => {
          response.json()
            .then(function (data) {
              if (data) {
                if (data.error) {
                  history.push('/');
                }
                else {
                  self.setState({
                    annualBudget: data.annualBudget,
                    goals: {
                      primary: data.goals && data.goals.primary || 'InfiniGrow Recommended',
                      secondary: data.goals && data.goals.secondary || 'InfiniGrow Recommended'
                    },
                    blockedChannels: data.blockedChannels || [],
                    maxChannels: data.maxChannels || -1,
                    isLoaded: true
                  });
                }
              }
            })
        })
        .catch(function (err) {
          self.setState({serverDown: true});
          console.log(err);
        })
    }
  }

  handleChangeGoals(parameter, event){
    let update = this.state.goals || {};
    update[parameter] = event.value;
    this.setState({goals: update});
  }

  handleChangeBudget(parameter, event){
    let update = {};
    update[parameter] = parseInt(event.target.value.replace('$',''));
    this.setState(update);
  }

  handleChangeBlockedChannels(index, event){
    if (typeof event.value === 'string') {
      var errors = this.state.showErrorMessage;
      errors[index] = false;
      this.setState({showErrorMessage: errors});
      let update = this.state.blockedChannels || [];
      update.splice(index, 1, event.value);
      this.setState({blockedChannels: update});
    }
    else {
      var errors = this.state.showErrorMessage;
      errors[index] = true;
      this.setState({showErrorMessage: errors});
    }
  }

  handleChangeMax(parameter, event) {
    const number = parseInt(event.target.value);
    if (number) {
      this.setState({maxChannels: number});
    }
  }

  rowRemoved(index){
    let update = this.state.blockedChannels || [];
    update.splice(index, 1);
    this.setState({blockedChannels: update});
  }

  render() {
    const selects = {
      /**     plan: {
        label: 'Plan Resolution',
        select: {
          name: 'plan',
          onChange: () => {},
          options: [
            { val: 'days', label: 'Days' },
            { val: 'months', label: 'Months' },
            { val: 'years', label: 'Years' }
          ]
        }
      }, **/
      primary_goal: {
        label: 'Primary Goal',
        select: {
          name: 'primary_goal',
          onChange: () => {},
          options: [
            { value: 'InfiniGrow Recommended', label: 'InfiniGrow Recommended' },
            { value: 'Revenue - Long Term', label: 'Revenue - Long Term' },
            { value: 'Revenue - Short Term', label: 'Revenue - Short Term' },
            { value: 'Number of Users', label: 'Number of Users' },
            { value: 'Reputation', label: 'Reputation' },
            { value: 'Marketing ROI', label: 'Marketing ROI' },
            { value: 'Grow Market Share', label: 'Grow Market Share' },
            { value: 'Brand Awareness', label: 'Brand Awareness' },
            { value: 'Better Quality Customers', label: 'Better Quality Customers' },
            { value: 'Target New Customers', label: 'Target New Customers' },
            { value: 'Increase Retention Rates', label: 'Increase Retention Rates' },
            { value: 'Number Of Job Applicants', label: 'Number Of Job Applicants' },
            { value: 'Thought Leadership', label: 'Thought Leadership' }
          ]
        }
      },
      secondary_goal: {
        label: 'Secondary Goal',
        select: {
          name: 'secondary_goal',
          onChange: () => {},
          options: [
            { value: 'InfiniGrow Recommended', label: 'InfiniGrow Recommended' },
            { value: 'Revenue - Long Term', label: 'Revenue - Long Term' },
            { value: 'Revenue - Short Term', label: 'Revenue - Short Term' },
            { value: 'Number of Users', label: 'Number of Users' },
            { value: 'Reputation', label: 'Reputation' },
            { value: 'Marketing ROI', label: 'Marketing ROI' },
            { value: 'Grow Market Share', label: 'Grow Market Share' },
            { value: 'Brand Awareness', label: 'Brand Awareness' },
            { value: 'Better Quality Customers', label: 'Better Quality Customers' },
            { value: 'Target New Customers', label: 'Target New Customers' },
            { value: 'Increase Retention Rates', label: 'Increase Retention Rates' },
            { value: 'Number Of Job Applicants', label: 'Number Of Job Applicants' },
            { value: 'Thought Leadership', label: 'Thought Leadership' }
          ]
        }
      }
    };

    const flatChannels = [];
    const channels = [
      {
        name: 'Advertising',
        children: [
          { name: 'Display Ads', children: [
            { name: 'Google AdWords', value: 'advertising_displayAds_googleAdwords' },
            { name: 'Other', value: 'advertising_displayAds_other' },
          ] },
          { name: 'Search Marketing', children: [
            { name: 'SEO', value: 'advertising_searchMarketing_SEO' },
            { name: 'SEM (PPC)', children: [
              { name: 'Google AdWords', value: 'advertising_searchMarketing_SEM_googleAdwords' },
              { name: 'Other', value: 'advertising_searchMarketing_SEM_other' }
            ] },
          ] },
          { name: 'Social Ads', children: [
            {name: 'SEM (PPC)', children: [
              {name: 'Facebook Advertising', value: 'advertising_socialAds_facebookAdvertising'},
              {name: 'Twitter Advertising', value: 'advertising_socialAds_twitterAdvertising'},
              {name: 'LinkedIn Advertising', value: 'advertising_socialAds_linkedinAdvertising'},
              {name: 'Instagram Advertising', value: 'advertising_socialAds_instagramAdvertising'},
              {name: 'Pinterest Advertising', value: 'advertising_socialAds_pinterestAdvertising'},
              {name: 'Google+ Advertising', value: 'advertising_socialAds_GooglePlusAdvertising'},
              {name: 'YouTube Advertising', value: 'advertising_socialAds_youtubeAdvertising' }
            ]}
          ] },
          { name: 'Offline Ads', children: [
            {name: 'TV', children: [
              {name: 'Local', value: 'advertising_offlineAds_TV_local'},
              {name: 'Nationwide', value: 'advertising_offlineAds_TV_nationwide'},
              {name: 'International', value: 'advertising_offlineAds_TV_international'}
            ]},
            {name: 'Radio', value: 'advertising_offlineAds_radio'},
            { name: 'Newspaper', children: [
              {name: 'Local', value: 'advertising_offlineAds_newspaper_local'},
              {name: 'Nationwide', value: 'advertising_offlineAds_newspaper_nationwide'},
              {name: 'International', value: 'advertising_offlineAds_newspaper_international'}
            ]},
            { name: 'Billboard', value: 'advertising_offlineAds_billboard' },
            { name: 'SMS', value: 'advertising_offlineAds_SMS' },
          ] },
          { name: 'Mobile', children: [
            { name: 'Incentivized CPI', value: 'advertising_mobile_incentivizedCPI' },
            { name: 'Non-Incentivized CPI', value: 'advertising_mobile_nonIncentivizedCPI' },
            { name: 'ASO (App Store Optimization)', value: 'advertising_mobile_ASO' },
            { name: 'In-app ads', value: 'advertising_mobile_inAppAds' }
          ] },
          { name: 'Magazines', children: [
            { name: 'Consumers', children: [
              { name: 'Local', value: 'advertising_magazines_consumers_local' },
              { name: 'Nationwide', value: 'advertising_magazines_consumers_nationwide' },
              { name: 'International', value: 'advertising_magazines_consumers_international' },
            ] },
            { name: 'Professional', children: [
              { name: 'Local', value: 'advertising_magazines_professional_local' },
              { name: 'Nationwide', value: 'advertising_magazines_professional_nationwide' },
              { name: 'International', value: 'advertising_magazines_professional_international' },
            ] },
          ] },
          { name: 'Paid Reviews', value: 'advertising_paidReviews' },
          { name: 'Celebrity Endorsements', value: 'advertising_celebrityEndorsements' },
        ]
      },
      { name: 'Content', children: [
        { name: 'Content Promotion', children: [
          { name: 'Targeting Blogs (guest)',value: 'content_contentPromotion_targetingBlogs' },
          { name: 'Content Discovery', children: [
            { name: 'Outbrain', value: 'content_contentPromotion_contentDiscovery_outbrain' },
            { name: 'Taboola', value: 'content_contentPromotion_contentDiscovery_taboola' },
            { name: 'Other', value: 'content_contentPromotion_contentDiscovery_other' }
          ] },
          { name: 'Forums', children: [
            { name: 'Reddit', value: 'content_contentPromotion_forums_reddit' },
            { name: 'Quora', value: 'content_contentPromotion_forums_quora' },
            { name: 'Other', value: 'content_contentPromotion_forums_other' }
          ] },
          { name: 'EBooks' },
        ] },
        {name: 'Content Creation', children: [
          { name: 'Blog Posts - Company Blog (on website)', value: 'content_contentCreation_companyBlog' },
          { name: 'Images & Infographics', value: 'content_contentCreation_imagesAndInfographics' },
          { name: 'Presentations', value: 'content_contentCreation_presentations' },
          { name: 'Report Sponsorship', value: 'content_contentCreation_reportSponsorship' },
          { name: 'Research Paper (Whitepaper)', value: 'content_contentCreation_researchPaper' },
          { name: 'E-book', value: 'content_contentCreation_eBook' },
          { name: 'Videos', value: 'content_contentCreation_videos' },
          { name: 'Case Studies', value: 'content_contentCreation_caseStudies' }
        ]}
      ]},
      { name: 'Email', children: [
        { name: 'Marketing Email', value: 'email_marketingEmail' },
        { name: 'Transactional Email', value: 'email_transactionalEmail' },
      ] },
      { name: 'Engineering as Marketing', children: [
        { name: 'Professional Tool', value: 'engineeringAsMarketing_professionalTool' },
        { name: 'Calculator', value: 'engineeringAsMarketing_calculator' },
        { name: 'Widget', value: 'engineeringAsMarketing_widget' },
        { name: 'Educational Microsites', value: 'engineeringAsMarketing_educationalMicrosites' },
        { name: 'Other', value: 'engineeringAsMarketing_other' }
      ]},
      { name: 'Events', children: [
        { name: 'Offline Events' , children: [
          { name: 'Sponsorship', value: 'events_offlineEvents_sponsorship' },
          { name: 'Speaking Engagements (Conferences)', value: 'events_offlineEvents_speakingEngagements' },
          { name: 'Showcase (Trade Shows, Exhibitions)', value: 'events_offlineEvents_showcase' },
          { name: 'Running', value: 'events_offlineEvents_running' }
        ] },
        { name: 'Online Events (Running)', children: [
          { name: 'Webinar', value: 'events_onlineEvents_webinar' },
          { name: 'Podcast', value: 'events_onlineEvents_podcast' },
          { name: 'Workshop', value: 'events_onlineEvents_workshop' }
        ] },
      ] },
      { name: 'Mobile', children: [
        { name: 'Mobile App', value: 'mobile_mobileApp' },
        { name: 'Mobile Site', value: 'mobile_mobileSite' }
      ] },
      { name: 'Partners', children: [
        { name: 'Affiliate Programs', value: 'partners_affiliatePrograms' }
      ]},
      { name: 'PR', children: [
        { name: 'Unconventional PR', children: [
          { name: 'Publicity Stunts', value: 'PR_unconventionalPR_publicityStunts' },
          { name: 'Customer Appreciation', value: 'PR_unconventionalPR_customerAppreciation' }
        ] },
        { name: 'Publicity', children: [
          { name: 'Press Releases', children: [
            { name: 'Local', value: 'PR_publicity_pressReleases_local' },
            { name: 'Nationwide', value: 'PR_publicity_pressReleases_nationwide' },
            { name: 'International', value: 'PR_publicity_pressReleases_international' },
          ]}
        ] }
      ] },
      { name: 'Social', children: [
        { name: 'Facebook Page', value: 'social_facebookPage' },
        { name: 'Twitter Account', value: 'social_twitterAccount' },
        { name: 'Youtube Channel', value: 'social_youtubeChannel' },
        { name: 'Instagram Account', value: 'social_instagramAccount' },
        { name: 'Google+ Page', value: 'social_googlePlusPage' },
        { name: 'Pinterest Page', value: 'social_pinterestPage' },
        { name: 'LinkedIn Company Profile', value: 'social_linkedinCompanyProfile' },
        { name: 'LinkedIn Group', value: 'social_linkedinGroup' },
        { name: 'Influencer Outreach', value: 'social_influencerOutreach' },
        { name: 'Community Building', value: 'social_communityBuilding' },
        { name: 'Product Hunt (Launch)', value: 'social_productHunt' }
      ] },
      { name: 'Telemarketing', value: 'telemarketing' },
      { name: 'Viral', children: [
        { name: 'Recommend a Friend', children: [
          { name: 'Referral Program (P2P)', value: 'viral_recommendAFriend_referralProgram' }
        ]}
      ] },
      { name: 'Web', children: [
        { name: 'Company’s Website', value: 'web_companyWebsite' },
        { name: 'Landing Pages', value: 'web_landingPages' }
      ] }
    ].forEach((channel) => {
      mapChannel(channel, 0);
    });

    function mapChannel(channel, indent) {
      flatChannels.push({
        label: channel.name,
        value: channel.value,
        indent: indent
      });

      if (channel.children) {
        channel.children.forEach((channel) => {
          mapChannel(channel, indent + 1);
        });
      }
    }

    return <div>
      <Header />
      <Sidebar />
      <Page popup={ isPopupMode() }>
        <Title title="Preferences" subTitle="Tell us your goals and constrains. Different objectives dictate different strategies" />
        <div className={ this.classes.error }>
          <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our support. </label>
        </div>
        { this.state.isLoaded ?
          <div className={ this.classes.cols }>
            <div className={ this.classes.colLeft }>
              {/**
               <div className={ this.classes.row } style={{
              width: '258px'
            }}>
               <Label question>Start Date</Label>
               <Calendar />
               </div> **/}
              <div className={ this.classes.row }>
                <Label question>Plan Annual Budget ($)</Label>
                <div className={ this.classes.cell }>
                  <Textfield defaultValue={"$" + (this.state.annualBudget || '')} onChange={ this.handleChangeBudget.bind(this, 'annualBudget')} style={{
                  width: '166px'
                }} />
                  {/** <NotSure style={{
                  marginLeft: '10px'
                }} /> **/}
                </div>
              </div>
              {/**
               <div className={ this.classes.row } style={{
              // maxWidth: '440px',
              // minWidth: '200px',
              width: '258px'
            }}>
               <Select { ... selects.plan } />
               </div>
               **/}
              <div className={ this.classes.row } style={{
              // maxWidth: '440px',
              // minWidth: '200px',
              width: '258px'
            }}>
                <Select { ... selects.primary_goal } selected={ this.state.goals.primary } onChange= { this.handleChangeGoals.bind(this, 'primary') }/>
              </div>
              <div className={ this.classes.row } style={{
              // maxWidth: '440px',
              // minWidth: '200px',
              width: '258px'
            }}>
                <Select { ... selects.secondary_goal } selected={ this.state.goals.secondary } onChange= { this.handleChangeGoals.bind(this, 'secondary') }/>
              </div>
              <div className={ this.classes.row }>
                <Label question>#of Channels</Label>
                <div className={ this.classes.cell }>
                  <Textfield defaultValue="MAX" onChange={ this.handleChangeMax.bind(this, '')} style={{
                  width: '166px'
                }} />
                  {/** <NotSure style={{
                  marginLeft: '10px'
                }} /> **/}
                </div>
              </div>
              <div className={ this.classes.row } style={{
              
            }}>
                <h3 style={{
                marginBottom: '0'
              }}>Blocked Channels</h3>
                <Notice warning style={{
                margin: '12px 0'
              }}>
                  * Please notice that adding channel constrains is limiting the ideal plan creation
                </Notice>
                <MultiRow numOfRows={ (this.state.blockedChannels && this.state.blockedChannels.length) || 0 } rowRemoved={this.rowRemoved} maxNumOfRows= {3} >
                  {({ index, data, update, removeButton }) => {
                    return <div style={{
                    width: '492px'
                  }} className={ preferencesStyle.locals.channelsRow }>
                      <Select
                        className={ preferencesStyle.locals.channelsSelect }
                        selected={ (this.state.blockedChannels && this.state.blockedChannels[index]) || -1 }
                        select={{
                        menuTop: true,
                        name: 'channels',
                        onChange: (selected) => {
                          update({
                            selected: selected
                          });
                        },
                        options: flatChannels
                      }}
                        onChange = { this.handleChangeBlockedChannels.bind(this, index) }
                        label={ `#${ index + 1 } (optional)` }
                      />
                      <div className={ preferencesStyle.locals.channelsRemove }>
                        { removeButton }
                      </div>
                      <div className={ preferencesStyle.locals.error }>
                        <label hidden={ !this.state.showErrorMessage[index]}>Please choose a leaf channel</label>
                      </div>
                    </div>
                  }}
                </MultiRow>
              </div>
            </div>

            { isPopupMode() ?

              <div className={ this.classes.colRight }>
                <div className={ this.classes.row }>
                  <ProfileProgress progress={ 76 } image={
                require('assets/flower/4.png')
              }
                                   text="You rock!"/>
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
            history.push('/target-audience');
          }} />
            <div style={{ width: '30px' }} />
            <NextButton onClick={() => {
              if (this.validate()) {
              serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({annualBudget: this.state.annualBudget, goals: { primary: this.state.goals.primary, secondary: this.state.goals.secondary }, blockedChannels: this.state.blockedChannels, maxChannels: this.state.maxChannels}))
							.then(function(data){
							});
            history.push('/indicators');
            }
            else {
            		this.setState({validationError: true});
            }
            }
          } />
          </div>

          :
          <div className={ this.classes.footer }>
            <SaveButton onClick={() => {
              let self = this;
		serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({annualBudget: this.state.annualBudget, goals: { primary: this.state.goals.primary, secondary: this.state.goals.secondary }, blockedChannels: this.state.blockedChannels, maxChannels: this.state.maxChannels}))
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
