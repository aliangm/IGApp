import React from 'react';
import Component from 'components/Component';
import ProgressBar from 'components/pages/campaigns/ProgressBar';
import Task from 'components/pages/campaigns/Task';
import CampaignTask from 'components/pages/campaigns/CampaignTask';
import Textfield from 'components/controls/Textfield';
import Label from 'components/ControlsLabel';
import { formatBudget } from 'components/utils/budget';
import style from 'styles/onboarding/onboarding.css';
import trackingStyle from 'styles/campaigns/tracking.css';
import Select from 'components/controls/Select';
import Button from 'components/controls/Button';

export default class Tracking extends Component {

  style = style;
  styles = [trackingStyle];

  constructor(props) {
    super(props);
    this.state = {
      isHttp: true
    }
  };

  handleChangeSource = (event) => {
    this.props.updateState({
      channel: event.value
    });
  };

  toggleProtocol() {
    let update = Object.assign({}, this.props.campaign);
    update.tracking.isHttp = !this.props.campaign.tracking.isHttp;
    this.props.updateState({campaign: update});
  }

  handleChange(parameter, event) {
    let update = Object.assign({}, this.props.campaign);
    update.tracking[parameter] = event.target.value;
    this.props.updateState({campaign: update});
  }

  generateLink() {
    let update = Object.assign({}, this.props.campaign);
    const url = this.props.campaign.tracking.isHttp ? 'http://' : 'https://' +
      this.props.campaign.tracking.baseUrl +
      '/?utm_source=' + this.refs.source.props.value +
      '&utm_medium=' + this.refs.medium.props.value +
      '&utm_campaign=' + this.props.campaign.name;
    fetch('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyDEoi0JNfWmDlnN8swZz_tZc3Vu14yV0rw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({longUrl: encodeURI(url)})
    })
      .then((response) => {
        response.json()
          .then((data) => {
            if (data) {
              update.tracking.trackingUrl = data.longUrl;
              update.tracking.shortenedTrackingUrl = data.id;
              this.props.updateState({campaign: update, unsaved: false});
              this.props.updateCampaign(this.props.campaign, this.props.index, this.props.channel);
            }
          })
      })
      .catch((error) => {
        console.log(error);
      });

  }

  handleFocus(event) {
    event.target.select();
  }

  render() {
    const selects = {
      source: {
        label: 'Source',
        select: {
          name: 'source',
          options: [ { value: 'web_landingPages', label: 'Web / Landing Pages' },
            { value: 'web_companyWebsite',
              label: 'Web / Company’s Website' },
            { value: 'viral_recommendAFriend_referralProgram',
              label: 'Viral / Recommend a Friend / Referral Program (P2P)' },
            { value: 'telemarketing', label: 'Telemarketing' },
            { value: 'social_productHunt',
              label: 'Social / Product Hunt (Launch)' },
            { value: 'social_communityBuilding',
              label: 'Social / Community Building' },
            { value: 'social_influencerOutreach',
              label: 'Social / Influencer Outreach' },
            { value: 'social_linkedinGroup',
              label: 'Social / LinkedIn Group' },
            { value: 'social_linkedinCompanyProfile',
              label: 'Social / LinkedIn Company Profile' },
            { value: 'social_pinterestPage',
              label: 'Social / Pinterest Page' },
            { value: 'social_googlePlusPage',
              label: 'Social / Google+ Page' },
            { value: 'social_instagramAccount',
              label: 'Social / Instagram Account' },
            { value: 'social_youtubeChannel',
              label: 'Social / Youtube Channel' },
            { value: 'social_twitterAccount',
              label: 'Social / Twitter Account' },
            { value: 'social_facebookPage',
              label: 'Social / Facebook Page' },
            { value: 'PR_publicity_pressReleases_international',
              label: 'PR / Publicity / Press Releases / International' },
            { value: 'PR_publicity_pressReleases_nationwide',
              label: 'PR / Publicity / Press Releases / Nationwide' },
            { value: 'PR_publicity_pressReleases_local',
              label: 'PR / Publicity / Press Releases / Local' },
            { value: 'PR_unconventionalPR_customerAppreciation',
              label: 'PR / Unconventional PR / Customer Appreciation' },
            { value: 'PR_unconventionalPR_publicityStunts',
              label: 'PR / Unconventional PR / Publicity Stunts' },
            { value: 'partners_affiliatePrograms',
              label: 'Partners / Affiliate Programs' },
            { value: 'mobile_mobileSite', label: 'Mobile / Mobile Site' },
            { value: 'mobile_mobileApp', label: 'Mobile / Mobile App' },
            { value: 'events_onlineEvents_workshop',
              label: 'Events / Online Events / Workshop' },
            { value: 'events_onlineEvents_podcast',
              label: 'Events / Online Events / Podcast' },
            { value: 'events_onlineEvents_webinar',
              label: 'Events / Online Events / Webinar' },
            { value: 'events_offlineEvents_running',
              label: 'Events / Offline Events / Organising' },
            { value: 'events_offlineEvents_showcase',
              label: 'Events / Offline Events / Showcase (Trade Shows, Exhibitions)' },
            { value: 'events_offlineEvents_speakingEngagements',
              label: 'Events / Offline Events / Speaking Engagements' },
            { value: 'events_offlineEvents_sponsorship',
              label: 'Events / Offline Events / Sponsorship' },
            { value: 'engineeringAsMarketing_other',
              label: 'Engineering as Marketing / Other' },
            { value: 'engineeringAsMarketing_educationalMicrosites',
              label: 'Engineering as Marketing / Educational Microsites' },
            { value: 'engineeringAsMarketing_widget',
              label: 'Engineering as Marketing / Widget' },
            { value: 'engineeringAsMarketing_calculator',
              label: 'Engineering as Marketing / Calculator' },
            { value: 'engineeringAsMarketing_professionalTool',
              label: 'Engineering as Marketing / Professional Tool' },
            { value: 'email_transactionalEmail',
              label: 'Email / Transactional Email' },
            { value: 'email_marketingEmail',
              label: 'Email / Marketing Email' },
            { value: 'content_contentCreation_caseStudies',
              label: 'Content / Content Creation / Case Studies' },
            { value: 'content_contentCreation_videos',
              label: 'Content / Content Creation / Videos' },
            { value: 'content_contentCreation_eBook',
              label: 'Content / Content Creation / E-book' },
            { value: 'content_contentCreation_researchPaper',
              label: 'Content / Content Creation / Research Paper (Whitepaper)' },
            { value: 'content_contentCreation_reportSponsorship',
              label: 'Content / Content Creation / Report Sponsorship' },
            { value: 'content_contentCreation_presentations',
              label: 'Content / Content Creation / Presentations' },
            { value: 'content_contentCreation_imagesAndInfographics',
              label: 'Content / Content Creation / Images & Infographics' },
            { value: 'content_contentCreation_companyBlog',
              label: 'Content / Content Creation / Blog Posts - Company Blog' },
            { value: 'content_contentPromotion_forums_other',
              label: 'Content / Content Promotion / Forums / Other' },
            { value: 'content_contentPromotion_forums_quora',
              label: 'Content / Content Promotion / Forums / Quora' },
            { value: 'content_contentPromotion_forums_reddit',
              label: 'Content / Content Promotion / Forums / Reddit' },
            { value: 'content_contentPromotion_contentDiscovery_other',
              label: 'Content / Content Promotion / Content Discovery / Other' },
            { value: 'content_contentPromotion_contentDiscovery_taboola',
              label: 'Content / Content Promotion / Content Discovery / Taboola' },
            { value: 'content_contentPromotion_contentDiscovery_outbrain',
              label: 'Content / Content Promotion / Content Discovery / Outbrain' },
            { value: 'content_contentPromotion_targetingBlogs',
              label: 'Content / Content Promotion / Targeting Blogs (guest)' },
            { value: 'advertising_celebrityEndorsements',
              label: 'Advertising / Celebrity Endorsements' },
            { value: 'advertising_paidReviews',
              label: 'Advertising / Paid Reviews' },
            { value: 'advertising_magazines_professional_international',
              label: 'Advertising / Magazines / Professional / International' },
            { value: 'advertising_magazines_professional_nationwide',
              label: 'Advertising / Magazines / Professional / Nationwide' },
            { value: 'advertising_magazines_professional_local',
              label: 'Advertising / Magazines / Professional / Local' },
            { value: 'advertising_magazines_consumers_international',
              label: 'Advertising / Magazines / Consumers / International' },
            { value: 'advertising_magazines_consumers_nationwide',
              label: 'Advertising / Magazines / Consumers / Nationwide' },
            { value: 'advertising_magazines_consumers_local',
              label: 'Advertising / Magazines / Consumers / Local' },
            { value: 'advertising_mobile_inAppAds',
              label: 'Advertising / Mobile / In-app ads' },
            { value: 'advertising_mobile_ASO',
              label: 'Advertising / Mobile / ASO (App Store Optimization)' },
            { value: 'advertising_mobile_nonIncentivizedCPI',
              label: 'Advertising / Mobile / Non-Incentivized CPI' },
            { value: 'advertising_mobile_incentivizedCPI',
              label: 'Advertising / Mobile / Incentivized CPI' },
            { value: 'advertising_offlineAds_SMS',
              label: 'Advertising / Offline Ads / SMS' },
            { value: 'advertising_offlineAds_billboard',
              label: 'Advertising / Offline Ads / Billboard' },
            { value: 'advertising_offlineAds_newspaper_international',
              label: 'Advertising / Offline Ads / Newspaper / International' },
            { value: 'advertising_offlineAds_newspaper_nationwide',
              label: 'Advertising / Offline Ads / Newspaper / Nationwide' },
            { value: 'advertising_offlineAds_newspaper_local',
              label: 'Advertising / Offline Ads / Newspaper / Local' },
            { value: 'advertising_offlineAds_radio',
              label: 'Advertising / Offline Ads / Radio' },
            { value: 'advertising_offlineAds_TV_international',
              label: 'Advertising / Offline Ads / TV / International' },
            { value: 'advertising_offlineAds_TV_nationwide',
              label: 'Advertising / Offline Ads / TV / Nationwide' },
            { value: 'advertising_offlineAds_TV_local',
              label: 'Advertising / Offline Ads / TV / Local' },
            { value: 'advertising_socialAds_youtubeAdvertising',
              label: 'Advertising / Paid Social / YouTube Advertising' },
            { value: 'advertising_socialAds_GooglePlusAdvertising',
              label: 'Advertising / Paid Social / Google+ Advertising' },
            { value: 'advertising_socialAds_pinterestAdvertising',
              label: 'Advertising / Paid Social / Pinterest Advertising' },
            { value: 'advertising_socialAds_instagramAdvertising',
              label: 'Advertising / Paid Social / Instagram Advertising' },
            { value: 'advertising_socialAds_linkedinAdvertising',
              label: 'Advertising / Paid Social / LinkedIn Advertising' },
            { value: 'advertising_socialAds_twitterAdvertising',
              label: 'Advertising / Paid Social / Twitter Advertising' },
            { value: 'advertising_socialAds_facebookAdvertising',
              label: 'Advertising / Paid Social / Facebook Advertising' },
            { value: 'advertising_searchMarketing_SEM_other',
              label: 'Advertising / Search Marketing / SEM (PPC) / Other' },
            { value: 'advertising_searchMarketing_SEM_googleAdwords',
              label: 'Advertising / Search Marketing / SEM (PPC) / Google AdWords' },
            { value: 'advertising_searchMarketing_SEO',
              label: 'Advertising / Search Marketing / SEO' },
            { value: 'advertising_displayAds_other',
              label: 'Advertising / Display Ads / Other' },
            { value: 'advertising_displayAds_googleAdwords',
              label: 'Advertising / Display Ads / Google AdWords' } ]
        }
      },
    };
    let source = this.props.channel;
    let medium = 'Other';
    const value = selects.source.select.options
      .find(item => item.value === this.props.channel);
    if (value) {
      const title = value.label;
      const titleArray = title.split('/');
      source = titleArray[titleArray.length -1].trim();
      medium = titleArray[titleArray.length -2].trim();
    }
    return <div>
      <div className={ trackingStyle.locals.baseUrl }>
        <div className={ trackingStyle.locals.protocolBox } onClick={ this.toggleProtocol.bind(this) }>
          <div className={ trackingStyle.locals.protocol }>
            {this.props.campaign.tracking.isHttp ? 'http://' : 'https://' }
          </div>
        </div>
        <div className={ trackingStyle.locals.userBoxUrl }>
          <input className={ trackingStyle.locals.userInputUrl } placeholder="Enter URL" value={ this.props.campaign.tracking.baseUrl } onChange={ this.handleChange.bind(this, 'baseUrl') }/>
        </div>
      </div>
      <div className={ this.classes.row }>
        <Label style={{ fontSize: '18px', fontWeight: 'bold' }}>UTMs</Label>
      </div>
      <div className={ this.classes.row }>
        <Label>Source</Label>
        <Textfield value={ source } readOnly={true} ref="source"/>
      </div>
      <div className={ this.classes.row }>
        <Label>Medium</Label>
        <Textfield value={ medium } readOnly={true} ref="medium"/>
      </div>
      <div className={ this.classes.row }>
        <Label>Campaign</Label>
        <Textfield value={ this.props.campaign.name } readOnly={true}/>
      </div>
      <div className={ trackingStyle.locals.rowCenter }>
        <Button type="accent2" style={{ width: '170px' }} onClick={ this.generateLink.bind(this) }>
          Generate link
        </Button>
      </div>
      <div className={trackingStyle.locals.urls }>
        <div className={ trackingStyle.locals.urlLine }>
          <Label className={ trackingStyle.locals.urlTitle }>Full Tracking URL</Label>
          <Textfield className={ trackingStyle.locals.urlTextbox } value={ this.props.campaign.tracking.trackingUrl } readOnly={true} onFocus={ this.handleFocus.bind(this) }/>
        </div>
        <div className={ trackingStyle.locals.urlLine }>
          <Label className={ trackingStyle.locals.urlTitle }>Shortened Tracking URL</Label>
          <Textfield className={ trackingStyle.locals.urlTextbox } value={ this.props.campaign.tracking.shortenedTrackingUrl } readOnly={true} onFocus={ this.handleFocus.bind(this) }/>
        </div>
      </div>
    </div>
  }

}