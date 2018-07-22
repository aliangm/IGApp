import React from 'react';
import ReactDOM from 'react-dom';
import merge from 'lodash/merge';
import Component from 'components/Component';
import Page from 'components/Page';
import Popup from 'components/Popup';
import style from 'styles/plan/plan.css';
import Button from 'components/controls/Button';
import ReplanButton from 'components/pages/plan/ReplanButton';
import {isPopupMode, disablePopupMode} from 'modules/popup-mode';
import history from 'history';
import events from 'data/events';
import AddChannelPopup from 'components/pages/plan/AddChannelPopup';
import {output} from 'components/utils/channels';
import FirstPageVisit from 'components/pages/FirstPageVisit';
import {FeatureToggle} from 'react-feature-toggles';
import ReactTooltip from 'react-tooltip';
import NewScenarioPopup from 'components/pages/plan/NewScenarioPopup';
import BudgetLeftToPlan from 'components/pages/plan/BudgetLeftToPlan';

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
    this.state = {
      addChannelPopup: false,
      editMode: false,
      interactiveMode: false,
      showNewScenarioPopup: false
    };
  }

  componentDidMount() {
    this.getRelevantEvents(this.props);
    let callback = (data) => {
      this.props.setDataAsState(data);
      // if user didn't upload an excel
      if (!this.props.approvedBudgets || this.props.approvedBudgets.length === 0) {
        this.props.approveAllBudgets(true);
      }
    };
    if (isPopupMode()) {
      disablePopupMode();
      if (this.props.userAccount.permissions.plannerAI) {
        this.props.plan(true, null, callback, this.props.region, false);
      }
      else {
        history.push('/dashboard/CMO');
      }
    }
    this.setBudgetsData();
  }

  setBudgetsData = (isPlannerPrimary = false) => {
    const budgetsData = this.props.planBudgets.map(month =>
      Object.keys(month).reduce((object, channelKey) => {
        const {committedBudget, plannerBudget, isSoft, userBudgetConstraint} = month[channelKey];
        object[channelKey] = {
          primaryBudget: isPlannerPrimary ? plannerBudget : committedBudget,
          secondaryBudget: isPlannerPrimary ? committedBudget : plannerBudget,
          isConstraint: userBudgetConstraint,
          isSoft: isSoft
        };
        return object;
      }, {})
    );
    this.setState({budgetsData: budgetsData});
  };

  componentWillReceiveProps(nextProps) {
    this.getRelevantEvents(nextProps);
  }

  commitChanges = () => {
    const planBudgets = this.state.budgetsData.map(month =>
      Object.keys(month).reduce((object, channelKey) => {
        const {primaryBudget, isConstraint, isSoft, budgetConstraint} = month[channelKey];
        object[channelKey] = {
          committedBudget: primaryBudget,
          userBudgetConstraint: isConstraint ? budgetConstraint : null,
          isSoft: isConstraint ? isSoft : null
        };
        return object;
      }, {})
    );
    this.props.updateUserMonthPlan({planBudgets: planBudgets}, this.props.region, this.props.planDate);
    this.setState({planBudgets: planBudgets});
  };

  removeChannel = channelKey => {

  };

  editCommittedBudget = (month, channelKey, newBudget) => {
    const budgetsData = [...this.state.budgetsData];
    budgetsData[month][channelKey].primaryBudget = parseInt(newBudget.toString().replace(/\D+/g, '')) || 0;
    this.setState({budgetsData: budgetsData});
  };

  changeBudgetConstraint = (month, channelKey, isConstraint, isSoft = null) => {
    const budgetsData = [...this.state.budgetsData];
    budgetsData[month][channelKey].isConstraint = isConstraint;
    budgetsData[month][channelKey].isSoft = isSoft;
    if (isConstraint) {
      budgetsData[month][channelKey].budgetConstraint = this.props.planBudgets[month][channelKey].committedBudget;
    }
    this.setState({budgetsData: budgetsData});
  };

  getRelevantEvents = props => {
    this.setState({
      events: events.filter(
        event => event.vertical === props.userProfile.vertical || event.companyType === props.targetAudience.companyType)
    });
  };

  editUpdate = () => {
    return this.props.updateUserMonthPlan({
      projectedPlan: this.props.projectedPlan,
      approvedBudgets: this.props.approvedBudgets,
      unknownChannels: this.props.planUnknownChannels
    }, this.props.region, this.props.planDate);
  };

  addChannel = (newChannel) => {
    let projectedPlan = this.props.projectedPlan;
    let approvedBudgets = this.props.approvedBudgets;
    for (let i = 0; i < 12; i++) {
      if (!approvedBudgets[i]) {
        approvedBudgets[i] = {};
      }
      if (!projectedPlan[i] || Object.keys(projectedPlan[i]).length === 0) {
        projectedPlan[i] = {plannedChannelBudgets: {}, projectedIndicatorValues: {}};
      }
      projectedPlan[i].plannedChannelBudgets[newChannel] = 0;
      approvedBudgets[i][newChannel] = 0;
    }
    this.props.updateUserMonthPlan({
      projectedPlan: projectedPlan,
      approvedBudgets: approvedBudgets
    }, this.props.region, this.props.planDate)
      .then(() => {
        this.setState({addChannelPopup: false});
        const domElement = ReactDOM.findDOMNode(this[newChannel]);
        if (domElement) {
          domElement.scrollIntoView({});
        }
      });
  };

  addUnknownChannel = (otherChannel, otherChannelHierarchy) => {
    const channel = otherChannelHierarchy ? otherChannelHierarchy + ' / ' + otherChannel : otherChannel;
    let planUnknownChannels = this.props.planUnknownChannels;
    for (let i = 0; i < 12; i++) {
      if (!planUnknownChannels[i]) {
        planUnknownChannels[i] = {};
      }
      planUnknownChannels[i][channel] = 0;
    }
    this.props.updateUserMonthPlan({
      unknownChannels: planUnknownChannels
    }, this.props.region, this.props.planDate)
      .then(() => {
        this.setState({addChannelPopup: false});
        const domElement = ReactDOM.findDOMNode(this[channel]);
        if (domElement) {
          domElement.scrollIntoView({});
        }
      });
  };

  setRef = (channel, ref) => {
    this[channel] = ref;
  };

  forecastingGraphRef = ref => {
    this.forecastingGraph = ref;
  };

  render() {
    const {interactiveMode, editMode, addChannelPopup, showNewScenarioPopup} = this.state;
    const {annualBudget, calculatedData: {annualBudgetLeftToPlan}} = this.props;

    const planChannels = merge([],
      Object.keys(this.props.approvedBudgets.reduce((object, item) => {
          return merge(object, item);
        }
        , {})),
      Object.keys(this.props.projectedPlan.reduce((object, item) => {
          return merge(object, item.plannedChannelBudgets);
        }
        , {}))
    );

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, merge({}, this.props, this.state, {
        whatIf: this.props.plan,
        setRef: this.setRef.bind(this),
        forecastingGraphRef: this.forecastingGraphRef.bind(this),
        editCommittedBudget: this.editCommittedBudget,
        changeBudgetConstraint: this.changeBudgetConstraint
      })));

    const annualTabActive = this.props.children ? this.props.children.type.name === 'AnnualTab' : null;

    return <div>
      <ReactTooltip/>
      <Page popup={interactiveMode} contentClassName={this.classes.content} innerClassName={this.classes.pageInner}
            width="100%">
        <div className={this.classes.head}>
          <div className={this.classes.column} style={{justifyContent: 'flex-start'}}>
            <div className={this.classes.headTitle}>Plan</div>
            {annualTabActive && interactiveMode ?
              <FeatureToggle featureName="plannerAI">
                <div style={{display: 'flex'}}>
                  <div className={this.classes.error}>
                    <label hidden={!this.props.isPlannerError}>You've reached the plan updates limit.<br/> To upgrade,
                      click <a href="mailto:support@infinigrow.com?&subject=I need replan upgrade"
                               target='_blank'>here</a>
                    </label>
                  </div>
                  <ReplanButton numberOfPlanUpdates={this.props.numberOfPlanUpdates}
                                onClick={() => {
                                  this.props.plan(true, false, (data) => {
                                    this.props.setDataAsState(data);
                                  }, this.props.region, false);
                                }}
                                planNeedsUpdate={this.props.planNeedsUpdate}/>
                </div>
              </FeatureToggle>
              : null
            }
          </div>
          <div className={this.classes.column} style={{justifyContent: 'center'}}>
            <BudgetLeftToPlan annualBudget={annualBudget} annualBudgetLeftToPlan={annualBudgetLeftToPlan}/>
          </div>
          <div className={this.classes.column} style={{justifyContent: 'flex-end'}}>
            <div className={this.classes.headPlan}>
              {annualTabActive ?
                <div className={this.classes.forecastButton} data-tip="forecasting" onClick={() => {
                  const domElement = ReactDOM.findDOMNode(this.forecastingGraph);
                  if (domElement) {
                    domElement.scrollIntoView({});
                  }
                }}/>
                : null
              }
              {annualTabActive ?
                interactiveMode ?
                  <div style={{display: 'flex'}}>
                    <Button type="secondary"
                            style={{
                              marginLeft: '15px',
                              width: '102px'
                            }}
                            onClick={() => {
                              this.setState({interactiveMode: false});
                              this.setBudgetsData();
                            }}>
                      Cancel
                    </Button>
                    <Button type="secondary"
                            style={{
                              marginLeft: '15px',
                              width: '102px'
                            }}
                            onClick={() => {
                              this.commitChanges();
                              this.setState({
                                interactiveMode: false
                              });
                            }}>
                      Commit
                    </Button>
                  </div>
                  :
                  <div>
                    <Button type="primary"
                            style={{
                              marginLeft: '15px',
                              width: '102px'
                            }}
                            selected={showNewScenarioPopup ? true : null}
                            onClick={() => {
                              this.setState({
                                showNewScenarioPopup: true
                              });
                            }}>
                      New Scenario
                    </Button>
                    <NewScenarioPopup hidden={!showNewScenarioPopup}
                                      onCommittedClick={() => {
                                        this.setState({interactiveMode: true, showNewScenarioPopup: false});
                                      }}
                                      onScratchClick={() => {
                                        this.setState({interactiveMode: true, showNewScenarioPopup: false});
                                        this.props.plan(true, false, (data) => {
                                          this.props.setDataAsState(data);
                                          this.setBudgetsData(true);
                                        }, this.props.region, false);
                                      }}/>
                  </div>
                : null
              }
              {annualTabActive ?
                <div style={{position: 'relative'}}>
                  <Button type="primary"
                          style={{
                            marginLeft: '15px',
                            width: '102px'
                          }}
                          selected={editMode ? true : null}
                          onClick={() => {
                            if (editMode) {
                              this.editUpdate()
                                .then(() => {
                                  this.props.forecast();
                                  if (!this.props.userAccount.steps || !this.props.userAccount.steps.plan) {
                                    this.props.updateUserAccount({'steps.plan': true});
                                  }
                                });
                            }
                            this.setState({
                              editMode: !editMode
                            });
                          }}
                          icon={editMode ? 'buttons:plan' : 'buttons:edit'}>
                    {editMode ? (interactiveMode ? 'Done' : 'Commit') : 'Edit'}
                  </Button>
                  <Popup
                    className={this.classes.dropmenuEdit}
                    hidden={!editMode}
                  >
                    <div>
                      <div className={this.classes.dropmenuItemAdd}
                           onClick={() => {
                             this.setState({addChannelPopup: true});
                           }}>
                        Add Channel
                      </div>
                      <div className={this.classes.dropmenuItemCancel}
                           onClick={() => {
                             this.setState({editMode: false});
                             this.props.getUserMonthPlan(this.props.region);
                           }}>
                        Cancel
                      </div>
                    </div>
                  </Popup>
                  <AddChannelPopup
                    hidden={!addChannelPopup}
                    onChannelChoose={this.addChannel}
                    channels={output()}
                    planChannels={planChannels.map(item => {
                      return {id: item};
                    })}
                    close={() => {
                      this.setState({addChannelPopup: false});
                    }}
                    addUnknownChannel={this.addUnknownChannel}
                  />
                </div>
                : null}
            </div>
          </div>
        </div>
        {this.props.userAccount.pages && this.props.userAccount.pages.plan ?
          <div className={this.classes.wrap}>
            <div className={this.classes.serverDown}>
              <label hidden={!this.props.serverDown}>Something is wrong... Let us check what is it and fix it for you
                :)</label>
            </div>
            {childrenWithProps}
          </div>
          :
          <FirstPageVisit
            title="One place for understanding your route to growth"
            content="Everything starts with planning. Plan where, when and how you're going to invest your marketing budget to achieve your goals."
            action="Let's plan some budgets >"
            icon="step:plan"
            onClick={() => {
              this.props.updateUserAccount({'pages.plan': true});
            }}
          />
        }
      </Page>
    </div>;
  }
}