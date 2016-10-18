import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import history from 'history';

import Profile from './components/pages/Profile';
import Welcome from './components/pages/Welcome';
import Goals from './components/pages/Goals';
import TargetAudience from './components/pages/TargetAudience';
import Indicators from './components/pages/Indicators';
import Manual from './components/pages/Manual';
import SignIn from './components/pages/SignIn';
// import Index from './components/pages/Index';
import Plan from './components/pages/Plan';

import style from 'styles/global/main.css';

style.use();

ReactDOM.render(
  <Router history={ history }>
    <Route path="/profile" component={ Profile } />
    <Route path="/goals" component={ Goals } />
    <Route path="/target-audience" component={ TargetAudience } />
    <Route path="/indicators" component={ Indicators } />
    <Route path="/manual" component={ Manual } />
    <Route path="/welcome" component={ Welcome } />
    <Route path="/plan" component={ Plan } />
    <Route path="/" component={ SignIn } />
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