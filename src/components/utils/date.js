export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(dateStr) {
  if (dateStr) {
    const [monthNum, yearNum] = dateStr.split('/');
    return `${monthNames[monthNum - 1]} ${yearNum.substr(2, 2)}`;
  }
  else return null;
}

export function getDates(dateStr, includingPast = false, includingFuture = true) {
  if (dateStr) {
    const dates = [];
    const planDate = dateStr.split('/');
    for (let i = includingPast ? -12 : 0; i < (includingFuture ? 12 : 0); i++) {
      const date = new Date(planDate[1], planDate[0] - 1);
      date.setMonth(date.getMonth() + i);
      dates.push(monthNames[date.getMonth()] + ' ' + date.getFullYear().toString().substr(2, 2));
    }
    return dates;
  }
  return [];
}