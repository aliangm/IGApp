import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import history from 'history';

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
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/' })
  }
}

ReactDOM.render(
  <Router history={ history }>
    <Route path="/" component={ SignIn } />
    <Route component={ App } auth={ auth } onEnter={ requireAuth }>
      <Route path="/profile" component={ Profile } onEnter={ requireAuth }/>
      <Route path="/preferences" component={ Preferences } onEnter={ requireAuth }/>
      <Route path="/target-audience" component={ TargetAudience } onEnter={ requireAuth }/>
      <Route path="/indicators" component={ Indicators } onEnter={ requireAuth }/>
      <Route path="/manual" component={ Manual } onEnter={ requireAuth }/>
      <Route path="/welcome" component={ Welcome } onEnter={ requireAuth }/>
      <Route path="/plan" component={ Plan } onEnter={ requireAuth }/>
      <Route path="/planned-vs-actual" component={ PlannedVsActual } onEnter={ requireAuth }/>
      <Route path="/campaigns" component={ Campaigns } onEnter={ requireAuth }/>
    </Route>
  </Router>,
  // <Profile />,
  document.querySelector('#main')
);

const runtime = require('offline-plugin/runtime');

runtime.install({
  onUpdating: () => {
    console.log('SW Event:', 'onUpdating');
  },
  onUpdateReady: () => {
    console.log('SW Event:', 'onUpdateReady');
    runtime.applyUpdate();
  },
  onUpdated: () => {
    console.log('SW Event:', 'onUpdated');
    window.location.reload();
  },

  onUpdateFailed: () => {
    console.log('SW Event:', 'onUpdateFailed');
  }
});