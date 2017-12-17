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
import { initialize as initializeIndicators } from 'components/utils/indicators';
import { initialize as initializeChannels } from 'components/utils/channels';
import Loading from 'components/pages/plan/Loading';
import Popup from 'components/Popup';
import style from 'styles/app.css';
import { FeatureToggleProvider } from 'react-feature-toggles';

class AppComponent extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
    this.state = {
      loaded: false,
      getUserMonthPlan: this.getUserMonthPlan.bind(this),
      updateUserMonthPlan: this.updateUserMonthPlan.bind(this),
      updateUserAccount: this.updateUserAccount.bind(this),
      createUserMonthPlan: this.createUserMonthPlan.bind(this),
      createUserAccount: this.createUserAccount.bind(this),
      updateState: this.updateState.bind(this),
      setDataAsState: this.setDataAsState.bind(this),
      unsaved: false,
      auth: props.route.auth,
      addNotification: this.addNotification.bind(this)
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
    this.setAsyncRouteLeaveHook(this.props.router, this.routerWillLeave);
    const tasks = [
      this.getUserAccount(),
      this.getRegions(),
      this.getIndicatorsMetadata(),
      this.getChannelsMetadata(),
      this.getUserMonthPlan(localStorage.getItem('region'), null)
    ];

    Promise.all(tasks)
      .then( () => {
        setTimeout(() => { this.setState({loaded: true}); }, 1000);
      })
      .catch( (err) => {
          console.log(err);
        }
      )

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
                initializeIndicators(this.state.indicatorsSchema, data.namesMapping && data.namesMapping.indicators);
                initializeChannels(this.state.channelsSchema, data.namesMapping && data.namesMapping.channels);
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
    const deferred = q.defer();
    serverCommunication.serverRequest('GET', 'usermonthplan', null, region, planDate)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (data) {
                this.setDataAsState(data);
                this.getPreviousData();
                initializeIndicators(this.state.indicatorsSchema, data.namesMapping && data.namesMapping.indicators);
                initializeChannels(this.state.channelsSchema, data.namesMapping && data.namesMapping.channels);
              }
              deferred.resolve();
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

  getUserAccount() {
    const deferred = q.defer();
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
                  permissions: data.permissions
                });
              }
              deferred.resolve();
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

  createUserAccount(body) {
    const deferred = q.defer();
    serverCommunication.serverRequest('POST', 'useraccount', JSON.stringify(body))
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

  getChannelsMetadata() {
    const deferred = q.defer();
    serverCommunication.serverRequest('GET', 'metadata/channels', false, false, false, true)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (data) {
                this.setState({
                  channelsSchema: data
                });
                initializeChannels(data);
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

  getIndicatorsMetadata() {
    const deferred = q.defer();
    serverCommunication.serverRequest('GET', 'metadata/indicators', false, false, false, true)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (data) {
                this.setState({
                  indicatorsSchema: data
                });
                initializeIndicators(data);
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

  getRegions() {
    const deferred = q.defer();
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
              deferred.resolve();
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
      targetAudience: data.targetAudience && data.targetAudience.length > 0 ? data.targetAudience : [{fields: {}, info: { weight: 100 }}],
      annualBudget: data.annualBudget,
      annualBudgetArray: data.annualBudgetArray || [],
      planDate: data.planDate,
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
      actualIndicators: data.actualIndicators || {},
      plannedChannelBudgets: data.projectedPlan && data.projectedPlan.length>0 ? data.projectedPlan[0].plannedChannelBudgets : {},
      knownChannels: data.actualChannelBudgets && data.actualChannelBudgets.knownChannels || {},
      unknownChannels: data.actualChannelBudgets && data.actualChannelBudgets.unknownChannels || {},
      monthBudget: data.projectedPlan && data.projectedPlan.length>0 ? data.projectedPlan[0].monthBudget : null,
      campaigns: data.campaigns || [],
      campaignsTemplates: data.campaignsTemplates || {},
      campaignIdeas: data.campaignIdeas || [],
      numberOfPlanUpdates: data.numberOfPlanUpdates,
      projectedPlan: data.projectedPlan || [],
      approvedBudgets: data.approvedBudgets || [],
      approvedBudgetsProjection: data.approvedBudgetsProjection || [],
      planUnknownChannels: data.unknownChannels || [],
      budget: data.annualBudget,
      budgetArray: data.annualBudgetArray || [],
      events: data.events || [],
      unsaved: false,
      googleAuto: data.googleapi,
      hubspotAuto: data.hubspotapi,
      isFacebookAuto: !!data.facebookapi,
      mozapi: data.mozapi,
      salesforceAuto: data.salesforceapi,
      isLinkedinAuto: !!data.linkedinapi,
      isTwitterAuto: !!data.twitterapi,
      googleSheetsAuto: data.googlesheetsapi,
      isStripeAuto: !!data.stripeapi,
      attribution: data.attribution || { events: [] },
      pricingTiers: data.pricingTiers || [],
      planNeedsUpdate: data.planNeedsUpdate,
      notifications: data.notifications || [],
      CEVs: data.CEVs || {}
    });
  }

  addNotification(userId, type, notification, isSendEmail) {
    let notifications = this.state.notifications || [];
    notifications.push({
      UID: userId,
      timestamp: new Date(),
      notificationType: type,
      isRead: false,
      notification: notification
    });
    this.updateUserMonthPlan({notifications: notifications}, this.state.region, this.state.planDate);
    /*
    if (isSendEmail) {
      serverCommunication.serverRequest('POST', 'email', {
          email: this.state.teamMembers.find(member => member.userId === userId).email,
          type: type,
          taggerName: this.state.teamMembers.find(member => member.userId === notification.tagger) ? this.state.teamMembers.find(member => member.userId === notification.tagger).name : 'Dor Lahav',
          campaignName: notification.campaignName
        },
        false, false, true
      );
    }
    */
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, this.state));
    return <FeatureToggleProvider featureToggleList={this.state.permissions || {}}>
      <div>
        <Header auth={ this.props.route.auth } {... this.state}/>
        <Sidebar auth={ this.props.route.auth }/>
        <UnsavedPopup hidden={ !this.state.showUnsavedPopup } callback={ this.state.callback }/>
        { this.state.loaded ?
          childrenWithProps
          : <div className={ this.classes.loading }>
            <Popup className={ this.classes.popup }>
              <div>
                <Loading />
              </div>
            </Popup>
          </div> }
      </div>
    </FeatureToggleProvider>
  }
}

export default withRouter(DragDropContext(HTML5Backend)(AppComponent))