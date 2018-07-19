import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
import IndicatorsGraph from 'components/pages/plan/IndicatorsGraph';
import {timeFrameToDate} from 'components/utils/objective';
import {formatBudget} from 'components/utils/budget';
import BudgetTable from 'components/pages/plan/BudgetTable';
import {monthNames, getDates} from 'components/utils/date';

export default class AnnualTab extends Component {

  style = style;
  styles = [planStyles, icons];

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
      hoverRow: void 0,
      graphDimensions: {},
      approvedPlan: true,
      isSticky: false
    };
  }

  componentDidMount() {
    this.calculateGraphDimensions();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    this.setState({isSticky: window.pageYOffset >= (this.planTable && this.planTable.offsetTop)});
  };

  calculateGraphDimensions() {
    if (this.planTable && this.firstColumnCell) {
      const planTableOffsetWidth = this.planTable.offsetWidth;
      const firstColumnOffsetWidth = this.firstColumnCell.offsetWidth;
      window.requestAnimationFrame(() => {
        this.setState({
          graphDimensions: {
            width: planTableOffsetWidth,
            marginLeft: firstColumnOffsetWidth
          }
        });
      });
    }
  }

  render() {
    const {planBudgets, planDate, annualBudget, calculatedData: {annualBudgetLeftToPlan}, editMode, interactiveMode} = this.props;

    const budgetsData = planBudgets.map(month =>
      Object.keys(month).reduce((object, channelKey) => {
        object[channelKey] = {
          primaryBudget: month[channelKey].committedBudget,
          secondaryBudget: month[channelKey].plannerBudget,
          isSoft: month[channelKey].isSoft
        };
        return object;
      }, {})
    );

    const currentSuggested = {};
    const dates = getDates(planDate);
    const projections = this.props.projectedPlan.map((item, index) => {
      const json = {};
      if (item.projectedIndicatorValues) {
        Object.keys(item.projectedIndicatorValues).forEach(key => {
          json[key + 'Suggested'] = item.projectedIndicatorValues[key];
        });
        Object.keys(this.props.actualIndicators).forEach(indicator => {
          currentSuggested[indicator + 'Suggested'] = this.props.actualIndicators[indicator];
        });
      }
      return {...json, name: dates[index], ... this.props.approvedBudgetsProjection[index]};
    });

    // Current indicators values to first cell
    projections.splice(0, 0, {...this.props.actualIndicators, name: 'today', ...currentSuggested});

    const objectives = {};
    this.props.objectives
      .filter(function (objective) {
        const today = new Date();
        const date = objective && objective.timeFrame ? timeFrameToDate(objective.timeFrame) : today;
        return date >= today;
      })
      .forEach(objective => {
        const delta = objective.isPercentage
          ? objective.amount * (objective.currentValue || 0) / 100
          : objective.amount;
        const target = objective.direction === 'equals' ? objective.amount : (objective.direction === 'increase'
          ? delta + (objective.currentValue || 0)
          : (objective.currentValue || 0) - delta);
        const date = timeFrameToDate(objective.timeFrame);
        const monthStr = monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2);
        objectives[objective.indicator] = {x: monthStr, y: target};
      });

    return <div>
      <div className={this.classes.wrap}>
        <div className={planStyles.locals.title} style={{padding: '0'}}>
          <div className={planStyles.locals.titleMain}>
            <div className={planStyles.locals.titleText}>
              Annual Budget
            </div>
            <div className={planStyles.locals.titlePrice} ref="budgetRef"
                 style={{color: this.state.isTemp ? '#1991eb' : 'Inherit'}}>
              ${(Math.ceil(annualBudget / 1000) * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{this.state.isTemp
              ? '*'
              : ''}
            </div>
          </div>
        </div>
        <div className={planStyles.locals.title} style={{padding: '0', height: '35px'}}>
          <div className={planStyles.locals.titleMain}>
            <div className={this.classes.titleBudget}>
              Budget left to plan
            </div>
            <div className={this.classes.titleArrow}
                 style={{color: annualBudgetLeftToPlan >= 0 ? '#2ecc71' : '#ce352d'}}>
              {
                Math.abs(annualBudgetLeftToPlan) >= 100 ?
                  '$' + annualBudgetLeftToPlan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : <div className={planStyles.locals.budgetLeftToPlanOk}/>
              }
            </div>
          </div>
        </div>
        <div className={this.classes.innerBox}>
          <BudgetTable isEditMode={editMode}
                       isShowSecondaryEnabled={interactiveMode}
                       isConstraitsEnabled={interactiveMode}
                       data={budgetsData}
                       tableRef={(ref) => this.planTable = ref}
                       firstColumnCell={(ref) => this.firstColumnCell = ref}
                       dates={dates}
                       approvedPlan={this.state.approvedPlan}
                       {...this.props}/>

          <div className={this.classes.indicatorsGraph} style={{width: this.state.graphDimensions.width}}
               ref={this.props.forecastingGraphRef.bind(this)}>
            <IndicatorsGraph data={projections} objectives={objectives} dimensions={this.state.graphDimensions}/>
          </div>
        </div>
      </div>
    </div>;
  }
}