import React from 'react';
import _ from 'lodash';
import Component from 'components/Component';
import Page from 'components/Page';
import ByChannelTab from 'components/pages/campaigns/ByChannelTab';
import ByStatusTab from 'components/pages/campaigns/ByStatusTab';
import channelsSchema from 'data/channelsSchema';
import { Search, UnorderedSearchIndex } from 'js-search';
import CampaignPopup from 'components/pages/campaigns/CampaignPopup';
import planStyle from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
import campaignsStyle from 'styles/campaigns/campaigns.css';

const tabs = {
  'By Channel': ByChannelTab,
  'By Status': ByStatusTab
};

const tabNames = Object.keys(tabs);

function getDateString(stringDate) {
  if (stringDate) {
    const monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    const planDate = stringDate.split("/");
    const date = new Date(planDate[1], planDate[0] - 1);

    return monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2);
  }

  return null;
}

export default class Campaigns extends Component {
  styles = [planStyle, icons];
  style = campaignsStyle;

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
      search: '',
      showPopup: false,
      index: undefined,
      campaign: {}
    };
  }

  static defaultProps = {
    campaigns: [],
    projectedPlan: [],
    planUnknownChannels: []
  };

  updateCampaigns = (campaigns) => {
    return this.props.updateUserMonthPlan({ campaigns }, this.props.region, this.props.planDate);
  };

  updateCampaignsTemplates = (templateName, template) => {
    delete template.index;
    const campaignsTemplates = { ...this.props.campaignsTemplates, [templateName]: template };
    return this.props.updateUserMonthPlan({ campaignsTemplates }, this.props.region, this.props.planDate);
  };

  updateCampaign = (campaign) => {
    let campaigns = this.props.campaigns;
    const index = campaign.index;
    delete campaign.index;
    if (index !== undefined)
    {
      campaigns[index] = campaign;
    }
    else {
      campaigns.push(campaign);
    }
    return this.updateCampaigns(campaigns);
  };

  handleTabSelect = (e) => {
    this.setState({
      selectedIndex: +e.target.dataset.id
    })
  };

  closePopup = () => {
    this.setState({showPopup: false, index: undefined, campaign: {}});
  };

  showCampaign = (campaign) => {
    this.setState({showPopup: true, index: campaign.index, campaign: campaign || {}});
  };

  render() {
    const { selectedIndex } = this.state;
    const { monthBudget, campaigns, projectedPlan, planUnknownChannels, planDate, teamMembers, campaignsTemplates, userFirstName, userLastName, inHouseChannels } = this.props;
    const selectedName = tabNames[selectedIndex];
    const selectedTab = tabs[selectedName];

    const projectedChannels = projectedPlan && projectedPlan.length > 0 && projectedPlan[0] ? projectedPlan[0].plannedChannelBudgets : {};
    const unknownChannels = planUnknownChannels && planUnknownChannels.length > 0 && planUnknownChannels[0] ? planUnknownChannels[0] : {};
    const inHouse = {};
    inHouseChannels.forEach(channel => {
      inHouse[channel] = 0;
    });

    let channels = _.merge({}, projectedChannels, unknownChannels, inHouse);
    const processedChannels = {
      titles: { },
      icons: { },
      budgets: channels,
      names: Object.keys(channels).sort()
    };

    processedChannels.names.forEach((channel) => {
      if (channelsSchema.properties[channel]) {
        processedChannels.titles[channel] = channelsSchema.properties[channel].title;
        let channelHierarchy = channelsSchema.properties[channel].title.split('/').map(item => item.trim());
        processedChannels.icons[channel] = "plan:" + channelHierarchy[channelHierarchy.length - 1];
      }
      else {
        processedChannels.titles[channel] = channel;
        processedChannels.icons[channel] = "plan:other";
      }
    });

    const campaignsWithIndex = campaigns.map((campaign, index) => { return { ... campaign, index: index} });

    const activeCampaigns = campaignsWithIndex.filter(campaign => campaign.isArchived !== true);

    let budgetLeftToSpend = activeCampaigns.reduce((res, campaign) => {
      res -= campaign.actualSpent || campaign.budget;
      return res;
    }, monthBudget);

    let filteredCampaigns = activeCampaigns;

    if (this.state.search) {
      const search = new Search('index');
      search.searchIndex = new UnorderedSearchIndex();
      search.addIndex('name');
      search.addIndex('owner');
      search.addIndex('source');

      search.addDocuments(activeCampaigns);
      filteredCampaigns = search.search(this.state.search);
    }
    return <div>
      <Page contentClassName={ planStyle.locals.content } width="100%">
        <div className={ planStyle.locals.head }>
          <div className={ planStyle.locals.headTitle }>Campaign Management</div>
          <div className={ planStyle.locals.headTabs }>
            {
              tabNames.map((name, i) => {
                let className;

                if (i === selectedIndex) {
                  className = planStyle.locals.headTabSelected;
                } else {
                  className = planStyle.locals.headTab;
                }

                return <div className={className} key={i} data-id={i} onClick={this.handleTabSelect}>{name}</div>
              })
            }
          </div>
        </div>
        <div>
          <div className={ this.classes.campaignsTitle }>
            <div className={ this.classes.campaignsTitleDate }>
              { getDateString(planDate) } - Campaigns
              <div className={ this.classes.search }>
                <div className={ this.classes.searchIcon }/>
                <input value={ this.state.search } onChange={ (e)=>{ this.setState({search: e.target.value}) } } className={ this.classes.searchInput }/>
                <div className={ this.classes.searchClear } onClick={ ()=>{ this.setState({search: ''}) } }/>
              </div>
            </div>
            <div className={ this.classes.campaignsTitleBudget }>
              Budget left to invest
              <div className={ this.classes.campaignsTitleArrow } style={{ color: budgetLeftToSpend >= 0 ? '#2ecc71' : '#ce352d' }}>
                ${ budgetLeftToSpend ? budgetLeftToSpend.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '' }
              </div>
            </div>
          </div>
          {
            selectedTab && React.createElement(selectedTab, _.merge({ }, this.props, {
              processedChannels,
              filteredCampaigns: filteredCampaigns,
              updateCampaigns: this.updateCampaigns,
              showCampaign: this.showCampaign
            }))
          }
          <div hidden={ !this.state.showPopup }>
            <CampaignPopup
              campaign={ this.state.index !== undefined ? campaignsWithIndex[this.state.index] : this.state.campaign  }
              channelTitle={ processedChannels.titles[this.state.index !== undefined ? campaignsWithIndex[this.state.index].source : this.state.campaign && this.state.campaign.source] }
              closePopup={ this.closePopup.bind(this) }
              updateCampaign={ this.updateCampaign }
              teamMembers={ teamMembers }
              campaignsTemplates={ campaignsTemplates }
              updateCampaignsTemplates={ this.updateCampaignsTemplates }
              firstName={ userFirstName }
              lastName={ userLastName }
            />
          </div>
        </div>
      </Page>
    </div>
  }
}