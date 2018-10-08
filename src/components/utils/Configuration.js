import merge from 'lodash/merge';

const config = {
  default: {
    authClientId: 'En6sYxyCeCWBwHSORHGxVfBoNjWWp41c',
    authDomain: 'infinigrow-test.auth0.com',
    port: 8443,
    mixpanelKey: '6582a6509ab1035b0a461098560913e8',
    isProd: false,
    sendEvents: false
  },
  "app.infinigrow.com": {
    authClientId: 'ZPLaIfv_lyA2N5PghXNjWSjah6aE1y9e',
    authDomain: 'infinigrow.auth0.com',
    mixpanelKey: '6582a6509ab1035b0a461098560913e8',
    isProd: true,
    sendEvents: true
  },
  "www.infiqa.com": {
    sendEvents: true
  }
};

module.exports = merge(config.default, config[window.location.hostname]);
