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
import PlanLoading from 'components/pages/plan/PlanLoading';
import {budgetExtend} from 'dataExtenders/budgetExtender.js';
import {campaignsExtend} from 'dataExtenders/campaignExtender.js';

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
      addNotification: this.addNotification.bind(this),
      plan: this.plan.bind(this),
      forecast: this.forecast.bind(this),
      approveAllBudgets: this.approveAllBudgets.bind(this),
      approveChannel: this.approveChannel.bind(this),
      approveWholeChannel: this.approveWholeChannel.bind(this),
      approveWholeMonth: this.approveWholeMonth.bind(this),
      declineAllBudgets: this.declineAllBudgets.bind(this),
      declineChannel: this.declineChannel.bind(this),
      declineWholeChannel: this.declineWholeChannel.bind(this),
      declineWholeMonth: this.declineWholeMonth.bind(this),
      calculateAttributionData: this.calculateAttributionData.bind(this)
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
    if (this.state.showUnsavedPopup) {
      if (userAnswer && this.state.unsaved) {
        this.getUserMonthPlan(localStorage.getItem('region'), null);
      }
      this.setState({showUnsavedPopup: false});
    }
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
    this.setState({unsaved: false});
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
    this.setState({unsaved: false});
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
                  companyWebsite: data.companyWebsite,
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

  updateUserAccount(body) {
    const deferred = q.defer();
    this.setState({unsaved: false});
    serverCommunication.serverRequest('PUT', 'useraccount', JSON.stringify(body))
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
                permissions: data.permissions
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
                permissions: data.permissions,
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
    const initialData = {
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
      googleAuto: data.googleapi,
      hubspotAuto: data.hubspotapi,
      isFacebookAuto: !!data.facebookapi,
      isYoutubeAuto: !!data.youtubeapi,
      mozapi: data.mozapi,
      salesforceAuto: data.salesforceapi,
      isLinkedinAuto: !!data.linkedinapi,
      isTwitterAuto: !!data.twitterapi,
      googleSheetsAuto: data.googlesheetsapi,
      isStripeAuto: !!data.stripeapi,
      adwordsapi: data.adwordsapi,
      facebookadsapi: data.facebookadsapi,
      linkedinadsapi: data.linkedinadsapi,
      twitteradsapi: data.twitteradsapi,
      attribution: data.attribution || { events: [] },
      pricingTiers: data.pricingTiers && data.pricingTiers.length > 0 ? data.pricingTiers : [{price: '', isMonthly: false, weight: 100}],
      planNeedsUpdate: data.planNeedsUpdate,
      notifications: data.notifications || [],
      CEVs: data.CEVs || {},
      CIM: data.CIM || {},
      technologyStack: data.technologyStack || [],
      historyData: data.historyData || {},
    }

    let extendedData = budgetExtend(initialData);
    extendedData = campaignsExtend(extendedData);

    this.setState(extendedData);
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
    if (isSendEmail) {
      serverCommunication.serverRequest('POST', 'email', JSON.stringify({
          email: this.state.teamMembers.find(member => member.userId === userId).email,
          name: this.state.teamMembers.find(member => member.userId === userId).name,
          type: type,
          taggerName: this.state.teamMembers.find(member => member.userId === notification.tagger).name,
          campaignName: notification.campaignName,
          plainComment: notification.plainComment
        }),
        false, false, true
      );
    }
  }

  approveAllBudgets(withProjections) {
    const json = {approvedBudgets: this.state.projectedPlan.map(projectedMonth => projectedMonth.plannedChannelBudgets)};
    if (withProjections) {
      json.approvedBudgetsProjection = this.state.projectedPlan.map(projectedMonth => projectedMonth.projectedIndicatorValues);
    }
    return this.state.updateUserMonthPlan(json, this.state.region, this.state.planDate)
      .then(() => {
        this.forecast();
      })
  }

  declineAllBudgets() {
    const projectedPlan = this.state.projectedPlan;
    projectedPlan.forEach((month, index) => {
      month.plannedChannelBudgets = this.state.approvedBudgets[index];
    });
    // this.setState({dropmenuVisible: false});
    return this.state.updateUserMonthPlan({projectedPlan: projectedPlan}, this.state.region, this.state.planDate);
  }

  approveChannel(month, channel, budget){
    let approvedBudgets = this.state.approvedBudgets;
    let approvedMonth = this.state.approvedBudgets[month] || {};
    approvedMonth[channel] = parseInt(budget.toString().replace(/[-$,]/g, ''));
    approvedBudgets[month] = approvedMonth;
    return this.state.updateUserMonthPlan({approvedBudgets: approvedBudgets}, this.state.region, this.state.planDate)
      .then(() => {
        this.forecast();
      })
  }

  approveWholeChannel(channel) {
    const approvedBudgets = this.state.approvedBudgets;
    approvedBudgets.forEach((month, index) => {
      month[channel] = this.state.projectedPlan[index].plannedChannelBudgets[channel] || 0;
    });
    return this.state.updateUserMonthPlan({approvedBudgets: approvedBudgets}, this.state.region, this.state.planDate)
      .then(() => {
        this.forecast();
      })
  }

  declineWholeChannel(channel) {
    const projectedPlan = this.state.projectedPlan;
    projectedPlan.forEach((month, index) => {
      month.plannedChannelBudgets[channel] = this.state.approvedBudgets[index][channel] || 0;
    });
    return this.state.updateUserMonthPlan({projectedPlan: projectedPlan}, this.state.region, this.state.planDate);
  }

  approveWholeMonth(month) {
    const approvedBudgets = this.state.approvedBudgets;
    approvedBudgets[month] = this.state.projectedPlan[month].plannedChannelBudgets;
    return this.state.updateUserMonthPlan({approvedBudgets: approvedBudgets}, this.state.region, this.state.planDate)
      .then(() => {
        this.forecast();
      })
  }

  declineWholeMonth(month) {
    const projectedPlan = this.state.projectedPlan;
    projectedPlan[month].plannedChannelBudgets = this.state.approvedBudgets[month];
    return this.state.updateUserMonthPlan({projectedPlan: projectedPlan}, this.state.region, this.state.planDate);
  }

  declineChannel(month, channel, budget){
    let projectedPlan = this.state.projectedPlan;
    let projectedMonth = this.state.projectedPlan[month];
    projectedMonth.plannedChannelBudgets[channel] = parseInt(budget.toString().replace(/[-$,]/g, ''));
    projectedPlan[month] = projectedMonth;
    return this.state.updateUserMonthPlan({projectedPlan: projectedPlan}, this.state.region, this.state.planDate);
  }

  plan(isCommitted, preferences, callback, region, silent){
    let body = preferences ? JSON.stringify(preferences) : null;
    let func = isCommitted ? (body ? 'PUT' : 'GET') : 'POST';
    if (!silent) {
      this.setState({
        isPlannerLoading: true,
        serverDown: false
      });
    }
    serverCommunication.serverRequest(func, 'plan', body, region)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (data) {
                if (data.error) {
                  if (!silent) {
                    this.setState({isPlannerError: true});
                  }
                }
                else {
                  if (!silent) {
                    this.setState({
                      isPlannerError: false
                    });
                  }
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
            if (!silent) {
              history.push('/');
            }
          }
          if (response.status == 400){
            if (!silent) {
              this.setState({isPlannerError: true, isPlannerLoading: false});
            }
          }
          else {
            if (!silent) {
              this.setState({serverDown: true, isPlannerLoading: false});
            }
          }
        }
      })
      .catch((err) => {
        if (!silent) {
          this.setState({
            serverDown: true, isPlannerLoading: false
          });
        }
      });
  }

  forecast() {
    const callback = (data) => {
      // PATCH
      // Update user month plan using another request
      const approvedBudgetsProjection = this.state.approvedBudgetsProjection;
      data.projectedPlan.forEach((month, index) => {
        if (!approvedBudgetsProjection[index]) {
          approvedBudgetsProjection[index] = {};
        }
        approvedBudgetsProjection[index] = month.projectedIndicatorValues;
      });
      this.state.updateUserMonthPlan({approvedBudgetsProjection: approvedBudgetsProjection}, this.state.region, this.state.planDate);
    };
    this.plan(false, {useApprovedBudgets: true}, callback, this.state.region, true);
  }

  calculateAttributionData(monthsExceptThisMonth, attributionModel) {
    const deferred = q.defer();
    this.setState({loaded: false});
    serverCommunication.serverRequest('POST', 'attribution', JSON.stringify({monthsExceptThisMonth: monthsExceptThisMonth, attributionModel: attributionModel}), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.setDataAsState(data);
              this.setState({loaded: true, months: this.state.previousData.length - 1 - monthsExceptThisMonth, attributionModel: attributionModel});
              deferred.resolve();
            });
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
    return <FeatureToggleProvider featureToggleList={this.state.permissions || {}}>
      <div>
        <Header auth={ this.props.route.auth } {... this.state} path={this.props.location.pathname}/>
        <Sidebar auth={ this.props.route.auth } userAccount={this.state.userAccount} path={this.props.location.pathname}/>
        <UnsavedPopup hidden={ !this.state.showUnsavedPopup } callback={ this.state.callback }/>
        <PlanLoading showPopup={this.state.isPlannerLoading} close={ ()=> { this.setState({isPlannerLoading: false}) } }/>
        { this.state.loaded ?
          <div className={this.classes.wrap} data-loading={this.state.isPlannerLoading ? true : null}>
            {childrenWithProps}
          </div>
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