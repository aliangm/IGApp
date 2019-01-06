import {getEndOfMonthDate} from 'components/utils/date';
import {isRefreshed} from 'components/utils/indicators';
import {sumBy, concat, get} from 'lodash';

export function timeFrameToDate(timeFrame) {
  /*
   const formattedDateArray = timeFrame.split('-').reverse();
   formattedDateArray.push(formattedDateArray.shift());
   const formattedDate = formattedDateArray.reverse().join('-');
   */
  const formattedDateArray = timeFrame.split('-');
  formattedDateArray.splice(0, 0, formattedDateArray.splice(2, 1)[0]);
  const formattedDate = formattedDateArray.join('-');
  return new Date(formattedDate);
}

export function flattenObjectives(objectives,
                                  actualIndicators,
                                  dates,
                                  historyIndicators,
                                  historyDates,
                                  removeDuplicates = false) {

  const actualIndicatorsWithHistory = concat(historyIndicators, actualIndicators);
  const datesWithHistory = concat(historyDates, dates);

  const getObjectiveData = (indicator, objective, monthIndex) => {
    let objectiveValue;
    if(isRefreshed(indicator)){
      const objectiveDate = new Date(objective.userInput.startDate);
      const startMonthIndex = datesWithHistory.findIndex(date => date.getMonth() === objectiveDate.getMonth() && date.getFullYear() === objectiveDate.getFullYear());
      objectiveValue = sumBy(actualIndicatorsWithHistory.slice(startMonthIndex, monthIndex + historyDates.length + 1), month => get(month, indicator, 0));
    }
    else{
      objectiveValue = Array.isArray(actualIndicators) ? actualIndicators[monthIndex][indicator] : actualIndicators[indicator];
    }

    return {
      monthIndex: monthIndex,
      dueDate: getEndOfMonthDate(dates[monthIndex]),
      indicator: indicator,
      // in the case that objectives comes from historyData, indicators an array and needs special treatment
      value: objectiveValue,
      target: objective.target.value,
      priority: objective.target.priority,
      ...objective.userInput
    };
  };

  let objectivesData = objectives.map((month, index) => {
    const monthData = {};
    month && Object.keys(month).forEach(objectiveKey => {
      monthData[objectiveKey] = getObjectiveData(objectiveKey, month[objectiveKey], index);
    });

    return monthData;
  });


  if (removeDuplicates) {
    const withoutDuplicates = {};
    objectivesData.forEach((month) => {
      Object.keys(month).forEach((key) => {
        if (!withoutDuplicates[key]) {
          withoutDuplicates[key] = month[key];
        }
      });
    });

    objectivesData = Object.keys(withoutDuplicates).map(objectiveKey => withoutDuplicates[objectiveKey]);
  }
  else {
    objectivesData = [].concat(...objectivesData.map(monthData =>
      Object.keys(monthData).map(objectiveKey => monthData[objectiveKey])));
  }

  return objectivesData;
}

