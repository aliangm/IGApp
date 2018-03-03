import React from 'react';
import merge from 'lodash/merge';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/plan/plan.css';
import Setup from 'components/pages/attribution/Setup';
import TrackingPlan from 'components/pages/attribution/TrackingPlan';
import TrackingUrls from 'components/pages/attribution/TrackingUrls';
import Offline from 'components/pages/attribution/Offline';
import UploadOfflinePopup from 'components/pages/attribution/UploadOfflinePopup';
import { FeatureToggle } from 'react-feature-toggles';
import FirstPageVisit from 'components/pages/FirstPageVisit';
import Button from 'components/controls/Button';

export default class Attribution extends Component {
  style = style;

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0
    };
  }

  selectTab(index) {
    this.setState({
      selectedTab: index
    });
  }

  render() {
    const tabs = {
      "Setup": Setup,
      "Tracking Plan": TrackingPlan,
      "Campaign URLs": TrackingUrls,
      "Offline": Offline
    };

    const tabNames = Object.keys(tabs);
    const selectedName = tabNames[this.state.selectedTab];
    const selectedTab = tabs[selectedName];
    return <FeatureToggle featureName="attribution">
      <div>
        <Page contentClassName={ this.classes.content } innerClassName={ this.classes.pageInner } width="100%">
          <div className={ this.classes.head }>
            <div className={ this.classes.headTitle }>Attribution</div>
            <div className={ this.classes.headTabs }>
              {
                tabNames.map((name, i) => {
                  let className;

                  if (i === this.state.selectedTab) {
                    className = this.classes.headTabSelected;
                  } else {
                    className = this.classes.headTab;
                  }

                  return <div className={ className } key={ i } onClick={() => {
                    this.selectTab(i);
                  }}>{ name }</div>
                })
              }
            </div>
            <div className={this.classes.headPlan}>
              { this.state.selectedTab !== 3 ? null :
                <Button type="primary2" style={{
                  width: '102px'
                }} selected={ this.state.showOfflinePopup ? true : null } onClick={() => {
                  this.setState({showOfflinePopup: true})
                }}>
                  Upload
                </Button>
              }
            </div>
          </div>
          { this.props.userAccount.pages && this.props.userAccount.pages.attribution ?
            <div style={{paddingTop: '90px'}}>
              {selectedTab ? React.createElement(selectedTab, merge(this.props)) : null}
              <div hidden={!this.state.showOfflinePopup}>
                <UploadOfflinePopup close={ () => { this.setState({showOfflinePopup: false}) } } setDataAsState={this.props.setDataAsState}/>
              </div>
            </div>
            :
            <FirstPageVisit
              title="Understanding data starts by collecting it"
              content="You can learn and improve a lot from your data. Track leads’ and users’ interactions with your brand to better understand your investments' effectiveness."
              action="Implement Attribution >"
              icon="step:attribution"
              onClick={ () => { this.props.updateUserAccount({'pages.attribution': true}) } }
            />
          }
        </Page>
      </div>
    </FeatureToggle>
  }
}