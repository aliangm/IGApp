export function formatDate(dateStr) {
  if (dateStr) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [monthNum, yearNum] = dateStr.split("/");

    return `${monthNames[monthNum - 1]}/${yearNum.substr(2,2)}`;
  }
  else return null;
}

export function getDates(dateStr) {
  if (dateStr) {
    const dates = [];
    const planDate = dateStr.split("/");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 12; i++) {
      const date = new Date(planDate[1], planDate[0] - 1);
      date.setMonth(date.getMonth() + i);
      dates.push(monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2));
    }
    return dates;
  }
  return [];
}