export const NUMBER_OF_FUTURE_MONTHS = 12;

export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(dateStr) {
  if (dateStr) {
    const [monthNum, yearNum] = dateStr.split('/');
    return `${monthNames[monthNum - 1]} ${yearNum.substr(2, 2)}`;
  }
  else {
    return null;
  }
}

export function getDates(dateStr, includingPast = false, includingFuture = true) {
  return getDatesSpecific(dateStr, includingPast ? NUMBER_OF_FUTURE_MONTHS : 0, includingFuture ? NUMBER_OF_FUTURE_MONTHS : 0);
}

export function getDatesSpecific(dateStr, numberOfPast, numberOfFuture, isSystemDates = false) {
  if (dateStr) {
    const dates = [];
    const planDate = dateStr.split('/');
    for (let i = -numberOfPast; i < numberOfFuture; i++) {
      const date = new Date(planDate[1], planDate[0] - 1);
      date.setMonth(date.getMonth() + i);
      const monthStr = isSystemDates ? date.getMonth() + 1 : monthNames[date.getMonth()];
      const yearStr = isSystemDates ?  date.getFullYear().toString() : date.getFullYear().toString().substr(2, 2);
      const delimiter = isSystemDates ? '/' : ' ';
      dates.push(monthStr + delimiter + yearStr);
    }
    return dates;
  }
  return [];
}

export function getEndOfMonthDate(dateStr) {
  const [monthStr, year] = dateStr.split(' ');
  const month = monthNames.indexOf(monthStr);
  return new Date(parseInt(`20${year}`), month + 1, 0);
}

export function getEndOfMonthString(dateStr) {
  const [monthStr, year] = dateStr.split(' ');
  const month = monthNames.indexOf(monthStr);
  const date = new Date(year, month + 1, 0);
  return `${date.getDate()} ${monthStr} ${year}`;
}

export function getNumberOfDaysBetweenDates(toDate, fromDate = new Date()) {
  return Math.max(Math.ceil((toDate.getTime() - fromDate.getTime()) / (24 * 60 * 60 * 1000)), 0);
}