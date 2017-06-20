import React from 'react';
import _ from 'lodash';
import Component from 'components/Component';
import Page from 'components/Page';
import Title from 'components/onboarding/Title';
import Brief from 'components/pages/campaigns/Brief';
import Checklist from 'components/pages/campaigns/Checklist';

import planStyle from 'styles/plan/plan.css';
import style from 'styles/onboarding/onboarding.css';
import campaignPopupStyle from 'styles/campaigns/capmaign-popup.css';
import UnsavedPopup from 'components/UnsavedPopup';

export default class CampaignPopup extends Component {

  style = style
  styles = [campaignPopupStyle, planStyle]

  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.state = {
      selectedTab: 0,
      visible: this.props.visible || false,
      channel: this.props.channel,
      campaign: _.merge({ name: '', status: "New", time: { development: 0, design: 0, marketing: 0 }, objectives: { kpi: ['', '', ''], growth: ['', '', ''] }, tracking: {UTM: '', URL: ''}, tasks: []}, this.props.campaign),
      updateState: this.updateState.bind(this),
      close: this.close
    };
  }

  static defaultProps = {
    teamMembers: []
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
    if (this.state.unsaved) {
      const callback = (userAnswer) => {
        if (userAnswer) {
          this.props.close();
        }
        this.setState({showUnsavedPopup: false});
      };
      this.setState({showUnsavedPopup: true, callback: callback});
    }
    else {
      this.props.close();
    }
  }

  render() {
    const tabs = {
      'Brief': Brief,
      'Checklist': Checklist
    };

    const tabNames = Object.keys(tabs);
    const selectedName = tabNames[this.state.selectedTab];
    const selectedTab = tabs[selectedName];

    return <div>
      <Page popup={ true } width={'800px'} contentClassName={ campaignPopupStyle.locals.content }>
        <div className={ campaignPopupStyle.locals.topRight }>
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
        <div style={{ marginTop: '45px' }}>
          { selectedTab ? React.createElement(selectedTab, _.merge({}, this.props, this.state)) : null }
        </div>
      </Page>
      <UnsavedPopup hidden={ !this.state.showUnsavedPopup } callback={ this.state.callback }/>
    </div>
  }
}