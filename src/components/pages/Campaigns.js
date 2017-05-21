import React from 'react';
import _ from 'lodash';
import Component from 'components/Component';
import Page from 'components/Page';
import Paging from 'components/Paging';
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
			campaigns: {},
			monthBudget: 0,
			teamMembers: [],
			...props,
			selectedIndex: 0
    };
  }

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps);
	}

	pagingUpdateState = (data) => {
  	console.log('PAGING UPDATE STATE', data);
		this.setState({
			planDate: data.planDate,
			region: data.region,
			plannedChannelBudgets: data.projectedPlan.length > 0 ? data.projectedPlan[0].plannedChannelBudgets : {},
			knownChannels: data.actualChannelBudgets && data.actualChannelBudgets.knownChannels || {},
			unknownChannels: data.actualChannelBudgets && data.actualChannelBudgets.unknownChannels || {},
			monthBudget: data.projectedPlan.length > 0 ? data.projectedPlan[0].monthBudget : null,
			campaigns: data.campaigns || {}
		});
	};

	updateCampaigns = (campaigns) => {
		return this.state.updateUserMonthPlan({ campaigns }, this.state.region, this.state.planDate);
	};

	handleTabSelect = (e) => {
    this.setState({
      selectedIndex: +e.target.dataset.id
    })
  };

  render() {
    const { selectedIndex, planDate, region, monthBudget } = this.state;
    const selectedName = tabNames[selectedIndex];
    const selectedTab = tabs[selectedName];

		let channels = _.merge(this.state.plannedChannelBudgets, this.state.knownChannels, this.state.unknownChannels);
		const processedChannels = {
			titles: { },
			icons: { },
			budgets: channels,
			names: Object.keys(channels).sort()
		};
		let budgetLeftToSpend = Object.keys(this.state.campaigns).reduce((res, channel) => {
			this.state.campaigns[channel].forEach((campaign) => {
				res -= campaign.actualSpent || campaign.budget;
			});

			return res;
		}, monthBudget);

		processedChannels.names.forEach((channel) => {
			const title = channelsSchema.properties[channel] ? channelsSchema.properties[channel].title : channel;
			processedChannels.titles[channel] = title;
			let channelHierarchy = title.split('/').map(item => item.trim());
			processedChannels.icons[channel] = "plan:" + channelHierarchy[channelHierarchy.length - 1];
		});

    return <div>
      <Page contentClassName={ planStyle.locals.content } width="1180px">
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
        <div className={ planStyle.locals.serverDown } style={{ padding: '30px 30px' }}>
          <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our support. </label>
        </div>
        <div>
          <Paging month={planDate} region={region} pagingUpdateState={this.pagingUpdateState}/>
          <div className={ this.classes.campaignsTitle }>
            <div className={ this.classes.campaignsTitleDate }>
							{ getDateString(this.state.planDate) } - Campaigns
            </div>
            <div className={ this.classes.campaignsTitleBudget }>
              Budget left to spend
              <div className={ this.classes.campaignsTitleArrow } style={{ color: budgetLeftToSpend >= 0 ? '#2ecc71' : '#ce352d' }}>
                ${ budgetLeftToSpend ? budgetLeftToSpend.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '' }
              </div>
            </div>
          </div>
          {
          	selectedTab && React.createElement(selectedTab, _.merge({ }, this.props, this.state, {
          		processedChannels,
							updateCampaigns: this.updateCampaigns
          	}))
          }
        </div>
      </Page>
    </div>
  }
}