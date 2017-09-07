import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import { isPopupMode ,disablePopupMode, checkIfPopup } from 'modules/popup-mode';
import serverCommunication from 'data/serverCommunication';
import q from 'q';
import history from 'history';
import { withRouter } from 'react-router';
import UnsavedPopup from 'components/UnsavedPopup';

class AppComponent extends Component {

  constructor(props) {
    super(props);
    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
    this.state = {
      getUserMonthPlan: this.getUserMonthPlan.bind(this),
      updateUserMonthPlan: this.updateUserMonthPlan.bind(this),
      updateUserAccount: this.updateUserAccount.bind(this),
      createUserMonthPlan: this.createUserMonthPlan.bind(this),
      updateState: this.updateState.bind(this),
      setDataAsState: this.setDataAsState.bind(this),
      unsaved: false
    };
  }

  // Asynchronous version of `setRouteLeaveHook`.
// Instead of synchronously returning a result, the hook is expected to
// return a promise.
  setAsyncRouteLeaveHook(router, hook) {
    let withinHook = false;
    let finalResult = undefined;
    let finalResultSet = false;
    router.listenBefore(nextLocation => {
      withinHook = true;
      if (!finalResultSet) {
        hook(nextLocation).then(result => {
          this.handleCallback(result);
          finalResult = result;
          finalResultSet = true;
          if (!withinHook && nextLocation) {
            // Re-schedule the navigation
            router.push(nextLocation)
          }
        })
      }
      let result = finalResultSet ? finalResult : false;
      withinHook = false;
      finalResult = undefined;
      finalResultSet = false;
      return result
    })
  }

  routerWillLeave() {
    return new Promise((resolve, reject) => {
      if (!this.state.unsaved) {
        // No unsaved changes -- leave
        resolve(true)
      } else {
        // Unsaved changes -- ask for confirmation
        /**
         vex.dialog.confirm({
          message: 'There are unsaved changes. Leave anyway?' + nextLocation,
          callback: result => resolve(result)
        })
         **/
        this.setState({showUnsavedPopup: true, callback: resolve});
      }
    })
  }

  handleCallback(userAnswer) {
    if (userAnswer && this.state.unsaved) {
      this.getUserMonthPlan(localStorage.getItem('region'), null);
    }
    this.setState({showUnsavedPopup: false});
  }

  componentDidMount() {
    this.setAsyncRouteLeaveHook(this.props.router, this.routerWillLeave)

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

  updateState(newState, callback){
    this.setState(newState, callback);
    this.setState({unsaved: newState.unsaved === undefined ? true : newState.unsaved});
  }

  updateUserMonthPlan(body, region, planDate, dontSetState) {
    const deferred = q.defer();
    serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify(body), region, planDate)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (!dontSetState) {
                this.setDataAsState(data);
                this.getPreviousData();
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
                this.setDataAsState(data);
                this.getPreviousData();
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

  getPreviousData() {
    serverCommunication.serverRequest('GET', 'previousdata', null, this.state.region)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (data) {
                this.setState({
                  previousData: data
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
                teamMembers: data.teamMembers,
                unsaved: false
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
                this.setDataAsState(data);
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

  setDataAsState(data) {
    this.setState({
      userProfile: data.userProfile,
      targetAudience: data.targetAudience && data.targetAudience.length > 0 ? data.targetAudience : [{fields: {}, info: {}}],
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
      userMinMonthBudgets: data.userMinMonthBudgets || [],
      maxChannels: data.maxChannels || -1,
      actualIndicators: data.actualIndicators,
      plannedChannelBudgets: data.projectedPlan && data.projectedPlan.length>0 ? data.projectedPlan[0].plannedChannelBudgets : {},
      knownChannels: data.actualChannelBudgets && data.actualChannelBudgets.knownChannels || {},
      unknownChannels: data.actualChannelBudgets && data.actualChannelBudgets.unknownChannels || {},
      monthBudget: data.projectedPlan && data.projectedPlan.length>0 ? data.projectedPlan[0].monthBudget : null,
      campaigns: data.campaigns || [],
      campaignsTemplates: data.campaignsTemplates || {},
      numberOfPlanUpdates: data.numberOfPlanUpdates,
      projectedPlan: data.projectedPlan,
      approvedPlan: data.approvedPlan || [],
      planUnknownChannels: data.unknownChannels || [],
      budget: data.annualBudget,
      budgetArray: data.annualBudgetArray,
      events: data.events || [],
      unsaved: false,
      isGoogleAuto: !!data.googleapi,
      hubspotAuto: data.hubspotapi,
      isFacebookAuto: !!data.facebookapi,
      salesforceAuto: data.salesforceapi,
      isLinkedinAuto: !!data.linkedinapi,
      isTwitterAuto: !!data.twitterapi,
      googleSheetsAuto: data.googlesheetsapi,
    });
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, this.state));
    return <div>
      <Header auth={ this.props.route.auth } {... this.state}/>
      <Sidebar auth={ this.props.route.auth }/>
      <UnsavedPopup hidden={ !this.state.showUnsavedPopup } callback={ this.state.callback }/>
      { childrenWithProps }
    </div>
  }
}

export default withRouter(DragDropContext(HTML5Backend)(AppComponent))