import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'components/Component';

import Popup from 'components/Popup';
import Loading from 'components/pages/plan/Loading';
import Button from 'components/controls/Button';
import PlanPopup, {
  TextContent as PopupTextContent
} from 'components/pages/plan/Popup';
import Explanation from 'components/pages/plan/Explanation';
import style from 'styles/plan/annual-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
import popupStyle from 'styles/plan/popup.css';
import { parseAnnualPlan } from 'data/parseAnnualPlan';
import PlanCell from 'components/pages/plan/PlanCell';
import DeleteChannelPopup from 'components/pages/plan/DeleteChannelPopup';
import EditChannelNamePopup from 'components/pages/plan/EditChannelNamePopup';
import EditableCell from 'components/pages/plan/EditableCell';
import IndicatorsGraph from 'components/pages/plan/IndicatorsGraph';
import { formatChannels, output } from 'components/utils/channels';
import buttonsStyle from 'styles/onboarding/buttons.css';
import { ContextMenu, ContextMenuTrigger, SubMenu, MenuItem } from 'react-contextmenu';
import contextStyle from 'react-contextmenu/public/styles.css';
import Toggle from 'components/controls/Toggle';

export default class AnnualTab extends Component {

  style = style;
  styles = [planStyles, icons, popupStyle, buttonsStyle, contextStyle];

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
    approvedBudgetsProjection: [],
    annualBudgetArray: []
  };

  constructor(props) {
    super(props);
    this.state = {
      popupShown: false,
      popupLeft: 0,
      pouppTop: 0,
      hoverRow: void 0,
      collapsed: {},
      tableCollapsed: false,
      graphDimensions: {},
      approvedPlan: true
    };
    this.handleChangeContextMenu = this.handleChangeContextMenu.bind(this);
  }

  componentDidMount() {
    this.calculateGraphDimensions()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ budgetField: nextProps.budget });
    this.setState({ budgetArrayField: nextProps.budgetArray });
    this.setState({maxChannelsField: nextProps.maxChannels});
  }

  calculateGraphDimensions() {
    if (this.planTable && this.firstColumnCell) {
      window.requestAnimationFrame(() => {
        this.setState({
          graphDimensions: {
            width: this.planTable.offsetWidth,
            marginLeft: this.firstColumnCell.offsetWidth,
          }
        })
      })
    }
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
    const currentMonth = parseInt(this.props.planDate.split('/')[0]);
    const headers = dates.map((month, index) => {
      const events = this.props.events ?
        this.props.events
          .filter(event => {
            const eventMonth = parseInt(event.startDate.split('/')[1]);
            return (currentMonth + index) % 12 === eventMonth % 12;
          })
          .map((event, index) => {
            return <p key={ index }>
              {event.link ? <a href={event.link} target="_blank">{event.eventName}</a> : event.eventName } {event.startDate} {event.location}
            </p>
          })
        : null;
      return events.length > 0 ? <div style={{ position: 'relative' }}>
          <div className={ this.classes.tableButton } onClick={ () => { this.setState({monthPopup: month}) }}
               onMouseEnter={ ()=> { this.setState({monthPopupHover: month}) }}
               onMouseLeave={ ()=> { this.setState({monthPopupHover: ''}) } }>
            { month }</div>
          <Popup hidden={ month !== this.state.monthPopup && month !== this.state.monthPopupHover } className={ this.classes.eventPopup }>
            <div className={ popupStyle.locals.header }>
              <div className={ popupStyle.locals.title }>
                {"Events - " + month}
              </div>
              <div className={ popupStyle.locals.close }
                   role="button"
                   onClick={ () => { this.setState({monthPopup: ''}) }}
              />
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

  editChannel(i, channel, event) {
    let value = parseInt(event.target.value.replace(/[-$,]/g, '')) || 0;
    let planUnknownChannels = this.props.planUnknownChannels || [];
    if (planUnknownChannels.length > 0 && planUnknownChannels[i] && planUnknownChannels[i][channel] !== undefined) {
      planUnknownChannels[i][channel] = value;
      this.props.updateState({planUnknownChannels: planUnknownChannels});
    }
    else {
      let projectedPlan = this.props.projectedPlan;
      let approvedBudgets = this.props.approvedBudgets;
      projectedPlan[i].plannedChannelBudgets[channel] = value;
      if (!approvedBudgets[i]) {
        approvedBudgets[i] = {};
      }
      approvedBudgets[i][channel] = value;
      this.props.updateState({projectedPlan: projectedPlan, approvedBudgets: approvedBudgets});
    }
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
    this.setState({deletePopup: ''});
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
      // Update user month plan using another request
      const approvedBudgetsProjection = this.props.approvedBudgetsProjection;
      data.projectedPlan.forEach((month, index) => {
        if (!approvedBudgetsProjection[index]) {
          approvedBudgetsProjection[index] = {};
        }
        approvedBudgetsProjection[index] = month.projectedIndicatorValues;
      });
      this.props.updateUserMonthPlan({approvedBudgetsProjection: approvedBudgetsProjection}, this.props.region, this.props.planDate);
    };
    this.props.whatIf(false, {useApprovedBudgets: true}, callback, this.props.region, true);
  }

  handleChangeContextMenu(event, data) {
    const channel = data.channel;
    const percent = data.percent;
    let planUnknownChannels = this.props.planUnknownChannels;
    let projectedPlan = this.props.projectedPlan;
    let approvedBudgets = this.props.approvedBudgets;
    for (let i=0; i< 12; i++) {
      if (planUnknownChannels.length > 0 && planUnknownChannels[i] && planUnknownChannels[i][channel] !== undefined) {
        planUnknownChannels[i][channel] = Math.round(planUnknownChannels[i][channel] * percent);
      }
      else {
        const newBudget = Math.round((projectedPlan[i].plannedChannelBudgets[channel] || 0) * percent);
        projectedPlan[i].plannedChannelBudgets[channel] = newBudget;
        if (!approvedBudgets[i]) {
          approvedBudgets[i] = {};
        }
        approvedBudgets[i][channel] = newBudget;
      }
      this.props.updateState({projectedPlan: projectedPlan, approvedBudgets: approvedBudgets, planUnknownChannels: planUnknownChannels});
    }
  }

  editChannelName(longName, shortName, channel) {
    let namesMapping = this.props.namesMapping || {};
    if (!namesMapping.channels) {
      namesMapping.channels = {};
    }
    namesMapping.channels[channel] = {
      title: longName,
      nickname: shortName
    };
    this.props.updateUserMonthPlan({namesMapping: namesMapping}, this.props.region, this.props.planDate);
    this.setState({editChannelName: ''});
  }

  render() {
    if (!this.props.isPlannerLoading) {
      const planJson = parseAnnualPlan(this.props.projectedPlan, this.props.approvedBudgets, this.props.planUnknownChannels);
      let budget = Object.keys(planJson)[0];
      const data = planJson[budget];
      budget = this.props.annualBudgetArray.reduce((a, b) => a+b, 0);
      budget = Math.ceil(budget/1000)*1000;
      let rows = [];

      const handleRows = (data, parent, level) => {
        level = level | 0;

        Object.keys(data).sort().forEach((item, i) => {
          if (item === '__TOTAL__') return null;

          let key = parent + ':' + item + '-' + i;
          let collapsed = !!this.state.collapsed[key];
          const params = data[item];
          let values;
          let hoverValues;
          let isSecondGood = false;
          if (this.state.approvedPlan) {
            values = params.approvedValues.map(val => {if (val) {return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} else { return "$0"}});
            hoverValues = params.values.map(val => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            isSecondGood = true;
          }
          else {
            values = params.values.map(val => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            hoverValues = params.approvedValues ? params.approvedValues.map(val => {if (val) {return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} else { return "$0"}}) : undefined;
          }
          const  titleElem = <div ref={ params.channel ? this.props.setRef.bind(this, params.channel) : null }>
            { this.props.editMode && params.channel && !params.isOtherChannel ?
              <div className={ this.classes.editChannelNameWrapper }>
                <div className={ this.classes.editChannelName } onClick={ ()=>{ this.setState({editChannelName: params.channel}) } }/>
              </div>
              : null }
            <ContextMenuTrigger id="rightClick" collect={()=>{ return {channel: params.channel} }} disable={!params.channel || !this.props.editMode}>
              <div
                style={{
                  marginLeft: (level | 0) * 17 + 'px',
                  cursor: (params.channel && !this.props.editMode) ? 'pointer' : 'initial'
                }}
                className={ this.classes.rowTitle }>
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
                  this.props.editMode ?
                    <div>
                      <div
                        className={ this.classes.rowDelete }
                        onClick={ () => this.setState({deletePopup: params.channel}) }
                      />
                      <Popup hidden={ params.channel !== this.state.deletePopup } style={{ top: '-72px', left: '130px', cursor: 'initial' }}>
                        <DeleteChannelPopup
                          onNext={ this.deleteRow.bind(this, params.channel) }
                          onBack={ () => this.setState({deletePopup: ''}) }
                        />
                      </Popup>
                      <Popup hidden={ params.channel !== this.state.editChannelName } style={{ top: '-72px', left: '130px', cursor: 'initial' }}>
                        <EditChannelNamePopup
                          channel={ this.state.editChannelName }
                          onNext={ this.editChannelName.bind(this) }
                          onBack={ () => this.setState({editChannelName: ''}) }
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
            </ContextMenuTrigger>
          </div>

          const rowProps = {
            className: this.props.editMode ? null :this.classes.tableRow,
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

          const row = this.getTableRow(titleElem, values, rowProps, params.channel, hoverValues, isSecondGood);
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

      const dates = this.getDates();
      const projections = this.props.projectedPlan.map((item, index) => {
        const json = {};
        if (item.projectedIndicatorValues) {
          Object.keys(item.projectedIndicatorValues).forEach(key => {
            json[key + 'Suggested'] = item.projectedIndicatorValues[key];
          });
        }
        return {... json, name: dates[index], ... this.props.approvedBudgetsProjection[index]}
      });
      const currentSuggested = {};
      Object.keys(this.props.actualIndicators).forEach(indicator => {
        currentSuggested[indicator + 'Suggested'] = this.props.actualIndicators[indicator];
      });
      // Current indicators values to first cell
      projections.splice(0,0,{... this.props.actualIndicators, name: 'today', ... currentSuggested});

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
                <div data-selected={ this.state.dropmenuVisible ? true : null }>

                </div>
              }
              <Button type="reverse" style={{
                marginRight: '10px',
                width: '102px'
              }} onClick={ () => {
                const domElement = ReactDOM.findDOMNode(this.refs.forecastingGraph);
                if (domElement) {
                  domElement.scrollIntoView({});
                }
              }}>Forecast</Button>
            </div>
          </div>
          <div className={ planStyles.locals.title } style={{ padding: '0', height: '35px' }}>
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
            <div className={ planStyles.locals.titleToggle } style={{ width: '50%' }}>
              <Toggle
                leftText="Current"
                rightText="Suggested"
                leftActive={ this.state.approvedPlan }
                leftClick={ ()=>{ this.setState({approvedPlan: true}) } }
                rightClick={ ()=>{ this.setState({approvedPlan: false}) } }
              />
            </div>
          </div>
          <div className={ this.classes.innerBox }>
            <div className={ this.classes.box }>
              <table className={ this.classes.table } ref={(ref) => this.planTable = ref}>
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

            <ContextMenu id="rightClick">
              <SubMenu title="Increase by" hoverDelay={250}>
                <MenuItem data={{percent: 1.1}} onClick={this.handleChangeContextMenu}>
                  10%
                </MenuItem>
                <MenuItem data={{percent: 1.2}} onClick={this.handleChangeContextMenu}>
                  20%
                </MenuItem>
                <MenuItem data={{percent: 1.3}} onClick={this.handleChangeContextMenu}>
                  30%
                </MenuItem>
                <MenuItem data={{percent: 1.4}} onClick={this.handleChangeContextMenu}>
                  40%
                </MenuItem>
                <MenuItem data={{percent: 1.5}} onClick={this.handleChangeContextMenu}>
                  50%
                </MenuItem>
              </SubMenu>
              <SubMenu title="Decrease by" hoverDelay={250}>
                <MenuItem data={{percent: 0.9}} onClick={this.handleChangeContextMenu}>
                  10%
                </MenuItem>
                <MenuItem data={{percent: 0.8}} onClick={this.handleChangeContextMenu}>
                  20%
                </MenuItem>
                <MenuItem data={{percent: 0.7}} onClick={this.handleChangeContextMenu}>
                  30%
                </MenuItem>
                <MenuItem data={{percent: 0.6}} onClick={this.handleChangeContextMenu}>
                  40%
                </MenuItem>
                <MenuItem data={{percent: 0.5}} onClick={this.handleChangeContextMenu}>
                  50%
                </MenuItem>
              </SubMenu>
            </ContextMenu>

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
            <div className={ this.classes.indicatorsGraph } style={{ width: this.state.graphDimensions.width }} ref="forecastingGraph">
              <IndicatorsGraph data={ projections } objectives={ objectives } dimensions={this.state.graphDimensions}/>
            </div>
          </div>
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

  getTableRow(title, items, props, channel, hoverValues, isSecondGood)
  {
    return <tr {... props}>
      <td className={ this.classes.titleCell } ref={(ref) => this.firstColumnCell = ref}>{ this.getCellItem(title) }</td>
      {
        items.map((item, i) => {
          if (channel && this.props.editMode) {
            return <td className={ this.classes.valueCell } key={ i }>{
              <EditableCell
                title={ (hoverValues && item !== hoverValues[i]) ? "previous: " + hoverValues[i] : null }
                value={ item }
                onChange={ this.editChannel.bind(this, i, channel) }
                i={ i }
                channel={ channel }
                draggableValue={ this.state.draggableValue }
                dragStart={ this.dragStart.bind(this) }
                dragEnter={ this.dragEnter.bind(this, i, channel) }
                drop={ this.commitDrag.bind(this) }
                isDragging={ this.state.isDragging }/>
            }</td>
          }
          else if (channel && hoverValues && item !== hoverValues[i]) {
            return <PlanCell
              item={ item }
              hover={ hoverValues[i] }
              key={ i }
              approveChannel={ () => { this.props.approveChannel(i, channel, isSecondGood ? hoverValues[i] : item) } }
              declineChannel={ () => { this.props.declineChannel(i, channel, isSecondGood ? item : hoverValues[i]) } }
              isSecondGood={isSecondGood}/>
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