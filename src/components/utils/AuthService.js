import Auth0Lock from 'auth0-lock'
import history from 'history';

export default class AuthService {
  constructor() {
    // Configure Auth0
    this.lock = new Auth0Lock('En6sYxyCeCWBwHSORHGxVfBoNjWWp41c', 'infinigrow-test.auth0.com', {
      auth: {
//        redirectUrl: 'http://localhost:7272/',
        responseType: 'token'
      },
      languageDictionary: {
        title: ''
      },
      autoclose: true,
      popupOptions: { width: '450px', height: '600px' },
      theme: {
        primaryColor: '#1165a3',
        logo: 'http://localhost:7272/icons/logo-on-white-bg.png'
      },
      socialButtonStyle: 'small'
    });
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this)
  }

  _doAuthentication(authResult) {
    // Saves the user token
    this.setToken(authResult.idToken);
    // navigate to the home route
    // history.push('/');
    // Async loads the user profile data
    /**
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error)
      } else {
        this.setProfile(profile)
      }
    })
     **/
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show()
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    return !!this.getToken()
  }

  setToken(idToken) {
    // Saves user token to local storage
    localStorage.setItem('id_token', idToken)
  }

  getToken() {
    // Retrieves the user token from local storage
    return localStorage.getItem('id_token')
  }
/**
  setProfile(profile) {
    // Saves profile data to local storage
    localStorage.setItem('profile', JSON.stringify(profile))
    // Triggers profile_updated event to update the UI
    // this.emit('profile_updated', profile)
  }

  getProfile() {
    // Retrieves the profile data from local storage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }
**/
  logout() {
    // Clear user token and profile data from local storage
    localStorage.removeItem('id_token');
    //localStorage.removeItem('profile');
  }
}