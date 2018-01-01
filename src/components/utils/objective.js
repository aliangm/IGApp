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