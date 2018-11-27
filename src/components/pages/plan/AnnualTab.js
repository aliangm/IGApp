import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
import IndicatorsGraph from 'components/pages/plan/IndicatorsGraph';
import BudgetsTable from 'components/pages/plan/BudgetsTable';
import {monthNames, getEndOfMonthString, getQuarterOffset, getRawDatesSpecific, formatSpecificDate, addQuartersAndFormatDates, getRawDates} from 'components/utils/date';
import FloatingComponent from 'components/controls/FloatingComponent';
import {addQuarters} from 'utils';
import {isNil, sumBy, union, last} from 'lodash';

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
    const {budgetsData, editMode, interactiveMode, secondaryPlanForecastedIndicators, primaryPlanForecastedIndicators, forecastingGraphRef, calculatedData: {objectives: {objectivesData}}, historyData: {indicators}} = this.props;

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

    const numberOfPastDates = budgetsData && budgetsData.filter((month) => month.isHistory).length;
    const dates = !isNil(numberOfPastDates) && budgetsData && getRawDatesSpecific(this.props.planDate,
      numberOfPastDates,
      budgetsData.length - numberOfPastDates);
    const quarterOffset = getQuarterOffset(dates);

    const datesWithQuarters = dates &&
      addQuartersAndFormatDates(dates, quarterOffset, item => formatSpecificDate(item, false));

    const budgetDataWithIndex = budgetsData && budgetsData.map((month, index) => {
      return {...month, updateIndex: index};
    });

    const dataWithQuarters = budgetDataWithIndex && addQuarters(budgetDataWithIndex, quarterData => {
      const channelsInQuarter = union(...quarterData.map(month => Object.keys(month.channels)));
      const quarterSummedChannel = {};
      channelsInQuarter.forEach(channel => {
        const primaryBudget = sumBy(quarterData, month => {
          return month.channels[channel] ? month.channels[channel].primaryBudget : 0;
        });
        const secondaryBudget = sumBy(quarterData, month => {
          return month.channels[channel] ? month.channels[channel].secondaryBudget : 0;
        });

        return quarterSummedChannel[channel] = {primaryBudget, secondaryBudget};
      });

      return {channels: quarterSummedChannel, isHistory: last(quarterData).isHistory, isQuarter: true};
    }, quarterOffset);


    const futureDatesRaw = getRawDates(this.props.planDate, false, true);
    const quarterFutureOffset = getQuarterOffset(futureDatesRaw);
    const futureDatesWithQuarters = addQuartersAndFormatDates(futureDatesRaw,
      quarterFutureOffset,
      item => getEndOfMonthString(formatSpecificDate(item, false)));

    const pastDatesRaw = getRawDatesSpecific(this.props.planDate, indicators.length);
    const quarterPastOffset = getQuarterOffset(pastDatesRaw);
    const pastDatesWithQuarters = addQuartersAndFormatDates(pastDatesRaw,
      quarterPastOffset,
      item => getEndOfMonthString(formatSpecificDate(item, false)));

    const primaryDataWithQuarters = addQuarters(primaryPlanForecastedIndicators, (quarterData) => {
      return last(quarterData);
    }, quarterFutureOffset);

    const secondaryDataWithQuarters = secondaryPlanForecastedIndicators && addQuarters(secondaryPlanForecastedIndicators, (quarterData) => {
      return last(quarterData);
    }, quarterFutureOffset);

    const pastIndicatorsWithQuarters = addQuarters(indicators, (quarterData) => {
      return last(quarterData);
    }, quarterPastOffset);

    return <div>
      <div className={this.classes.wrap}>
        <div className={this.classes.innerBox}>
          <BudgetsTable isEditMode={editMode}
                        isShowSecondaryEnabled={interactiveMode || editMode}
                        isConstraintsEnabled={interactiveMode}
                        data={dataWithQuarters}
                        changeScrollPosition={this.changeScrollPosition}
                        scrollPosition={this.state.scrollPosition}
                        cellWidth={CELL_WIDTH}
                        isPopup={interactiveMode}
                        dates={datesWithQuarters || []}
                        numberOfPastDates={numberOfPastDates}
                        {...this.props}
          />

          <div className={this.classes.indicatorsGraph} ref={forecastingGraphRef.bind(this)}>
            <FloatingComponent popup={this.props.interactiveMode}>
              <IndicatorsGraph parsedObjectives={parsedObjectives}
                               dimensions={this.state.graphDimensions}
                               changeScrollPosition={this.changeScrollPosition}
                               scrollPosition={this.state.scrollPosition}
                               cellWidth={CELL_WIDTH}
                               mainLineData={showSecondaryIndicatorGraph
                                 ? secondaryDataWithQuarters
                                 : primaryDataWithQuarters}
                               dashedLineData={showSecondaryIndicatorGraph ? primaryDataWithQuarters : null}
                               pastIndicators={pastIndicatorsWithQuarters}
                               pastDates={pastDatesWithQuarters}
                               futureDates={futureDatesWithQuarters}
                               {...this.props}
              />
            </FloatingComponent>
          </div>
        </div>
      </div>
    </div>;
  }
}