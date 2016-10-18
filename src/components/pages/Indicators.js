import React from 'react';

import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Label from 'components/ControlsLabel';

import Title from 'components/onboarding/Title';
import ProfileProgress from 'components/pages/profile/Progress';
import ProfileInsights from 'components/pages/profile/Insights';
import BackButton from 'components/pages/profile/BackButton';
import PlanButton from 'components/pages/indicators/PlanButton';

import Item from 'components/pages/indicators/Item';

import style from 'styles/onboarding/onboarding.css';
import indiStyle from 'styles/indicators/indicators.css';

import { isPopupMode, disablePopupMode } from 'modules/popup-mode';
import history from 'history';

export default class Indicators extends Component {
  style = style;
  styles = [indiStyle];

  render() {
    return <div>
      <Header />
      <Sidebar />
      <Page popup={ isPopupMode() }>
        <Title title="Indicators" subTitle="Marketing is great, but without measuring the impact on your metrics, there is no real point in it. Automatic permissions are recommended in order to get full real-time optimization" />
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:facebook" title="Facebook Likes" />
              <Item icon="indicator:twitter" title="Twitter Followers" />
              <Item icon="indicator:pinterest" title="Pinterest Followers" />
              <Item icon="indicator:linkedin" title="LinkedIn Followers" />
              <Item icon="indicator:snapchat" title="Snapchat Views" />
              <Item icon="indicator:instagram" title="Instagram Followers" />
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:cac" title="Customer acquisition cost" />
              <Item icon="indicator:ltv" title="Life time value" />
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:lead" title="Leads" />
              <Item icon="indicator:downloads" title="Downloads" />
              <Item icon="indicator:sales" title="Sales" />
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:alexa-rank" title="Alexa Rank" />
              <Item icon="indicator:google-rank" title="Google Rank" />
              <Item icon="indicator:mentions" title="Mentions" />
              <Item icon="indicator:engagement" title="Engagement" />
            </div>
            <div className={ indiStyle.locals.row }>
              <Item icon="indicator:users" title="Users" />
              <Item icon="indicator:new-users" title="New Users" />
              <Item icon="indicator:active-users" title="Active Users" />
            </div>
          </div>

          { isPopupMode() ?

          <div className={ this.classes.colRight }>
            <div className={ this.classes.row }>
              <ProfileProgress progress={ 101 } image={
                require('assets/flower/5.png')
              }
              text="Seems you got some new super powers. Now the journey for GROWTH really begins!"/>
            </div>
            <div className={ this.classes.row }>
              <ProfileInsights />
            </div>
          </div>

          : null }
        </div>

        { isPopupMode() ?

        <div className={ this.classes.footer }>
          <BackButton onClick={() => {
            history.push('/manual');
          }} />
          <div style={{ width: '30px' }} />
          <PlanButton onClick={() => {
            disablePopupMode();
            history.push('/plan');
          }} />
        </div>

        : null }
      </Page>
    </div>
  }
}