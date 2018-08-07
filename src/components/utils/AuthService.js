import auth0 from 'auth0-js';
import history from 'history';
import config from 'components/utils/Configuration';

const options = {
  responseType: 'token',
  clientID: config.authClientId,
  domain: config.authDomain,
  redirectUri: window.location.origin,
  scope: 'openid profile'
};

const webAuth = new auth0.WebAuth(options);
let userProfile = {};

export function handleAuthentication() {
  webAuth.parseHash({hash: window.location.hash.slice(1, window.location.hash.length - 10)}, function (err, authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      setSession(authResult);
      history.push('/');
    } else if (err) {
      // navigate to the home route
      history.push('/');
      console.log(err);
    }
  });
}

function setSession(authResult) {
  // Set the time that the access token will expire at
  let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
  localStorage.setItem('access_token', authResult.accessToken);
  localStorage.setItem('id_token', authResult.idToken);
  localStorage.setItem('expires_at', expiresAt);
  // navigate to the home route
  history.push('/');
}

export function login() {
  webAuth.authorize();
}

export function getToken() {
  // Retrieves the user token from local storage
  return localStorage.getItem('id_token');
}

export function isAuthenticated() {
  // Check whether the current time is past the
  // access token's expiry time
  let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  return new Date().getTime() < expiresAt;
}

export function logout() {
  // Clear access token and ID token from local storage
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('expires_at');
  // navigate to the home route
  history.push('/');
}

function getAccessToken() {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No Access Token found');
  }
  return accessToken;
}

export function getProfile(cb) {
  if (userProfile && Object.keys(userProfile).length > 0) {
    if (cb) {
      cb(null, userProfile);
    }
  }
  else {
    let accessToken = getAccessToken();
    webAuth.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        userProfile = profile;
      }
      if (cb) {
        cb(err, profile);
      }
    });
  }
}

export function getProfileSync() {
  if (userProfile) {
    return userProfile;
  }
  return null;
}