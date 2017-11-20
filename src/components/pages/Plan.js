import React from 'react';
import _ from 'lodash';
import Component from 'components/Component';
import Page from 'components/Page';
import Popup from 'components/Popup';

import style from 'styles/plan/plan.css';

import CurrentTab from 'components/pages/plan/CurrentTab';
import ProjectionsTab from 'components/pages/plan/ProjectionsTab';
import AnnualTab from 'components/pages/plan/AnnualTab';
import PlannedVsActual from 'components/pages/plan/PlannedVsActual';
import ReplanButton from 'components/pages/plan/ReplanButton';
import serverCommunication from 'data/serverCommunication';
import { isPopupMode, disablePopupMode } from 'modules/popup-mode';
import PlanNextMonthPopup from 'components/pages/plan/PlanNextMonthPopup';
import history from 'history';
import events from 'data/events';

function formatDate(dateStr) {
  if (dateStr) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [monthNum, yearNum] = dateStr.split("/");

    return `${monthNames[monthNum - 1]}/${yearNum.substr(2,2)}`;
  }
  else return null;
}

export default class Plan extends Component {
  style = style;

  static defaultProps = {
    userProfile: {},
    targetAudience: {},
    projectedPlan: [],
    planDate: '',
    userAccount: {}
  };

  constructor(props) {
    super(props);
    this.plan = this.plan.bind(this);
    this.approveAllBudgets = this.approveAllBudgets.bind(this);
    this.popup = this.popup.bind(this);
    this.state = {
      selectedTab: 1,
      numberOfPlanUpdates: 0,
      whatIf: this.plan.bind(this),
      approveAll: this.approveAllBudgets.bind(this),
      declineAll: this.declineAllBudgets.bind(this),
      editMode: false
    };
  }

  componentDidMount() {
    this.getRelevantEvents(this.props);
    let callback = (data) => {
      this.props.setDataAsState(data);
      this.approveAllBudgets(true);
    };
    if (isPopupMode()) {
      if (this.props.userAccount.freePlan === false) {
        this.plan(true, null, callback, localStorage.getItem('region'));
      }
      else {
        this.setState({editMode: true});
      }
      disablePopupMode();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getRelevantEvents(nextProps);
    if (this.state.editMode) {
      this.setState({editMode: false});
    }
  }

  getRelevantEvents(props) {
    this.setState({events: events.filter(event => event.vertical == props.userProfile.vertical || event.companyType == props.targetAudience.companyType)});
  }

  approveAllBudgets(withProjections) {
    const json = {approvedBudgets: this.props.projectedPlan.map(projectedMonth => projectedMonth.plannedChannelBudgets)};
    if (withProjections) {
      json.approvedBudgetsProjection = this.props.projectedPlan.map(projectedMonth => projectedMonth.projectedIndicatorValues);
    }
    return this.props.updateUserMonthPlan(json, this.props.region, this.props.planDate);
  }

  declineAllBudgets() {
    const projectedPlan = this.props.projectedPlan;
    projectedPlan.forEach((month, index) => {
      month.plannedChannelBudgets = this.props.approvedBudgets[index];
    });
    return this.props.updateUserMonthPlan({projectedPlan: projectedPlan}, this.props.region, this.props.planDate);
  }

  popup() {
    this.setState({popup: true});
  }

  plan(isCommitted, preferences, callback, region){
    let body = preferences ? JSON.stringify(preferences) : null;
    let func = isCommitted ? (body ? 'PUT' : 'GET') : 'POST';
    this.setState({
      isPlannerLoading: true,
      popup: false,
      serverDown: false
    });
    serverCommunication.serverRequest(func, 'plan', body, region)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (data) {
                if (data.error) {
                  this.setState({isPlannerLoading: false, isError: true});
                }
                else {
                  this.setState({
                    isPlannerLoading: false,
                    isError: false
                  });
                  if (callback) {
                    callback(data);
                  }
                }
              }
              else {
              }
            })
        }
        else {
          if (response.status == 401){
            history.push('/');
          }
          if (response.status == 400){
            this.setState({isError: true, isPlannerLoading: false});
          }
          else {
            this.setState({serverDown: true, isPlannerLoading: false});
          }
        }
      })
      .catch((err) => {
        this.setState({
          isPlannerLoading: false,
          serverDown: true
        });
      });
  }

  selectTab(index) {
    this.setState({
      selectedTab: index
    });
  }

  render() {
    let tabs = {};
    let planDate = formatDate(this.props.planDate);
    tabs[planDate] = CurrentTab;
    tabs["Annual"] = AnnualTab;
    tabs["Forecasting"] = ProjectionsTab;
    tabs["Planned VS Actual"] = PlannedVsActual;

    const tabNames = Object.keys(tabs);
    const selectedName = tabNames[this.state.selectedTab];
    const selectedTab = tabs[selectedName];
    return <div>
      <Page contentClassName={ this.classes.content } innerClassName={ this.classes.pageInner } width="100%">
        <div className={ this.classes.head }>
          <div className={ this.classes.headTitle }>Plan</div>
          { this.props.userAccount.freePlan ? null :
            <div className={this.classes.headPlan}>
              <ReplanButton numberOfPlanUpdates={this.props.numberOfPlanUpdates} onClick={this.popup}/>
              <Popup style={{
                width: '265px',
                top: '180%',
                transform: 'translate(0, -50%)'
              }} hidden={!this.state.popup} onClose={() => {
                this.setState({
                  popup: false
                });
              }}>
                <PlanNextMonthPopup hidden={!this.state.popup} onNext={this.plan.bind(this, true, false, (data) => {
                  this.props.setDataAsState(data)
                }, this.props.region)} onBack={() => {
                  this.setState({
                    popup: false
                  })
                }}/>
              </Popup>
              <div className={this.classes.error}>
                <label hidden={!this.state.isError}>You've reached the plan updates limit.<br/> To upgrade, click <a
                  href="mailto:support@infinigrow.com?&subject=I need replan upgrade" target='_blank'>here</a></label>
              </div>
            </div>
          }
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
        <div>
          { selectedTab ? React.createElement(selectedTab, _.merge({}, this.props, this.state)) : null }
        </div>
      </Page>
    </div>
  }
}