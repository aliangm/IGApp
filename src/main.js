import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import history from 'history';

import Dashboard from './components/pages/Dashboard';
import Profile from './components/pages/Profile';
import Welcome from './components/pages/Welcome';
import Preferences from './components/pages/Preferences';
import TargetAudience from './components/pages/TargetAudience';
import Indicators from './components/pages/Indicators';
import Manual from './components/pages/Manual';
import SignIn from './components/pages/SignIn';
import Campaigns from './components/pages/Campaigns';
// import Index from './components/pages/Index';
import Plan from './components/pages/Plan';
import PlannedVsActual from './components/pages/PlannedVsActual';
import AuthService from './components/utils/AuthService'
import App from './components/App';

import style from 'styles/global/main.css';

style.use();
const auth = new AuthService();

// validate authentication for private routes
const requireAdminAuth = (nextState, replace) => {
  if (!auth.loggedIn() || !auth.getProfile().app_metadata || !auth.getProfile().app_metadata.isAdmin) {
    auth.logout();
    replace({ pathname: '/' })
  }
};

// validate authentication for private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/' })
  }
};

ReactDOM.render(
  <Router history={ history }>
    <Route path="/" component={ SignIn } />
    <Route component={ App } auth={ auth } onEnter={ requireAuth }>
      <Route path="/dashboard" component={ Dashboard } onEnter={ requireAdminAuth }/>
      <Route path="/profile" component={ Profile } onEnter={ requireAdminAuth }/>
      <Route path="/preferences" component={ Preferences } onEnter={ requireAdminAuth }/>
      <Route path="/target-audience" component={ TargetAudience } onEnter={ requireAdminAuth }/>
      <Route path="/indicators" component={ Indicators } onEnter={ requireAdminAuth }/>
      <Route path="/manual" component={ Manual } onEnter={ requireAdminAuth }/>
      <Route path="/welcome" component={ Welcome } onEnter={ requireAdminAuth }/>
      <Route path="/plan" component={ Plan } onEnter={ requireAdminAuth }/>
      <Route path="/planned-vs-actual" component={ PlannedVsActual } onEnter={ requireAdminAuth }/>
      <Route path="/campaigns" component={ Campaigns } onEnter={ requireAuth }/>
    </Route>
  </Router>,
  // <Profile />,
  document.querySelector('#main')
);