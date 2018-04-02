import React from 'react';
import merge from 'lodash/merge';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/plan/plan.css';
import CMO from 'components/pages/dashboard/CMO';
import Analyze from 'components/pages/dashboard/Analyze';
import FirstPageVisit from 'components/pages/FirstPageVisit';

export default class Dashboard extends Component {

  style = style;

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 1
    };
  }

  selectTab(index) {
    this.setState({
      selectedTab: index
    });
  }

  render() {
    let tabs = {
      CMO: CMO,
      Analyze: Analyze
    };

    const tabNames = Object.keys(tabs);
    const selectedName = tabNames[this.state.selectedTab];
    const selectedTab = tabs[selectedName];
    return <div>
      <Page contentClassName={ this.classes.content } innerClassName={ this.classes.pageInner } width="100%">
        <div className={ this.classes.head }>
          <div className={ this.classes.headTitle }>Dashboard</div>
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
        <div className={ this.classes.serverDown }>
          <label hidden={ !this.state.serverDown }>Something is wrong... Let us check what is it and fix it for you :)</label>
        </div>
        { this.props.userAccount.pages && this.props.userAccount.pages.dashboard ?
          <div>
            {selectedTab ? React.createElement(selectedTab, merge({}, this.props, this.state)) : null}
          </div>
          :
          <FirstPageVisit
            title="360 view on all marketing data and performance"
            content="Control and visibility over your marketing mix, data and performance are crucial for marketing success. Get a one-point-view of what happens at any given moment."
            action="Show me the data >"
            icon="step:dashboard"
            onClick={() => {
              this.props.updateUserAccount({'pages.dashboard': true})
            }}
          />
        }
      </Page>
    </div>
  }
}