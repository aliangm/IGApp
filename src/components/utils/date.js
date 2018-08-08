export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(dateStr) {
  if (dateStr) {
    const [monthNum, yearNum] = dateStr.split('/');
    return `${monthNames[monthNum - 1]} ${yearNum.substr(2, 2)}`;
  }
  else return null;
}

export function getDates(dateStr, includingPast = false, includingFuture = true) {
  return getDatesSpecific(dateStr, includingPast ? 12 : 0, includingFuture ? 12 : 0);
}

export function getDatesSpecific(dateStr, numberOfPast, numberOfFuture) {
  if (dateStr) {
    const dates = [];
    const planDate = dateStr.split('/');
    for (let i = -numberOfPast; i < numberOfFuture; i++) {
      const date = new Date(planDate[1], planDate[0] - 1);
      date.setMonth(date.getMonth() + i);
      dates.push(monthNames[date.getMonth()] + ' ' + date.getFullYear().toString().substr(2, 2));
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