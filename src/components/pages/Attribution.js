import React from 'react';
import _ from 'lodash';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/plan/plan.css';
import Setup from 'components/pages/attribution/Setup';
import TrackingPlan from 'components/pages/attribution/TrackingPlan';
import TrackingUrls from 'components/pages/attribution/TrackingUrls';

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
      "Tracking URLs": TrackingUrls
    };

    const tabNames = Object.keys(tabs);
    const selectedName = tabNames[this.state.selectedTab];
    const selectedTab = tabs[selectedName];
    return <div>
      <Page contentClassName={ this.classes.content } innerClassName={ this.classes.pageInner } width="100%">
        <div className={ this.classes.head }>
          <div className={ this.classes.headTitle }>Attribution - Coming soon</div>
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
        </div>
        <div>
          { selectedTab ? React.createElement(selectedTab, _.merge(this.props)) : null }
        </div>
      </Page>
    </div>
  }
}