import { getNickname } from 'components/utils/channels';

export function parsePlannedVsActual(approvedBudgets, plannedUnknownChannels, knownChannels, unknownChannels) {
  let returnObj = [];
  Object.keys(approvedBudgets).forEach((channel) => {
    returnObj.push({
      key: channel,
      channel: getNickname(channel),
      planned: approvedBudgets[channel],
      actual: knownChannels[channel] !== undefined  ? knownChannels[channel] : approvedBudgets[channel]
    });
  });
  if (plannedUnknownChannels) {
    Object.keys(plannedUnknownChannels).forEach(channel => {
      returnObj.push({
        key: channel,
        channel: channel,
        planned: plannedUnknownChannels[channel],
        actual: unknownChannels[channel] !== undefined ? unknownChannels[channel] : plannedUnknownChannels[channel]
      });
    });
  }
  Object.keys(knownChannels).forEach((channel) => {
    if (approvedBudgets[channel] === undefined) {
      returnObj.push({
        key: channel,
        channel: getNickname(channel),
        planned: 0,
        actual: knownChannels[channel]
      });
    }
  });
  Object.keys(unknownChannels).forEach((channel) => {
    if (plannedUnknownChannels[channel] === undefined) {
      returnObj.push({
        key: channel,
        channel: channel,
        planned: 0,
        actual: unknownChannels[channel]
      });
    }
  });
  return returnObj;
}