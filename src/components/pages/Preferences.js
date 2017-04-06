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

  budgetWeights = [0.07, 0.11, 0.13, 0.13, 0.11, 0.05, 0.04, 0.04, 0.09, 0.09, 0.12, 0.02];

  constructor(props) {
    super(props);
    this.state = {
      goals: {
        primary: 'InfiniGrow Recommended',
        secondary: 'InfiniGrow Recommended'
      },
      isCheckAnnual: true,
      maxChannels: -1,
      notLeafBlockedChannelError: [false, false, false],
      blockedChannelAlreadyExistsError: [false, false, false],
      notLeafInHouseChannelError: [false, false, false],
      inHouseChannelAlreadyExistsError: [false, false, false]
    };
    this.handleChangeGoals = this.handleChangeGoals.bind(this);
    this.blockedChannelRemove = this.blockedChannelRemove.bind(this);
    this.inHouseChannelRemove = this.inHouseChannelRemove.bind(this);
    this.minimumBudgetRemove = this.minimumBudgetRemove.bind(this);
    this.toggleCheck = this.toggleCheck.bind(this);
  }

  validate() {
    let filterNanArray = this.state.annualBudgetArray.filter((value)=>{return !!value});
    return filterNanArray.length == 12;
  }

  componentDidMount() {
    let self = this;
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
                  annualBudgetArray: data.annualBudgetArray || [],
                  planDate: data.planDate,
                  goals: {
                    primary: data.goals && data.goals.primary || 'InfiniGrow Recommended',
                    secondary: data.goals && data.goals.secondary || 'InfiniGrow Recommended'
                  },
                  blockedChannels: data.blockedChannels || [],
                  inHouseChannels: data.inHouseChannels || [],
                  userMinMonthBudgets: data.userMinMonthBudgets || {},
                  maxChannels: data.maxChannels || -1,
                  isCheckAnnual: data.annualBudget!==null,
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

  handleChangeGoals(parameter, event) {
    let update = this.state.goals || {};
    update[parameter] = event.value;
    this.setState({goals: update});
    if (this.state.goals.primary == 'InfiniGrow Recommended' && this.state.goals.secondary != 'InfiniGrow Recommended') {
      this.setState({
        goals: {
          primary: this.state.goals.secondary,
          secondary: 'InfiniGrow Recommended'
        }
      })
    }
  }

  handleChangeBudget(parameter, event) {
    let update = {};
    update[parameter] = parseInt(event.target.value.replace(/[-$,]/g, ''));

    let planDate = this.state.planDate.split("/");
    let firstMonth = parseInt(planDate[0]) - 1;

    let budget = [];
    this.budgetWeights.forEach((element, index) => {
      budget[(index + 12 - firstMonth) % 12] = Math.round(element * update[parameter]);
    });
    update['annualBudgetArray'] = budget;

    this.setState(update);
  }

  handleChangeBudgetArray(index, event) {
    let update = this.state.annualBudgetArray || [];
    update.splice(index, 1, parseInt(event.target.value.replace(/[-$,]/g, '')));
    this.setState({annualBudgetArray: update});
  }

  handleChangeBlockedChannels(index, event) {
    /**if (typeof event.value === 'string') {
      var errors = this.state.notLeafBlockedChannelError;
      errors[index] = false;
      this.setState({notLeafBlockedChannelError: errors});
      let update = this.state.blockedChannels || [];
      update.splice(index, 1, event.value);
      this.setState({blockedChannels: update});
    }
     else {
      var errors = this.state.notLeafBlockedChannelError;
      errors[index] = true;
      this.setState({notLeafBlockedChannelError: errors});
      let update = this.state.blockedChannels || [];
      update.splice(index, 1, event.value);
      this.setState({blockedChannels: update});
    }**/
    var notLeafChannelError = this.state.notLeafBlockedChannelError;
    var channelAlreadyExistsError = this.state.blockedChannelAlreadyExistsError;
    notLeafChannelError[index] = false;
    channelAlreadyExistsError[index] = false;
    this.setState({notLeafBlockedChannelError: notLeafChannelError, blockedChannelAlreadyExistsError: channelAlreadyExistsError});

    if (this.state.blockedChannels.indexOf(event.value) === -1) {
      var errors = this.state.notLeafBlockedChannelError;
      errors[index] = (typeof event.value === 'string') ? false : true;
      this.setState({notLeafBlockedChannelError: errors});
      let update = this.state.blockedChannels || [];
      update.splice(index, 1, event.value);
      this.setState({blockedChannels: update});
    }
    else {
      var errors = this.state.blockedChannelAlreadyExistsError;
      errors[index] = true;
      this.setState({blockedChannelAlreadyExistsError: errors});
      let update = this.state.blockedChannels || [];
      update.splice(index, 1);
      this.setState({blockedChannels: update});
    }

  }

  handleChangeInHouseChannels(index, event) {
    let notLeafChannelError = this.state.notLeafInHouseChannelError;
    let channelAlreadyExistsError = this.state.inHouseChannelAlreadyExistsError;
    notLeafChannelError[index] = false;
    channelAlreadyExistsError[index] = false;
    this.setState({notLeafInHouseChannelError: notLeafChannelError, inHouseChannelAlreadyExistsError: channelAlreadyExistsError});

    if (this.state.inHouseChannels.indexOf(event.value) === -1) {
      let errors = this.state.notLeafInHouseChannelError;
      errors[index] = typeof event.value !== 'string';
      this.setState({notLeafInHouseChannelError: errors});
      let update = this.state.inHouseChannels || [];
      update.splice(index, 1, event.value);
      this.setState({inHouseChannels: update});
    }
    else {
      let errors = this.state.inHouseChannelAlreadyExistsError;
      errors[index] = true;
      this.setState({inHouseChannelAlreadyExistsError: errors});
      let update = this.state.inHouseChannels || [];
      update.splice(index, 1);
      this.setState({inHouseChannels: update});
    }

  }

  handleChangeMax(parameter, event) {
    const number = parseInt(event.target.value);
    if (number && number > 0) {
      this.setState({maxChannels: number});
    }
    else {
      this.setState({maxChannels: -1});
    }
  }

  inHouseChannelRemove(index) {
    let update = this.state.inHouseChannels || [];
    update.splice(index, 1);
    this.setState({inHouseChannels: update});
  }

  blockedChannelRemove(index) {
    let update = this.state.blockedChannels || [];
    update.splice(index, 1);
    this.setState({blockedChannels: update});
  }

  minimumBudgetRemove(index) {
    let update = this.state.userMinMonthBudgets || {};
    let channel = Object.keys(update)[index];
    delete update[channel];
    this.setState({userMinMonthBudgets: update});
  }

  handleChangeMinChannel(index, event) {
    let update = this.state.userMinMonthBudgets || {};
    let channel = Object.keys(update)[index];
    if (channel) {
      update[event.value] = update[channel];
      delete update[channel];
    }
    else {
      update[event.value] = null;
    }
    this.setState({userMinMonthBudgets: update});
  }

  handleChangeMinBudget(index, event) {
    let update = this.state.userMinMonthBudgets || {};
    let channel = Object.keys(update)[index];
    update[channel] = parseInt(event.target.value.replace(/[-$,]/g, ''));
    this.setState({userMinMonthBudgets: update});
  }

  getDates = () => {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    var dates = [];
    for (var i = 0; i < 12; i++) {
      var planDate = this.state.planDate.split("/");
      var date = new Date(planDate[1], planDate[0] - 1);
      date.setMonth(date.getMonth() + i);
      dates.push(monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2));
    }
    return dates;
  }

  monthBudgets() {
    const datesArray = this.getDates();
    return datesArray.map((month, index) => {
      return <div className={ this.classes.cell } key={index}>
        <Label style={{width: '70px', marginTop: '12px'}}>{month}</Label>
        <Textfield
          value={"$" + (this.state.annualBudgetArray[index] ? this.state.annualBudgetArray[index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
          onChange={ this.handleChangeBudgetArray.bind(this, index)} style={{
          width: '166px'
        }}/>
      </div>
    });
  }

  toggleCheck() {
    if (this.state.isCheckAnnual) {
      let prevBudget = this.state.annualBudget;
      let planDate = this.state.planDate.split("/");
      let firstMonth = parseInt(planDate[0]) - 1;

      let budget = [];
      this.budgetWeights.forEach((element, index) => {
        budget[(index + 12 - firstMonth) % 12] = Math.round(element * prevBudget);
      });

      this.setState({annualBudget: null, annualBudgetArray: budget});
    }
    else {
      let sum = this.state.annualBudgetArray.reduce((a, b) => a + b, 0);
      this.setState({annualBudget: sum});
    }
    this.setState({isCheckAnnual: !this.state.isCheckAnnual});
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
        labelQuestion: [''],
        description: ['What is your company main goal for marketing? The goal should be aligned with and support your business goals. By default, InfiniGrow will choose the goal it thinks is the most relevant, based on your data.'],
        select: {
          name: 'primary_goal',
          onChange: () => {},
          options: [
            {value: 'InfiniGrow Recommended', label: 'InfiniGrow Recommended'},
            {value: 'Revenue - Long Term', label: 'Revenue - Long Term'},
            {value: 'Revenue - Short Term', label: 'Revenue - Short Term'},
            {value: 'Reputation', label: 'Reputation'},
            {value: 'Marketing ROI', label: 'Marketing ROI'},
            {value: 'Market Share', label: 'Market Share'},
            {value: 'Brand Awareness', label: 'Brand Awareness'},
            {value: 'Better Quality Customers', label: 'Better Quality Customers'},
            {value: 'Lead Generation', label: 'Lead Generation'},
            {value: 'Retention Rates', label: 'Retention Rates'},
            {value: 'Number Of Job Applicants', label: 'Number Of Job Applicants'},
            {value: 'Thought Leadership', label: 'Thought Leadership'}
          ]
        }
      },
      secondary_goal: {
        label: 'Secondary Goal',
        labelQuestion: [''],
        description: ['What is your company secondary goal for marketing? The goal should be aligned with and support your business goals. By default, InfiniGrow will choose the goal it thinks is the most relevant, based on your data.'],
        select: {
          name: 'secondary_goal',
          onChange: () => {},
          options: [
            {value: 'InfiniGrow Recommended', label: 'InfiniGrow Recommended'},
            {value: 'Revenue - Long Term', label: 'Revenue - Long Term'},
            {value: 'Revenue - Short Term', label: 'Revenue - Short Term'},
            {value: 'Reputation', label: 'Reputation'},
            {value: 'Marketing ROI', label: 'Marketing ROI'},
            {value: 'Market Share', label: 'Market Share'},
            {value: 'Brand Awareness', label: 'Brand Awareness'},
            {value: 'Better Quality Customers', label: 'Better Quality Customers'},
            {value: 'Lead Generation', label: 'Lead Generation'},
            {value: 'Retention Rates', label: 'Retention Rates'},
            {value: 'Number Of Job Applicants', label: 'Number Of Job Applicants'},
            {value: 'Thought Leadership', label: 'Thought Leadership'}
          ]
        }
      }
    };

    const flatChannels = [];
    const channels = [
      {
        name: 'Advertising',
        children: [
          {
            name: 'Display Ads', children: [
            {name: 'Google AdWords', value: 'advertising_displayAds_googleAdwords'},
            {name: 'Other (not Google Ads)', value: 'advertising_displayAds_other'},
          ]
          },
          {
            name: 'Search Marketing', children: [
            {name: 'SEO', value: 'advertising_searchMarketing_SEO'},
            {
              name: 'SEM (PPC)', children: [
              {name: 'Google AdWords', value: 'advertising_searchMarketing_SEM_googleAdwords'},
              {name: 'Other (not Google Ads)', value: 'advertising_searchMarketing_SEM_other'}
            ]
            },
          ]
          },
          {
            name: 'Social Ads', children: [
            {name: 'Facebook Advertising', value: 'advertising_socialAds_facebookAdvertising'},
            {name: 'Twitter Advertising', value: 'advertising_socialAds_twitterAdvertising'},
            {name: 'LinkedIn Advertising', value: 'advertising_socialAds_linkedinAdvertising'},
            {name: 'Instagram Advertising', value: 'advertising_socialAds_instagramAdvertising'},
            {name: 'Pinterest Advertising', value: 'advertising_socialAds_pinterestAdvertising'},
            {name: 'Google+ Advertising', value: 'advertising_socialAds_GooglePlusAdvertising'},
            {name: 'YouTube Advertising', value: 'advertising_socialAds_youtubeAdvertising'}
          ]
          },
          {
            name: 'Offline Ads', children: [
            {
              name: 'TV', children: [
              {name: 'Local', value: 'advertising_offlineAds_TV_local'},
              {name: 'Nationwide', value: 'advertising_offlineAds_TV_nationwide'},
              {name: 'International', value: 'advertising_offlineAds_TV_international'}
            ]
            },
            {name: 'Radio', value: 'advertising_offlineAds_radio'},
            {
              name: 'Newspaper', children: [
              {name: 'Local', value: 'advertising_offlineAds_newspaper_local'},
              {name: 'Nationwide', value: 'advertising_offlineAds_newspaper_nationwide'},
              {name: 'International', value: 'advertising_offlineAds_newspaper_international'}
            ]
            },
            {name: 'Billboard', value: 'advertising_offlineAds_billboard'},
            {name: 'SMS', value: 'advertising_offlineAds_SMS'},
          ]
          },
          {
            name: 'Mobile', children: [
            {name: 'Incentivized CPI', value: 'advertising_mobile_incentivizedCPI'},
            {name: 'Non-Incentivized CPI', value: 'advertising_mobile_nonIncentivizedCPI'},
            {name: 'ASO (App Store Optimization)', value: 'advertising_mobile_ASO'},
            {name: 'In-app ads', value: 'advertising_mobile_inAppAds'}
          ]
          },
          {
            name: 'Magazines', children: [
            {
              name: 'Consumers', children: [
              {name: 'Local', value: 'advertising_magazines_consumers_local'},
              {name: 'Nationwide', value: 'advertising_magazines_consumers_nationwide'},
              {name: 'International', value: 'advertising_magazines_consumers_international'},
            ]
            },
            {
              name: 'Professional', children: [
              {name: 'Local', value: 'advertising_magazines_professional_local'},
              {name: 'Nationwide', value: 'advertising_magazines_professional_nationwide'},
              {name: 'International', value: 'advertising_magazines_professional_international'},
            ]
            },
          ]
          },
          {name: 'Paid Reviews', value: 'advertising_paidReviews'},
          {name: 'Celebrity Endorsements', value: 'advertising_celebrityEndorsements'},
        ]
      },
      {
        name: 'Content', children: [
        {
          name: 'Content Promotion', children: [
          {name: 'Targeting Blogs (guest)', value: 'content_contentPromotion_targetingBlogs'},
          {
            name: 'Content Discovery', children: [
            {name: 'Outbrain', value: 'content_contentPromotion_contentDiscovery_outbrain'},
            {name: 'Taboola', value: 'content_contentPromotion_contentDiscovery_taboola'},
            {name: 'General', value: 'content_contentPromotion_contentDiscovery_other'}
          ]
          },
          {
            name: 'Forums', children: [
            {name: 'Reddit', value: 'content_contentPromotion_forums_reddit'},
            {name: 'Quora', value: 'content_contentPromotion_forums_quora'},
            {name: 'Niche Specific', value: 'content_contentPromotion_forums_other'}
          ]
          },
          {name: 'EBooks'},
        ]
        },
        {
          name: 'Content Creation', children: [
          {name: 'Blog Posts - Company Blog (on website)', value: 'content_contentCreation_companyBlog'},
          {name: 'Images & Infographics', value: 'content_contentCreation_imagesAndInfographics'},
          {name: 'Presentations', value: 'content_contentCreation_presentations'},
          {name: 'Report Sponsorship', value: 'content_contentCreation_reportSponsorship'},
          {name: 'Research Paper (Whitepaper)', value: 'content_contentCreation_researchPaper'},
          {name: 'E-book', value: 'content_contentCreation_eBook'},
          {name: 'Videos', value: 'content_contentCreation_videos'},
          {name: 'Case Studies', value: 'content_contentCreation_caseStudies'}
        ]
        }
      ]
      },
      {
        name: 'Email', children: [
        {name: 'Marketing Email', value: 'email_marketingEmail'},
        {name: 'Transactional Email', value: 'email_transactionalEmail'},
      ]
      },
      {
        name: 'Engineering as Marketing', children: [
        {name: 'Professional Tool', value: 'engineeringAsMarketing_professionalTool'},
        {name: 'Calculator', value: 'engineeringAsMarketing_calculator'},
        {name: 'Widget', value: 'engineeringAsMarketing_widget'},
        {name: 'Educational Microsites', value: 'engineeringAsMarketing_educationalMicrosites'},
        {name: 'Any', value: 'engineeringAsMarketing_other'}
      ]
      },
      {
        name: 'Events', children: [
        {
          name: 'Offline Events', children: [
          {name: 'Sponsorship', value: 'events_offlineEvents_sponsorship'},
          {name: 'Speaking Engagements (Conferences)', value: 'events_offlineEvents_speakingEngagements'},
          {name: 'Showcase (Trade Shows, Exhibitions)', value: 'events_offlineEvents_showcase'},
          {name: 'Running', value: 'events_offlineEvents_running'}
        ]
        },
        {
          name: 'Online Events (Running)', children: [
          {name: 'Webinar', value: 'events_onlineEvents_webinar'},
          {name: 'Podcast', value: 'events_onlineEvents_podcast'},
          {name: 'Workshop', value: 'events_onlineEvents_workshop'}
        ]
        },
      ]
      },
      {
        name: 'Mobile', children: [
        {name: 'Mobile App', value: 'mobile_mobileApp'},
        {name: 'Mobile Site', value: 'mobile_mobileSite'}
      ]
      },
      {
        name: 'Partners', children: [
        {name: 'Affiliate Programs', value: 'partners_affiliatePrograms'}
      ]
      },
      {
        name: 'PR', children: [
        {
          name: 'Unconventional PR', children: [
          {name: 'Publicity Stunts', value: 'PR_unconventionalPR_publicityStunts'},
          {name: 'Customer Appreciation', value: 'PR_unconventionalPR_customerAppreciation'}
        ]
        },
        {
          name: 'Publicity', children: [
          {
            name: 'Press Releases', children: [
            {name: 'Local', value: 'PR_publicity_pressReleases_local'},
            {name: 'Nationwide', value: 'PR_publicity_pressReleases_nationwide'},
            {name: 'International', value: 'PR_publicity_pressReleases_international'},
          ]
          }
        ]
        }
      ]
      },
      {
        name: 'Social', children: [
        {name: 'Facebook Page', value: 'social_facebookPage'},
        {name: 'Twitter Account', value: 'social_twitterAccount'},
        {name: 'Youtube Channel', value: 'social_youtubeChannel'},
        {name: 'Instagram Account', value: 'social_instagramAccount'},
        {name: 'Google+ Page', value: 'social_googlePlusPage'},
        {name: 'Pinterest Page', value: 'social_pinterestPage'},
        {name: 'LinkedIn Company Profile', value: 'social_linkedinCompanyProfile'},
        {name: 'LinkedIn Group', value: 'social_linkedinGroup'},
        {name: 'Influencer Outreach', value: 'social_influencerOutreach'},
        {name: 'Community Building', value: 'social_communityBuilding'},
        {name: 'Product Hunt (Launch)', value: 'social_productHunt'}
      ]
      },
      {name: 'Telemarketing', value: 'telemarketing'},
      {
        name: 'Viral', children: [
        {
          name: 'Recommend a Friend', children: [
          {name: 'Referral Program (P2P)', value: 'viral_recommendAFriend_referralProgram'}
        ]
        }
      ]
      },
      {
        name: 'Web', children: [
        {name: 'Company’s Website', value: 'web_companyWebsite'},
        {name: 'Landing Pages', value: 'web_landingPages'}
      ]
      }
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
      <Page popup={ isPopupMode() } width={isPopupMode() ? 'initial' : '1051px'}>
        <Title title="Preferences"
               subTitle="What are your marketing goals and constrains? Different objectives dictate different strategies"/>
        <div className={ this.classes.error }>
          <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our
            support. </label>
        </div>
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
              <Label checkbox={this.state.isCheckAnnual} toggleCheck={ this.toggleCheck.bind(this) } question={['']}
                     description={['What is your marketing budget for the next 12 months?']}>Plan Annual Budget
                ($)</Label>
              <div className={ this.classes.cell }>
                <Textfield disabled={!this.state.isCheckAnnual}
                           value={"$" + (this.state.annualBudget ? this.state.annualBudget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                           onChange={ this.handleChangeBudget.bind(this, 'annualBudget')} style={{
                  width: '166px'
                }}/>
                {/** <NotSure style={{
                  marginLeft: '10px'
                }} /> **/}
              </div>
            </div>
            <div className={ this.classes.row }>
              <Label checkbox={!this.state.isCheckAnnual} toggleCheck={ this.toggleCheck.bind(this) } question={['']}
                     description={['What is your marketing budget for the next 12 months?']}>Plan Monthly Budget
                ($)</Label>
              { this.state.isCheckAnnual ? null : this.monthBudgets() }
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
              <Select { ... selects.primary_goal } selected={ this.state.goals.primary }
                      onChange={ this.handleChangeGoals.bind(this, 'primary') }/>
            </div>
            <div className={ this.classes.row } style={{
              // maxWidth: '440px',
              // minWidth: '200px',
              width: '258px'
            }}>
              <Select { ... selects.secondary_goal } selected={ this.state.goals.secondary }
                      onChange={ this.handleChangeGoals.bind(this, 'secondary') }/>
            </div>
            <div className={ this.classes.row }>
              <Label question={['']}
                     description={['Do you want to limit the number of channels that will be included in your 12 months’ plan? \n To set the number to max available channels, please leave it blank.']}>max
                number of Channels</Label>
              <Notice warning style={{
                margin: '12px 0'
              }}>
                * Please notice that adding channel constrains is limiting the InfiniGrow’s ideal planning.
              </Notice>
              <div className={ this.classes.cell }>
                <Textfield value={ this.state.maxChannels != -1 ? this.state.maxChannels : '' }
                           onChange={ this.handleChangeMax.bind(this, '')} style={{
                  width: '83px'
                }}/>
                {/** <NotSure style={{
                  marginLeft: '10px'
                }} /> **/}
              </div>
            </div>
            <div className={ this.classes.row } style={{}}>
              <Label style={{
                marginBottom: '0',
                fontWeight: '600'
              }} question={['']}
                     description={['From your experience at the company, are there any channels that you want to block InfiniGrow from using in your marketing planning?']}>Minimum Budgets</Label>
              <Notice warning style={{
                margin: '12px 0'
              }}>
                * Please notice that adding channel constrains is limiting the InfiniGrow’s ideal planning.
              </Notice>
              {this.state.isLoaded ?
                //TODO: change numOfRows and add on change and selected
                <MultiRow numOfRows={ (Object.keys(this.state.userMinMonthBudgets)).length } rowRemoved={this.minimumBudgetRemove}>
                  {({index, data, update, removeButton}) => {
                    return <div style={{
                      width: '623px'
                    }} className={ preferencesStyle.locals.channelsRow }>
                      <Select
                        className={ preferencesStyle.locals.channelsSelect }
                        selected={ (this.state.userMinMonthBudgets && Object.keys(this.state.userMinMonthBudgets)[index]) || -1 }
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
                        onChange={ this.handleChangeMinChannel.bind(this, index) }
                        label={ `#${ index + 1 } (optional)` }
                      />
                      <Textfield className={ preferencesStyle.locals.channelsBudget } value={"$" + (this.state.userMinMonthBudgets[(Object.keys(this.state.userMinMonthBudgets))[index]] ? this.state.userMinMonthBudgets[(Object.keys(this.state.userMinMonthBudgets))[index]].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                                 onChange={ this.handleChangeMinBudget.bind(this, index)} style={{
                        width: '82px'
                      }} disabled={ !Object.keys(this.state.userMinMonthBudgets)[index] }/>
                      <div className={ preferencesStyle.locals.channelsRemove }>
                        { removeButton }
                      </div>
                      <div className={ preferencesStyle.locals.error }>
                        <label hidden={ true }>please choose a leaf channel</label>
                        <label hidden={ true }>channel already in use</label>
                      </div>
                    </div>
                  }}
                </MultiRow>
                : null }
            </div>
            <div className={ this.classes.row } style={{}}>
              <Label style={{
                marginBottom: '0',
                fontWeight: '600'
              }} question={['']}
                     description={['From your experience at the company, are there any channels that you want to block InfiniGrow from using in your marketing planning?']}>In-house Channels</Label>
              <Notice warning style={{
                margin: '12px 0'
              }}>
                * Please notice that adding channel constrains is limiting the InfiniGrow’s ideal planning.
              </Notice>
              {this.state.isLoaded ?
                <MultiRow numOfRows={ this.state.inHouseChannels.length } rowRemoved={this.inHouseChannelRemove}>
                  {({index, data, update, removeButton}) => {
                    return <div style={{
                      width: '492px'
                    }} className={ preferencesStyle.locals.channelsRow }>
                      <Select
                        className={ preferencesStyle.locals.channelsSelect }
                        selected={ (this.state.inHouseChannels && this.state.inHouseChannels[index]) || -1 }
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
                        onChange={ this.handleChangeInHouseChannels.bind(this, index) }
                        label={ `#${ index + 1 } (optional)` }
                      />
                      <div className={ preferencesStyle.locals.channelsRemove }>
                        { removeButton }
                      </div>
                      <div className={ preferencesStyle.locals.error }>
                        <label hidden={ !this.state.notLeafInHouseChannelError[index]}>please choose a leaf channel</label>
                        <label hidden={ !this.state.inHouseChannelAlreadyExistsError[index]}>channel already in use</label>
                      </div>
                    </div>
                  }}
                </MultiRow>
                : null }
            </div>
            <div className={ this.classes.row } style={{}}>
              <Label style={{
                marginBottom: '0',
                fontWeight: '600'
              }} question={['']}
                     description={['From your experience at the company, are there any channels that you want to block InfiniGrow from using in your marketing planning?']}>Blocked
                Channels</Label>
              <Notice warning style={{
                margin: '12px 0'
              }}>
                * Please notice that adding channel constrains is limiting the InfiniGrow’s ideal planning.
              </Notice>
              {this.state.isLoaded ?
                <MultiRow numOfRows={ this.state.blockedChannels.length } rowRemoved={this.blockedChannelRemove}
                          maxNumOfRows={3}>
                  {({index, data, update, removeButton}) => {
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
                        onChange={ this.handleChangeBlockedChannels.bind(this, index) }
                        label={ `#${ index + 1 } (optional)` }
                      />
                      <div className={ preferencesStyle.locals.channelsRemove }>
                        { removeButton }
                      </div>
                      <div className={ preferencesStyle.locals.error }>
                        <label hidden={ !this.state.notLeafBlockedChannelError[index]}>please choose a leaf channel</label>
                        <label hidden={ !this.state.blockedChannelAlreadyExistsError[index]}>channel already in use</label>
                      </div>
                    </div>
                  }}
                </MultiRow>
                : null }
            </div>
          </div>

          { isPopupMode() ?

            <div className={ this.classes.colRight }>
              <div className={ this.classes.row }>
                <ProfileProgress progress={ 76 } image={
                  require('assets/flower/4.png')
                }
                                 text="You rock! Hope you’re starting to get excited about planning the right way"/>
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
              <label hidden={ !this.state.validationError} style={{color: 'red'}}>Please fill all the required
                fields</label>
            </div>
            <BackButton onClick={() => {
              serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({
                annualBudget: this.state.annualBudget,
                annualBudgetArray: this.state.annualBudgetArray,
                goals: {primary: this.state.goals.primary, secondary: this.state.goals.secondary},
                blockedChannels: this.state.blockedChannels,
                inHouseChannels: this.state.inHouseChannels,
                userMinMonthBudgets: this.state.userMinMonthBudgets,
                maxChannels: this.state.maxChannels
              }))
                .then(function (data) {
                  history.push('/target-audience');
                });
            }}/>
            <div style={{width: '30px'}}/>
            <NextButton onClick={() => {
              if (this.validate()) {
                serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({
                  annualBudget: this.state.annualBudget,
                  annualBudgetArray: this.state.annualBudgetArray,
                  goals: {primary: this.state.goals.primary, secondary: this.state.goals.secondary},
                  blockedChannels: this.state.blockedChannels,
                  inHouseChannels: this.state.inHouseChannels,
                  userMinMonthBudgets: this.state.userMinMonthBudgets,
                  maxChannels: this.state.maxChannels
                }))
                  .then(function (data) {
                    history.push('/indicators');
                  });
              }
              else {
                this.setState({validationError: true});
              }
            }
            }/>
          </div>

          :
          <div className={ this.classes.footer }>
            <SaveButton onClick={() => {
              if (this.validate()) {
                let self = this;
                self.setState({saveFail: false, saveSuceess: false});
                serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({
                  annualBudget: this.state.annualBudget,
                  annualBudgetArray: this.state.annualBudgetArray,
                  goals: {primary: this.state.goals.primary, secondary: this.state.goals.secondary},
                  blockedChannels: this.state.blockedChannels,
                  inHouseChannels: this.state.inHouseChannels,
                  userMinMonthBudgets: this.state.userMinMonthBudgets,
                  maxChannels: this.state.maxChannels
                }))
                  .then(function (data) {
                    if (data.ok) {
                      self.setState({saveSuceess: true});
                    }
                    else {
                      self.setState({saveFail: true});
                    }
                  })
                  .catch(function (err) {
                    self.setState({saveFail: true});
                  });
              }
              else {
                this.setState({saveFail: true});
              }
            }} success={ this.state.saveSuceess } fail={ this.state.saveFail }/>
          </div>
        }
      </Page>
    </div>
  }
}
