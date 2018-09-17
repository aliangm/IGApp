import React from 'react';
import merge from 'lodash/merge';
import Component from 'components/Component';
import Page from 'components/Page';
import {Search, UnorderedSearchIndex} from 'js-search';
import CampaignPopup from 'components/pages/campaigns/CampaignPopup';
import ChooseExistingTemplate from 'components/pages/campaigns/ChooseExistingTemplate';
import planStyle from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
import campaignsStyle from 'styles/campaigns/campaigns.css';
import {getNickname, getTitle} from 'components/utils/channels';
import Label from 'components/ControlsLabel';
import Button from 'components/controls/Button';
import ImportCampaignsPopup from 'components/pages/campaigns/ImportCampaignsPopup';
import {formatNumber} from 'components/utils/budget';
import {getProfileSync} from 'components/utils/AuthService';

function getDateString(stringDate) {
  if (stringDate) {
    const monthNames = [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct',
      'Nov', 'Dec'
    ];
    const planDate = stringDate.split('/');
    const date = new Date(planDate[1], planDate[0] - 1);

    return monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2);
  }

  return null;
}

export default class Campaigns extends Component {

  style = campaignsStyle;
  styles = [planStyle, icons];

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
      search: '',
      showPopup: false,
      index: undefined,
      campaign: {},
      campaigns: props.campaigns,
      addNew: false,
      onlyMyCampaigns: false
    };
  }

  static defaultProps = {
    campaigns: [],
    planUnknownChannels: [],
    inHouseChannels: [],
    teamMembers: [],
    annualBudgetArray: []
  };

  componentDidMount() {
    if (this.props.location.query.campaign) {
      this.setState({showPopup: true, index: this.props.location.query.campaign});
    }
  }

  componentWillReceiveProps({campaigns}) {
    if (this.props.campaigns !== campaigns) {
      this.setCampaigns(campaigns);
    }
  }

  setCampaigns = (campaigns) => {
    this.setState({campaigns});
  };

  updateCampaigns = (campaigns) => {
    this.setCampaigns(campaigns);

    return this.props.updateUserMonthPlan({campaigns}, this.props.region, this.props.planDate);
  };

  updateCampaignsTemplates = (templateName, template) => {
    delete template.index;
    const campaignsTemplates = {...this.props.campaignsTemplates, [templateName]: template};
    this.setState({campaign: template});
    return this.props.updateUserMonthPlan({campaignsTemplates}, this.props.region, this.props.planDate);
  };

  updateCampaign = (campaign) => {
    let campaigns = this.state.campaigns.slice();
    const index = campaign.index;
    delete campaign.index;
    if (index !== undefined) {
      campaigns[index] = campaign;
    }
    else {
      const length = campaigns.push(campaign);
      this.setState({index: length - 1});
      console.log('Campaign was created');
      if (!this.props.userAccount.steps || !this.props.userAccount.steps.campaign) {
        this.props.updateUserAccount({'steps.campaign': true});
      }
    }

    this.setCampaigns(campaigns);

    return this.updateCampaigns(campaigns);
  };

  handleTabSelect = (e) => {
    this.setState({
      selectedIndex: +e.target.dataset.id
    });
  };

  closePopup = () => {
    this.setState({showPopup: false, index: undefined, campaign: {}});
  };

  showCampaign = (campaign) => {
    this.setState({showPopup: true, index: campaign.index, campaign: campaign || {}});
  };

  addNewCampaign = (campaign) => {
    this.setState({addNew: true, campaign: campaign});
  };

  render() {
    const {selectedIndex, campaigns} = this.state;
    const {planUnknownChannels, teamMembers, campaignsTemplates, userFirstName, userLastName, inHouseChannels, addNotification, calculatedData: {committedBudgets, monthlyBudget, monthlyBudgetLeftToInvest, activeCampaigns, campaignsWithIndex}} = this.props;

    const unknownChannels = planUnknownChannels && planUnknownChannels.length > 0 && planUnknownChannels[0]
      ? planUnknownChannels[0]
      : {};
    const firstMonthChannels = committedBudgets && committedBudgets.length > 0 && committedBudgets[0]
      ? committedBudgets[0]
      : {};
    const inHouse = {};
    inHouseChannels.forEach(channel => {
      inHouse[channel] = 0;
    });
    const campaignsChannels = {};
    campaigns.forEach(campaign => {
      if (!campaign.isArchived) {
        campaign.source.forEach(source => {
          campaignsChannels[source] = 0;
        });
      }
    });
    let channels = merge({}, campaignsChannels, firstMonthChannels, unknownChannels, inHouse);
    const processedChannels = {
      titles: {},
      icons: {},
      budgets: channels,
      names: Object.keys(channels).sort()
    };

    processedChannels.names.forEach((channel) => {
      const title = getTitle(channel);
      if (title) {
        processedChannels.titles[channel] = getNickname(channel);
        let channelHierarchy = title.split('/').map(item => item.trim());
        processedChannels.icons[channel] = 'plan:' + channel;
      }
      else {
        processedChannels.titles[channel] = channel;
        processedChannels.icons[channel] = 'plan:other';
      }
    });

    let filteredCampaigns = activeCampaigns;

    const member = teamMembers.find(member => member.userId === getProfileSync().user_id);

    if (member && member.isAdmin === false) {
      if (member.specificChannels && member.specificChannels.length > 0) {
        filteredCampaigns =
          activeCampaigns.filter(
            campaign => member.specificChannels.some(channel => campaign.source.includes(channel)));
        processedChannels.names = processedChannels.names.filter(channel => member.specificChannels.includes(channel));
      }
    }

    if (this.state.onlyMyCampaigns) {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.owner === member.userId);
    }

    if (this.state.search) {
      const search = new Search('index');
      search.searchIndex = new UnorderedSearchIndex();
      search.addIndex('name');
      search.addIndex('owner');
      search.addIndex('source');

      search.addDocuments(activeCampaigns);
      filteredCampaigns = search.search(this.state.search);
    }

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, merge({}, this.props, {
        processedChannels,
        filteredCampaigns: filteredCampaigns,
        updateCampaigns: this.updateCampaigns,
        showCampaign: this.showCampaign,
        addNewCampaign: this.addNewCampaign
      })));

    return <div>
      <Page contentClassName={planStyle.locals.content} width="100%">
        <div className={planStyle.locals.head}>
          <div className={planStyle.locals.headTitle}>Campaigns & Activities</div>
          <div className={planStyle.locals.headPlan}>
            <Button type="primary" style={{
              width: '102px'
            }} onClick={() => {
              this.setState({importSalesforceCampaigns: true});
            }}>
              Import
            </Button>
            <Label
              checkbox={this.state.onlyMyCampaigns}
              onChange={() => {
                this.setState({onlyMyCampaigns: !this.state.onlyMyCampaigns});
              }}
              style={{
                margin: '0',
                alignSelf: 'center',
                textTransform: 'capitalize',
                fontSize: '12px',
                marginLeft: '15px'
              }}
            >
              Show only my campaigns
            </Label>
          </div>
        </div>
        <div style={{paddingTop: '90px'}}>
          {selectedIndex !== 2 ?
            <div className={this.classes.campaignsTitle}>
              <div className={this.classes.campaignsTitleDate}>
                <div className={this.classes.search}>
                  <div className={this.classes.searchIcon}/>
                  <input value={this.state.search} onChange={(e) => {
                    this.setState({search: e.target.value});
                  }} className={this.classes.searchInput}/>
                  <div className={this.classes.searchClear} onClick={() => {
                    this.setState({search: ''});
                  }}/>
                </div>
              </div>
              <div className={this.classes.campaignsTitleBudget}>
                Budget left to invest
                <div className={this.classes.campaignsTitleArrow}
                     style={{color: monthlyBudgetLeftToInvest >= 0 ? '#2ecc71' : '#ce352d'}}>
                  ${monthlyBudgetLeftToInvest ? formatNumber(monthlyBudgetLeftToInvest) : 0}
                </div>
                <div>
                  {' / $' + formatNumber(monthlyBudget)}
                </div>
              </div>
            </div>
            : null}
          {childrenWithProps}
          <div hidden={!this.state.showPopup}>
            <CampaignPopup
              campaign={this.state.index !== undefined ? campaignsWithIndex[this.state.index] : this.state.campaign}
              channelTitle={processedChannels.titles[this.state.index !== undefined
                ? campaignsWithIndex[this.state.index] && campaignsWithIndex[this.state.index].source
                : this.state.campaign && this.state.campaign.source]}
              closePopup={this.closePopup.bind(this)}
              updateCampaign={this.updateCampaign}
              teamMembers={teamMembers}
              campaignsTemplates={campaignsTemplates}
              updateCampaignsTemplates={this.updateCampaignsTemplates}
              firstName={userFirstName}
              lastName={userLastName}
              processedChannels={processedChannels}
              addNotification={addNotification}
            />
          </div>
          <div hidden={!this.state.addNew}>
            <ChooseExistingTemplate
              showCampaign={(template) => this.showCampaign(merge({}, this.state.campaign, template))}
              close={() => {
                this.setState({addNew: false});
              }}
              campaignsTemplates={this.props.campaignsTemplates}
            />
          </div>
          <ImportCampaignsPopup
            hidden={!this.state.importSalesforceCampaigns}
            close={() => {
              this.setState({importSalesforceCampaigns: false});
            }}
            setDataAsState={this.props.setDataAsState}
            updateState={this.updateState}
            salesforceAuto={this.props.salesforceAuto}
            adwordsapi={this.props.adwordsapi}
            facebookadsapi={this.props.facebookadsapi}
            userAccount={this.props.userAccount}
          />
        </div>
      </Page>
    </div>;
  }
}