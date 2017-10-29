import { getTitle } from 'components/utils/channels';

export function parsePlannedVsActual(plannedChannelBudgets, knownChannels, unknownChannels) {
  let returnObj = [];
  Object.keys(plannedChannelBudgets).forEach((channel) => {
      returnObj.push({
        key: channel,
        channel: getTitle(channel),
        planned: plannedChannelBudgets[channel],
        actual: knownChannels[channel] !== undefined  ? knownChannels[channel] : plannedChannelBudgets[channel]
      });
  });
  Object.keys(knownChannels).forEach((channel) => {
    if (!plannedChannelBudgets[channel]) {
      returnObj.push({
        key: channel,
        channel: getTitle(channel),
        planned: 0,
        actual: knownChannels[channel]
      });
    }
  });
  Object.keys(unknownChannels).forEach((channel) => {
    returnObj.push({
      key: channel,
      channel: channel,
      planned: 0,
      actual: unknownChannels[channel]
    });
  });
  return returnObj;
}