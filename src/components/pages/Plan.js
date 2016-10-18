import React from 'react';

import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';

import style from 'styles/plan/plan.css';

import CurrentTab from 'components/pages/plan/CurrentTab';
import ProjectionsTab from 'components/pages/plan/ProjectionsTab';
import AnnualTab from 'components/pages/plan/AnnualTab';
import PlannedActualTab from 'components/pages/plan/PlannedActualTab';

import history from 'history';

export default class Plan extends Component {
  style = style;

  state = {
    selectedTab: 0
  }

  selectTab(index) {
    this.setState({
      selectedTab: index
    });
  }

  render() {
    const tabs = {
      "Current": CurrentTab,
      "Annual": AnnualTab,
      "Planned vs Actual": PlannedActualTab,
      "Projections": ProjectionsTab
    };

    const tabNames = Object.keys(tabs);
    const selectedName = tabNames[this.state.selectedTab];
    const selectedTab = tabs[selectedName];

    return <div>
      <Header />
      <Sidebar />
      <Page contentClassName={ this.classes.content } width="1180px">
        <div className={ this.classes.head }>
          <div className={ this.classes.headTitle }>Plan</div>
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
          { selectedTab ? React.createElement(selectedTab) : null }
        </div>
      </Page>
    </div>
  }
}