let schema = { properties: {} };
let isInitialized = false;

export function initialize(indicatorsSchema, userMapping) {
  schema = indicatorsSchema;
  if (userMapping) {
    Object.keys(userMapping).forEach(indicator => {
      schema.properties[indicator].title = userMapping[indicator].title;
      schema.properties[indicator].nickname = userMapping[indicator].nickname;
    });
  }
  isInitialized = true;
}

export function getTitle(indicator) {
  if (isInitialized) {
    return schema.properties[indicator].title;
  }
}

export function getNickname(indicator) {
  if (isInitialized) {
    return schema.properties[indicator].nickname;
  }
}

export function getIndicatorsWithNicknames() {
  if (isInitialized) {
    return Object.keys(schema.properties).map(item => {
      return {value: item, label: schema.properties[item].nickname}
    });
  }
}

export function getIndicatorsWithProps() {
  if (isInitialized) {
    return schema.properties;
  }
}