import schema from './channelsSchema';
import _ from 'lodash';
import channelDescriptions from 'data/channelDescriptions';

export function parseAnnualPlan(projectedPlan, approvedBudgets, unknownChannels) {
  var sum = {};
  var returnObj = {};
  sum["__TOTAL__"] = { values : new Array(projectedPlan.length).fill(0) };
  var budget = 0;
  projectedPlan.forEach((month, index)=> {
    //var month = projectedPlan[key];
    budget+= month.monthBudget || 0;
    var channels = month.plannedChannelBudgets || {};
    Object.keys(channels).forEach((channel) => {
      var title = schema.properties[channel].title
        .split('/')
        .map(item => item.trim());
      var obj = {};
      _.merge(returnObj, parseMonth(title, channels[channel], index, returnObj, sum["__TOTAL__"], channel, approvedBudgets ? approvedBudgets : new Array(projectedPlan.length).fill(null)));
    });
  });
  if (approvedBudgets) {
    approvedBudgets.forEach((channels, month) => {
      if (channels) {
        Object.keys(channels).forEach((channel) => {
          if (channel != '_id') {
            var title = schema.properties[channel].title
              .split('/')
              .map(item => item.trim());
            parseActuals(title, returnObj, channels[channel], channel, month, projectedPlan.length);
          }
        });
      }
    });
  }
  fillZeros(returnObj, approvedBudgets ? approvedBudgets : new Array(projectedPlan.length).fill(null), projectedPlan.length);
  if (unknownChannels && unknownChannels.length > 0) {
    parseUnknownChannels(returnObj, unknownChannels, projectedPlan.length, sum["__TOTAL__"]);
  }
  _.merge(returnObj, sum);
  var retJson = {};
  retJson[budget] = returnObj;
  return retJson;
}

function parseMonth(title, budget, month, current, sum, channel, approvedBudgets){
  if (title.length == 1) {
    sum.values[month] += budget;
    if (current && current[title[0]]){
      for(var i=current[title[0]].values.length; i< month ; i++){
        current[title[0]].values.push(0);
        current[title[0]].approvedValues[i] = approvedBudgets[i] && approvedBudgets[i][channel];
      }
      current[title[0]].values.push(budget);
      current[title[0]].approvedValues[month] = approvedBudgets[month] && approvedBudgets[month][channel];
      return {};
    }
    else {
      var obj = {};
      obj[title[0]] = { values : [] };
      obj[title[0]].approvedValues = new Array(approvedBudgets.length).fill(null);
      for (var i = 0; i < month; i++) {
        obj[title[0]].values.push(0);
        obj[title[0]].approvedValues[i] = approvedBudgets[i] && approvedBudgets[i][channel];
      }
      obj[title[0]].values.push(budget);
      obj[title[0]].icon = "plan:" + title[0];
      obj[title[0]].channel = channel;
      obj[title[0]].info = channelDescriptions[channel];
      obj[title[0]].approvedValues[month] = approvedBudgets[month] && approvedBudgets[month][channel];
      return obj;
    }
  }
  else {
    if (current && current[title[0]]) {
      if (current[title[0]].values[month] != null){
        current[title[0]].values[month]+= budget;
      }
      else {
        for(var i=current[title[0]].values.length; i< month ; i++){
          current[title[0]].values.push(0);
        }
        current[title[0]].values.push(budget);
      }
      var obj = {};
      obj[title[0]] = {children: parseMonth(title.splice(1, title.length - 1), budget, month, current ? (current[title[0]] ? current[title[0]].children : undefined) : undefined, sum, channel, approvedBudgets)};
      return obj;
    }
    else {
      var obj = {};
      obj[title[0]] = {values: [], children: parseMonth(title.splice(1, title.length - 1), budget, month, current ? (current[title[0]] ? current[title[0]].children : undefined) : undefined, sum, channel, approvedBudgets)};
      for (var i = 0; i < month; i++) {
        obj[title[0]].values.push(0);
      }
      obj[title[0]].values.push(budget);
      obj[title[0]].icon = "plan:" + title[0];
      obj[title[0]].disabled= true;
      return obj;
    }

  }
}

function fillZeros(json, approvedBudgets, length){
  Object.keys(json).forEach((key) => {
    if (json[key].values) {
      if (json[key].values.length < length) {
        for (var i = 0; i < length; i++) {
          if (json[key].values[i] === undefined) {
            json[key].values.push(0);
            if (json[key].channel) {
              json[key].approvedValues[i] = approvedBudgets[i] && approvedBudgets[i][json[key].channel];
            }
          }
        }
      }
    }
    if (json[key].children) {
      fillZeros(json[key].children, approvedBudgets, length);
    }
  })
}

function parseActuals(title, current, actualBudget, channel, month, length) {
  if (title.length == 1) {
    if (!current[title[0]]) {
      current[title[0]] = {};
      current[title[0]].values = new Array(length).fill(0);
      current[title[0]].icon = "plan:" + title[0];
      current[title[0]].channel = channel;
      current[title[0]].approvedValues = new Array(length).fill(0);
      current[title[0]].approvedValues[month] = actualBudget;
    }
    else {
      current[title[0]].approvedValues[month] = actualBudget;
    }
  }
  else {
    if (current && current[title[0]]) {
      return parseActuals(title.splice(1, title.length - 1), current ? (current[title[0]] ? current[title[0]].children : undefined) : undefined, actualBudget, channel, month, length);
    }
    else {
      current[title[0]] = {};
      current[title[0]] = {children: parseActuals(title.splice(1, title.length - 1), current[title[0]], actualBudget, channel, month, length)};
      current[title[0]].values = new Array(length).fill(0);
      current[title[0]].icon = "plan:" + title[0];
      current[title[0]].disabled= true;
    }
  }
  return current;
}

function parseUnknownChannels(returnObj, unknownChannels, length, sum) {
  const otherChannels = "~Other";
  unknownChannels.forEach((channels, index) => {
    if (channels && Object.keys(channels).length > 0) {
      if (!returnObj[otherChannels]) {
        returnObj[otherChannels] = {};
        returnObj[otherChannels].children = {};
        returnObj[otherChannels].values = new Array(length).fill(0);
        returnObj[otherChannels].icon = "plan:other";
      }
      Object.keys(channels).forEach(channel => {
        if (channel) {
          if (!returnObj[otherChannels].children[channel]) {
            returnObj[otherChannels].children[channel] = {};
            returnObj[otherChannels].children[channel].values = new Array(length).fill(0);
            returnObj[otherChannels].children[channel].channel = channel;
            returnObj[otherChannels].children[channel].icon = "plan:other";
          }
          returnObj[otherChannels].children[channel].values[index] = channels[channel];
          returnObj[otherChannels].values[index] += channels[channel];
          sum.values[index] += channels[channel];
        }
      });
    }
  });
}