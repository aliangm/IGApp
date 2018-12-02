import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
import IndicatorsGraph from 'components/pages/plan/IndicatorsGraph';
import BudgetsTable from 'components/pages/plan/BudgetsTable';
import {getEndOfMonthString, getQuarterOffset, getRawDatesSpecific, formatSpecificDate, getAnnualOffset} from 'components/utils/date';
import FloatingComponent from 'components/controls/FloatingComponent';
import {isNil, sumBy, union, last, orderBy, groupBy, isEmpty, isObject, get, chunk, mapValues} from 'lodash';
import {newFunnelMapping} from 'components/utils/utils';

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
    const pastMonths = this.props.calculatedData.historyData.rawMonths;
    const quarterOffset = getQuarterOffset(pastMonths);
    const annualOffset = getAnnualOffset(pastMonths);
    const monthsWithExtraData = this.addExtraSumData(pastMonths, () => {
      return {};
    }, () => {
      return {};
    }, quarterOffset, annualOffset);

    this.setState({scrollPosition: (monthsWithExtraData.length - 1) * CELL_WIDTH});
  }

  addExtraSumDataAndFormatDates = (dates, quarterOffset, annualOffset, formatDateFunc) => {
    const quarterDate = quarterData => {
      const date = quarterData[0];
      const quarterNumber = Math.round((date.getMonth() / 3)) + 1;
      const yearStr = date.getFullYear().toString().substr(2, 2);
      return {value: `Q${quarterNumber} ${yearStr}`, isQuarter: true};
    };

    const annualDate = (annualData) => {
      const date = annualData[0];
      const yearStr = date.getFullYear().toString();
      return {value: `FY ${yearStr}`, isAnnual: true};
    };

    return this.addExtraSumData(dates,
      quarterDate,
      annualDate,
      quarterOffset,
      annualOffset,
      item => formatDateFunc(item, false));
  };

  addEvery = (array, chunkFormattingData, itemInQuarterMap = (item) => {
    return item;
  }) => {
    const chunksAddition = union(...chunkFormattingData.map(({offset, itemsInChunk, chunkAdditionFormatter}, grouperIndex) => {
      const chunkSplit = [array.slice(0, offset),
        ...chunk(array.slice(offset), itemsInChunk)];

      const mapChunk = (chunk) => chunk.map((chunk, index) => {
        return {putAfter: (offset + index * itemsInChunk), value: chunkAdditionFormatter(chunk), orderIndex: grouperIndex};
      });

      // If does not need to add to last chunk
      if (array.length / itemsInChunk !== 0) {
        return mapChunk(chunkSplit.slice(0, chunkSplit.length - 1));
      }
      else {
        return mapChunk(chunkSplit);
      }
    }));

    const orderedChunksAddition = orderBy(chunksAddition, 'orderIndex');
    const groupedAdditions = groupBy(orderedChunksAddition, 'putAfter');
    const parsedArray = array.map((item, index) => {
      const valueOfItem = itemInQuarterMap(item);
      return isObject(valueOfItem)
        ? {...valueOfItem, realIndex: index}
        : {value: valueOfItem, realIndex: index};
    });

    let arrayWithAddition = parsedArray;
    Object.keys(groupedAdditions).forEach(putAfter => {
      const additions = groupedAdditions[putAfter];
      const putAfterIndex = arrayWithAddition.findIndex(item => item.realIndex == putAfter);
      arrayWithAddition =
        [...arrayWithAddition.slice(0, putAfterIndex),
          ...additions.map(item => item.value),
          ...arrayWithAddition.slice(putAfterIndex)];
    });

    return arrayWithAddition;
  };

  addExtraSumData = (array, quarterSumFunc, annualSumFunc, quarterOffset, annualOffset, itemParseFunc = (item) => {
    return item;
  }) => {

    if (isEmpty(array)) {
      return [];
    }
    else {
      return this.addEvery(array,
        [
          {offset: quarterOffset, itemsInChunk: 3, chunkAdditionFormatter: quarterSumFunc},
          {offset: annualOffset, itemsInChunk: 12, chunkAdditionFormatter: annualSumFunc}
        ], itemParseFunc);
    }
  };

  render() {
    const {budgetsData, editMode, interactiveMode, secondaryPlanForecastedIndicators, primaryPlanForecastedIndicators, forecastingGraphRef, calculatedData: {objectives: {objectivesData}}, historyData: {indicators}} = this.props;

    const showSecondaryIndicatorGraph = secondaryPlanForecastedIndicators &&
      secondaryPlanForecastedIndicators.length > 0;

    const parsedObjectives = {};
    objectivesData
      .forEach(objective => {
        const target = objective.target;
        const date = objective.dueDate;
        const endOfMonth = getEndOfMonthString(date);
        parsedObjectives[objective.indicator] = {x: endOfMonth, y: target};
      });

    const numberOfPastDates = budgetsData && budgetsData.filter((month) => month.isHistory).length;
    const dates = !isNil(numberOfPastDates) && budgetsData && getRawDatesSpecific(this.props.planDate,
      numberOfPastDates,
      budgetsData.length - numberOfPastDates);
    const quarterOffset = getQuarterOffset(dates);
    const annualOffset = getAnnualOffset(dates);

    const datesWithAddition = dates &&
      this.addExtraSumDataAndFormatDates(dates, quarterOffset, annualOffset, item => formatSpecificDate(item, false));

    const sumBudgetsData = (chunk) => {
      const channelsInChunk = union(...chunk.map(month => Object.keys(month.channels)));
      const chunkSummedChannels = {};
      channelsInChunk.forEach(channel => {
        const primaryBudget = sumBy(chunk, month => {
          return get(month, ['channels', channel, 'primaryBudget'], 0);
        });
        const secondaryBudget = sumBy(chunk, month => {
          return get(month, ['channels', channel, 'secondaryBudget'], 0);
        });

        const regionsInChannel = union(...chunk.map(
          month => Object.keys(get(month, ['channels', channel, 'regions'], {}))
        ));

        const summedRegions = {};
        regionsInChannel && regionsInChannel.forEach(region => {
          summedRegions[region] = sumBy(chunk, month => get(month, ['channels', channel, 'regions', region], 0));
        });

        chunkSummedChannels[channel] = {primaryBudget, secondaryBudget, regions: summedRegions};
      });

      return {channels: chunkSummedChannels, isHistory: last(chunk).isHistory};
    };

    const addBudgetQuarterData = (chunk) => {
      return {...sumBudgetsData(chunk), isQuarter: true};
    };

    const addAnnualBudgetData = (chunk) => {
      return {...sumBudgetsData(chunk), isAnnual: true};
    };

    const dataWithSumAddition = budgetsData && this.addExtraSumData(budgetsData, addBudgetQuarterData, addAnnualBudgetData,
      quarterOffset, annualOffset);

    const numberOfPastDatesWithSumAddition = dataWithSumAddition && dataWithSumAddition.filter((item) => item.isHistory).length;
    const datesForGraphWithPeriodMonths = dates && this.addExtraSumDataAndFormatDates(dates,
      quarterOffset, annualOffset,
      item => getEndOfMonthString(item));

    const forecastingDataForChunk = (chunk) => {
      const indicators = Object.keys(last(chunk));
      const summedIndicators = {};
      indicators.forEach(indicator => {
        const summedValue = newFunnelMapping[indicator]
          ? sumBy(chunk, month => month[indicator])
          : last(chunk)[indicator];

        summedIndicators[indicator] = {
          graphValue: last(chunk)[indicator],
          tooltipValue: summedValue
        };
      });

      return summedIndicators;
    };

    const addQuarterDataForForecasting = (quarterData) => {
      return {indicators: forecastingDataForChunk(quarterData), isQuarter: true};
    };

    const addAnnualDataForForecasting = (annualData) => {
      return {indicators: forecastingDataForChunk(annualData), isAnnual: true};
    };

    const parseRegularMonthForForecasting = (month) => {
      return {
        indicators: mapValues(month,(value) => {
          return {graphValue: value, tooltipValue: value};
        }),
        isQuarter: false,
        isAnnual: false
      };
    };

    const parseForecastingIndicators = (forecasting) => {
      return this.addExtraSumData([...indicators,
          ...forecasting.map(month => mapValues(month, indicator => indicator.committed))],
        addQuarterDataForForecasting, addAnnualDataForForecasting,
        quarterOffset, annualOffset,
        parseRegularMonthForForecasting);
    };

    const primaryDataWithSumAddition = dates &&
      parseForecastingIndicators(primaryPlanForecastedIndicators);

    const secondaryDataWithSumAddition = dates && secondaryPlanForecastedIndicators &&
      parseForecastingIndicators(secondaryPlanForecastedIndicators);

    return <div>
      <div className={this.classes.wrap}>
        <div className={this.classes.innerBox}>
          <BudgetsTable isEditMode={editMode}
                        isShowSecondaryEnabled={interactiveMode || editMode}
                        isConstraintsEnabled={interactiveMode}
                        data={dataWithSumAddition}
                        changeScrollPosition={this.changeScrollPosition}
                        scrollPosition={this.state.scrollPosition}
                        cellWidth={CELL_WIDTH}
                        isPopup={interactiveMode}
                        dates={datesWithAddition || []}
                        numberOfPastDates={numberOfPastDatesWithSumAddition || 0}
                        {...this.props}
          />

          <div className={this.classes.indicatorsGraph} ref={forecastingGraphRef.bind(this)}>
            <FloatingComponent popup={this.props.interactiveMode}>
              <IndicatorsGraph parsedObjectives={parsedObjectives}
                               dimensions={this.state.graphDimensions}
                               changeScrollPosition={this.changeScrollPosition}
                               scrollPosition={this.state.scrollPosition}
                               cellWidth={CELL_WIDTH}
                               mainLineData={(showSecondaryIndicatorGraph
                                 ? secondaryDataWithSumAddition
                                 : primaryDataWithSumAddition) || []}
                               dashedLineData={showSecondaryIndicatorGraph ? primaryDataWithSumAddition : null}
                               labelDates={datesForGraphWithPeriodMonths || []}
                               preiodDates={datesWithAddition || []}
                               numberOfPastDates={numberOfPastDatesWithSumAddition || 0}
                               {...this.props}
              />
            </FloatingComponent>
          </div>
        </div>
      </div>
    </div>;
  }
}