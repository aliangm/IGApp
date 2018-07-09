import { getNickname } from 'components/utils/channels';

const channelPlatformMapping = {
  'advertising_socialAds_facebookAdvertising' : 'facebookadsapi',
  'advertising_displayAds_googleAdwords' : 'adwordsapi',
  'advertising_searchMarketing_SEM_googleAdwords': 'adwordsapi',
  'advertising_socialAds_linkedinAdvertising': 'linkedinapi',
  'advertising_socialAds_twitterAdvertising': 'twitterapi',
};

export function parsePlannedVsActual(approvedBudgets, plannedUnknownChannels, knownChannels, unknownChannels, apis) {
  let returnObj = [];
  Object.keys(approvedBudgets).forEach((channel) => {
    returnObj.push({
      key: channel,
      channel: getNickname(channel),
      planned: approvedBudgets[channel],
      actual: knownChannels[channel] !== undefined  ? knownChannels[channel] : approvedBudgets[channel],
      isAutomatic: knownChannels[channel] !== undefined ? (apis[channelPlatformMapping[channel]] !== undefined) : false
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
        actual: knownChannels[channel],
        isAutomatic : apis[channelPlatformMapping[channel]] != undefined
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