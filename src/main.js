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
import Attribution from './components/pages/Attribution';
import Users from './components/pages/Users';
import Insights from './components/pages/Insights';
import Trustability from './components/pages/Trustability';
// import Index from './components/pages/Index';
import Plan from './components/pages/Plan';
import AuthService from './components/utils/AuthService'
import App from './components/App';
import PlannedVsActual from './components/pages/PlannedVsActual';
import style from 'styles/global/main.css';
import AnalyzePage from './components/pages/AnalyzePage';

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
      <Route path="/settings" component={ Welcome } onEnter={ requireAdminAuth }/>
      <Route path="/plan" component={ Plan } onEnter={ requireAdminAuth }/>
      <Route path="/campaigns" component={ Campaigns } onEnter={ requireAuth }/>
      <Route path="/attribution" component={ Attribution } onEnter={ requireAuth }/>
      <Route path="/audiences" component={ Users } onEnter={ requireAdminAuth }/>
      <Route path="/analyze" component={ AnalyzePage } onEnter={ requireAdminAuth }/>
      <Route path="/insights" component={ Insights } onEnter={ requireAdminAuth }/>
      <Route path="/trustability" component={ Trustability } onEnter={ requireAdminAuth }/>
      <Route path="/planned-vs-actual" component={ PlannedVsActual } onEnter={ requireAdminAuth }/>
    </Route>
  </Router>,
  // <Profile />,
  document.querySelector('#main')
);