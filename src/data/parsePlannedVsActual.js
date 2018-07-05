import { getNickname } from 'components/utils/channels';

export function parsePlannedVsActual(approvedBudgets, plannedUnknownChannels, knownChannels, unknownChannels) {
  let returnObj = [];

  Object.keys(approvedBudgets).forEach((channel) => {

    returnObj.push({
      key: channel,
      channel: getNickname(channel),
      planned: approvedBudgets[channel],
      updatedSpent: knownChannels[channel] !== undefined  ? knownChannels[channel] : approvedBudgets[channel],
      isUpdatedByUser: knownChannels[channel] !== undefined
    });
  });
  if (plannedUnknownChannels) {
    Object.keys(plannedUnknownChannels).forEach(channel => {
      returnObj.push({
        key: channel,
        channel: channel,
        planned: plannedUnknownChannels[channel],
        updatedSpent: unknownChannels[channel] !== undefined ? unknownChannels[channel] : plannedUnknownChannels[channel],
        isUpdatedByUser: knownChannels[channel] !== undefined,
      });
    });
  }
  Object.keys(knownChannels).forEach((channel) => {
    if (approvedBudgets[channel] === undefined) {
      returnObj.push({
        key: channel,
        channel: getNickname(channel),
        planned: 0,
        updatedSpent: knownChannels[channel],
        isUpdatedByUser: true
      });
    }
  });
  Object.keys(unknownChannels).forEach((channel) => {
    if (plannedUnknownChannels[channel] === undefined) {
      returnObj.push({
        key: channel,
        channel: channel,
        planned: 0,
        updatedSpent: unknownChannels[channel],
        isUpdatedByUser: true
      });
    }
  });
  return returnObj;
}