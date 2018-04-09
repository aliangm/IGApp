import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/plan/plan.css';
import Analyze from 'components/pages/analyze/Analyze';
import Content from 'components/pages/analyze/Content';
import UploadOfflinePopup from 'components/pages/attribution/UploadOfflinePopup';
import FirstPageVisit from 'components/pages/FirstPageVisit';

export default class AnalyzePage extends Component {

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
      "Analyze": Analyze,
      "Content": Content
    };

    const tabNames = Object.keys(tabs);
    const selectedName = tabNames[this.state.selectedTab];
    const selectedTab = tabs[selectedName];
    return <div>
        <Page contentClassName={ this.classes.content } innerClassName={ this.classes.pageInner } width="100%">
          <div className={ this.classes.head }>
            <div className={ this.classes.headTitle }>Analyze</div>
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
          { this.props.userAccount.pages && this.props.userAccount.pages.attribution ?
            <div style={{paddingTop: '90px'}}>
              {selectedTab ? React.createElement(selectedTab, this.props) : null}
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
  }
}