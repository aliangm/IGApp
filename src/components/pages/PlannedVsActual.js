import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';
import Title from 'components/onboarding/Title';
import MultiRow from 'components/MultiRow';
import Select from 'components/controls/Select';
import SaveButton from 'components/pages/profile/SaveButton';
import Notice from 'components/Notice';
import history from 'history';

import Popup from 'components/Popup';
import Loading from 'components/pages/plan/Loading';
import Button from 'components/controls/Button';
import Textfield from 'components/controls/Textfield';
import PlanPopup, {
  TextContent as PopupTextContent
} from 'components/pages/plan/Popup';
import serverCommunication from 'data/serverCommunication';
import style from 'styles/plan/planned-actual-tab.css';
import planStyles from 'styles/plan/plan.css';
import { parsePlannedVsActual } from 'data/parsePlannedVsActual';

import clone from 'clone';

import plannedActualData from 'data/planned_actual';

export default class PlannedVsActual extends Component {
  styles = [planStyles];
  style = style

  constructor(props) {
    super(props);

    this.state = {
      hoverRow: void 0,
      month: 0,
      plannedChannelBudgets: {},
      knownChannels: {},
      unknownChannels: {}
    };

    //this.data = clone(plannedActualData);
    //this.keys = Object.keys(this.data);
    this.keys = [''];
  }

  componentDidMount(){
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
                  plannedChannelBudgets: data.projectedPlan[0].plannedChannelBudgets,
                  knownChannels: data.actualChannelBudgets && data.actualChannelBudgets.knownChannels || {},
                  unknownChannels: data.actualChannelBudgets && data.actualChannelBudgets.unknownChannels || {},
                  planDate: data.planDate,
                  isLoaded: true
                });
                //self.setState({planDate: data.planDate});
                //self.keys.push(data.planDate);
              }
            }
          })
      })
      .catch(function (err) {
        self.setState({serverDown: true});
        console.log(err);
      })
  }

  addChannel(event) {
    this.setState({notLeafChannelError: false, channelAlreadyExistsError: false});
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
          var alreadyExist = Object.keys(this.state.plannedChannelBudgets);
          alreadyExist = alreadyExist.concat(Object.keys(this.state.knownChannels), Object.keys(this.state.unknownChannels));
          if (alreadyExist.indexOf(event.value) === -1) {
            var update = this.state.knownChannels;
            update[event.value] = 0;
            this.setState({knownChannels: update}); 
          }
          else {
            this.setState({channelAlreadyExistsError: true});

          }
        }
      }
      else {
        this.setState({notLeafChannelError: true});
      }
    }
    this.forceUpdate();
  }

  addOtherChannel(e) {
    this.setState({otherChannel: e.target.value});
  }

  updateActual(key, value){
    if (this.state.unknownChannels[key] !== undefined){
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

  changeMonth(dir) {
    let month = this.state.month + dir;

    if (month >= this.keys.length) {
      month = 0;
    } else if (month < 0) {
      month = this.keys.length - 1;
    }

    this.setState({
      month: month
    });
  }

  getDates = () => {
    var dates = [];
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    var planDate = this.state.planDate.split("/");
    var date = new Date(planDate[1], planDate[0]-1);
    dates.push(monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2,2));
    return dates;
  }

  render() {
    let month;
    let headRow;
    let rows;
    let flatChannels = [];
    if (this.state.isLoaded) {
      this.keys = this.getDates();
      month = this.keys[this.state.month];
      const data = parsePlannedVsActual(this.state.plannedChannelBudgets, this.state.knownChannels, this.state.unknownChannels);
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

      const channels = [
        {
          name: 'Advertising',
          children: [
            {
              name: 'Display Ads', children: [
              {name: 'Google AdWords', value: 'advertising_displayAds_googleAdwords'},
              {name: 'Other', value: 'advertising_displayAds_other'},
            ]
            },
            {
              name: 'Search Marketing', children: [
              {name: 'SEO', value: 'advertising_searchMarketing_SEO'},
              {
                name: 'SEM (PPC)', children: [
                {name: 'Google AdWords', value: 'advertising_searchMarketing_SEM_googleAdwords'},
                {name: 'Other', value: 'advertising_searchMarketing_SEM_other'}
              ]
              },
            ]
            },
            {
              name: 'Social Ads', children: [
              {
                name: 'SEM (PPC)', children: [
                {name: 'Facebook Advertising', value: 'advertising_socialAds_facebookAdvertising'},
                {name: 'Twitter Advertising', value: 'advertising_socialAds_twitterAdvertising'},
                {name: 'LinkedIn Advertising', value: 'advertising_socialAds_linkedinAdvertising'},
                {name: 'Instagram Advertising', value: 'advertising_socialAds_instagramAdvertising'},
                {name: 'Pinterest Advertising', value: 'advertising_socialAds_pinterestAdvertising'},
                {name: 'Google+ Advertising', value: 'advertising_socialAds_GooglePlusAdvertising'},
                {name: 'YouTube Advertising', value: 'advertising_socialAds_youtubeAdvertising'}
              ]
              }
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
              {name: 'Other', value: 'content_contentPromotion_contentDiscovery_other'}
            ]
            },
            {
              name: 'Forums', children: [
              {name: 'Reddit', value: 'content_contentPromotion_forums_reddit'},
              {name: 'Quora', value: 'content_contentPromotion_forums_quora'},
              {name: 'Other', value: 'content_contentPromotion_forums_other'}
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
          {name: 'Other', value: 'engineeringAsMarketing_other'}
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
        },
        {
          name: 'Other?', value: 'OTHER'
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
    }

    return <div>
      <Header />
      <Sidebar />
      <Page width={'1051px'}>
        <Title title="Planned VS Actual" subTitle="It is very important to keep the data credibility. To optimize your marketing planning every step of the way, InfiniGrow needs to know exactly what your actual marketing investments were (even if they aren’t 1:1 as recommended)."/>
        <div className={ planStyles.locals.serverDown }>
          <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our support. </label>
        </div>
        { this.state.isLoaded ? <div>
          <div className={ planStyles.locals.title }>
            <div className={ this.classes.titleBox }>
              <Button type="primary2" style={{
            width: '36px',
            // margin: '0 20px'
          }} onClick={() => {
            this.changeMonth(-1);
          }}>
                <div className={ this.classes.arrowLeft }/>
              </Button>
              <div className={ planStyles.locals.titleText } style={{
            width: '200px',
            textAlign: 'center'
          }}>
                { month }
              </div>
              <Button type="primary2" style={{
            width: '36px',
            // margin: '0 20px'
          }} onClick={() => {
            this.changeMonth(1);
          }}>
                <div className={ this.classes.arrowRight }/>
              </Button>
            </div>
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
            </div>
          </div>
          <MultiRow numOfRows={1} maxNumOfRows={1} >
            {({index, data, update, removeButton}) => {
              return <div style={{
                    paddingBottom: '20px',
                    width: '500px'
                  }} className={ this.classes.channelsRow }>
                <Select
                  className={ this.classes.channelsSelect }
                  selected={ {} }
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
                  onChange={ this.addChannel.bind(this) }
                  label={ `Add a channel` }
                  labelQuestion={ [''] }
                  description={ ['Are there any channels you invested in the last month that weren’t recommended by InfiniGrow? It is perfectly fine; it just needs to be validated so that InfiniGrow will optimize your planning effectively.\nPlease choose only a leaf channel (a channel that has no deeper hierarchy under it). If you can’t find the channel you’re looking for, please choose “other” at the bottom of the list, and write the channel name/description clearly.']}
                />
                <div className={ this.classes.channelsRemove } style={{ paddingTop: '4px' }}>
                  <label className={ this.classes.error } hidden={ !this.state.notLeafChannelError}>Please choose a leaf channel</label>
                  <label className={ this.classes.error } hidden={ !this.state.channelAlreadyExistsError}>channel already in use</label>
                </div>
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
          <div className={ this.classes.footer } style={{ marginTop: '100px' }}>
            <SaveButton onClick={() => {
            let self = this;
            self.setState({saveFail: false, saveSuceess: false});
		serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({actualChannelBudgets: {knownChannels: this.state.knownChannels, unknownChannels: this.state.unknownChannels}}))
			.then(function(data){
			  self.setState({saveSuceess: true});
			})
			.catch(function(err){
			  self.setState({saveFail: true});
			});
            }} success={ this.state.saveSuceess } fail={ this.state.saveFail }/>
          </div>
        </div>
          : null }
      </Page>
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