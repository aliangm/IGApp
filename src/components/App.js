import React from 'react';
import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import { isPopupMode ,disablePopupMode, checkIfPopup } from 'modules/popup-mode';
import serverCommunication from 'data/serverCommunication';
import q from 'q';
import history from 'history';

export default class AppComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      getUserMonthPlan: this.getUserMonthPlan.bind(this),
      updateUserMonthPlan: this.updateUserMonthPlan.bind(this),
      updateUserAccount: this.updateUserAccount.bind(this),
      createUserMonthPlan: this.createUserMonthPlan.bind(this),
      updateState: this.updateState.bind(this)
    };
  }

  componentDidMount() {
    serverCommunication.serverRequest('GET', 'useraccount')
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (data) {
                this.setState({
                  userAccount: data,
                  userFirstName: data.firstName,
                  userLastName: data.lastName,
                  userCompany: data.companyName,
                  logoURL: data.companyWebsite ? "https://logo.clearbit.com/" + data.companyWebsite : '',
                  teamMembers: data.teamMembers,
                });
              }
            })
        }
        else if (response.status == 401){
          history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });

    serverCommunication.serverRequest('GET', 'regions')
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (data) {
                this.setState({
                  regions: data
                });
              }
            })
        }
        else if (response.status == 401){
          history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });

    this.getUserMonthPlan(localStorage.getItem('region'), null);
  }

  updateState(newState){
    this.setState(newState);
  }

  updateUserMonthPlan(body, region, planDate, dontSetState) {
    const deferred = q.defer();
    serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify(body), region, planDate)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (!dontSetState) {
                this.setState({
                  userProfile: data.userProfile,
                  targetAudience: data.targetAudience,
                  annualBudget: data.annualBudget,
                  annualBudgetArray: data.annualBudgetArray || [],
                  planDate: data.planDate,
                  planDay: data.planDay,
                  region: data.region,
                  goals: {
                    primary: data.goals && data.goals.primary || 'InfiniGrow Recommended',
                    secondary: data.goals && data.goals.secondary || 'InfiniGrow Recommended'
                  },
                  objectives: data.objectives || [],
                  blockedChannels: data.blockedChannels || [],
                  inHouseChannels: data.inHouseChannels || [],
                  userMinMonthBudgets: data.userMinMonthBudgets || {},
                  maxChannels: data.maxChannels || -1,
                  isCheckAnnual: data.annualBudget !== null,
                  actualIndicators: data.actualIndicators,
                  plannedChannelBudgets: data.projectedPlan.length > 0 ? data.projectedPlan[0].plannedChannelBudgets : {},
                  knownChannels: data.actualChannelBudgets && data.actualChannelBudgets.knownChannels || {},
                  unknownChannels: data.actualChannelBudgets && data.actualChannelBudgets.unknownChannels || {},
                  monthBudget: data.projectedPlan.length > 0 ? data.projectedPlan[0].monthBudget : null,
                  campaigns: data.campaigns || {},
                  numberOfPlanUpdates: data.numberOfPlanUpdates,
                  projectedPlan: data.projectedPlan,
                  approvedPlan: data.approvedPlan || [],
                  budget: data.annualBudget,
                  budgetArray: data.annualBudgetArray,
                  events: data.events || []
                });
              }
              deferred.resolve(data);
            })
        }
        else if (response.status == 401){
          history.push('/');
          deferred.reject();
        }
      })
      .catch((err) => {
        console.log(err);
        deferred.reject();
      });

    return deferred.promise;

  }

  getUserMonthPlan(region, planDate) {
    serverCommunication.serverRequest('GET', 'usermonthplan', null, region, planDate)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (data) {
                this.setState({
                  userProfile: data.userProfile,
                  targetAudience: data.targetAudience,
                  annualBudget: data.annualBudget,
                  annualBudgetArray: data.annualBudgetArray || [],
                  planDate: data.planDate,
                  region: data.region,
                  planDay: data.planDay,
                  goals: {
                    primary: data.goals && data.goals.primary || 'InfiniGrow Recommended',
                    secondary: data.goals && data.goals.secondary || 'InfiniGrow Recommended'
                  },
                  objectives: data.objectives || [],
                  blockedChannels: data.blockedChannels || [],
                  inHouseChannels: data.inHouseChannels || [],
                  userMinMonthBudgets: data.userMinMonthBudgets || {},
                  maxChannels: data.maxChannels || -1,
                  isCheckAnnual: data.annualBudget !== null,
                  actualIndicators: data.actualIndicators,
                  plannedChannelBudgets: data.projectedPlan.length > 0 ? data.projectedPlan[0].plannedChannelBudgets : {},
                  knownChannels: data.actualChannelBudgets && data.actualChannelBudgets.knownChannels || {},
                  unknownChannels: data.actualChannelBudgets && data.actualChannelBudgets.unknownChannels || {},
                  monthBudget: data.projectedPlan.length > 0 ? data.projectedPlan[0].monthBudget : null,
                  campaigns: data.campaigns || {},
                  numberOfPlanUpdates: data.numberOfPlanUpdates,
                  projectedPlan: data.projectedPlan,
                  approvedPlan: data.approvedPlan || [],
                  budget: data.annualBudget,
                  budgetArray: data.annualBudgetArray,
                  events: data.events || []
                });
              }
            })
        }
        else if (response.status == 401){
          history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateUserAccount(body, region, planDate) {
    const deferred = q.defer();
    serverCommunication.serverRequest('PUT', 'useraccount', JSON.stringify(body), region, planDate)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.setState({
                userAccount: data,
                userFirstName: data.firstName,
                userLastName: data.lastName,
                userCompany: data.companyName,
                logoURL: data.companyWebsite ? "https://logo.clearbit.com/" + data.companyWebsite : '',
                teamMembers: data.teamMembers
              });
              deferred.resolve();
            });
        }
        else if (response.status == 401){
          history.push('/');
          deferred.reject();
        }
      })
      .catch(function (err) {
        console.log(err);
        deferred.reject();
      });
    return deferred.promise;
  }

  createUserMonthPlan(body) {
    const deferred = q.defer();
    serverCommunication.serverRequest('POST', 'usermonthplan', JSON.stringify(body))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (data) {
                this.setState({
                  userProfile: data.userProfile,
                  targetAudience: data.targetAudience,
                  annualBudget: data.annualBudget,
                  annualBudgetArray: data.annualBudgetArray || [],
                  planDate: data.planDate,
                  planDay: data.planDay,
                  region: data.region,
                  goals: {
                    primary: data.goals && data.goals.primary || 'InfiniGrow Recommended',
                    secondary: data.goals && data.goals.secondary || 'InfiniGrow Recommended'
                  },
                  objectives: data.objectives || [],
                  blockedChannels: data.blockedChannels || [],
                  inHouseChannels: data.inHouseChannels || [],
                  userMinMonthBudgets: data.userMinMonthBudgets || {},
                  maxChannels: data.maxChannels || -1,
                  isCheckAnnual: data.annualBudget !== null,
                  actualIndicators: data.actualIndicators,
                  plannedChannelBudgets: data.projectedPlan.length > 0 ? data.projectedPlan[0].plannedChannelBudgets : {},
                  knownChannels: data.actualChannelBudgets && data.actualChannelBudgets.knownChannels || {},
                  unknownChannels: data.actualChannelBudgets && data.actualChannelBudgets.unknownChannels || {},
                  monthBudget: data.projectedPlan.length > 0 ? data.projectedPlan[0].monthBudget : null,
                  campaigns: data.campaigns || {},
                  numberOfPlanUpdates: data.numberOfPlanUpdates,
                  projectedPlan: data.projectedPlan,
                  approvedPlan: data.approvedPlan || [],
                  budget: data.annualBudget,
                  budgetArray: data.annualBudgetArray,
                  events: data.events || []
                });
                deferred.resolve();
              }
            })
        }
        else if (response.status == 401){
          history.push('/');
          deferred.reject();
        }
      })
      .catch((err) => {
        console.log(err);
        deferred.reject();
      });

    return deferred.promise;
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, this.state));
    return <div>
      <Header auth={ this.props.route.auth } {... this.state}/>
      <Sidebar/>
      { childrenWithProps }
    </div>
  }
}