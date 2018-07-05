
export function getExtarpolateRatio(day, monthString){
  const planDate = monthString.split("/");
  const date = new Date(planDate[1], planDate[0] - 1);
  const numberOfDaysInMonth = 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
  return day.getDate() / numberOfDaysInMonth;
}