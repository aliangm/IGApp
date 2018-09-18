import React from 'react';
import ReactDOM from 'react-dom';
import merge from 'lodash/merge';
import Component from 'components/Component';
import Page from 'components/Page';
import Popup from 'components/Popup';
import style from 'styles/plan/plan.css';
import Button from 'components/controls/Button';
import PlanButton from 'components/pages/plan/PlanButton';
import {isPopupMode, disablePopupMode} from 'modules/popup-mode';
import history from 'history';
import events from 'data/events';
import AddChannelPopup from 'components/pages/plan/AddChannelPopup';
import {output, isUnknownChannel, initialize} from 'components/utils/channels';
import {FeatureToggle} from 'react-feature-toggles';
import ReactTooltip from 'react-tooltip';
import NewScenarioPopup from 'components/pages/plan/NewScenarioPopup';
import BudgetLeftToPlan from 'components/pages/plan/BudgetLeftToPlan';
import isEqual from 'lodash/isEqual';
import PlanOptimizationPopup from 'components/pages/plan/PlanOptimizationPopup';
import intersection from 'lodash/intersection';
import union from 'lodash/union';
import maxBy from 'lodash/maxBy';
import isNil from 'lodash/isNil';

export default class Plan extends Component {

  style = style;

  static defaultProps = {
    userProfile: {},
    targetAudience: {},
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
      scrollEvent: null,
      showOptimizationPopup: false,
      primaryPlanForecastedIndicators: this.props.forecastedIndicators
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
            this.setState({primaryPlanForecastedIndicators: this.parsePlannerForecasting(data.forecastedIndicators)});
            this.setState({interactiveMode: true});
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

  parsePlannerForecasting = (forecastedIndicators) => {
    return forecastedIndicators.map((month) => {
      const newMonth = {};

      Object.keys(month).forEach((indicator) => {
        if (month[indicator].planner) {
          newMonth[indicator] = {
            committed: month[indicator].planner
          };
        }
      });

      return newMonth;
    });
  };

  setBudgetsData = (planBudgets = this.props.planBudgets, withConstraints = null, isPlannerPrimary = false) => {
    const budgetsData = planBudgets.map(month => {
      const channelsObject = {};
      Object.keys(month).forEach(channelKey => {
        const {committedBudget, plannerBudget, isSoft, userBudgetConstraint} = month[channelKey];
        channelsObject[channelKey] = {
          primaryBudget: isPlannerPrimary ? plannerBudget : committedBudget,
          secondaryBudget: committedBudget,
          isConstraint: withConstraints ? !isNil(userBudgetConstraint) : false,
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
    this.props.planUnknownChannels.forEach((month, index) => {
      Object.keys(month).forEach(channelKey => {
        const committedBudget = month[channelKey];
        budgetsData[index].channels[channelKey] = {
          primaryBudget: committedBudget
        };
      });
    });
    this.setState({budgetsData: [...historyBudgetsData, ...budgetsData]});
  };

  componentWillReceiveProps(nextProps) {
    this.getRelevantEvents(nextProps);
    if (!isEqual(nextProps.planBudgets, this.props.planBudgets)) {
      this.setBudgetsData(nextProps.planBudgets);
      this.setState({primaryPlanForecastedIndicators: nextProps.forecastedIndicators});
    }
  }

  commitChanges = () => {
    const planBudgets = this.getPlanBudgets();
    this.forecastAndUpdateUserMonthPlan({
      planBudgets: planBudgets,
      unknownChannels: this.getPlanBudgets(true),
      namesMapping: this.props.namesMapping
    }, this.state.primaryPlanForecastedIndicators);
  };

  getPlanBudgets = (unknownChannels = false) => {
    const channels = this.state.budgetsData
      .filter(item => !item.isHistory)
      .map(item => item.channels);
    return channels.map(month => {
      const object = {};
      Object.keys(month)
        .filter(channelKey => unknownChannels ? isUnknownChannel(channelKey) : !isUnknownChannel(channelKey))
        .forEach(channelKey => {
          const {primaryBudget, isConstraint, isSoft, budgetConstraint} = month[channelKey];
          if (primaryBudget || isConstraint) {
            if (unknownChannels) {
              object[channelKey] = primaryBudget;
            }
            else {
              object[channelKey] = {
                committedBudget: primaryBudget,
                userBudgetConstraint: isConstraint ? budgetConstraint : null,
                isSoft: isConstraint ? isSoft : false
              };
            }
          }
        });
      return object;
    });
  };

  setCommittedBudgetsAsSoftConstraints = () => {
    let planBudgets = [...this.props.planBudgets];
    planBudgets = planBudgets.map(month => {
      const newMonthChannels = {...month};
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
        this.setState({primaryPlanForecastedIndicators: this.parsePlannerForecasting(data.forecastedIndicators)});
      });
  };

  deleteChannel = (channelKey) => {
    const budgetsData = this.state.budgetsData
      .map(month => {
        if (month.isHistory) {
          return month;
        }
        else {
          const channels = {...month.channels};
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
    const secondary = budgetsData[month].channels[channelKey] &&
      budgetsData[month].channels[channelKey].secondaryBudget;
    const alreadyHardConstraint = budgetsData[month].channels[channelKey] &&
      budgetsData[month].channels[channelKey].isConstraint &&
      budgetsData[month].channels[channelKey].isSoft ===
      false;
    budgetsData[month].channels[channelKey] = {
      secondaryBudget: secondary || 0,
      primaryBudget: newBudget,
      budgetConstraint: newBudget,
      isConstraint: true,
      isSoft: !alreadyHardConstraint
    };

    this.setState({budgetsData: budgetsData}, () => {
      this.props.forecast(this.getPlanBudgets())
        .then((data) => {
          this.setState({primaryPlanForecastedIndicators: data},
            () => {
              if (!this.state.interactiveMode && !this.state.editMode) {
                this.commitChanges();
              }
            });
        });
    });
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
    if (!this.state.interactiveMode){
      this.forecastAndUpdateUserMonthPlan({
        planBudgets: this.getPlanBudgets(),
        unknownChannels: this.getPlanBudgets(true),
        namesMapping: this.props.namesMapping
      });
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
          const channels = {...month.channels};
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

      // Scroll to the title cell
      const domElement = ReactDOM.findDOMNode(this[channelKey]).firstChild;
      if (domElement) {
        domElement.scrollIntoView({});
      }
    });
  };

  addUnknownChannel = (name, category) => {
    const namesMapping = {...this.props.namesMapping};
    if (!namesMapping.channels) {
      namesMapping.channels = {};
    }
    const channel = `${category} / ${name}`;
    namesMapping.channels[channel] = {
      title: channel,
      nickname: name,
      category: category,
      isUnknownChannel: true
    };
    this.props.updateState({namesMapping: namesMapping});
    this.addChannel(channel);
  };

  setRef = (channel, ref) => {
    this[channel] = ref;
  };

  forecastingGraphRef = ref => {
    this.forecastingGraph = ref;
  };

  applyLockOnChannels = (planBudgets, lockedChannels) => {
    return planBudgets.map((month) => {
      const newMonth = {...month};

      lockedChannels.forEach(channelKey => {
        const channelBudget = newMonth[channelKey] || {committedBudget: 0};
        newMonth[channelKey] = {
          ...channelBudget,
          userBudgetConstraint: channelBudget.committedBudget,
          isSoft: false
        };
      });

      return newMonth;
    });
  };

  manipulatePlanBudgets = (planBudgets, manipulateFunctions) => {
    return planBudgets.map((month) => {
      const newMonth = {};

      Object.keys(month).forEach(channelKey => {
        newMonth[channelKey] = manipulateFunctions(month[channelKey]);
      });

      return newMonth;
    });
  };

  planWithConstraints = (constraints) => {
    return new Promise((resolve, reject) => {
      const planBudgets = this.getPlanBudgets();

      const normalizedBudgets = this.manipulatePlanBudgets(planBudgets, (channelData) => {
        return {
          ...channelData,
          committedBudget: channelData.committedBudget || 0
        };
      });

      const planWithLockedChannles = this.applyLockOnChannels(normalizedBudgets,
        constraints.channelsToLock);

      this.props.optimalImprovementPlan(false, {
          planBudgets: planWithLockedChannles
        },
        this.props.region,
        false,
        constraints.channelsLimit)
        .then(data => {
          const changesObject = this.getChangesObjectFromPlan(data);

          resolve({
            ...changesObject,
            commitPlanBudgets: () => this.forecastAndUpdateUserMonthPlan({
              planBudgets: this.applyAllPlannerSuggestions(data.planBudgets)
            })
          });
        });
    });
  };

  applyAllPlannerSuggestions = (planBudgets) => {
    return this.manipulatePlanBudgets(planBudgets, (channelData) => {
      return {
        ...channelData,
        committedBudget: channelData.plannerBudget
      };
    });
  };

  forecastAndUpdateUserMonthPlan = ({planBudgets, ...userMonthPlan}, forecasting) => {
    const updateMonthPlan = (forecasting) => {
      return this.props.updateUserMonthPlan({
        ...userMonthPlan,
        planBudgets: planBudgets,
        forecastedIndicators: forecasting
      }, this.props.region, this.props.planDate);
    };

    return new Promise((resolve, reject) => {
      if (!forecasting) {
        this.props.forecast(planBudgets)
          .then((data) => {
            updateMonthPlan(data)
              .then(() => resolve());
          });
      }
      else {
        updateMonthPlan(forecasting)
          .then(() => resolve());
      }
    });
  };

  getChangesObjectFromPlan = ({planBudgets, forecastedIndicators}) => {
    const suggestions = union(...planBudgets.map((month, monthKey) => {
      return Object.keys(month).map((channelKey) => {
        return {
          channel: channelKey,
          monthKey: monthKey,
          fromBudget: month[channelKey].committedBudget || 0,
          toBudget: month[channelKey].plannerBudget
        };
      })
        .filter((data) => data.fromBudget !== data.toBudget);
    }));

    const objectivesKeys = this.props.calculatedData.objectives.collapsedObjectives.map((objective) => objective.indicator);
    const latestMonthWithSuggestion = maxBy(suggestions, suggestion => suggestion.monthKey).monthKey;

    const parsedForecasting = forecastedIndicators.map((month, monthKey) => {
      return Object.keys(month).map((indicatorKey) => {
        return {
          indicator: indicatorKey,
          monthKey: monthKey,
          committed: month[indicatorKey].committed,
          ifApproved: month[indicatorKey].planner
        };
      })
        .filter((data) => data.ifApproved &&
          data.committed !==
          data.ifApproved &&
          data.monthKey <= latestMonthWithSuggestion &&
          objectivesKeys.includes(data.indicator));
    });

    return {channelsArray: suggestions, forecastedIndicators: union(...parsedForecasting)};
  };

  render() {
    const {interactiveMode, editMode, addChannelPopup, showNewScenarioPopup} = this.state;
    const {calculatedData: {annualBudget, annualBudgetLeftToPlan}} = this.props;

    const planChannels = Object.keys(this.props.calculatedData.committedBudgets.reduce((object, item) => {
        return merge(object, item);
      }
      , {}));

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => {
        return React.cloneElement(child, merge({}, this.props, this.state, {
          whatIf: this.props.plan,
          setRef: this.setRef,
          forecastingGraphRef: this.forecastingGraphRef,
          editCommittedBudget: this.editCommittedBudget,
          changeBudgetConstraint: this.changeBudgetConstraint,
          deleteChannel: this.deleteChannel,
          secondaryPlanForecastedIndicators: this.state.editMode || this.state.interactiveMode
            ? this.props.forecastedIndicators
            : null,
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
            {(annualTabActive && !editMode) ?
              interactiveMode ?
                <FeatureToggle featureName="plannerAI">
                  <div style={{display: 'flex'}}>
                    <div className={this.classes.error}>
                      <label hidden={!this.props.isPlannerError}>You've reached the plan updates limit.<br/> To
                        upgrade,
                        click <a href="mailto:support@infinigrow.com?&subject=I need replan upgrade"
                                 target='_blank'>here</a>
                      </label>
                    </div>
                    <PlanButton numberOfPlanUpdates={this.props.numberOfPlanUpdates}
                                onClick={this.planAndSetBudgets}
                                label={'Optimize'}
                                style={{width: '138px'}}
                                planNeedsUpdate={this.props.planNeedsUpdate}
                                showIcons={true}
                    />
                  </div>
                </FeatureToggle>
                :
                <PlanButton numberOfPlanUpdates={this.props.numberOfPlanUpdates}
                            onClick={() => this.setState({showOptimizationPopup: true})}
                            style={{marginLeft: "15px", width: '140px'}}
                            label={'Get Suggestions'}
                            showIcons={false}/>
              : null}
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
                              this.setState({primaryPlanForecastedIndicators: this.props.forecastedIndicators});
                            }}>
                      Cancel
                    </Button>
                    <Button type="primary"
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
                                      onClose={() => {
                                        this.setState({showNewScenarioPopup: false});
                                      }}
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
        <PlanOptimizationPopup hidden={!this.state.showOptimizationPopup}
                               planDate={this.props.planDate}
                               onClose={() => {
                                 this.setState({showOptimizationPopup: false});
                               }}
                               planWithConstraints={this.planWithConstraints}
        />
        <div className={this.classes.wrap}>
          <div className={this.classes.serverDown}>
            <label hidden={!this.props.serverDown}>Something is wrong... Let us check what is it and fix it for you
              :)</label>
          </div>
          {childrenWithProps}
        </div>
      </Page>
    </div>;
  }
}