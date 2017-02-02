import schema from './channelsSchema';
import _ from 'lodash';

export function parsePlannedVsActual(plannedChannelBudgets, knownChannels, unknownChannels) {
  let returnObj = [];
  Object.keys(plannedChannelBudgets).forEach((channel) => {
      returnObj.push({
        key: channel,
        channel: schema.properties[channel].title,
        planned: plannedChannelBudgets[channel],
        actual: knownChannels[channel] !== undefined  ? knownChannels[channel] : plannedChannelBudgets[channel]
      });
  });
  Object.keys(knownChannels).forEach((channel) => {
    if (!plannedChannelBudgets[channel]) {
      returnObj.push({
        key: channel,
        channel: schema.properties[channel].title,
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