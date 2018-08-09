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
import isEqual from 'lodash/isEqual';

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
      showNewScenarioPopup: false,
      scrollEvent: null
    };
  }

  componentDidMount() {
    this.getRelevantEvents(this.props);
    if (isPopupMode()) {
      disablePopupMode();
      if (this.props.userAccount.permissions.plannerAI) {
        this.props.plan(true, null, this.props.region, false)
          .then(data => {
            this.props.setDataAsState(data);
            this.setBudgetsData(data.planBudgets);
          });
      }
      else {
        history.push('/dashboard/CMO');
      }
    }
    else {
      this.setBudgetsData();
    }
  }

  setBudgetsData = (planBudgets = this.props.planBudgets, withConstraints = null, isPlannerPrimary = false) => {
    const budgetsData = planBudgets.map(month => {
      const channelsObject = {};
      Object.keys(month).forEach(channelKey => {
        const {committedBudget, plannerBudget, isSoft, userBudgetConstraint} = month[channelKey];
        channelsObject[channelKey] = {
          primaryBudget: isPlannerPrimary ? plannerBudget : committedBudget,
          secondaryBudget: committedBudget,
          isConstraint: withConstraints ? userBudgetConstraint !== -1 : false,
          budgetConstraint: withConstraints ? committedBudget : null,
          isSoft: withConstraints ? isSoft : false
        };
      });
      return {channels: channelsObject, isHistory: false};
    });
    const historyBudgetsData = this.props.historyData.planBudgets.map(month => {
      const channelsObject = {};
      Object.keys(month).forEach(channelKey => {
        const {committedBudget} = month[channelKey];
        channelsObject[channelKey] = {
          primaryBudget: committedBudget
        };
      });
      return {channels: channelsObject, isHistory: true};
    });
    this.setState({budgetsData: [...historyBudgetsData, ...budgetsData]});
  };

  componentWillReceiveProps(nextProps) {
    this.getRelevantEvents(nextProps);
    if (!isEqual(nextProps.planBudgets, this.props.planBudgets)) {
      this.setBudgetsData(nextProps.planBudgets);
    }
  }

  commitChanges = () => {
    const planBudgets = this.getPlanBudgets();
    this.props.updateUserMonthPlan({planBudgets: planBudgets}, this.props.region, this.props.planDate);
  };

  getPlanBudgets = () => {
    const channels = this.state.budgetsData
      .filter(item => !item.isHistory)
      .map(item => item.channels);
    return channels.map(month => {
      const object = {};
      Object.keys(month).forEach(channelKey => {
        const {primaryBudget, isConstraint, isSoft, budgetConstraint} = month[channelKey];
        if (primaryBudget || isConstraint) {
          object[channelKey] = {
            committedBudget: primaryBudget,
            userBudgetConstraint: isConstraint ? budgetConstraint : -1,
            isSoft: isConstraint ? isSoft : false
          };
        }
      });
      return object;
    });
  };

  setCommittedBudgetsAsSoftConstraints = () => {
    let planBudgets = [...this.props.planBudgets];
    planBudgets = planBudgets.map(month => {
      const newMonthChannels = month;
      Object.keys(newMonthChannels).forEach(channelKey => {
        if (newMonthChannels[channelKey].committedBudget) {
          newMonthChannels[channelKey].isSoft = true;
          newMonthChannels[channelKey].userBudgetConstraint = newMonthChannels[channelKey].committedBudget;
        }
      });
      return newMonthChannels;
    });
    this.setBudgetsData(planBudgets, true);
  };

  planAndSetBudgets = () => {
    const planBudgets = this.getPlanBudgets();
    this.props.plan(true, {planBudgets: planBudgets}, this.props.region, false)
      .then(data => {
        this.setBudgetsData(data.planBudgets, true, true);
      });
  };

  deleteChannel = (channelKey) => {
    let budgetsData = [...this.state.budgetsData];
    budgetsData = budgetsData
      .map(month => {
        if (month.isHistory) {
          return month;
        }
        else {
          const channels = month.channels;
          if (channels[channelKey]) {
            channels[channelKey].primaryBudget = 0;
            if (!channels[channelKey].secondaryBudget && !channels[channelKey].isConstraint) {
              delete channels[channelKey];
            }
          }
          return {channels: channels, isHistory: month.isHistory};
        }
      });
    this.setState({budgetsData: budgetsData});
  };

  editCommittedBudget = (month, channelKey, newBudget) => {
    const budgetsData = [...this.state.budgetsData];
    budgetsData[month].channels[channelKey] = {
      secondaryBudget: budgetsData[month].channels[channelKey].secondaryBudget || 0,
      primaryBudget: newBudget,
      budgetConstraint: newBudget,
      isConstraint: true,
      isSoft: true
    };
    this.setState({budgetsData: budgetsData});
  };

  changeBudgetConstraint = (month, channelKey, isConstraint, isSoft = false) => {
    const budgetsData = [...this.state.budgetsData];
    if (!budgetsData[month].channels[channelKey]) {
      budgetsData[month].channels[channelKey] = {
        primaryBudget: 0,
        secondaryBudget: 0
      };
    }
    budgetsData[month].channels[channelKey].isConstraint = isConstraint;
    budgetsData[month].channels[channelKey].isSoft = isSoft;
    if (isConstraint) {
      budgetsData[month].channels[channelKey].budgetConstraint = budgetsData[month].channels[channelKey].primaryBudget;
    }
    this.setState({budgetsData: budgetsData});
  };

  getRelevantEvents = props => {
    this.setState({
      events: events.filter(
        event => event.vertical ===
          props.userProfile.vertical ||
          event.companyType ===
          props.targetAudience.companyType)
    });
  };

  editUpdate = () => {
    if (this.state.interactiveMode) {
      return Promise.resolve();
    }
    else {
      return this.props.updateUserMonthPlan({
        planBudgets: this.getPlanBudgets()
      }, this.props.region, this.props.planDate);
    }
  };

  addChannel = (channelKey) => {
    let budgetsData = [...this.state.budgetsData];
    budgetsData = budgetsData
      .map(month => {
        if (month.isHistory) {
          return month;
        }
        else {
          const channels = month.channels;
          if (!channels[channelKey]) {
            channels[channelKey] = {
              secondaryBudget: 0,
              primaryBudget: 0,
              budgetConstraint: 0,
              isConstraint: false,
              isSoft: false
            };
          }
          return {channels: channels, isHistory: month.isHistory};
        }
      });
    this.setState({budgetsData: budgetsData, addChannelPopup: false}, () => {
      const domElement = ReactDOM.findDOMNode(this[channelKey]);
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
      (child) => {
        return React.cloneElement(child, merge({}, this.props, this.state, {
          whatIf: this.props.plan,
          setRef: this.setRef,
          forecastingGraphRef: this.forecastingGraphRef,
          editCommittedBudget: this.editCommittedBudget,
          changeBudgetConstraint: this.changeBudgetConstraint,
          deleteChannel: this.deleteChannel,
          onPageScrollEventRegister: ((onPageScroll) => {
            this.setState({scrollEvent: onPageScroll});
          })
        }));
      });

    const annualTabActive = this.props.children ? this.props.children.type.name === 'AnnualTab' : null;

    return <div>
      <ReactTooltip/>
      <Page popup={interactiveMode} contentClassName={this.classes.content} innerClassName={this.classes.pageInner}
            width="100%" onPageScroll={this.state.scrollEvent}>
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
                                onClick={this.planAndSetBudgets}
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
                              width: '118px'
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
                                        this.setCommittedBudgetsAsSoftConstraints();
                                      }}
                                      onScratchClick={() => {
                                        this.setState({interactiveMode: true, showNewScenarioPopup: false});
                                        this.planAndSetBudgets();
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
                          icon={editMode ? 'buttons:done' : 'buttons:edit'}>
                    {editMode ? (interactiveMode ? 'Done' : 'Commit') : 'Edit'}
                  </Button>
                  <Popup
                    className={this.classes.dropmenuEdit}
                    hidden={!editMode}
                  >
                    <div>
                      <div className={this.classes.dropmenuItem}
                           onClick={() => {
                             this.setState({addChannelPopup: true});
                           }}>
                        Add Channel
                      </div>
                      <div className={this.classes.dropmenuItem}
                           onClick={() => {
                             this.setState({editMode: false});
                             this.setBudgetsData();
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