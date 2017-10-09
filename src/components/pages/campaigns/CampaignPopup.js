import React from 'react';
import _ from 'lodash';
import Component from 'components/Component';
import Page from 'components/Page';
import Title from 'components/onboarding/Title';
import Brief from 'components/pages/campaigns/Brief';
import Checklist from 'components/pages/campaigns/Checklist';
import Updates from 'components/pages/campaigns/Updates';
import Tracking from 'components/pages/campaigns/Tracking';
import Assets from 'components/pages/campaigns/Assets';
import planStyle from 'styles/plan/plan.css';
import style from 'styles/onboarding/onboarding.css';
import campaignPopupStyle from 'styles/campaigns/capmaign-popup.css';
import UnsavedPopup from 'components/UnsavedPopup';
import Button from 'components/controls/Button';
import AddTemplatePopup from 'components/pages/campaigns/AddTemplatePopup';
import LoadTemplatePopup from 'components/pages/campaigns/LoadTemplatePopup';

export default class CampaignPopup extends Component {

  style = style;
  styles = [campaignPopupStyle, planStyle];

  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.state = {
      selectedTab: 0,
      visible: this.props.visible || false,
      campaign: _.merge({}, CampaignPopup.defaultProps.campaign ,this.props.campaign)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        visible: nextProps.visible || false,
        campaign: _.merge({}, CampaignPopup.defaultProps.campaign, nextProps.campaign),
      });
    }
  }

  static defaultProps = {
    teamMembers: [],
    campaign: {
      index: undefined,
      name: '',
      budget: 0,
      owner: '',
      source: [],
      dueDate: '',
      startDate: '',
      actualSpent: 0,
      status: "New",
      time: {
        development: 0,
        design: 0,
        marketing: 0
      },
      objectives: {
        kpi: [
          '',
          '',
          ''
        ],
        growth: [
          '',
          '',
          ''
        ],
        actualGrowth: [
          '',
          '',
          ''
        ]
      },
      tracking: {},
      tasks: [],
      comments: [],
      assets: [],
      targetAudience: '',
      description: '',
      referenceProjects: '',
      keywords: '',
      additionalInformation: ''
    }
  };

  selectTab(selectedIndex) {
    this.setState({
      selectedTab: selectedIndex
    });
  }

  updateState(newState) {
    this.setState(newState);
    this.setState({unsaved: newState.unsaved === undefined ? true : newState.unsaved});
  }

  close() {
    const callback = (userAnswer) => {
      if (userAnswer) {
        this.props.closePopup();
      }
      this.setState({showUnsavedPopup: false});
    };
    if (this.state.unsaved) {
      this.setState({showUnsavedPopup: true, callback: callback});
    }
    else {
      this.props.closePopup();
    }
  }

  openAddTemplatePopup() {
    this.setState({showAddTemplatePopup: true});
  }

  closeAddTemplatePopup() {
    this.setState({showAddTemplatePopup: false});
  }

  createTemplate(templateName) {
    this.props.updateCampaignsTemplates(templateName, this.state.campaign);
    this.closeAddTemplatePopup();
  }

  openLoadTemplatePopup() {
    this.setState({showLoadTemplatePopup: true});
  }

  closeLoadTemplatePopup() {
    this.setState({showLoadTemplatePopup: false});
  }

  render() {
    const tabs = {
      'Brief': Brief,
      'Items': Checklist,
      'Updates': Updates,
      'Tracking': Tracking,
      'Assets': Assets
    };

    const tabNames = Object.keys(tabs);
    const selectedName = tabNames[this.state.selectedTab];
    const selectedTab = tabs[selectedName];

    return <div>
      <Page popup={ true } width={'800px'} contentClassName={ campaignPopupStyle.locals.content }>
        <div className={ campaignPopupStyle.locals.topRight }>
          <Button contClassName={ campaignPopupStyle.locals.loadButton } type="normal" style={{ width: '53px', height: '25px' }} onClick={ this.openLoadTemplatePopup.bind(this) }>Load</Button>
          <div className={ campaignPopupStyle.locals.close } onClick={ this.close }/>
        </div>
        <Title className={ campaignPopupStyle.locals.title } title={"Campaign Details - " + this.state.campaign.name}/>
        <div className={ planStyle.locals.headTabs }>
          {
            tabNames.map((name, i) => {
              let className;

              if (i === this.state.selectedTab) {
                className = planStyle.locals.headTabSelected;
              } else {
                className = planStyle.locals.headTab;
              }

              return <div className={ className } key={ i } onClick={() => {
                this.selectTab(i);
              }}>{ name }</div>
            })
          }
        </div>
        <div className={ campaignPopupStyle.locals.inner }>
          { selectedTab ? React.createElement(selectedTab, _.merge({ }, this.state, {
            updateState: this.updateState.bind(this),
            close: this.close,
            openAddTemplatePopup: this.openAddTemplatePopup.bind(this),
            updateCampaign: this.props.updateCampaign,
            closePopup: this.props.closePopup,
            teamMembers: this.props.teamMembers,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            auth: this.props.auth
          })) : null }
        </div>
      </Page>
      <UnsavedPopup hidden={ !this.state.showUnsavedPopup } callback={ this.state.callback }/>
      <AddTemplatePopup hidden={ !this.state.showAddTemplatePopup } closeAddTemplatePopup={ this.closeAddTemplatePopup.bind(this) } createTemplate={ this.createTemplate.bind(this) } campaignName={ this.state.campaign.name }/>
      <LoadTemplatePopup hidden={ !this.state.showLoadTemplatePopup } closeLoadTemplatePopup={ this.closeLoadTemplatePopup.bind(this) } updateState={ this.updateState.bind(this) } campaignsTemplates={ this.props.campaignsTemplates }/>
    </div>
  }
}