import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import history from 'history';
import CMO from 'components/pages/dashboard/CMO';
import Dashboard from './components/pages/Dashboard';
import Product from './components/pages/Product';
import Welcome from './components/pages/Welcome';
import Preferences from './components/pages/Preferences';
import TargetAudience from './components/pages/TargetAudience';
import Platforms from './components/pages/Platforms';
import TechnologyStack from './components/pages/TechnologyStack';
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
import Analyze from './components/pages/Analyze';
import Overview from 'components/pages/analyze/Overview';
import Content from 'components/pages/analyze/Content';
import Channels from 'components/pages/analyze/Channels';
import CampaignsMeasure from 'components/pages/analyze/Campaigns';
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
import Settings from 'components/pages/Settings';
import Profile from 'components/pages/Profile';

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
  <Router onUpdate={() => window.scrollTo(0, 0)} history={ history }>
    <Route path="/" component={ SignIn } />
    <Route component={ App } auth={ auth } onEnter={ requireAuth }>
      <Route component={ Dashboard } onEnter={ requireAdminAuth }>
        <Route path="/dashboard/CMO" component={ CMO } onEnter={ requireAdminAuth }/>
        <Route path="/dashboard/metrics" component={ Indicators } onEnter={ requireAdminAuth }/>
      </Route>
      <Route path="/profile/technology-stack" component={ TechnologyStack } onEnter={ requireAdminAuth }/>
      <Route path="/manual" component={ Manual } onEnter={ requireAdminAuth }/>
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
      <Route component={Settings} onEnter={requireAuth}>
        <Route path="/settings/account" component={ Welcome } onEnter={ requireAuth }/>
        <Route component={ Attribution } onEnter={ requireAuth }>
          <Route path="/settings/attribution/tracking-plan" component={ TrackingPlan } onEnter={ requireAuth }/>
          <Route path="/settings/attribution/setup" component={ Setup } onEnter={ requireAuth }/>
          <Route path="/settings/attribution/tracking-urls" component={ TrackingUrls } onEnter={ requireAuth }/>
          <Route path="/settings/attribution/offline" component={ Offline } onEnter={ requireAuth }/>
          <Route path="/settings/attribution/site-structure" component={ SiteStructure } onEnter={ requireAuth }/>
        </Route>
        <Route component={ Profile } onEnter={ requireAuth }>
          <Route path="/settings/profile/product" component={ Product } onEnter={ requireAdminAuth }/>
          <Route path="/settings/profile/preferences" component={ Preferences } onEnter={ requireAdminAuth }/>
          <Route path="/settings/profile/target-audience" component={ TargetAudience } onEnter={ requireAdminAuth }/>
          <Route path="/settings/profile/integrations" component={ Platforms } onEnter={ requireAdminAuth }/>
        </Route>
      </Route>
      <Route component={ Analyze } onEnter={ requireAdminAuth }>
        <Route path="/measure/analyze/overview" component={ Overview } onEnter={ requireAdminAuth }/>
        <Route path="/measure/analyze/channels" component={ Channels } onEnter={ requireAdminAuth }/>
        <Route path="/measure/analyze/campaigns" component={ CampaignsMeasure } onEnter={ requireAdminAuth }/>
        <Route path="/measure/analyze/content" component={ Content } onEnter={ requireAdminAuth }/>
        <Route path="/measure/analyze/audiences" component={ Users } onEnter={ requireAdminAuth }/>
      </Route>
      <Route path="/insights" component={ Insights } onEnter={ requireAdminAuth }/>
      <Route path="/trustability" component={ Trustability } onEnter={ requireAdminAuth }/>
      <Route path="/plan/planned-vs-actual" component={ PlannedVsActual } onEnter={ requireAdminAuth }/>
    </Route>
  </Router>,
  document.querySelector('#main')
);