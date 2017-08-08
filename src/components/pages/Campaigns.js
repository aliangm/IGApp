import React from 'react';
import _ from 'lodash';
import Component from 'components/Component';
import Page from 'components/Page';
import ByChannelTab from 'components/pages/campaigns/ByChannelTab';
import ByStatusTab from 'components/pages/campaigns/ByStatusTab';
import channelsSchema from 'data/channelsSchema';

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
      selectedIndex: 0
    };
  }

  static defaultProps = {
    unfilteredCampaigns: {}
  };

  updateCampaigns = (campaigns) => {
    return this.props.updateUserMonthPlan({ campaigns }, this.props.region, this.props.planDate);
  };

  updateCampaignsTemplates = (campaignsTemplates) => {
    return this.props.updateUserMonthPlan({ campaignsTemplates }, this.props.region, this.props.planDate);
  };

  handleTabSelect = (e) => {
    this.setState({
      selectedIndex: +e.target.dataset.id
    })
  };

  render() {
    const { selectedIndex } = this.state;
    const { monthBudget, unfilteredCampaigns } = this.props;
    const selectedName = tabNames[selectedIndex];
    const selectedTab = tabs[selectedName];

    const approvedChannels = this.props.approvedPlan && this.props.approvedPlan.length > 0 ? this.props.approvedPlan[0] : {};
    const unknownChannels = this.props.planUnknownChannels && this.props.planUnknownChannels.length > 0 ? this.props.planUnknownChannels[0] : {};

    let channels = _.merge(approvedChannels, unknownChannels);
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
    const activeCampaigns = {};
    Object.keys(unfilteredCampaigns).forEach(channel => {
      const channelActiveCampaigns = unfilteredCampaigns[channel].filter(campaign => campaign.isArchived !== true);
      if (channelActiveCampaigns.length > 0) {
        return activeCampaigns[channel] = channelActiveCampaigns
      }
    });

    let budgetLeftToSpend = Object.keys(activeCampaigns).reduce((res, channel) => {
      activeCampaigns[channel].forEach((campaign) => {
        res -= campaign.actualSpent || campaign.budget;
      });

      return res;
    }, monthBudget);

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
              { getDateString(this.props.planDate) } - Campaigns
            </div>
            <div className={ this.classes.campaignsTitleBudget }>
              Budget left to spend
              <div className={ this.classes.campaignsTitleArrow } style={{ color: budgetLeftToSpend >= 0 ? '#2ecc71' : '#ce352d' }}>
                ${ budgetLeftToSpend ? budgetLeftToSpend.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '' }
              </div>
            </div>
          </div>
          {
            selectedTab && React.createElement(selectedTab, _.merge({ }, this.props, {
              processedChannels,
              campaigns: activeCampaigns,
              updateCampaigns: this.updateCampaigns,
              updateCampaignsTemplates: this.updateCampaignsTemplates
            }))
          }
        </div>
      </Page>
    </div>
  }
}