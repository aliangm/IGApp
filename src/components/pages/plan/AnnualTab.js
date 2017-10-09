import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'components/Component';

import Popup from 'components/Popup';
import Loading from 'components/pages/plan/Loading';
import Button from 'components/controls/Button';
import Textfield from 'components/controls/Textfield';
import PlanPopup, {
  TextContent as PopupTextContent
} from 'components/pages/plan/Popup';
import Explanation from 'components/pages/plan/Explanation';
import Label from 'components/ControlsLabel';

import style from 'styles/plan/annual-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
import popupStyle from 'styles/plan/popup.css';
import { parseAnnualPlan } from 'data/parseAnnualPlan';
import PlanCell from 'components/pages/plan/PlanCell';
import DeleteChannelPopup from 'components/pages/plan/DeleteChannelPopup';
import history from 'history';
import MultiRow from 'components/MultiRow';
import Select from 'components/controls/Select';
import EditableCell from 'components/pages/plan/EditableCell';
import IndicatorsGraph from 'components/pages/plan/IndicatorsGraph';
import { formatChannels } from 'components/utils/channels';
import buttonsStyle from 'styles/onboarding/buttons.css';

export default class AnnualTab extends Component {
  styles = [planStyles, icons, popupStyle, buttonsStyle];
  style = style;

  budgetWeights = [0.05, 0.1, 0.19, 0.09, 0.09, 0.09, 0.04, 0.08, 0.1, 0.06, 0.07, 0.04];
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  static defaultProps = {
    projectedPlan: [],
    approvedBudgets: [],
    actualIndicators: {},
    planDate: '',
    events: [],
    objectives: [],
    annualBudget: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      //budget: 315000,
      whatIfSelected: false,
      popupShown: false,
      popupLeft: 0,
      pouppTop: 0,

      budgetField: props.budget || '',
      budgetArrayField: props.budgetArray || [],
      maxChannelsField: props.maxChannels || '',
      isCheckAnnual: !!props.budget,

      hoverRow: void 0,
      collapsed: {},
      tableCollapsed: false,
      annualData: {},
      editMode: false
    }
    this.whatIf = this.whatIf.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ budgetField: nextProps.budget });
    this.setState({ budgetArrayField: nextProps.budgetArray });
    this.setState({maxChannelsField: nextProps.maxChannels});
  }

  /**
   onHeadClick = (e) => {
    const elem = e.currentTarget;
    const rect = elem.getBoundingClientRect();
    const wrapRect = ReactDOM.findDOMNode(this.refs.wrap).getBoundingClientRect();


    this.refs.headPopup.open();

    this.setState({
      popupShown: true,
      popupLeft: rect.left - wrapRect.left,
      popupTop: rect.top - wrapRect.top + rect.height
    });
  }
   **/

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

  getMonthHeaders = () => {
    const dates = this.getDates();
    const headers = dates.map((month, index) => {
      const events = this.props.events ?
        this.props.events
          .filter(event => {
            const currentMonth = parseInt(this.props.planDate.split('/')[0]);
            const eventMonth = parseInt(event.startDate.split('/')[1]);
            return currentMonth + index === eventMonth;
          })
          .map((event, index) => {
            return <p key={ index }>
              {event.link ? <a href={event.link} target="_blank">{event.eventName}</a> : event.eventName } {event.startDate} {event.location}
            </p>
          })
        : null;
      return events.length > 0 ? <div style={{ position: 'relative' }}>
          <div className={ this.classes.tableButton } onClick={ () => { this.setState({monthPopup: month}) }}>{ month }</div>
          <Popup hidden={ month != this.state.monthPopup } className={ this.classes.eventPopup }>
            <div className={ popupStyle.locals.header }>
              <div className={ popupStyle.locals.title }>
                {"Events - " + month}
              </div>
              <div className={ popupStyle.locals.close }
                   role="button"
                   onClick={ () => { this.setState({monthPopup: ''}) }}
              ></div>
            </div>
            <PopupTextContent>
              {events}
            </PopupTextContent>
          </Popup>
        </div>
        :
        <div className={ this.classes.cellItem }>{ month }</div>
    });
    return headers;
  };

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
      this.props.whatIf(isCommitted, preferences, callback, this.props.region);
    }
    /**
     this.setState({
      budget: budget,
      budgetField: '$'
    });**/
  }

  whatIfCommit = () => {
    let callback = (data) => {
      this.props.setDataAsState(data);
      this.refs.whatIfPopup.close();
      this.setState({whatIfSelected: false, isTemp: false});
    }
    this.whatIf(true, callback);
  }

  whatIfTry = () => {
    let callback = (data) => {
      this.props.setDataAsState(data);
      this.refs.whatIfPopup.open();
      this.setState({whatIfSelected: true, isTemp: true});
    }
    this.whatIf(false, callback);
  }

  whatIfCancel = () => {
    this.refs.whatIfPopup.close();
    this.setState({whatIfSelected: false, isTemp: false, budgetField: '', maxChannelsField: ''});
    this.props.getUserMonthPlan(this.props.region);
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

  handleChangeBudgetArray(index, event) {
    let update = this.state.budgetArrayField || [];
    update.splice(index, 1, parseInt(event.target.value.replace(/[-$,]/g, '')));
    this.setState({budgetArrayField: update});
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

  approveChannel(month, channel, budget){
    let approvedBudgets = this.props.approvedBudgets;
    let approvedMonth = this.props.approvedBudgets[month] || {};
    approvedMonth[channel] = parseInt(budget.replace(/[-$,]/g, ''));
    approvedBudgets[month] = approvedMonth;
    this.props.updateUserMonthPlan({approvedBudgets: approvedBudgets}, this.props.region, this.props.planDate);
  }

  declineChannel(month, channel, budget){
    let projectedPlan = this.props.projectedPlan;
    let projectedMonth = this.props.projectedPlan[month];
    projectedMonth.plannedChannelBudgets[channel] = parseInt(budget.replace(/[-$,]/g, ''));
    projectedPlan[month] = projectedMonth;
    this.props.updateUserMonthPlan({projectedPlan: projectedPlan}, this.props.region, this.props.planDate);
  }

  handleChangeSelect(event) {
    this.setState({newChannel: event.value, channelAddedSuccessfully: false})
  }

  addChannel() {
    let projectedPlan = this.props.projectedPlan;
    let approvedBudgets = this.props.approvedBudgets;
    for (let i = 0; i < 12; i++) {
      if (!approvedBudgets[i]) {
        approvedBudgets[i] = {};
      }
      if (!projectedPlan[i]) {
        projectedPlan[i] = { plannedChannelBudgets: {}, projectedIndicatorValues: {} };
      }
      projectedPlan[i].plannedChannelBudgets[this.state.newChannel] = 0;
      approvedBudgets[i][this.state.newChannel] = 0;
    }
    this.props.updateUserMonthPlan({
      projectedPlan: projectedPlan,
      approvedBudgets: approvedBudgets
    }, this.props.region, this.props.planDate);
    this.setState({channelAddedSuccessfully: true});
  }

  handleChangeText(event) {
    this.setState({otherChannel: event.target.value, channelAddedSuccessfully: false});
  }

  addUnknownChannel() {
    let planUnknownChannels = this.props.planUnknownChannels;
    for (let i = 0; i < 12; i++) {
      if (!planUnknownChannels[i]) {
        planUnknownChannels[i] = {};
      }
      planUnknownChannels[i][this.state.otherChannel] = 0;
    }
    this.props.updateUserMonthPlan({
      unknownChannels: planUnknownChannels
    }, this.props.region, this.props.planDate);
    this.setState({channelAddedSuccessfully: true});
  }

  editChannel(i, channel, event) {
    let value = parseInt(event.target.value.replace(/[-$,]/g, ''));
    let planUnknownChannels = this.props.planUnknownChannels;
    if (planUnknownChannels.length > 0 && planUnknownChannels[i][channel] !== undefined) {
      planUnknownChannels[i][channel] = value || 0;
      this.props.updateState({planUnknownChannels: planUnknownChannels});
    }
    else {
      let projectedPlan = this.props.projectedPlan;
      let approvedBudgets = this.props.approvedBudgets;
      projectedPlan[i].plannedChannelBudgets[channel] = value || 0;
      if (!approvedBudgets[i]) {
        approvedBudgets[i] = {};
      }
      approvedBudgets[i][channel] = value;
      this.props.updateState({projectedPlan: projectedPlan, approvedBudgets: approvedBudgets});
    }
  }

  editUpdate() {
    this.props.updateUserMonthPlan({projectedPlan: this.props.projectedPlan, approvedBudgets: this.props.approvedBudgets, unknownChannels: this.props.planUnknownChannels}, this.props.region, this.props.planDate);
  }

  dragStart(value) {
    this.setState({draggableValue: value, isDragging: true});
  }

  commitDrag() {
    let value = parseInt(this.state.draggableValue.replace(/[-$,]/g, ''));
    let planUnknownChannels = this.props.planUnknownChannels;
    let projectedPlan = this.props.projectedPlan;
    let approvedBudgets = this.props.approvedBudgets;
    this.state.draggableValues.forEach(cell => {
      if (planUnknownChannels.length > 0 && planUnknownChannels[cell.i][cell.channel] !== undefined) {
        planUnknownChannels[cell.i][cell.channel] = value || 0;
      }
      else {
        projectedPlan[cell.i].plannedChannelBudgets[cell.channel] = value || 0;
        if (!approvedBudgets[cell.i]) {
          approvedBudgets[cell.i] = {};
        }
        approvedBudgets[cell.i][cell.channel] = value;
      }
    });
    this.props.updateState({projectedPlan: projectedPlan, approvedBudgets: approvedBudgets, planUnknownChannels: planUnknownChannels});
    this.setState({isDragging: false, draggableValues: []});
  }

  dragEnter(i, channel) {
    const update = this.state.draggableValues || [];
    update.push({channel: channel, i: i});
    this.setState({draggableValues: update});
  }

  deleteRow(channel, event) {
    event.preventDefault();
    let planUnknownChannels = this.props.planUnknownChannels;
    let projectedPlan = this.props.projectedPlan;
    let approvedBudgets = this.props.approvedBudgets;
    for (let i=0; i<12; i++) {
      if (planUnknownChannels.length > 0 && planUnknownChannels[i][channel] !== undefined) {
        delete planUnknownChannels[i][channel];
      }
      else {
        delete projectedPlan[i].plannedChannelBudgets[channel];
        if (approvedBudgets[i]) {
          delete approvedBudgets[i][channel];
        }
      }
    }
    this.props.updateState({projectedPlan: projectedPlan, approvedBudgets: approvedBudgets, planUnknownChannels: planUnknownChannels});
  }

  forecast() {
    const callback = (data) => {
      // PATCH
      // Update user month plan projected indicators using another request
      const projectedPlan = this.props.projectedPlan;
      projectedPlan.forEach((month, index) => {
        month.projectedIndicatorValues = data.projectedPlan[index].projectedIndicatorValues;
      });
      this.props.updateUserMonthPlan({projectedPlan: projectedPlan}, this.props.region, this.props.planDate);
    };
    this.props.whatIf(false, {useApprovedBudgets: true}, callback, this.props.region);
  }

  render() {
    if (!this.props.isPlannerLoading) {
      const channelOptions = formatChannels();
      const planJson = parseAnnualPlan(this.props.projectedPlan, this.props.approvedBudgets, this.props.planUnknownChannels);
      let budget = Object.keys(planJson)[0];
      const data = planJson[budget];
      budget = this.props.annualBudget !== null ? this.props.annualBudget : this.props.annualBudgetArray.reduce((a, b) => a+b, 0);
      budget = Math.ceil(budget/1000)*1000;
      let rows = [];

      const handleRows = (data, parent, level) => {
        level = level | 0;

        Object.keys(data).sort().forEach((item, i) => {
          if (item === '__TOTAL__') return null;

          let key = parent + ':' + item + '-' + i;
          let collapsed = !!this.state.collapsed[key];
          const params = data[item];
          const values = params.values.map(val => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
          const approvedValues = params.approvedValues ? params.approvedValues.map(val => {if (val) {return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} else { return "$0"}}) : undefined;
          const  titleElem = <div
            style={{
              marginLeft: (level | 0) * 17 + 'px',
              cursor: params.channel ? 'pointer' : 'initial'
            }}
            className={ this.classes.rowTitle }
            onClick={ () => {
              if (!this.state.editMode && params.channel) {
                history.push({
                  pathname: `campaigns` ,
                  query: { hash: params.channel }
                })
              } }}>
            { params.children ?
              <div
                className={ this.classes.rowArrow }
                data-collapsed={ collapsed || null }
                onClick={() => {
                  this.state.collapsed[key] = !collapsed;
                  this.forceUpdate();
                }}
              />
              :
              this.state.editMode ?
                <div>
                  <div
                    className={ this.classes.rowDelete }
                    onClick={ () => this.setState({deletePopup: params.channel}) }
                  />
                  <Popup hidden={ params.channel != this.state.deletePopup } style={{ top: '-72px', left: '130px', cursor: 'initial' }}>
                    <DeleteChannelPopup
                      onNext={ this.deleteRow.bind(this, params.channel) }
                      onBack={ () => this.setState({deletePopup: ''}) }
                    />
                  </Popup>
                </div>
                : null }

            { params.icon ?
              <div className={ this.classes.rowIcon } data-icon={ params.icon }/>
              : null }

            { params.icon_mask ?
              <div className={ this.classes.rowMaskIcon }>
                <div className={ this.classes.rowMaskIconInside } data-icon={ params.icon_mask }/>
              </div>
              : null }
            {/**   { item.length > 13 ?
                <div>{ item.substr(0, item.lastIndexOf(' ', 13)) }
                  <br/> { item.substr(item.lastIndexOf(' ', 13) + 1, item.length) }
                </div>
                : item }**/}
            {item}
          </div>

          const rowProps = {
            className: this.state.editMode ? null :this.classes.tableRow,
            key: key,
            onMouseEnter: () => {
              this.setState({
                hoverRow: key
              });
            },
            onMouseLeave: () => {
              this.setState({
                hoverRow: void 0
              });
            }
          };

          if (params.disabled) {
            rowProps['data-disabled'] = true;
          }

          const row = this.getTableRow(titleElem, values, rowProps, params.channel, approvedValues);
          rows.push(row);

          if (!collapsed && params.children) {
            handleRows(params.children, key, level + 1);
          }
        });
      }

      if (data && !this.state.tableCollapsed) {
        handleRows(data);
      }

      const budgetLeftToPlan = budget - data['__TOTAL__'].values.reduce((a, b) => a + b, 0);

      const headRow = this.getTableRow(<div className={ this.classes.headTitleCell }>
        <div
          className={ this.classes.rowArrow }
          data-collapsed={ this.state.tableCollapsed || null }
          onClick={() => {
            this.state.tableCollapsed = !this.state.tableCollapsed;
            this.forceUpdate();
          }}
        />
        { 'Marketing Channel' }
      </div>, this.getMonthHeaders(), {
        className: this.classes.headRow
      });

      const footRow = data && this.getTableRow(<div className={ this.classes.footTitleCell }>
        { 'TOTAL' }
      </div>, data['__TOTAL__'].values.map(val => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')), {
        className: this.classes.footRow
      });

      const isExist = (value) => {
        let exist = false;
        this.props.projectedPlan.forEach((month)=>{
          if (Object.keys(month.plannedChannelBudgets).includes(value)) {
            exist = true;
          }
        });
        this.props.approvedBudgets.forEach((month)=>{
          if (month && Object.keys(month).includes(value)) {
            exist = true;
          }
        });
        return exist;
      };

      let preventDuplicates = (value) => {
        if (value.options) {
          value.options.map(preventDuplicates);
        }
        else {
          value.disabled = isExist(value.value);
          return value;
        }
      };

      channelOptions.map(preventDuplicates);

      const dates = this.getDates();
      const projections = this.props.projectedPlan.map((item, index) => {
        return {... item.projectedIndicatorValues, name: dates[index]}
      });
      // Current indicators values to first cell
      projections.splice(0,0,{... this.props.actualIndicators, name: 'today'});

      const objectives = {};
      this.props.objectives.forEach(objective => {
        const delta = objective.isPercentage ? objective.amount * this.props.actualIndicators[objective.indicator] / 100 : objective.amount;
        const target = objective.direction === "equals" ? objective.amount : (objective.direction === "increase" ? delta + this.props.actualIndicators[objective.indicator] : this.props.actualIndicators[objective.indicator] - delta);
        const date = new Date(objective.timeFrame);
        const monthStr = this.monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2,2);
        objectives[objective.indicator] = {x: monthStr, y: target};
      });

      return <div>
        <div className={ this.classes.wrap } data-loading={ this.props.isPlannerLoading ? true : null }>
          <div className={ planStyles.locals.title } style={{ padding: '0' }}>
            <div className={ planStyles.locals.titleMain }>
              <div className={ planStyles.locals.titleText }>
                Annual Budget
              </div>
              <div className={ planStyles.locals.titlePrice } ref="budgetRef" style={{ color: this.state.isTemp ? '#1991eb' : 'Inherit' }}>
                ${ budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{this.state.isTemp ? '*' : ''}
              </div>
            </div>
            <div className={ planStyles.locals.titleButtons }>
              { this.props.userAccount.freePlan ? null :
                <Button type="accent2" style={{
                  marginLeft: '15px',
                  width: '114px'
                }} onClick={() => {
                  this.props.approveAll();
                }}>
                  Approve All
                </Button>
              }
              <Button type="reverse" style={{
                marginLeft: '15px',
                width: '102px'
              }} onClick={ this.forecast.bind(this) }>Forecast</Button>
              <Button type="normalAccent" style={{
                marginLeft: '15px',
                width: '102px'
              }} selected={ this.state.editMode ? true : null } onClick={() => {
                if (this.state.editMode) {
                  this.editUpdate();
                }
                this.setState({
                  editMode: !this.state.editMode
                });
              }} icon={this.state.editMode ? "buttons:like" : "buttons:edit"}>
                { this.state.editMode ? "Done" : "Edit" }
              </Button>
              { this.props.userAccount.freePlan ? null :
                <div>
                  <Button type="primary2" style={{
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
                      top: '-37px'
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
              }
            </div>
          </div>
          <div className={ planStyles.locals.title } style={{ height: '40px', padding: '0' }}>
            <div className={ planStyles.locals.titleMain }>
              <div className={ this.classes.titleBudget }>
                Budget left to plan
              </div>
              <div className={ this.classes.titleArrow } style={{ color: budgetLeftToPlan >= 0 ? '#2ecc71' : '#ce352d' }}>
                {
                  Math.abs(budgetLeftToPlan) >= 100 ?
                    '$' + budgetLeftToPlan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : <div className={ planStyles.locals.budgetLeftToPlanOk }/>
                }
              </div>
            </div>
          </div>
          <div className={ this.classes.innerBox }>
            <div className={ this.classes.wrap } ref="wrap">
              <div className={ this.classes.box }>
                <table className={ this.classes.table }>
                  <thead>
                  { headRow }
                  </thead>
                  <tbody className={ this.classes.tableBody }>
                  { rows }
                  </tbody>
                  <tfoot>
                  { footRow }
                  </tfoot>
                </table>
              </div>

              <div className={ this.classes.hoverBox }>
                <table className={ this.classes.hoverTable }>
                  <thead>{ headRow }</thead>
                  <tbody>{ rows }</tbody>
                  <tfoot>{ footRow }</tfoot>
                </table>
              </div>

              <PlanPopup ref="headPopup" style={{
                width: '350px',
                left: this.state.popupLeft + 'px',
                top: this.state.popupTop + 'px',
                marginTop: '5px'
              }} title="Events: Mar/16"
                         onClose={() => {
                           this.setState({
                             popupShown: false,
                             popupLeft: 0,
                             popupTop: 0
                           });
                         }}
              >
                <PopupTextContent>
                  <strong>User Events</strong>
                  <p>With the exception of Nietzsche, no other madman has contributed so much to human sanity as has
                    Louis
                    Althusser. He is mentioned twice in the Encyclopaedia Britannica as someone’s teacher.</p>
                  <strong>Global Events</strong>
                  <p>Thought experiments (Gedankenexperimenten) are “facts” in the sense that they have a “real life”
                    correlate in the form of electrochemical activity in the brain. But it is quite obvious that they
                    do
                    not</p>
                </PopupTextContent>
              </PlanPopup>
            </div>
            { this.state.editMode ?
              <div className={ this.classes.addChannel }>
                <div className={ this.classes.channelsRow }>
                  <Select
                    className={ this.classes.channelsSelect }
                    selected={ this.state.newChannel }
                    select={{
                      menuTop: true,
                      name: 'channels',
                      onChange: (selected) => {
                        update({
                          selected: selected
                        });
                      },
                      options: channelOptions
                    }}
                    onChange={ this.handleChangeSelect.bind(this) }
                    label={ `Add a channel` }
                  />
                  <div hidden={ !this.state.newChannel || this.state.newChannel == "OTHER"  }>
                    <Button type="primary2" style={{
                      width: '72px',
                      marginTop: '5px'
                    }} onClick={
                      this.addChannel.bind(this)
                    }> Enter
                    </Button>
                  </div>
                </div>
                { this.state.newChannel == "OTHER" ?
                  <div className={ this.classes.channelsRow } style={{ display: 'flex', marginTop: '20px' }}>
                    <Textfield style={{
                      width: '292px'
                    }}  onChange={
                      this.handleChangeText.bind(this)
                    }/>
                    <Button type="primary2" style={{
                      width: '72px',
                      margin: '0 20px'
                    }} onClick={
                      this.addUnknownChannel.bind(this)
                    }> Enter
                    </Button>
                  </div>
                  : null }
                { this.state.channelAddedSuccessfully ?
                  <label style={{ color: '#26B10F', marginTop: '10px' }}>
                    Channel Added Successfully!
                  </label>
                  : null }
              </div>
              :null }
          </div>
        </div>
        <div className={ this.classes.indicatorsGraph }>
          <IndicatorsGraph data={ projections } objectives={ objectives }/>
        </div>
      </div>
    } else {
      return <div className={ this.classes.loading }>
        <Popup className={ this.classes.popup }>
          <div>
            <Loading />
          </div>

          <div className={ this.classes.popupText }>
            Please wait while the system optimizes your plan
          </div>
        </Popup>
      </div>
    }
  }

  getTableRow(title, items, props, channel, approvedValues)
  {
    return <tr {... props}>
      <td className={ this.classes.titleCell }>{ this.getCellItem(title) }</td>
      {
        items.map((item, i) => {
          if (channel && this.state.editMode) {
            return <td className={ this.classes.valueCell } key={ i }>{
              <EditableCell title={ (approvedValues && item != approvedValues[i]) ? "previous: " + approvedValues[i] : null } value={ item } onChange={ this.editChannel.bind(this, i, channel) } i={ i } channel={ channel } draggableValue={ this.state.draggableValue } dragStart={ this.dragStart.bind(this) } dragEnter={ this.dragEnter.bind(this, i, channel) } drop={ this.commitDrag.bind(this) } isDragging={ this.state.isDragging }/>
            }</td>
          }
          else if (channel && approvedValues && item != approvedValues[i]) {
            return <PlanCell item={ item } approved={ approvedValues[i] } key={ i }
                             approveChannel={ this.approveChannel.bind(this, i, channel, item) } declineChannel={ this.declineChannel.bind(this, i, channel, approvedValues[i]) }/>
          }
          else return <td className={ this.classes.valueCell } key={ i }>{
              this.getCellItem(item)
            }</td>
        })
      }
    </tr>
  }

  getCellItem(item)
  {
    let elem;

    if (typeof item !== 'object') {
      elem = <div className={ this.classes.cellItem }>{ item }</div>
    } else {
      elem = item;
    }

    return elem;
  }
}