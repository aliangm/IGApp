let schema = { properties: {} };
let isInitialized = false;

export function initialize(channelsSchema, userMapping) {
  schema = channelsSchema;
  if (userMapping) {
    Object.keys(userMapping).forEach(channel => {
      schema.properties[channel].title = userMapping[channel].title;
      schema.properties[channel].nickname = userMapping[channel].nickname;
    });
  }
  isInitialized = true;
}

export function getTitle(channel) {
  if (isInitialized && channel) {
    return schema.properties[channel] && schema.properties[channel].title;
  }
  else {
    console.log(channel);
  }
}

export function getNickname(channel) {
  if (isInitialized && channel) {
    return schema.properties[channel].nickname;
  }
  else {
    console.log(channel);
  }
}

export function getChannelsWithTitles() {
  if (isInitialized) {
    return Object.keys(schema.properties).map(item => {
      return {value: item, label: schema.properties[item].title}
    });
  }
}

export function getChannelsWithProps() {
  if (isInitialized) {
    return schema.properties;
  }
}

export function formatChannels() {
  let returnObject = [];
  Object.keys(schema.properties).forEach(channel => {
    const titles = schema.properties[channel].title.split('/').map(item => item.trim());
    const nickname = schema.properties[channel].nickname;
    breakTitles(titles, returnObject, nickname, channel);
  });
  return returnObject;
}

function breakTitles(titles, returnObject, nickname, channel) {
  if (titles.length === 1) {
    returnObject.push({label: nickname, value: channel});
    return returnObject;
  }
  const isExists = returnObject.find(item => item.label === titles[0]);
  const title = titles.splice(0, 1);
  // Already exists
    if (isExists) {
      breakTitles(titles, isExists.options, nickname, channel);
    }
    else {
      returnObject.push({label: title[0], options: breakTitles(titles, [], nickname, channel)});
      return returnObject;
    }
}

export function formatFatherChannels() {
  let returnObject = [];
  Object.keys(schema.properties).forEach(channel => {
    const titles = schema.properties[channel].title.split('/').map(item => item.trim());
    breakFatherTitles(titles, returnObject);
  });
  return returnObject;
}

function breakFatherTitles(titles, returnObject, hierarchy) {
  if (titles.length === 1) {
    return returnObject;
  }
  const title = titles.splice(0, 1);
  const titleHierarchy = hierarchy ? hierarchy +' / ' + title[0] : title[0];
  const isExists = returnObject.find(item => item.label === titleHierarchy);
  // Already exists
  if (isExists) {
    breakFatherTitles(titles, returnObject, titleHierarchy);
  }
  else {
    returnObject.push({label: titleHierarchy, value: titleHierarchy});
    breakFatherTitles(titles, [], titleHierarchy);
    return returnObject;
  }
}