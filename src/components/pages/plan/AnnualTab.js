import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
import IndicatorsGraph from 'components/pages/plan/IndicatorsGraph';
import {timeFrameToDate} from 'components/utils/objective';
import {formatNumber} from 'components/utils/budget';
import BudgetsTable from 'components/pages/plan/BudgetsTable';
import {monthNames, getDates} from 'components/utils/date';
import {getIndicatorsWithProps} from 'components/utils/indicators';

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
    const {budgetsData, planDate, editMode, interactiveMode, forecastedIndicators, forecastingGraphRef, calculatedData: {objectives: {objectivesData}} ,historyData: {indicators}} = this.props;

    const forecastingData = [];

    const getEndOfMonth = (dateStr) => {
      const [monthStr, year] = dateStr.split(' ');
      const month = monthNames.indexOf(monthStr);
      const date = new Date(year, month + 1, 0);
      return `${date.getDate()} ${monthStr} ${year}`;
    };

    const futureDates = getDates(planDate);
    forecastedIndicators.forEach((item, index) => {
      const json = {};
      Object.keys(item).forEach(key => {
        json[key] = item[key].committed;
      });
      forecastingData.push({...json, name: getEndOfMonth(futureDates[index])});
    });

    const pastDates = getDates(planDate, true, false);
    indicators.forEach((json, index) => {
      forecastingData.unshift({...json, name: getEndOfMonth(pastDates[pastDates.length - 1 - index])});
    });

    const zeroedIndicators = {};
    Object.keys(getIndicatorsWithProps()).forEach(key => {
      zeroedIndicators[key] = 0;
    });
    forecastingData.unshift({...zeroedIndicators, name: ''});

    const parsedObjectives = {};
    objectivesData
      .forEach(objective => {
        const target = objective.target;
        const date = objective.dueDate;
        const monthStr = monthNames[date.getMonth()] + ' ' + date.getFullYear().toString().substr(2, 2);
        parsedObjectives[objective.indicator] = {x: getEndOfMonth(monthStr), y: target};
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
            <IndicatorsGraph data={forecastingData}
                             objectives={parsedObjectives}
                             dimensions={this.state.graphDimensions}
                             changeScrollPosition={this.changeScrollPosition}
                             scrollPosition={this.state.scrollPosition}
                             cellWidth={CELL_WIDTH}/>
          </div>
        </div>
      </div>
    </div>;
  }
}