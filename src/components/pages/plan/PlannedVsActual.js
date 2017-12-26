import React from 'react';
import Component from 'components/Component';
import MultiRow from 'components/MultiRow';
import Select from 'components/controls/Select';
import SaveButton from 'components/pages/profile/SaveButton';
import Button from 'components/controls/Button';
import Textfield from 'components/controls/Textfield';
import style from 'styles/plan/planned-actual-tab.css';
import planStyles from 'styles/plan/plan.css';
import { parsePlannedVsActual } from 'data/parsePlannedVsActual';
import Paging from 'components/Paging';
import { getTitle } from 'components/utils/channels';

export default class PlannedVsActual extends Component {

  style = style;
  styles = [planStyles];

  static defaultProps = {
    planUnknownChannels: [],
    approvedBudgets: [],
    knownChannels: {},
    unknownChannels: {},
    hoverRow: void 0,
    month: 0,
  };

  constructor(props) {
    super(props);
    this.state = props;

    this.keys = [''];
    this.pagingUpdateState = this.pagingUpdateState.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  pagingUpdateState(data) {
    this.setState({
      planDate: data.planDate,
      region: data.region,
      knownChannels: data.actualChannelBudgets && data.actualChannelBudgets.knownChannels || {},
      unknownChannels: data.actualChannelBudgets && data.actualChannelBudgets.unknownChannels || {},
      approvedBudgets: data.approvedBudgets || [],
      planUnknownChannels: data.unknownChannels || [],
    });
  }

  addChannel(event) {
    if (!event){
      var update = this.state.unknownChannels;
      update[this.state.otherChannel] = 0;
      this.setState({
        unknownChannels: update,
        showText: false,
        otherChannel: ''
      });
    }
    else {
      if (typeof event.value === 'string') {
        if (event.value == 'OTHER') {
          this.setState({showText: true});
        }
        else {
          var alreadyExist = Object.keys(this.state.approvedBudgets[0]);
          alreadyExist = alreadyExist.concat(Object.keys(this.state.knownChannels), Object.keys(this.state.unknownChannels));
          if (alreadyExist.indexOf(event.value) === -1) {
            var update = this.state.knownChannels;
            update[event.value] = 0;
            this.setState({knownChannels: update});
          }
        }
      }
    }
  }

  addOtherChannel(e) {
    this.setState({otherChannel: e.target.value});
  }

  updateActual(key, value){
    const title = getTitle(key);
    if (!title){
      let update = this.state.unknownChannels;
      update[key] = value;
      this.setState({unknownChannels: update});
    }
    else {
      let update = this.state.knownChannels;
      update[key] = value;
      this.setState({knownChannels: update});
    }
  }

  getDates = () => {
    var dates = [];
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    var planDate = this.state.planDate ? this.state.planDate .split("/") : null;
    if (planDate) {
      var date = new Date(planDate[1], planDate[0] - 1);
      dates.push(monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2));
      return dates;
    }
    else return [];
  }

  render() {
    let month;
    let headRow;
    let rows;
    let channelOptions = [];
    this.keys = this.getDates();
    month = this.keys[this.state.month];
    const data = parsePlannedVsActual(this.state.approvedBudgets[0] || {}, this.state.planUnknownChannels[0] || {}, this.state.knownChannels, this.state.unknownChannels);
    if (data) {
      rows = data.map((item, i) => {
        return this.getTableRow(null, [
          item.channel,
          '$' + item.planned.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          <div className={ this.classes.cellItem }>
            <Textfield style={{
              minWidth: '72px'
            }} value={ '$' + item.actual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') } onChange={(e) => {
              let value = parseInt(e.target.value.replace(/^\$/, '').replace(',','')) || '';
              this.updateActual(item.key, value);
            }}/>
          </div>
        ], {
          key: month + i
        });
      });
    }

    headRow = this.getTableRow(null, [
      'Channels',
      'Planned',
      'Actual'
    ], {
      className: this.classes.headRow
    });

    channelOptions = [
      {
        label: 'Advertising',
        options: [
          {
            label: 'Display Ads', options: [
            {label: 'Google AdWords', value: 'advertising_displayAds_googleAdwords'},
            {label: 'Other (not Google Ads)', value: 'advertising_displayAds_other'},
          ]
          },
          {
            label: 'Search Marketing', options: [
            {label: 'SEO', value: 'advertising_searchMarketing_SEO'},
            {
              label: 'SEM (PPC)', options: [
              {label: 'Google AdWords', value: 'advertising_searchMarketing_SEM_googleAdwords'},
              {label: 'Other (not Google Ads)', value: 'advertising_searchMarketing_SEM_other'}
            ]
            },
          ]
          },
          {
            label: 'Paid Social', options: [
            {label: 'Facebook Advertising', value: 'advertising_socialAds_facebookAdvertising'},
            {label: 'Twitter Advertising', value: 'advertising_socialAds_twitterAdvertising'},
            {label: 'LinkedIn Advertising', value: 'advertising_socialAds_linkedinAdvertising'},
            {label: 'Instagram Advertising', value: 'advertising_socialAds_instagramAdvertising'},
            {label: 'Pinterest Advertising', value: 'advertising_socialAds_pinterestAdvertising'},
            {label: 'Google+ Advertising', value: 'advertising_socialAds_GooglePlusAdvertising'},
            {label: 'YouTube Advertising', value: 'advertising_socialAds_youtubeAdvertising'}
          ]
          },
          {
            label: 'Offline Ads', options: [
            {
              label: 'TV', options: [
              {label: 'Local', value: 'advertising_offlineAds_TV_local'},
              {label: 'Nationwide', value: 'advertising_offlineAds_TV_nationwide'},
              {label: 'International', value: 'advertising_offlineAds_TV_international'}
            ]
            },
            {label: 'Radio', value: 'advertising_offlineAds_radio'},
            {
              label: 'Newspaper', options: [
              {label: 'Local', value: 'advertising_offlineAds_newspaper_local'},
              {label: 'Nationwide', value: 'advertising_offlineAds_newspaper_nationwide'},
              {label: 'International', value: 'advertising_offlineAds_newspaper_international'}
            ]
            },
            {label: 'Billboard', value: 'advertising_offlineAds_billboard'},
            {label: 'SMS', value: 'advertising_offlineAds_SMS'},
          ]
          },
          {
            label: 'Mobile', options: [
            {label: 'Incentivized CPI', value: 'advertising_mobile_incentivizedCPI'},
            {label: 'Non-Incentivized CPI', value: 'advertising_mobile_nonIncentivizedCPI'},
            {label: 'ASO (App Store Optimization)', value: 'advertising_mobile_ASO'},
            {label: 'In-app ads', value: 'advertising_mobile_inAppAds'}
          ]
          },
          {
            label: 'Magazines', options: [
            {
              label: 'Consumers', options: [
              {label: 'Local', value: 'advertising_magazines_consumers_local'},
              {label: 'Nationwide', value: 'advertising_magazines_consumers_nationwide'},
              {label: 'International', value: 'advertising_magazines_consumers_international'},
            ]
            },
            {
              label: 'Professional', options: [
              {label: 'Local', value: 'advertising_magazines_professional_local'},
              {label: 'Nationwide', value: 'advertising_magazines_professional_nationwide'},
              {label: 'International', value: 'advertising_magazines_professional_international'},
            ]
            },
          ]
          },
          {label: 'Paid Reviews', value: 'advertising_paidReviews'},
          {label: 'Celebrity Endorsements', value: 'advertising_celebrityEndorsements'},
        ]
      },
      {
        label: 'Content', options: [
        {
          label: 'Content Promotion', options: [
          {label: 'Targeting Blogs (guest)', value: 'content_contentPromotion_targetingBlogs'},
          {
            label: 'Content Discovery', options: [
            {label: 'Outbrain', value: 'content_contentPromotion_contentDiscovery_outbrain'},
            {label: 'Taboola', value: 'content_contentPromotion_contentDiscovery_taboola'},
            {label: 'General', value: 'content_contentPromotion_contentDiscovery_other'}
          ]
          },
          {
            label: 'Forums', options: [
            {label: 'Reddit', value: 'content_contentPromotion_forums_reddit'},
            {label: 'Quora', value: 'content_contentPromotion_forums_quora'},
            {label: 'Niche Specific', value: 'content_contentPromotion_forums_other'}
          ]
          },
        ]
        },
        {
          label: 'Content Creation', options: [
          {label: 'Blog Posts - Company Blog (on website)', value: 'content_contentCreation_companyBlog'},
          {label: 'Images & Infographics', value: 'content_contentCreation_imagesAndInfographics'},
          {label: 'Presentations', value: 'content_contentCreation_presentations'},
          {label: 'Report Sponsorship', value: 'content_contentCreation_reportSponsorship'},
          {label: 'Research Paper (Whitepaper)', value: 'content_contentCreation_researchPaper'},
          {label: 'E-book', value: 'content_contentCreation_eBook'},
          {label: 'Videos', value: 'content_contentCreation_videos'},
          {label: 'Case Studies', value: 'content_contentCreation_caseStudies'}
        ]
        }
      ]
      },
      {
        label: 'Email', options: [
        {label: 'Marketing Email', value: 'email_marketingEmail'},
        {label: 'Transactional Email', value: 'email_transactionalEmail'},
      ]
      },
      {
        label: 'Engineering as Marketing', options: [
        {label: 'Professional Tool', value: 'engineeringAsMarketing_professionalTool'},
        {label: 'Calculator', value: 'engineeringAsMarketing_calculator'},
        {label: 'Widget', value: 'engineeringAsMarketing_widget'},
        {label: 'Educational Microsites', value: 'engineeringAsMarketing_educationalMicrosites'},
        {label: 'Any', value: 'engineeringAsMarketing_other'}
      ]
      },
      {
        label: 'Events', options: [
        {
          label: 'Offline Events', options: [
          {label: 'Sponsorship', value: 'events_offlineEvents_sponsorship'},
          {label: 'Speaking Engagements (Conferences)', value: 'events_offlineEvents_speakingEngagements'},
          {label: 'Showcase (Trade Shows, Exhibitions)', value: 'events_offlineEvents_showcase'},
          {label: 'Organising', value: 'events_offlineEvents_running'}
        ]
        },
        {
          label: 'Online Events (Running)', options: [
          {label: 'Webinar', value: 'events_onlineEvents_webinar'},
          {label: 'Podcast', value: 'events_onlineEvents_podcast'},
          {label: 'Workshop', value: 'events_onlineEvents_workshop'}
        ]
        },
      ]
      },
      {
        label: 'Mobile', options: [
        {label: 'Mobile App', value: 'mobile_mobileApp'},
        {label: 'Mobile Site', value: 'mobile_mobileSite'}
      ]
      },
      {
        label: 'Partners', options: [
        {label: 'Affiliate Programs', value: 'partners_affiliatePrograms'}
      ]
      },
      {
        label: 'PR', options: [
        {
          label: 'Unconventional PR', options: [
          {label: 'Publicity Stunts', value: 'PR_unconventionalPR_publicityStunts'},
          {label: 'Customer Appreciation', value: 'PR_unconventionalPR_customerAppreciation'}
        ]
        },
        {
          label: 'Publicity', options: [
          {
            label: 'Press Releases', options: [
            {label: 'Local', value: 'PR_publicity_pressReleases_local'},
            {label: 'Nationwide', value: 'PR_publicity_pressReleases_nationwide'},
            {label: 'International', value: 'PR_publicity_pressReleases_international'},
          ]
          }
        ]
        }
      ]
      },
      {
        label: 'Social', options: [
        {label: 'Facebook Page', value: 'social_facebookPage'},
        {label: 'Twitter Account', value: 'social_twitterAccount'},
        {label: 'Youtube Channel', value: 'social_youtubeChannel'},
        {label: 'Instagram Account', value: 'social_instagramAccount'},
        {label: 'Google+ Page', value: 'social_googlePlusPage'},
        {label: 'Pinterest Page', value: 'social_pinterestPage'},
        {label: 'LinkedIn Company Profile', value: 'social_linkedinCompanyProfile'},
        {label: 'LinkedIn Group', value: 'social_linkedinGroup'},
        {label: 'Influencer Outreach', value: 'social_influencerOutreach'},
        {label: 'Community Building', value: 'social_communityBuilding'},
        {label: 'Product Hunt (Launch)', value: 'social_productHunt'}
      ]
      },
      {label: 'Telemarketing', value: 'telemarketing'},
      {
        label: 'Viral', options: [
        {
          label: 'Recommend a Friend', options: [
          {label: 'Referral Program (P2P)', value: 'viral_recommendAFriend_referralProgram'}
        ]
        }
      ]
      },
      {
        label: 'Web', options: [
        {label: 'Company’s Website', value: 'web_companyWebsite'},
        {label: 'Landing Pages', value: 'web_landingPages'}
      ]
      },
      {
        label: 'Other?', value: 'OTHER'
      }
    ];

    let preventDuplicates = (value) => {
      if (value.options) {
        value.options.map(preventDuplicates);
      }
      else {
        value.disabled = Object.keys(this.state.knownChannels).includes(value.value) || Object.keys(this.state.approvedBudgets[0] || {}).includes(value.value);
        return value;
      }
    };

    channelOptions.map(preventDuplicates);

    return <div style={{ paddingTop: '90px' }}>
      <div className={ planStyles.locals.title }>
        <Paging month={ this.state.planDate } pagingUpdateState={ this.pagingUpdateState } region={ this.state.region }/>
      </div>
      <div className={ planStyles.locals.innerBox }>
        <div className={ this.classes.wrap } ref="wrap">
          <div className={ this.classes.box }>
            <table className={ this.classes.table }>
              {/*<col style={{ width: '50%' }} />
                 <col style={{ width: '25%' }} />
                 <col style={{ width: '25%' }} />*/}
              <thead>
              { headRow }
              </thead>
              <tbody className={ this.classes.tableBody }>
              { rows }
              </tbody>
            </table>
          </div>
          <div className={ this.classes.bottom }>
            <MultiRow numOfRows={1} maxNumOfRows={1} >
              {({index, data, update, removeButton}) => {
                return <div style={{
                  paddingBottom: '25px',
                  width: '460px'
                }} className={ this.classes.channelsRow }>
                  <Select
                    className={ this.classes.channelsSelect }
                    selected={ -1 }
                    select={{
                      menuTop: true,
                      name: 'channels',
                      onChange: (selected) => {
                        update({
                          selected: selected
                        });
                      },
                      options: channelOptions
                    }}
                    onChange={ this.addChannel.bind(this) }
                    label={ `Add a channel` }
                    labelQuestion={ [''] }
                    description={ ['Are there any channels you invested in the last month that weren’t recommended by InfiniGrow? It is perfectly fine; it just needs to be validated so that InfiniGrow will optimize your planning effectively.\nPlease choose only a leaf channel (a channel that has no deeper hierarchy under it). If you can’t find the channel you’re looking for, please choose “other” at the bottom of the list, and write the channel name/description clearly.']}
                  />
                </div>
              }}
            </MultiRow>
            { this.state.showText ?
              <div className={ this.classes.channelsRow }>
                <Textfield style={{
                  width: '292px'
                }}  onChange={(e) => {
                  this.addOtherChannel(e);
                }}/>
                <Button type="primary2" style={{
                  width: '72px',
                  margin: '0 20px'
                }} onClick={() => {
                  this.addChannel();
                }}> Enter
                </Button>
              </div>
              : null }
            <div className={ this.classes.footer } style={{ marginTop: '150px' }}>
              <SaveButton onClick={() => {
                this.setState({saveFail: false, saveSuccess: false});
                this.state.updateUserMonthPlan({actualChannelBudgets: {knownChannels: this.state.knownChannels, unknownChannels: this.state.unknownChannels}}, this.state.region, this.state.planDate, true)
                this.setState({saveSuccess: true});
                if (!this.props.userAccount.steps || !this.props.userAccount.steps.plannedVsActual) {
                  this.props.updateUserAccount({'steps.plannedVsActual': true});
                }
              }} success={ this.state.saveSuccess} fail={ this.state.saveFail }/>
            </div>
          </div>
        </div>
      </div>
    </div>
  }

  getTableRow(title, items, props) {
    return <tr {... props}>
      { title != null ?
        <td className={ this.classes.titleCell }>{ this.getCellItem(title) }</td>
        : null }
      {
        items.map((item, i) => {
          return <td className={ this.classes.valueCell } key={ i }>{
            this.getCellItem(item)
          }</td>
        })
      }
    </tr>
  }

  getCellItem(item) {
    let elem;

    if (typeof item !== 'object' ) {
      elem = <div className={ this.classes.cellItem }>{ item }</div>
    } else {
      elem = item;
    }

    return elem;
  }
}