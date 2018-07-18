import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
import popupStyle from 'styles/plan/popup.css';
import IndicatorsGraph from 'components/pages/plan/IndicatorsGraph';
import buttonsStyle from 'styles/onboarding/buttons.css';
import contextStyle from 'react-contextmenu/public/styles.css';
import Toggle from 'components/controls/Toggle';
import {timeFrameToDate} from 'components/utils/objective';
import {FeatureToggle} from 'react-feature-toggles';
import {formatBudget} from 'components/utils/budget';
import BudgetTable from 'components/pages/plan/BudgetTable';

export default class AnnualTab extends Component {

  style = style;
  styles = [planStyles, icons, popupStyle, buttonsStyle, contextStyle];

  monthNames = [
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct',
    'Nov', 'Dec'
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
      var planDate = this.props.planDate.split('/');
      var date = new Date(planDate[1], planDate[0] - 1);
      date.setMonth(date.getMonth() + i);
      dates.push(this.monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2));
    }
    return dates;
  };

  render() {
    const budget = this.props.annualBudget;
    const budgetLeftToPlan = this.props.calculatedData.annualBudgetLeftToPlan;

    const currentSuggested = {};
    const dates = this.getDates();
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
        const monthStr = this.monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2);
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
              ${(Math.ceil(budget / 1000) * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{this.state.isTemp
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
            <div className={this.classes.titleArrow} style={{color: budgetLeftToPlan >= 0 ? '#2ecc71' : '#ce352d'}}>
              {
                Math.abs(budgetLeftToPlan) >= 100 ?
                  '$' + budgetLeftToPlan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : <div className={planStyles.locals.budgetLeftToPlanOk}/>
              }
            </div>
          </div>
          <FeatureToggle featureName="plannerAI">
            <div className={planStyles.locals.titleToggle} style={{width: '69%'}}>
              <Toggle
                leftText="Current"
                rightText="Suggested"
                leftActive={this.state.approvedPlan}
                leftClick={() => {
                  this.setState({approvedPlan: true});
                }}
                rightClick={() => {
                  this.setState({approvedPlan: false});
                }}
              />
            </div>
          </FeatureToggle>
        </div>
        <div className={this.classes.innerBox}>
          <BudgetTable tableRef={(ref) => this.planTable = ref}
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