import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
import IndicatorsGraph from 'components/pages/plan/IndicatorsGraph';
import BudgetsTable from 'components/pages/plan/BudgetsTable';
import {monthNames, getEndOfMonthString} from 'components/utils/date';

const CELL_WIDTH = 140;

export default class AnnualTab extends Component {

  style = style;
  styles = [planStyles, icons];

  static defaultProps = {
    actualIndicators: {},
    planDate: '',
    events: [],
    objectives: [],
    annualBudgetArray: []
  };

  constructor(props) {
    super(props);
    this.state = {
      hoverRow: void 0,
      approvedPlan: true,
      scrollPosition: 0
    };
  }

  changeScrollPosition = (toPosition) => {
    this.setState({
      scrollPosition: toPosition
    });
  };

  componentDidMount() {
    this.setState({scrollPosition: this.props.calculatedData.historyData.historyDataLength * CELL_WIDTH});
  }

  render() {
    const {budgetsData, planDate, editMode, interactiveMode, secondaryPlanForecastedIndicators, primaryPlanForecastedIndicators, forecastingGraphRef, calculatedData: {objectives: {objectivesData}}, historyData: {indicators}} = this.props;

    const showSecondaryIndicatorGraph = secondaryPlanForecastedIndicators &&
      secondaryPlanForecastedIndicators.length > 0;

    const parsedObjectives = {};
    objectivesData
      .forEach(objective => {
        const target = objective.target;
        const date = objective.dueDate;
        const monthStr = monthNames[date.getMonth()] + ' ' + date.getFullYear().toString().substr(2, 2);
        parsedObjectives[objective.indicator] = {x: getEndOfMonthString(monthStr), y: target};
      });

    return <div>
      <div className={this.classes.wrap}>
        <div className={this.classes.innerBox}>
          <BudgetsTable isEditMode={editMode}
                        isShowSecondaryEnabled={interactiveMode || editMode}
                        isConstraintsEnabled={interactiveMode}
                        data={budgetsData}
                        approvedPlan={this.state.approvedPlan}
                        changeScrollPosition={this.changeScrollPosition}
                        scrollPosition={this.state.scrollPosition}
                        cellWidth={CELL_WIDTH}
                        isPopup={interactiveMode}
                        {...this.props}
          />

          <div className={this.classes.indicatorsGraph} ref={forecastingGraphRef.bind(this)}>
            <IndicatorsGraph objectives={parsedObjectives}
                             dimensions={this.state.graphDimensions}
                             changeScrollPosition={this.changeScrollPosition}
                             scrollPosition={this.state.scrollPosition}
                             cellWidth={CELL_WIDTH}
                             mainLineData={showSecondaryIndicatorGraph ? secondaryPlanForecastedIndicators : primaryPlanForecastedIndicators}
                             dashedLineData={showSecondaryIndicatorGraph ? primaryPlanForecastedIndicators : null}
                             pastIndicators={indicators}
                             planDate={planDate}
            />
          </div>
        </div>
      </div>
    </div>;
  }
}