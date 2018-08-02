import React from 'react';

import Component from 'components/Component';
import Page from 'components/Page';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Label from 'components/ControlsLabel';
import Notice from 'components/Notice';
import MultiRow from 'components/MultiRow';

import Title from 'components/onboarding/Title';
import ProfileProgress from 'components/pages/profile/Progress';
import ProfileInsights from 'components/pages/profile/Insights';
import BackButton from 'components/pages/profile/BackButton';
import SaveButton from 'components/pages/profile/SaveButton';
import NotSure from 'components/onboarding/NotSure';
import MultiSelect from 'components/controls/MultiSelect';
import PlanButton from 'components/pages/indicators/PlanButton';

import style from 'styles/onboarding/onboarding.css';
import preferencesStyle from 'styles/preferences/preferences.css';

import { isPopupMode } from 'modules/popup-mode';
import history from 'history';
import PlanFromExcel from 'components/PlanFromExcel';
import { formatChannels } from 'components/utils/channels';
import ObjectiveView from 'components/pages/preferences/ObjectiveView';
import AddObjectivePopup from 'components/pages/preferences/AddObjectivePopup';
import { getNickname } from 'components/utils/indicators';
import { FeatureToggle } from 'react-feature-toggles';
import Range from 'components/controls/Range';

export default class Preferences extends Component {
  style = style;
  styles = [preferencesStyle];

  budgetWeights = [0.05, 0.1, 0.19, 0.09, 0.09, 0.09, 0.04, 0.08, 0.1, 0.06, 0.07, 0.04];

  static defaultProps = {
    objectives: [],
    isCheckAnnual: true,
    maxChannels: -1,
    blockedChannels: [],
    inHouseChannels: [],
    planDate: null,
    annualBudgetArray: [],
    userAccount: {},
    actualIndicators: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      isCheckAnnual: props.annualBudget !== null,
      isDivideEqually: props.annualBudget !== null && props.annualBudgetArray.length > 0 && props.annualBudgetArray.every((budget)=> {return budget === props.annualBudgetArray[0]}),
      showAdvancedFields: false
    };
    this.blockedChannelRemove = this.blockedChannelRemove.bind(this);
    this.inHouseChannelRemove = this.inHouseChannelRemove.bind(this);
    this.budgetConstraintRemove = this.budgetConstraintRemove.bind(this);
    this.objectiveRemove = this.objectiveRemove.bind(this);
    this.toggleBudgetsCheck = this.toggleBudgetsCheck.bind(this);
    this.calculateBudgets = this.calculateBudgets.bind(this);
  }

  componentDidMount() {
    // Advanced toggle open?
    if (this.props.maxChannels !== -1 ||
      Object.keys(this.props.budgetConstraints).length > 0 ||
      this.props.inHouseChannels.length > 0 ||
      this.props.blockedChannels.length > 0) {
      this.setState({showAdvancedFields: true});
    }
  }

  validate() {
    let filterNanArray = this.props.annualBudgetArray.filter((value)=>{return !!value});
    return filterNanArray.length == 12;
  }

  handleChangeBudget(parameter, event) {
    let update = {};
    update[parameter] = parseInt(event.target.value.replace(/[-$,]/g, ''));
    this.props.updateState(update, this.calculateBudgets);
  }

  handleChangeBudgetArray(index, event) {
    let update = this.props.annualBudgetArray || [];
    update.splice(index, 1, parseInt(event.target.value.replace(/[-$,]/g, '')));
    this.props.updateState({annualBudgetArray: update}, this.calculateBudgets);
  }

  handleChangeBlockedChannels(event) {
    let update = event.map((obj) => {
      return obj.value;
    });
    this.props.updateState({blockedChannels: update});
  }

  handleChangeInHouseChannels(event) {
    let update = event.map((obj) => {
      return obj.value;
    });
    this.props.updateState({inHouseChannels: update});
  }

  handleChangeMax(parameter, event) {
    const number = parseInt(event.target.value);
    if (number && number > 0) {
      this.props.updateState({maxChannels: number});
    }
    else {
      this.props.updateState({maxChannels: -1});
    }
  }

  inHouseChannelRemove(index) {
    let update = this.props.inHouseChannels || [];
    update.splice(index, 1);
    this.props.updateState({inHouseChannels: update});
  }

  blockedChannelRemove(index) {
    let update = this.props.blockedChannels || [];
    update.splice(index, 1);
    this.props.updateState({blockedChannels: update});
  }

  budgetConstraintRemove(index) {
    const budgetConstraints = {...this.props.budgetConstraints};
    const channel = Object.keys(budgetConstraints)[index];
    delete budgetConstraints[channel];
    this.props.updateState({budgetConstraints: budgetConstraints});
  }

  addBudgetConstraintChannel(index, event) {
    const budgetConstraints = {...this.props.budgetConstraints};
    const channel = event.value;
    const existingChannels = Object.keys(budgetConstraints);
    const numOfConstrains = existingChannels.length;
    // New line
    if (index === numOfConstrains) {
      if (!budgetConstraints[channel]) {
        budgetConstraints[channel] = {
          range: {
            min: 0,
            max: -1
          }
        };
      }
    }
    else {
      // Existing line
      const oldChannel = existingChannels[index];
      budgetConstraints[channel] = budgetConstraints[oldChannel];
      delete budgetConstraints[oldChannel];
    }
    this.props.updateState({budgetConstraints: budgetConstraints});
  }

  handleRangeChange(index, event) {
    const budgetConstraints = {...this.props.budgetConstraints};
    const channel = Object.keys(budgetConstraints)[index];
    budgetConstraints[channel].range = event;
    this.props.updateState({budgetConstraints: budgetConstraints});
  }

  objectiveRemove(index) {
    let update = this.props.objectives || [];
    update.splice(index,1);
    this.props.updateState({objectives: update});
  }

  createOrUpdateObjective(objective, index) {
    const delta = objective.isPercentage ? objective.amount * (objective.currentValue || 0) / 100 : objective.amount;
    objective.target = Math.round(objective.direction === "equals" ? objective.amount : (objective.direction === "increase" ? delta + (objective.currentValue || 0) : (objective.currentValue || 0) - delta));
    objective.nickname = getNickname(objective.indicator);
    objective.alreadyNotified = false;
    if (objective.isRecurrent) {
      const now = new Date();
      let endDate;
      if (objective.isMonthly) {
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }
      else {
        const quarter = Math.floor((now.getMonth() / 3));
        const firstDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0);
      }
      objective.timeFrame = (endDate.getMonth()+1) + "-" + endDate.getDate() + "-" + endDate.getFullYear();

    }
    let objectives = this.props.objectives || [];
    if (index !== undefined) {
      if (index === objective.order) {
        objectives[index] = objective;
      }
      else {
        objectives.splice(objective.order, 0, objective);
      }
    }
    else {
      if (objective.order === objectives.length) {
        objectives.push(objective);
      }
      else {
        objectives.splice(objective.order, 0, objective);
      }
    }
    this.props.updateState({objectives: objectives});
    this.setState({showObjectivesPopup: false, objectiveIndex: undefined});
  }

  getDates = () => {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    var dates = [];
    for (var i = 0; i < 12; i++) {
      var planDate = this.props.planDate ? this.props.planDate.split("/") : null;
      if (planDate) {
        var date = new Date(planDate[1], planDate[0] - 1);
        date.setMonth(date.getMonth() + i);
        dates.push(monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2));
      }
    }
    return dates;
  }

  monthBudgets() {
    const datesArray = this.getDates();
    return datesArray.map((month, index) => {
      return <div className={ this.classes.cell } key={index}>
        <Label style={{width: '70px', marginTop: '12px'}}>{month}</Label>
        <Textfield
          value={"$" + (this.props.annualBudgetArray[index] ? this.props.annualBudgetArray[index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
          onChange={ this.handleChangeBudgetArray.bind(this, index)} style={{
          width: '166px'
        }}/>
      </div>
    });
  }

  toggleBudgetsCheck() {
    if (this.props.planDate) {
      this.setState({isCheckAnnual: !this.state.isCheckAnnual}, this.calculateBudgets);
    }
  }

  handleBudgetDivideChange(){
    this.setState({isDivideEqually: !this.state.isDivideEqually}, this.calculateBudgets);
  }

  calculateBudgets() {
    if (this.state.isCheckAnnual) {
      let prevBudget = this.props.annualBudget || this.props.annualBudgetArray.reduce((a, b) => a + b, 0);
      let planDate = this.props.planDate.split("/");
      let firstMonth = parseInt(planDate[0]) - 1;

      let budget = [];
      if (this.state.isDivideEqually) {
        let numOfMonth = 12;
        const value = Math.round(prevBudget / numOfMonth);
        while(numOfMonth--) {
          budget.push(value);
        }
      }
      else {
        this.budgetWeights.forEach((element, index) => {
          budget[(index + 12 - firstMonth) % 12] = Math.round(element * prevBudget);
        });
      }
      this.props.updateState({annualBudget: prevBudget, annualBudgetArray: budget});
    }
    else {
      this.props.updateState({annualBudget: null});
    }
  }

  render() {
    const { budgetConstraints, annualBudgetArray } = this.props;

    const selects = {
      /**     plan: {
        label: 'Plan Resolution',
        select: {
          name: 'plan',
          onChange: () => {},
          options: [
            { val: 'days', label: 'Days' },
            { val: 'months', label: 'Months' },
            { val: 'years', label: 'Years' }
          ]
        }
      }, **/
      months: {
        label: '',
        select: {
          name: 'months',
          onChange: () => {
          },
          placeholder: 'Choose specific months',
          options: [
            {label: 'Jan', value: 0},
            {label: 'Feb', value: 1},
            {label: 'Mar', value: 2},
            {label: 'Apr', value: 3},
            {label: 'May', value: 4},
            {label: 'Jun', value: 5},
            {label: 'Jul', value: 6},
            {label: 'Aug', value: 7},
            {label: 'Sep', value: 8},
            {label: 'Oct', value: 9},
            {label: 'Nov', value: 10},
            {label: 'Dec', value: 11},
          ]
        }
      }
    };

    const channels = {
      select: {
        name: "channels",
        options: formatChannels()
      }
    };

    let preventDuplicates = (value) => {
      if (value.options) {
        value.options.map(preventDuplicates);
      }
      value.disabled = this.props.blockedChannels.includes(value.value) || this.props.inHouseChannels.includes(value.value) || Object.keys(budgetConstraints).includes(value.value);
      return value;
    };

    let maxChannels = (value) => {
      if (value.options) {
        value.options.map(maxChannels);
      }
      else {
        value.disabled = true;
        return value;
      }
    };

    channels.select.options.map(preventDuplicates);
    // Deep copy
    const blockedChannels = JSON.parse(JSON.stringify(channels));
    // We allow only 3 blocked channels.
    if (this.props.blockedChannels.length >= 3) {
      // Disable all options
      blockedChannels.select.options.map(maxChannels);
    }

    const objectivesOrder = this.props.objectives.map((item, index) => {
      return {value: index, label: '#' + (index + 1)}
    });

    const objectives = this.props.objectives.map((objective, index) => {
      if (!objective.isArchived) {
        const delta = objective.isPercentage ? objective.amount * (objective.currentValue || 0) / 100 : objective.amount;
        const target = Math.round(objective.direction === "equals" ? objective.amount : (objective.direction === "increase" ? delta + (objective.currentValue || 0) : (objective.currentValue || 0) - delta));
        return <ObjectiveView
          value={this.props.actualIndicators[objective.indicator]}
          index={index}
          key={index}
          target={target}
          {...objective}
          editObjective={() => {
            this.setState({showObjectivesPopup: true, objectiveIndex: index})
          }}
          deleteObjective={() => {
            this.objectiveRemove(index)
          }}
        />
      }
    });

    const budgetConstraintsChannels = Object.keys(budgetConstraints);

    return <div>
      <Page popup={ isPopupMode() } className={!isPopupMode() ? this.classes.static : null}>
        {isPopupMode() ? <Title title="Preferences"
                                subTitle="What are your marketing goals and constrains? Different objectives dictate different strategies"/> : null}
        <div className={ this.classes.error }>
          <label hidden={ !this.props.serverDown }>Something is wrong... Let us check what is it and fix it for you :)</label>
        </div>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            {/**
             <div className={ this.classes.row } style={{
              width: '258px'
            }}>
             <Label question>Start Date</Label>
             <Calendar />
             </div> **/}
            <div className={ this.classes.row }>
              <Label checkbox={this.state.isCheckAnnual} onChange={ this.toggleBudgetsCheck.bind(this) } question={['']}
                     description={['What is your marketing budget for the next 12 months?']}>Plan Annual Budget
                ($)</Label>
              <div className={ this.classes.cell }>
                <Textfield disabled={!this.state.isCheckAnnual}
                           value={"$" + (this.props.annualBudget ? this.props.annualBudget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                           onChange={ this.handleChangeBudget.bind(this, 'annualBudget')} style={{
                  width: '166px'
                }}/>
                <Label className={ preferencesStyle.locals.divideEqually } checkbox={this.state.isDivideEqually} onChange={ this.handleBudgetDivideChange.bind(this) }>Divide Equally</Label>
                {/** <NotSure style={{
                  marginLeft: '10px'
                }} /> **/}
              </div>
            </div>
            <div className={ this.classes.row }>
              <Label checkbox={!this.state.isCheckAnnual} onChange={ this.toggleBudgetsCheck.bind(this) } question={['']}
                     description={['What is your marketing budget for the next 12 months?']}>Plan Monthly Budgets
                ($)</Label>
              { this.state.isCheckAnnual ? null : this.monthBudgets() }
            </div>
            {/**
             <div className={ this.classes.row } style={{
              // maxWidth: '440px',
              // minWidth: '200px',
              width: '258px'
            }}>
             <Select { ... selects.plan } />
             </div>
             **/}
            <div className={ this.classes.row } style={{}}>
              <Label style={{
                marginBottom: '12px',
                fontWeight: '600'
              }} question={['']}
                     description={['Define your objectives / targets for marketing. The objectives should be:\n- Specific\n- Measurable\n- Attainable\n- Realistic\n- Time-Bound']}>Objectives</Label>
              {objectives}
              <div className={ preferencesStyle.locals.addObjective } onClick={() => { this.setState({showObjectivesPopup: true, objectiveIndex: undefined}) }}/>
              <AddObjectivePopup
                hidden={ !this.state.showObjectivesPopup }
                index={ this.state.objectiveIndex }
                objectives={this.props.objectives}
                close={() => { this.setState({showObjectivesPopup: false}) } }
                createOrUpdateObjective={this.createOrUpdateObjective.bind(this)}
                actualIndicators={ this.props.actualIndicators }
                projectedPlan={ this.props.projectedPlan }
              />
            </div>
            <FeatureToggle featureName="plannerAI">
              <div>
                <div className={ preferencesStyle.locals.advancedButton } onClick={()=>{ this.setState({showAdvancedFields: !this.state.showAdvancedFields}) }}>
                  Advanced
                </div>
                <div hidden={!this.state.showAdvancedFields}>
                  <div className={this.classes.row}>
                    <Label style={{fontSize: '20px', fontWeight: 'bold'}}>Channel Constraints (Optional)</Label>
                    <Notice warning style={{
                      margin: '12px 0'
                    }}>
                      * Please notice that adding channel constrains is limiting the InfiniGrow’s ideal planning.
                    </Notice>
                  </div>
                  <div className={this.classes.row}>
                    <Label question={['']}
                           description={['Do you want to limit the number of channels in your plan (in parallel, for each month)? \nTo set the number to max available channels, please leave it blank.']}>max
                      number of Channels</Label>
                    <div className={this.classes.cell}>
                      <Textfield value={this.props.maxChannels != -1 ? this.props.maxChannels : ''}
                                 onChange={this.handleChangeMax.bind(this, '')} style={{
                        width: '83px'
                      }}/>
                      {/** <NotSure style={{
                  marginLeft: '10px'
                }} /> **/}
                    </div>
                  </div>
                  <div className={this.classes.row}>
                    <Label question={['']} description={['Are there any channels that you’re going to use in any case? Please provide their min/max budgets.']}>
                      Monthly Budget Constraints
                    </Label>
                    <MultiRow numOfRows={budgetConstraintsChannels.length} rowRemoved={this.budgetConstraintRemove}>
                      {({index, data, update, removeButton}) => {
                        return <div className={preferencesStyle.locals.channelsRow}>
                          <Select
                            style={{width: '230px'}}
                            selected={budgetConstraintsChannels[index]}
                            select={{
                              menuTop: true,
                              name: 'channels',
                              onChange: (selected) => {
                                update({
                                  selected: selected
                                });
                              },
                              options: channels.select.options
                            }}
                            onChange={this.addBudgetConstraintChannel.bind(this, index)}
                          />
                          <Range
                            disabled={!budgetConstraintsChannels[index]}
                            step={50}
                            allowSameValues={true}
                            minValue={0}
                            maxValue={Math.max(...annualBudgetArray)}
                            value={budgetConstraints[budgetConstraintsChannels[index]] ? budgetConstraints[budgetConstraintsChannels[index]].range : {min: 0, max: -1}}
                            onChange={this.handleRangeChange.bind(this, index)}
                          />
                          <div style={{marginLeft: '25px', alignSelf: 'center'}}>
                            {removeButton}
                          </div>
                        </div>
                      }}
                    </MultiRow>
                  </div>
                  <div className={this.classes.row}>
                    <MultiSelect {...channels} selected={this.props.inHouseChannels}
                                 onChange={this.handleChangeInHouseChannels.bind(this)} label='In-house Channels'
                                 labelQuestion={['']}
                                 description={['Are there any channels that you don’t want InfiniGrow to allocate budgets to because you’re doing them in-house?']}/>
                  </div>
                  <div className={this.classes.row}>
                    <MultiSelect {...blockedChannels} selected={this.props.blockedChannels}
                                 onChange={this.handleChangeBlockedChannels.bind(this)} label='Blocked Channels'
                                 labelQuestion={['']}
                                 description={['From your experience at the company, are there any channels that you want to block InfiniGrow from using in your marketing planning? \n * Maximum allowed # of blocked channels: 3']}/>
                  </div>
                </div>
              </div>
            </FeatureToggle>
            <div className={ this.classes.row } style={{ marginTop: '55px' }}>
              <PlanFromExcel {... this.props}/>
            </div>
          </div>

          { isPopupMode() ?

            <div className={ this.classes.colRight }>
              <div className={ this.classes.row }>
                <ProfileProgress progress={ 101 } image={
                  require('assets/flower/5.png')
                }
                                 text="Seems you got some new super powers. Now the journey for GROWTH really begins!"/>
              </div>
              {/**
               <div className={ this.classes.row }>
               <ProfileInsights />
               </div>
               **/}
            </div>

            : null }
        </div>

        { isPopupMode() ?

          <div className={ this.classes.footer }>
            <div className={ this.classes.almostFooter }>
              <label hidden={ !this.state.validationError} style={{color: 'red'}}>
                Please fill all the required fields
              </label>
            </div>
            <BackButton onClick={() => {
              this.props.updateUserMonthPlan({
                annualBudget: this.props.annualBudget,
                annualBudgetArray: this.props.annualBudgetArray,
                objectives: this.props.objectives,
                blockedChannels: this.props.blockedChannels,
                inHouseChannels: this.props.inHouseChannels,
                maxChannels: this.props.maxChannels,
                approvedBudgets: this.props.approvedBudgets,
                budgetConstraints: budgetConstraints,
                planNeedsUpdate: true
              }, this.props.region, this.props.planDate)
                .then(() => {
                  history.push('/profile/integrations');
                });
            }}/>
            <div style={{width: '30px'}}/>
            <PlanButton onClick={() => {
              if (this.validate()) {
                this.props.updateUserMonthPlan({
                  annualBudget: this.props.annualBudget,
                  annualBudgetArray: this.props.annualBudgetArray,
                  objectives: this.props.objectives,
                  blockedChannels: this.props.blockedChannels,
                  inHouseChannels: this.props.inHouseChannels,
                  maxChannels: this.props.maxChannels,
                  approvedBudgets: this.props.approvedBudgets,
                  budgetConstraints: budgetConstraints,
                  planNeedsUpdate: true
                }, this.props.region, this.props.planDate)
                  .then(() => {
                    history.push('/plan/plan/annual');
                  });
              }
              else {
                this.setState({validationError: true});
              }
            }
            }/>
          </div>

          :
          <div className={ this.classes.footer }>
            <SaveButton onClick={() => {
              if (this.validate()) {
                this.setState({saveFail: false, saveSuccess: false});
                this.props.updateUserMonthPlan({
                  annualBudget: this.props.annualBudget,
                  annualBudgetArray: this.props.annualBudgetArray,
                  objectives: this.props.objectives,
                  blockedChannels: this.props.blockedChannels,
                  inHouseChannels: this.props.inHouseChannels,
                  maxChannels: this.props.maxChannels,
                  approvedBudgets: this.props.approvedBudgets,
                  budgetConstraints: budgetConstraints,
                  planNeedsUpdate: true
                }, this.props.region, this.props.planDate);
                this.setState({saveSuccess: true});
              }
              else {
                this.setState({saveFail: true});
              }
            }} success={ this.state.saveSuccess } fail={ this.state.saveFail }/>
          </div>
        }
      </Page>
    </div>
  }
}
