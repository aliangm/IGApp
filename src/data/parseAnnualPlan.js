//import serverCommunication from './serverCommunication';

import schema from './channelsSchema';
import _ from 'lodash';

export function parseAnnualPlan(data) {
  var sum = {};
  var returnObj = {};
  sum["__TOTAL__"] = { values : [0,0,0,0,0,0,0,0,0,0,0,0] };
  var budget = 0;
  data.forEach((month)=> {
    //var month = data[key];
    budget+= month.monthBudget;
    var channels = month.plannedChannelBudgets;
    Object.keys(channels).forEach((channel) => {
      var title = schema.properties[channel].title
        .split('/')
        .map(item => item.trim());
      var obj = {};
      _.merge(returnObj, parseMonth(title, channels[channel], month.monthNumber, returnObj, sum["__TOTAL__"]));
    });
  });
  fillZeros(returnObj);
  _.merge(returnObj, sum);
  var retJson = {};
  retJson[budget] = returnObj;
  return retJson;
}

function parseMonth(title, budget, month, current, sum){
  if (title.length == 1) {
    sum.values[month] += budget;
    if (current && current[title[0]]){
      current[title[0]].values.push(budget);
      return {};
    }
    else {
      var obj = {};
      obj[title[0]] = { values : [] };
      for (var i = 0; i < month; i++) {
        obj[title[0]].values.push(0);
      }
      obj[title[0]].values.push(budget);
      obj[title[0]].icon = "plan:" + title[0];
      return obj;
    }
  }
  else {
    if (current && current[title[0]]) {
      if (current[title[0]].values[month]){
        current[title[0]].values[month]+= budget;
      }
      else {
        current[title[0]].values.push(budget);
      }
      var obj = {};
      obj[title[0]] = {children: parseMonth(title.splice(1, title.length - 1), budget, month, current ? (current[title[0]] ? current[title[0]].children : undefined) : undefined, sum)};
      return obj;
    }
    else {
      var obj = {};
      obj[title[0]] = {values: [], children: parseMonth(title.splice(1, title.length - 1), budget, month, current ? (current[title[0]] ? current[title[0]].children : undefined) : undefined, sum)};
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

function fillZeros(json, sum){
  Object.keys(json).forEach((key) => {
    if (json[key].values) {
      if (json[key].values.length < 12) {
        for (var i = 0; i < 12; i++) {
          if (json[key].values[i] === undefined) {
            json[key].values.push(0);
          }
        }
      }
    }
    if (json[key].children) {
      fillZeros(json[key].children, sum);
    }
  })
}