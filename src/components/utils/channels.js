import uniq from 'lodash/uniq';

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

export function output() {
  const channels = schema.properties;
  const result = {
    root: {
      children: []
    }
  };

  result.root.children.push('other?');
  result['other?'] = {
    channelId: 'other?',
    level: 1,
    title: 'Other*',
    path: null,
    isLeaf: true,
    isOther: true,
    id: 'other?',
    minBudget: 0,
    children: null
  };


  Object.keys(channels).forEach((key) => {
    const channel = channels[key];
    const pathTitles = channel.title
      .split('/')
      .map(item => item.trim());
    const pathIds = pathTitles.map((item, index) => {
      return pathTitles.slice(0, index + 1)
        .map(it => it.toLowerCase())
        .join('_');
    });


    pathIds.forEach((id, index) => {
      if (index !== 0) {
        result[pathIds[index - 1]].children.push(id);
        result[pathIds[index - 1]].children.push(pathTitles[index -1] + '_other?');
      } else {
        result.root.children.push(id);
      }

      const isLeaf = index === pathIds.length - 1;

      if (!result[id]) {
        result[id] = {
          channelId: id,
          level: index + 1,
          title: pathTitles[index],
          path: isLeaf ? channel.title : null,
          isLeaf,
          id: isLeaf ? key : null,
          minBudget: isLeaf ? channel.minMonthBudget : 0,
          children: !isLeaf ? [] : null
        };
      }
      if (!result[pathTitles[index -1] + '_other?']) {
        const title = pathTitles.slice(1, index).reduce((a, b) => a + ' / ' + b, pathTitles[0]);
        result[pathTitles[index -1] + '_other?'] = {
          channelId: pathTitles[index -1] + '_other?',
          level: index + 1,
          title: "Other*",
          path: title,
          isLeaf: true,
          isOther: true,
          id: pathTitles[index -1] + '_other?',
          minBudget: 0,
          children: null
        };
      }
    });
  });

  Object.keys(result).forEach((key) => {
    const channel = result[key];

    if (channel.children) {
      channel.children = uniq(channel.children)
        .sort((a, b) => {
          const channelA = result[a];
          const channelB = result[b];

          if (!channelA.isLeaf || channelB.isLeaf) {
            return -1;
          }

          return 1;
        });
    }
  });

  return result;
}