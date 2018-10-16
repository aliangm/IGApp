import merge from 'lodash/merge';

const config = {
  default: {
    authClientId: 'En6sYxyCeCWBwHSORHGxVfBoNjWWp41c',
    authDomain: 'infinigrow-test.auth0.com',
    sendEvents: false,
    apiBaseURI: ':8443/'
  },
  "app.infinigrow.com": {
    authClientId: 'ZPLaIfv_lyA2N5PghXNjWSjah6aE1y9e',
    authDomain: 'infinigrow.auth0.com',
    sendEvents: true,
    apiBaseURI: '/api/'
  },
  "www.infiqa.com": {
    sendEvents: true,
    apiBaseURI: '/api/'
  }
};

module.exports = merge(config.default, config[window.location.hostname]);
