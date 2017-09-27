import channelsSchema from 'data/channelsSchema';

export function formatChannels() {
  let returnObject = [];
  Object.keys(channelsSchema.properties).forEach(channel => {
    const titles = channelsSchema.properties[channel].title.split('/').map(item => item.trim());
    const nickname = channelsSchema.properties[channel].nickname;
    breakTitles(titles, returnObject, nickname);
  });
  return returnObject;
}

function breakTitles(titles, returnObject, nickname) {
  if (titles.length === 1) {
    returnObject.push({label: titles[0], value: nickname});
    return returnObject;
  }
  const isExists = returnObject.find(item => item.label === titles[0]);
  const title = titles.splice(0, 1);
  // Already exists
    if (isExists) {
      breakTitles(titles, isExists.options, nickname);
    }
    else {
      returnObject.push({label: title[0], options: breakTitles(titles, [], nickname)});
      return returnObject;
    }
}