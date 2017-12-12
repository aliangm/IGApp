import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Component from 'components/Component';
import Page from 'components/Page';
import Popup from 'components/Popup';
import style from 'styles/plan/plan.css';
import Button from 'components/controls/Button';
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
import PlanPopup from 'components/pages/plan/Popup';
import Label from 'components/ControlsLabel';
import Textfield from 'components/controls/Textfield';
import AddChannelPopup from 'components/pages/plan/AddChannelPopup';
import { output } from 'components/utils/channels';

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

  budgetWeights = [0.05, 0.1, 0.19, 0.09, 0.09, 0.09, 0.04, 0.08, 0.1, 0.06, 0.07, 0.04];
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

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
      editMode: false,
      approveChannel: this.approveChannel.bind(this),
      declineChannel: this.declineChannel.bind(this),
      dropmenuVisible: false,
      budgetField: props.budget || '',
      budgetArrayField: props.budgetArray || [],
      maxChannelsField: props.maxChannels || '',
      isCheckAnnual: !!props.budget,
      setRef: this.setRef.bind(this),
      whatIfSelected: false,
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
        this.plan(true, null, callback, this.props.region, false);
      }
      else {
        this.setState({editMode: true});
      }
      disablePopupMode();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getRelevantEvents(nextProps);
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

  approveChannel(month, channel, budget){
    let approvedBudgets = this.props.approvedBudgets;
    let approvedMonth = this.props.approvedBudgets[month] || {};
    approvedMonth[channel] = parseInt(budget.toString().replace(/[-$,]/g, ''));
    approvedBudgets[month] = approvedMonth;
    return this.props.updateUserMonthPlan({approvedBudgets: approvedBudgets}, this.props.region, this.props.planDate)
      .then(() => {
        this.forecast();
      })
  }

  declineChannel(month, channel, budget){
    let projectedPlan = this.props.projectedPlan;
    let projectedMonth = this.props.projectedPlan[month];
    projectedMonth.plannedChannelBudgets[channel] = parseInt(budget.toString().replace(/[-$,]/g, ''));
    projectedPlan[month] = projectedMonth;
    return this.props.updateUserMonthPlan({projectedPlan: projectedPlan}, this.props.region, this.props.planDate);
  }

  popup() {
    this.setState({popup: true});
  }

  plan(isCommitted, preferences, callback, region, silent){
    let body = preferences ? JSON.stringify(preferences) : null;
    let func = isCommitted ? (body ? 'PUT' : 'GET') : 'POST';
    if (!silent) {
      this.setState({
        isPlannerLoading: true,
        popup: false,
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
                    this.setState({isPlannerLoading: false, isError: true});
                  }
                }
                else {
                  if (!silent) {
                    this.setState({
                      isPlannerLoading: false,
                      isError: false
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
              this.setState({isError: true, isPlannerLoading: false});
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
            isPlannerLoading: false,
            serverDown: true
          });
        }
      });
  }

  toggleCheck() {
    if (this.state.isCheckAnnual) {
      let prevBudget = this.state.budgetField;
      let planDate = this.props.planDate.split("/");
      let firstMonth = parseInt(planDate[0]) - 1;

      let budget = [];
      this.budgetWeights.forEach((element, index) => {
        budget[(index + 12 - firstMonth) % 12] = Math.round(element * prevBudget);
      });

      this.setState({budgetField: null, budgetArrayField: budget});
    }
    else {
      let sum = this.state.budgetArrayField.reduce((a, b) => a + b, 0);
      this.setState({budgetField: sum});
    }
    this.setState({isCheckAnnual: !this.state.isCheckAnnual});
  }

  handleChangeBudget(event) {
    let update = {};
    update.budgetField = parseInt(event.target.value.replace(/[-$,]/g, ''));

    let planDate = this.props.planDate.split("/");
    let firstMonth = parseInt(planDate[0]) - 1;

    let budget = [];
    this.budgetWeights.forEach((element, index) => {
      budget[(index + 12 - firstMonth) % 12] = Math.round(element * update.budgetField);
    });
    update.budgetArrayField = budget;

    this.setState(update);
  }

  getDates = () => {
    var dates = [];
    for (var i = 0; i < 12; i++) {
      var planDate = this.props.planDate.split("/");
      var date = new Date(planDate[1], planDate[0]-1);
      date.setMonth(date.getMonth() + i);
      dates.push(this.monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2,2));
    }
    return dates;
  }

  monthBudgets() {
    const datesArray = this.getDates();
    return datesArray.map((month, index) => {
      return <div className={ this.classes.budgetChangeBox } key={index} style={{ marginLeft: '8px', paddingBottom: '0px', paddingTop: '0px' }}>
        <div className={ this.classes.left }>
          <Label style={{width: '70px', marginTop: '8px'}}>{month}</Label>
        </div>
        <div className={ this.classes.right }>
          <Textfield
            value={"$" + (this.state.budgetArrayField && this.state.budgetArrayField[index] ? this.state.budgetArrayField[index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
            onChange={ this.handleChangeBudgetArray.bind(this, index) } style={{
            width: '110px'
          }}/>
        </div>
      </div>
    });
  }

  whatIf = (isCommitted, callback) => {
    this.setState({whatIfSelected: false});
    let preferences = {};

    preferences.annualBudgetArray = this.state.budgetArrayField;
    preferences.annualBudget = this.state.budgetField;
    const maxChannels = parseInt(this.state.maxChannelsField);
    if (isNaN(maxChannels)) {
      preferences.maxChannels = -1;
    }
    else {
      preferences.maxChannels = maxChannels;
    }
    let filterNanArray = preferences.annualBudgetArray.filter((value)=>{return !!value});
    if (filterNanArray.length == 12 && preferences.maxChannels) {
      this.plan(isCommitted, preferences, callback, this.props.region, false);
    }
    /**
     this.setState({
      budget: budget,
      budgetField: '$'
    });**/
  };

  whatIfCommit = () => {
    let callback = (data) => {
      this.props.setDataAsState(data);
      this.refs.whatIfPopup.close();
      this.setState({whatIfSelected: false, isTemp: false});
    };
    this.whatIf(true, callback);
  };

  whatIfTry = () => {
    let callback = (data) => {
      this.props.setDataAsState(data);
      this.refs.whatIfPopup.open();
      this.setState({whatIfSelected: true, isTemp: true});
    };
    this.whatIf(false, callback);
  };

  whatIfCancel = () => {
    this.refs.whatIfPopup.close();
    this.setState({whatIfSelected: false, isTemp: false, budgetField: '', maxChannelsField: ''});
    this.props.getUserMonthPlan(this.props.region);
  };

  handleChangeBudgetArray(index, event) {
    let update = this.state.budgetArrayField || [];
    update.splice(index, 1, parseInt(event.target.value.replace(/[-$,]/g, '')));
    this.setState({budgetArrayField: update});
  }

  editUpdate() {
    return this.props.updateUserMonthPlan({projectedPlan: this.props.projectedPlan, approvedBudgets: this.props.approvedBudgets, unknownChannels: this.props.planUnknownChannels}, this.props.region, this.props.planDate);
  }

  addChannel(newChannel) {
    let projectedPlan = this.props.projectedPlan;
    let approvedBudgets = this.props.approvedBudgets;
    for (let i = 0; i < 12; i++) {
      if (!approvedBudgets[i]) {
        approvedBudgets[i] = {};
      }
      if (!projectedPlan[i] || Object.keys(projectedPlan[i]).length === 0) {
        projectedPlan[i] = { plannedChannelBudgets: {}, projectedIndicatorValues: {} };
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
        const domElement = ReactDOM.findDOMNode(this.refs[newChannel]);
        if (domElement) {
          domElement.scrollIntoView({});
        }
      });
  }

  addUnknownChannel(otherChannel, otherChannelHierarchy) {
    const channel = otherChannelHierarchy ? otherChannelHierarchy + ' / ' + otherChannel : otherChannel
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
        const domElement = ReactDOM.findDOMNode(this.refs[channel]);
        if (domElement) {
          domElement.scrollIntoView({});
        }
      });
  }

  setRef = (channel, ref) => {
    this.refs[channel] = ref;
  };

  selectTab(index) {
    this.setState({
      selectedTab: index
    });
  }

  render() {
    const planChannels = _.merge([],
      Object.keys(this.props.approvedBudgets.reduce((object, item) => {
          return _.merge(object, item);
        }
        , {})),
      Object.keys(this.props.projectedPlan.reduce((object, item) => {
          return _.merge(object, item.plannedChannelBudgets)
        }
        , {}))
    );
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
          { this.props.userAccount.freePlan || this.state.selectedTab !== 1 ? null :
            <div className={this.classes.headPlan}>
              <div className={this.classes.error}>
                <label hidden={!this.state.isError}>You've reached the plan updates limit.<br/> To upgrade, click <a
                  href="mailto:support@infinigrow.com?&subject=I need replan upgrade" target='_blank'>here</a></label>
              </div>
              <ReplanButton numberOfPlanUpdates={this.props.numberOfPlanUpdates} onClick={this.popup} planNeedsUpdate={this.props.planNeedsUpdate}/>
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
                }, this.props.region, false)} onBack={() => {
                  this.setState({
                    popup: false
                  })
                }}/>
              </Popup>
              <div>
                <Button type="reverse" contClassName={ this.classes.dropButton } style={{
                  width: '102px'
                }} onClick={() => {
                  this.setState({dropmenuVisible: !this.state.dropmenuVisible})
                }}>
                  Apply All
                  <div className={this.classes.buttonTriangle}/>
                </Button>
                <Popup
                  className={ this.classes.dropmenu }
                  hidden={ !this.state.dropmenuVisible } onClose={() => {
                  this.setState({
                    dropmenuVisible: false
                  });
                }}
                >
                  <div>
                    <div className={ this.classes.dropmenuItem } onClick={ () => {
                      this.approveAllBudgets()
                        .then( () => {
                          this.forecast();
                        });
                    }}>
                      Approve all
                    </div>
                    <div className={ this.classes.dropmenuItem } onClick={ this.declineAllBudgets.bind(this) }>
                      Decline all
                    </div>
                  </div>
                </Popup>
              </div>
              <div>
                <Button type="reverse" style={{
                  marginLeft: '15px',
                  width: '102px'
                }} selected={ this.state.whatIfSelected ? true : null } onClick={() => {
                  this.setState({
                    whatIfSelected: true
                  });

                  this.refs.whatIfPopup.open();
                }}>What if</Button>
                <div style={{ position: 'relative' }}>
                  <PlanPopup ref="whatIfPopup" style={{
                    width: '367px',
                    right: '110px',
                    left: 'auto',
                    top: '-37px',
                    textAlign: 'initial',
                    cursor: 'initial'
                  }} hideClose={ true } title="What If - Scenarios Management">
                    <div className={ this.classes.budgetChangeBox } style={{ paddingTop: '12px' }}>
                      <div className={ this.classes.left }>
                        <Label checkbox={this.state.isCheckAnnual} toggleCheck={ this.toggleCheck.bind(this) } style={{ paddingTop: '7px' }}>Plan Annual Budget ($)</Label>
                      </div>
                      <div className={ this.classes.right }>
                        <Textfield style={{ maxWidth: '110px' }}
                                   value={ '$' + (this.state.budgetField ? this.state.budgetField.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '') }
                                   className={ this.classes.budgetChangeField }
                                   onChange={ this.handleChangeBudget.bind(this) }
                                   onKeyDown={(e) => {
                                     if (e.keyCode === 13) {
                                       this.whatIf();
                                     }
                                   }}
                                   disabled={ !this.state.isCheckAnnual }
                        />
                      </div>
                    </div>
                    <div className={ this.classes.budgetChangeBox } style={{ display: 'inline-block' }}>
                      <div className={ this.classes.left }>
                        <div className={ this.classes.left }>
                          <Label checkbox={!this.state.isCheckAnnual} toggleCheck={ this.toggleCheck.bind(this) } style={{ paddingTop: '7px' }}>Plan Monthly Budget ($)</Label>
                        </div>
                      </div>
                      { this.state.isCheckAnnual ? null : this.monthBudgets() }
                    </div>
                    <div className={ this.classes.budgetChangeBox }>
                      <div className={ this.classes.left }>
                        <Label style={{ paddingTop: '7px' }}>max number of Channels</Label>
                      </div>
                      <div className={ this.classes.right }>
                        <Textfield style={{
                          maxWidth: '110px' }}
                                   value={ this.state.maxChannelsField != -1 ? this.state.maxChannelsField : '' }
                                   className={ this.classes.budgetChangeField }
                                   onChange={(e) => {
                                     this.setState({
                                       maxChannelsField: e.target.value
                                     });
                                   }}
                                   onKeyDown={(e) => {
                                     if (e.keyCode === 13) {
                                       this.whatIf();
                                     }
                                   }}
                        />
                      </div>
                    </div>
                    <div className={ this.classes.budgetChangeBox }>
                      <Button type="primary2" style={{
                        width: '110px'
                      }} onClick={ this.whatIfTry }>Try</Button>
                    </div>
                    <div className={ this.classes.budgetChangeBox } style={{ paddingBottom: '12px' }}>
                      <div className={ this.classes.left }>
                        <Button type="normal" style={{
                          width: '110px'
                        }} onClick={ this.whatIfCancel }>Cancel</Button>
                      </div>
                      <div className={ this.classes.right }>
                        <Button type="accent2" style={{
                          width: '110px'
                        }} onClick={ this.whatIfCommit }>Commit</Button>
                      </div>
                    </div>
                  </PlanPopup>
                </div>
              </div>
              <Button type="primary2" style={{
                marginLeft: '15px',
                width: '102px'
              }} selected={ this.state.editMode ? true : null } onClick={() => {
                if (this.state.editMode) {
                  this.editUpdate()
                    .then( () => {
                      this.forecast();
                    });
                }
                this.setState({
                  editMode: !this.state.editMode
                });
              }} icon={this.state.editMode ? "buttons:plan" : "buttons:edit"}>
                { this.state.editMode ? "Done" : "Edit" }
              </Button>
              <Popup
                className={ this.classes.dropmenuEdit }
                hidden={ !this.state.editMode }
              >
                <div>
                  <div className={ this.classes.dropmenuItemAdd } onClick={ () => {
                    this.setState({addChannelPopup: true});
                  }}>
                    Add Channel
                  </div>
                  <div className={ this.classes.dropmenuItemCancel } onClick={ () => {
                    this.setState({editMode: false});
                    this.props.getUserMonthPlan(this.props.region);
                  } }>
                    Cancel
                  </div>
                </div>
              </Popup>
              <AddChannelPopup
                hidden={ !this.state.addChannelPopup }
                onChannelChoose={ this.addChannel.bind(this) }
                channels={ output() }
                planChannels={ planChannels.map(item => { return { id: item } }) }
                close={ () => { this.setState({addChannelPopup: false}) } }
                addUnknownChannel={ this.addUnknownChannel.bind(this) }
              />
            </div>
          }
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