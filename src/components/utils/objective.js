import {getEndOfMonthDate} from 'components/utils/date';
import extend from 'lodash/extend';

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

export function flattenObjectives(objectives, actualIndicators, dates, shouldCollapseObjectives = false){
  const getObjectiveData = (indicator, objective, monthIndex) => {
    return {
      monthIndex: monthIndex,
      dueDate: getEndOfMonthDate(dates[monthIndex]),
      indicator: indicator,
      value: actualIndicators[indicator],
      target: objective.target.value,
      priority: objective.target.priority,
      ...objective.userInput
    }
  };

  if(shouldCollapseObjectives) {
    const objectivesData = objectives.map((month, index) => {
      const monthData = {};
      Object.keys(month).forEach(objectiveKey => {
        if(!monthData[objectiveKey]) {
          monthData[objectiveKey] = getObjectiveData(objectiveKey, month[objectiveKey],index);
        }
      });

      return monthData;
    });

    const collapsedData = extend(objectivesData[(objectivesData.length-1)], ...[...objectivesData].reverse());
    return Object.keys(collapsedData).map(objectKey => collapsedData[objectKey]);
  }

  else {
    const objectiveData = [];
    objectives.forEach((month, index) => {
      Object.keys(month).forEach(objective => {
        objectiveData.push(getObjectiveData(objective, month[objective],index));
      });
    });

    return objectiveData;
  }
}

