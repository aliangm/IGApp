import React from 'react';

import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';

import style from 'styles/plan/plan.css';

import CurrentTab from 'components/pages/plan/CurrentTab';
import ProjectionsTab from 'components/pages/plan/ProjectionsTab';
import AnnualTab from 'components/pages/plan/AnnualTab';
//import PlannedActualTab from 'components/pages/plan/PlannedActualTab';
import ReplanButton from 'components/pages/plan/ReplanButton';
import serverCommunication from 'data/serverCommunication';
import { isPopupMode, disablePopupMode } from 'modules/popup-mode';

import history from 'history';

export default class Plan extends Component {
  style = style;

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      numberOfPlanUpdates: 0
    }
    this.handleRePlan = this.handleRePlan.bind(this);
  }

  componentDidMount(){
    let self = this;
    if (isPopupMode()) {
      disablePopupMode();
      this.handleRePlan();
    }
    else {
      serverCommunication.serverRequest('GET', 'usermonthplan')
        .then((response) => {
          response.json()
            .then(function (data) {
              if (data) {
                if (data.error) {
                  history.push('/');
                }
                else {
                  self.setState({actualIndicators: data.actualIndicators});
                  self.setState({numberOfPlanUpdates: data.numberOfPlanUpdates});
                  self.setState({projectedPlan: data.projectedPlan});
                  self.setState({budget: data.annualBudget});
                  self.setState({planDate: data.planDate});
                  self.setState({isLoaded: true});
                }
              }
            })
        })
        .catch(function (err) {
          self.setState({serverDown: true});
          console.log(err);
        });
    }
  }

  handleRePlan(){
    this.setState({isLoaded: true});
    this.setState({isPlannerLoading: true});
    let self = this;
    serverCommunication.serverRequest('GET', 'plan')
      .then((response) => {
        response.json()
          .then(function (data) {
            if (data) {
              if (data.error){
                self.setState({isPlannerLoading: false, isError: true});
              }
              else {
                self.setState({
                  actualIndicators: data.actualIndicators,
                  projectedPlan: data.projectedPlan,
                  selectedTab: 0,
                  budget: data.annualBudget,
                  planDate: data.planDate,
                  isPlannerLoading: false
                });
                //self.forceUpdate();
              }
            }
            else {
            }
          })
      })
      .catch(function (err) {
        self.setState({
          isPlannerLoading: false,
          serverDown: true
        });
        console.log(err);
      })
  }

  selectTab(index) {
    this.setState({
      selectedTab: index
    });
  }

  render() {
    const tabs = {
      //"Current": CurrentTab,
      "Annual": AnnualTab,
      //"Planned vs Actual": PlannedActualTab,
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
          <div className={this.classes.headPlan } >
            <ReplanButton numberOfPlanUpdates={ this.state.numberOfPlanUpdates } onClick={this.handleRePlan}/>
            <div className={ this.classes.error }>
              <label hidden={ !this.state.isError}>You've reached the replan limit.<br/> To upgrade, click <a href="mailto:support@infinigrow.com?&subject=I need replan upgrade" target='_blank'>here</a></label>
            </div>
          </div>
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
        <div className={ this.classes.serverDown } style={{ padding: '30px 30px' }}>
          <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our support. </label>
        </div>
        <div>
          { selectedTab ? React.createElement(selectedTab, this.state) : null }
        </div>
      </Page>
    </div>
  }
}