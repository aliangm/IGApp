import React from 'react';

import Component from 'components/Component';
import Page from 'components/Page';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Calendar from 'components/controls/Calendar';
import Label from 'components/ControlsLabel';
import Notice from 'components/Notice';
import MultiRow from 'components/MultiRow';

import Title from 'components/onboarding/Title';
import ProfileProgress from 'components/pages/profile/Progress';
import ProfileInsights from 'components/pages/profile/Insights';
import BackButton from 'components/pages/profile/BackButton';
import NextButton from 'components/pages/profile/NextButton';
import SaveButton from 'components/pages/profile/SaveButton';
import NotSure from 'components/onboarding/NotSure';
import MultiSelect from 'components/controls/MultiSelect';

import style from 'styles/onboarding/onboarding.css';
import preferencesStyle from 'styles/preferences/preferences.css';

import { isPopupMode } from 'modules/popup-mode';
import history from 'history';
import PlanFromExcel from 'components/PlanFromExcel';
import { formatChannels } from 'components/utils/channels';
import { getIndicatorsWithNicknames } from 'components/utils/indicators';

export default class Preferences extends Component {
  style = style;
  styles = [preferencesStyle];

  budgetWeights = [0.05, 0.1, 0.19, 0.09, 0.09, 0.09, 0.04, 0.08, 0.1, 0.06, 0.07, 0.04];

  static defaultProps = {
    goals: {
      primary: 'InfiniGrow Recommended',
      secondary: 'InfiniGrow Recommended'
    },
    objectives: [],
    isCheckAnnual: true,
    maxChannels: -1,
    userMinMonthBudgets: [],
    blockedChannels: [],
    inHouseChannels: [],
    planDay: 28,
    planDate: null,
    annualBudgetArray: [],
    userAccount: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      userMinMonthBudgetsLines: [],
      isCheckAnnual: props.annualBudget !== null,
      isDivideEqually: props.annualBudget !== null && props.annualBudgetArray.length > 0 && props.annualBudgetArray.every((budget)=> {return budget === props.annualBudgetArray[0]})
    };
    this.handleChangeGoals = this.handleChangeGoals.bind(this);
    this.blockedChannelRemove = this.blockedChannelRemove.bind(this);
    this.inHouseChannelRemove = this.inHouseChannelRemove.bind(this);
    this.minimumBudgetRemove = this.minimumBudgetRemove.bind(this);
    this.toggleBudgetsCheck = this.toggleBudgetsCheck.bind(this);
    this.calculateBudgets = this.calculateBudgets.bind(this);
  }

  componentDidMount() {
    this.getUserMinMonthBudgetsLines(this.props.userMinMonthBudgets, this.props.planDate);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userMinMonthBudgets.length == 0 && nextProps.userMinMonthBudgets.length > 0) {
      this.getUserMinMonthBudgetsLines(nextProps.userMinMonthBudgets, nextProps.planDate);
    }
    /**
    if (nextProps.annualBudget != this.props.annualBudget) {
      this.setState({isCheckAnnual: nextProps.annualBudget !== null,
        isDivideEqually: nextProps.annualBudget !== null && nextProps.annualBudgetArray.every((budget)=> {return budget === nextProps.annualBudgetArray[0]})});
    }
     **/
  }

  getUserMinMonthBudgetsLines(userMinMonthBudgets, planDate) {
    if (planDate) {
      let planDateArray = planDate.split("/");
      let firstMonth = parseInt(planDateArray[0]) - 1;
      let userMinMonthBudgetsLines = [];
      userMinMonthBudgets.forEach((month, index) => {
        if (month) {
          const normalizedMonth = (index + firstMonth) % 12;
          Object.keys(month).forEach((channel) => {
            let isExist = false;
            userMinMonthBudgetsLines.forEach((line) => {
              if (line.channel == channel) {
                line.months.push(normalizedMonth);
                isExist = true;
              }
            });
            if (!isExist) {
              userMinMonthBudgetsLines.push({channel: channel, budget: month[channel], months: [normalizedMonth]})
            }
          });
        }
      });
      this.setState({userMinMonthBudgetsLines: userMinMonthBudgetsLines});
    }
  }

  validate() {
    let filterNanArray = this.props.annualBudgetArray.filter((value)=>{return !!value});
    return filterNanArray.length == 12;
  }

  handleChangeGoals(parameter, event) {
    let update = this.props.goals || {};
    update[parameter] = event.value;
    this.props.updateState({goals: update});
    if (this.props.goals.primary == 'InfiniGrow Recommended' && this.props.goals.secondary != 'InfiniGrow Recommended') {
      this.props.updateState({
        goals: {
          primary: this.props.goals.secondary,
          secondary: 'InfiniGrow Recommended'
        }
      })
    }
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

  handleChangePlanDay(event) {
    this.props.updateState({planDay: event.value});
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

  minimumBudgetRemove(index) {
    const userMinMonthBudgetsLines = this.state.userMinMonthBudgetsLines;
    userMinMonthBudgetsLines.splice(index, 1);
    this.setState({userMinMonthBudgetsLines: userMinMonthBudgetsLines});
  }

  handleChangeMinChannel(index, event) {
    const userMinMonthBudgetsLines = this.state.userMinMonthBudgetsLines;
    if (!userMinMonthBudgetsLines[index]) {
      userMinMonthBudgetsLines[index] = {
        budget: 0
      };
    }
    userMinMonthBudgetsLines[index].channel = event.value;
    this.setState({userMinMonthBudgetsLines: userMinMonthBudgetsLines});
  }

  handleChangeMinBudget(index, event) {
    const userMinMonthBudgetsLines = this.state.userMinMonthBudgetsLines;
    if (!userMinMonthBudgetsLines[index]) {
      userMinMonthBudgetsLines[index] = {};
    }
    userMinMonthBudgetsLines[index].budget = parseInt(event.target.value.replace(/[-$,]/g, ''));
    this.setState({userMinMonthBudgetsLines: userMinMonthBudgetsLines});
  }

  handleChangeMinMonths(index, event) {
    const userMinMonthBudgetsLines = this.state.userMinMonthBudgetsLines;
    userMinMonthBudgetsLines[index].months = event.map((month) => { return month.value });
    this.setState({userMinMonthBudgetsLines: userMinMonthBudgetsLines});
  }

  handleChangeObjectivesSelect(index, parameter, event) {
    let update = this.props.objectives || [];
    if (index === null) {
      update.push({[parameter]: event.value});
    }
    else {
      update[index][parameter] = event.value;
    }
    this.props.updateState({objectives: update});
  }

  handleChangeObjectivesNumber(index, parameter, event) {
    let update = this.props.objectives || [];
    if (index === null) {
      update.push({[parameter]: parseInt(event.target.value)});
    }
    else {
      update[index][parameter] = parseInt(event.target.value);
    }
    this.props.updateState({objectives: update});
  }

  handleChangeDate(index, value) {
    let update = this.props.objectives || [];
    if (index === null) {
      update.push({timeFrame: value})
    }
    else {
      update[index].timeFrame = value;
    }
    this.props.updateState({objectives: update});
  }

  handleChangeObjectiveOrder(index, event) {
    let update = this.props.objectives || [];
    if (index === null) {
      update.splice(event.value, 0, {});
    }
    else {
      update.splice(event.value, 0, update.splice(index, 1)[0]);
    }
    this.props.updateState({objectives: update});
  }

  objectiveRemove(objectives) {
    return (index => {
      if (objectives[index]) {
        let update = this.props.objectives || [];
        update.splice(objectives[index].index, 1);
        this.props.updateState({objectives: update});
      }
    })
  }

  createUserMinMonthBudgetJson(){
    let userMinMonthBudgets = new Array(12).fill(null);
    const planDate = this.props.planDate.split("/");
    const firstMonth = parseInt(planDate[0]) - 1;
    this.state.userMinMonthBudgetsLines.forEach((line) => {
      line.months.forEach((month) => {
        const index = (month + 12 - firstMonth) % 12;
        if (!userMinMonthBudgets[index]) {
          userMinMonthBudgets[index] = {};
        }
        userMinMonthBudgets[index][line.channel] = line.budget;
      });
    });
    return userMinMonthBudgets;
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
      },
      primary_goal: {
        label: 'Primary Focus',
        labelQuestion: [''],
        description: ['What is your company main focus for marketing? The focus should be aligned with and support your business goals. By default, InfiniGrow will choose the focus it thinks is the most relevant, based on your data.'],
        select: {
          name: 'primary_goal',
          onChange: () => {},
          options: [
            {value: 'InfiniGrow Recommended', label: 'InfiniGrow Recommended'},
            {value: 'Revenue - Long Term', label: 'Revenue - Long Term'},
            {value: 'Revenue - Short Term', label: 'Revenue - Short Term'},
            {value: 'Reputation', label: 'Reputation'},
            {value: 'Marketing ROI', label: 'Marketing ROI'},
            {value: 'Market Share', label: 'Market Share'},
            {value: 'Brand Awareness', label: 'Brand Awareness'},
            {value: 'Better Quality Customers', label: 'Better Quality Customers'},
            {value: 'Lead Generation', label: 'Lead Generation'},
            {value: 'Retention Rates', label: 'Retention Rates'},
            {value: 'Number Of Job Applicants', label: 'Number Of Job Applicants'},
            {value: 'Thought Leadership', label: 'Thought Leadership'}
          ]
        }
      },
      secondary_goal: {
        label: 'Secondary Focus',
        labelQuestion: [''],
        description: ['What is your company secondary focus for marketing? The focus should be aligned with and support your business goals. By default, InfiniGrow will choose the focus it thinks is the most relevant, based on your data.'],
        select: {
          name: 'secondary_goal',
          onChange: () => {},
          options: [
            {value: 'InfiniGrow Recommended', label: 'InfiniGrow Recommended'},
            {value: 'Revenue - Long Term', label: 'Revenue - Long Term'},
            {value: 'Revenue - Short Term', label: 'Revenue - Short Term'},
            {value: 'Reputation', label: 'Reputation'},
            {value: 'Marketing ROI', label: 'Marketing ROI'},
            {value: 'Market Share', label: 'Market Share'},
            {value: 'Brand Awareness', label: 'Brand Awareness'},
            {value: 'Better Quality Customers', label: 'Better Quality Customers'},
            {value: 'Lead Generation', label: 'Lead Generation'},
            {value: 'Retention Rates', label: 'Retention Rates'},
            {value: 'Number Of Job Applicants', label: 'Number Of Job Applicants'},
            {value: 'Thought Leadership', label: 'Thought Leadership'}
          ]
        }
      },
      planDay: {
        label: 'Plan-Next-Month Day',
        labelQuestion: [''],
        description: ['Choose the next-plan-month day. After this day in the month, re-planning will plan your next month (re-planning before this day will plan the current month).'],
        select: {
          name: 'planDay',
          onChange: () => {},
          options: [
            {value:1 , label: 1},
            {value:2 , label: 2},
            {value:3 , label: 3},
            {value:4 , label: 4},
            {value:5 , label: 5},
            {value:6 , label: 6},
            {value:7 , label: 7},
            {value:8 , label: 8},
            {value:9 , label: 9},
            {value:10 , label: 10},
            {value:11 , label: 11},
            {value:12 , label: 12},
            {value:13 , label: 13},
            {value:14 , label: 14},
            {value:15 , label: 15},
            {value:16 , label: 16},
            {value:17 , label: 17},
            {value:18 , label: 18},
            {value:19 , label: 19},
            {value:20 , label: 20},
            {value:21 , label: 21},
            {value:22 , label: 22},
            {value:23 , label: 23},
            {value:24 , label: 24},
            {value:25 , label: 25},
            {value:26 , label: 26},
            {value:27 , label: 27},
            {value:28 , label: 28},
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
      value.disabled = this.props.blockedChannels.includes(value.value) || this.props.inHouseChannels.includes(value.value) || this.state.userMinMonthBudgetsLines.map(line => line.channel).includes(value.value);
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

    const activeObjectives = this.props.objectives
      .map((objective, index) => {
        return {objective: objective, index: index};
      })
      .filter((item) => {
        const objective = item.objective;
        const today = new Date();
        const date = objective && objective.timeFrame ? new Date(objective.timeFrame) : today;
        return date >= today;
      });

    const objectivesOrder = activeObjectives.map((item, index) => {
      return {value: index, label: '#' + (index + 1)}
    });

    return <div>
      <Page popup={ isPopupMode() }>
        <Title title="Preferences"
               subTitle="What are your marketing goals and constrains? Different objectives dictate different strategies"/>
        <div className={ this.classes.error }>
          <label hidden={ !this.props.serverDown }> It look's like our server is down... :( <br/> Please contact our
            support. </label>
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
            <div className={ this.classes.row } style={{
              // maxWidth: '440px',
              // minWidth: '200px',
              width: '258px'
            }}>
              <Select { ... selects.primary_goal } selected={ this.props.goals.primary }
                      onChange={ this.handleChangeGoals.bind(this, 'primary') }/>
            </div>
            <div className={ this.classes.row } style={{
              // maxWidth: '440px',
              // minWidth: '200px',
              width: '258px'
            }}>
              <Select { ... selects.secondary_goal } selected={ this.props.goals.secondary }
                      onChange={ this.handleChangeGoals.bind(this, 'secondary') }/>
            </div>
            <div className={ this.classes.row } style={{}}>
              <Label style={{
                marginBottom: '12px',
                fontWeight: '600'
              }} question={['']}
                     description={['Define your objectives / targets for marketing. The objectives should be:\n- Specific\n- Measurable\n- Attainable\n- Realistic\n- Time-Bound']}>Objectives</Label>
              <MultiRow numOfRows={ activeObjectives.length } rowRemoved={this.objectiveRemove(activeObjectives)}>
                {({index, data, update, removeButton}) => {
                  return <div>
                    <div className={preferencesStyle.locals.channelsRow}>
                      <Label style={{
                        marginBottom: '0',
                        fontWeight: '600'
                      }}>{`#${ index + 1 }`} </Label>
                    </div>
                    <div style={{}} className={preferencesStyle.locals.channelsRow}>
                      <div className={preferencesStyle.locals.objectiveText}>I want</div>
                      <Textfield type="number"
                                 value={activeObjectives[index] && activeObjectives[index].objective && activeObjectives[index].objective.amount ? activeObjectives[index].objective.amount : ''}
                                 style={{width: '80px', marginLeft: '10px'}}
                                 onChange={this.handleChangeObjectivesNumber.bind(this, activeObjectives[index] ? activeObjectives[index].index : null, 'amount')}/>
                      <Select
                        className={preferencesStyle.locals.objectiveSelect}
                        selected={activeObjectives[index] ? activeObjectives[index].objective.isPercentage : -1}
                        select={{
                          menuTop: true,
                          name: 'type',
                          onChange: (selected) => {
                            update({
                              selected: selected
                            });
                          },
                          placeholder: '%/num',
                          options: [{label: '%', value: true}, {label: '(num)', value: false}]
                        }}
                        onChange={this.handleChangeObjectivesSelect.bind(this, activeObjectives[index] ? activeObjectives[index].index : null, 'isPercentage')}
                      />
                      <Select
                        className={preferencesStyle.locals.objectiveSelect}
                        selected={activeObjectives[index] ? activeObjectives[index].objective.direction : -1}
                        select={{
                          menuTop: true,
                          name: 'channels',
                          onChange: (selected) => {
                            update({
                              selected: selected
                            });
                          },
                          placeholder: 'Direction',
                          options: [{label: 'increase', value: 'increase'}, {
                            label: 'decrease',
                            value: 'decrease'
                          }, {label: '(target)', value: 'equals'}]
                        }}
                        onChange={this.handleChangeObjectivesSelect.bind(this, activeObjectives[index] ? activeObjectives[index].index : null, 'direction')}
                      />
                      <div className={preferencesStyle.locals.objectiveText} style={{marginLeft: '10px'}}>in</div>
                      <Select
                        className={preferencesStyle.locals.objectiveSelect}
                        selected={activeObjectives[index] ? activeObjectives[index].objective.indicator : -1}
                        select={{
                          menuTop: true,
                          name: 'channels',
                          onChange: (selected) => {
                            update({
                              selected: selected
                            });
                          },
                          placeholder: 'KPI',
                          options: getIndicatorsWithNicknames()
                        }}
                        onChange={this.handleChangeObjectivesSelect.bind(this, activeObjectives[index] ? activeObjectives[index].index : null, 'indicator')}
                        style={{width: '200px'}}
                      />
                      <div className={preferencesStyle.locals.objectiveText} style={{marginLeft: '10px'}}>until</div>
                      <div style={{marginLeft: '10px', width: '205px'}}>
                        <Calendar value={activeObjectives[index] && activeObjectives[index].objective && activeObjectives[index].objective.timeFrame ? activeObjectives[index].objective.timeFrame : ''}
                                  onChange={this.handleChangeDate.bind(this, activeObjectives[index] ? activeObjectives[index].index : null)}/>
                      </div>
                      <Select
                        className={preferencesStyle.locals.objectiveSelect}
                        selected={ index }
                        select={{
                          onChange: (selected) => {
                            update({
                              selected: selected
                            });
                          },
                          options: objectivesOrder
                        }}
                        onChange={ this.handleChangeObjectiveOrder.bind(this, activeObjectives[index] ? activeObjectives[index].index : null) }
                        style={{width: '50px'}}
                      />
                      <div className={preferencesStyle.locals.channelsRemove} style={{marginTop: '5px'}}>
                        {removeButton}
                      </div>
                    </div>
                  </div>
                }}
              </MultiRow>
            </div>
            { this.props.userAccount.freePlan ? null :
              <div>
                <div className={this.classes.row} style={{
                  // maxWidth: '440px',
                  // minWidth: '200px',
                  width: '70px'
                }}>
                  <Select {...selects.planDay} selected={this.props.planDay}
                          onChange={this.handleChangePlanDay.bind(this)}/>
                </div>
                <div className={this.classes.row} style={{marginTop: '96px'}}>
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
                <div className={this.classes.row} style={{}}>
                  <Label style={{
                    marginBottom: '12px',
                    fontWeight: '600'
                  }} question={['']}
                         description={['Are there any channels that you’re going to use in any case? Please provide their minimum budgets.']}>Minimum
                    Budgets</Label>
                  <MultiRow numOfRows={this.state.userMinMonthBudgetsLines.length}
                            rowRemoved={this.minimumBudgetRemove}>
                    {({index, data, update, removeButton}) => {
                      return <div style={{
                        width: '700px'
                      }} className={preferencesStyle.locals.channelsRow}>
                        <Select
                          className={preferencesStyle.locals.channelsSelect}
                          selected={this.state.userMinMonthBudgetsLines[index] != undefined && this.state.userMinMonthBudgetsLines[index].channel}
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
                          onChange={this.handleChangeMinChannel.bind(this, index)}
                          label={`#${ index + 1 } (optional)`}
                        />
                        <Textfield className={preferencesStyle.locals.channelsBudget}
                                   value={"$" + (this.state.userMinMonthBudgetsLines[index] && this.state.userMinMonthBudgetsLines[index].budget ? this.state.userMinMonthBudgetsLines[index].budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                                   onChange={this.handleChangeMinBudget.bind(this, index)} style={{
                          width: '82px'
                        }}
                                   disabled={!this.state.userMinMonthBudgetsLines[index] || this.state.userMinMonthBudgetsLines[index].budget == undefined}/>
                        <div style={{marginTop: '32px'}}>
                          <MultiSelect {...selects.months}
                                       selected={this.state.userMinMonthBudgetsLines[index] && this.state.userMinMonthBudgetsLines[index].months}
                                       onChange={this.handleChangeMinMonths.bind(this, index)}
                                       style={{width: '240px'}}/>
                        </div>
                        <div className={preferencesStyle.locals.channelsRemove}>
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
            }
            <div className={ this.classes.row } style={{ marginTop: '96px' }}>
              <PlanFromExcel {... this.props}/>
            </div>
          </div>

          { isPopupMode() ?

            <div className={ this.classes.colRight }>
              <div className={ this.classes.row }>
                <ProfileProgress progress={ 76 } image={
                  require('assets/flower/4.png')
                }
                                 text="You rock! Hope you’re starting to get excited about planning the right way"/>
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
              <label hidden={ !this.props.validationError} style={{color: 'red'}}>Please fill all the required
                fields</label>
            </div>
            <BackButton onClick={() => {
              this.props.updateUserMonthPlan({
                annualBudget: this.props.annualBudget,
                annualBudgetArray: this.props.annualBudgetArray,
                goals: {primary: this.props.goals.primary, secondary: this.props.goals.secondary},
                objectives: this.props.objectives,
                blockedChannels: this.props.blockedChannels,
                inHouseChannels: this.props.inHouseChannels,
                userMinMonthBudgets: this.createUserMinMonthBudgetJson(),
                maxChannels: this.props.maxChannels,
                planDay: this.props.planDay
              }, this.props.region, this.props.planDate)
                .then(() => {
                  history.push('/target-audience');
                });
            }}/>
            <div style={{width: '30px'}}/>
            <NextButton onClick={() => {
              if (this.validate()) {
                this.props.updateUserMonthPlan({
                  annualBudget: this.props.annualBudget,
                  annualBudgetArray: this.props.annualBudgetArray,
                  goals: {primary: this.props.goals.primary, secondary: this.props.goals.secondary},
                  objectives: this.props.objectives,
                  blockedChannels: this.props.blockedChannels,
                  inHouseChannels: this.props.inHouseChannels,
                  userMinMonthBudgets: this.createUserMinMonthBudgetJson(),
                  maxChannels: this.props.maxChannels,
                  planDay: this.props.planDay
                }, this.props.region, this.props.planDate)
                  .then(() => {
                    history.push('/indicators');
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
                  goals: {primary: this.props.goals.primary, secondary: this.props.goals.secondary},
                  objectives: this.props.objectives,
                  blockedChannels: this.props.blockedChannels,
                  inHouseChannels: this.props.inHouseChannels,
                  userMinMonthBudgets: this.createUserMinMonthBudgetJson(),
                  maxChannels: this.props.maxChannels,
                  planDay: this.props.planDay
                }, this.props.region, this.props.planDate)
                  .then(() => {
                    this.setState({saveSuccess: true});
                  })
                  .catch(() => {
                    this.setState({saveFail: true});
                  });
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
