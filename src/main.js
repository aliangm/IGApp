import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import history from 'history';
import CMO from 'components/pages/dashboard/CMO';
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
import Plan from './components/pages/Plan';
import AuthService from './components/utils/AuthService'
import App from './components/App';
import PlannedVsActual from './components/pages/PlannedVsActual';
import style from 'styles/global/main.css';
import AnalyzePage from './components/pages/AnalyzePage';
import Analyze from 'components/pages/analyze/Analyze';
import Content from 'components/pages/analyze/Content';
import Setup from 'components/pages/attribution/Setup';
import TrackingPlan from 'components/pages/attribution/TrackingPlan';
import TrackingUrls from 'components/pages/attribution/TrackingUrls';
import Offline from 'components/pages/attribution/Offline';
import SiteStructure from 'components/pages/attribution/SiteStructure';
import CurrentTab from 'components/pages/plan/CurrentTab';
import ProjectionsTab from 'components/pages/plan/ProjectionsTab';
import AnnualTab from 'components/pages/plan/AnnualTab';
import ByChannelTab from 'components/pages/campaigns/ByChannelTab';
import ByStatusTab from 'components/pages/campaigns/ByStatusTab';
import IdeasTab from 'components/pages/campaigns/Ideas';
import OnlineTab from 'components/pages/campaigns/OnlineCampaigns';

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
      <Route component={ Dashboard } onEnter={ requireAdminAuth }>
        <Route path="/dashboard/CMO" component={ CMO } onEnter={ requireAdminAuth }/>
      </Route>
      <Route path="/profile/product" component={ Profile } onEnter={ requireAdminAuth }/>
      <Route path="/profile/preferences" component={ Preferences } onEnter={ requireAdminAuth }/>
      <Route path="/profile/target-audience" component={ TargetAudience } onEnter={ requireAdminAuth }/>
      <Route path="/profile/indicators" component={ Indicators } onEnter={ requireAdminAuth }/>
      <Route path="/manual" component={ Manual } onEnter={ requireAdminAuth }/>
      <Route path="/settings" component={ Welcome } onEnter={ requireAdminAuth }/>
      <Route component={ Plan } onEnter={ requireAdminAuth }>
        <Route path="/plan/plan/current" component={ CurrentTab } onEnter={ requireAdminAuth }/>
        <Route path="/plan/plan/annual" component={ AnnualTab } onEnter={ requireAdminAuth }/>
        <Route path="/plan/plan/projections" component={ ProjectionsTab } onEnter={ requireAdminAuth }/>
      </Route>
      <Route component={ Campaigns } onEnter={ requireAuth }>
        <Route path="/campaigns/by-channel" component={ ByChannelTab } onEnter={ requireAuth }/>
        <Route path="/campaigns/by-status" component={ ByStatusTab } onEnter={ requireAuth }/>
        <Route path="/campaigns/online-performance" component={ OnlineTab } onEnter={ requireAuth }/>
        <Route path="/campaigns/ideas" component={ IdeasTab } onEnter={ requireAuth }/>
      </Route>
      <Route component={ Attribution } onEnter={ requireAuth }>
        <Route path="/analyze/attribution/setup" component={ Setup } onEnter={ requireAuth }/>
        <Route path="/analyze/attribution/tracking-plan" component={ TrackingPlan } onEnter={ requireAuth }/>
        <Route path="/analyze/attribution/tracking-urls" component={ TrackingUrls } onEnter={ requireAuth }/>
        <Route path="/analyze/attribution/offline" component={ Offline } onEnter={ requireAuth }/>
        <Route path="/analyze/attribution/site-structure" component={ SiteStructure } onEnter={ requireAuth }/>
      </Route>
      <Route path="/analyze/audiences" component={ Users } onEnter={ requireAdminAuth }/>
      <Route component={ AnalyzePage } onEnter={ requireAdminAuth }>
        <Route path="/analyze/analyze/analyze" component={ Analyze } onEnter={ requireAdminAuth }/>
        <Route path="/analyze/analyze/content" component={ Content } onEnter={ requireAdminAuth }/>
      </Route>
      <Route path="/plan/insights" component={ Insights } onEnter={ requireAdminAuth }/>
      <Route path="/trustability" component={ Trustability } onEnter={ requireAdminAuth }/>
      <Route path="/plan/planned-vs-actual" component={ PlannedVsActual } onEnter={ requireAdminAuth }/>
    </Route>
  </Router>,
  document.querySelector('#main')
);