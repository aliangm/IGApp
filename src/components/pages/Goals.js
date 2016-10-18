import React from 'react';

import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Calendar from 'components/controls/Calendar';
import Label from 'components/ControlsLabel';
import Notice from 'components/Notice';
import MultiRow from 'components/MultiRow';

import Title from 'components/onboarding/Title';
import ProfileProgress from 'components/pages/profile/Progress';
import ProfileInsights from 'components/pages/profile/Insights';
import BackButton from 'components/pages/profile/BackButton';
import NextButton from 'components/pages/profile/NextButton';
import ButtonsSet from 'components/pages/profile/ButtonsSet';
import NotSure from 'components/onboarding/NotSure';

import style from 'styles/onboarding/onboarding.css';
import goalsStyle from 'styles/goals/goals.css';

import { isPopupMode } from 'modules/popup-mode';
import history from 'history';

export default class Goals extends Component {
  style = style
  styles = [goalsStyle]

  render() {
    const selects = {
      plan: {
        label: 'Plan Resolution',
        select: {
          name: 'plan',
          onChange: () => {},
          options: [
            { val: 'days', label: 'Days' },
            { val: 'months', label: 'Months' },
            { val: 'years', label: 'Years' }
          ]
        }
      },
      primary_goal: {
        label: 'Primary Goal',
        select: {
          name: 'primary_goal',
          onChange: () => {},
          options: [
            { val: 'Sales (Long Term)', label: 'Sales (Long Term)' },
            { val: 'Sales (Short Term)', label: 'Sales (Short Term)' },
            { val: 'Reputation', label: 'Reputation' },
            { val: 'Marketing ROI', label: 'Marketing ROI' },
            { val: 'Market Share', label: 'Market Share' },
            { val: 'Awareness', label: 'Awareness' },
            { val: 'Customer Value', label: 'Customer Value' },
            { val: 'recommend', label: 'InfiniGrow Recommended' }
          ]
        }
      },
      secondary_goal: {
        label: 'Secondary Goal',
        select: {
          name: 'secondary_goal',
          onChange: () => {},
          options: [
            { val: 'Sales (Long Term)', label: 'Sales (Long Term)' },
            { val: 'Sales (Short Term)', label: 'Sales (Short Term)' },
            { val: 'Reputation', label: 'Reputation' },
            { val: 'Marketing ROI', label: 'Marketing ROI' },
            { val: 'Market Share', label: 'Market Share' },
            { val: 'Awareness', label: 'Awareness' },
            { val: 'Customer Value', label: 'Customer Value' },
            { val: 'recommend', label: 'InfiniGrow Recommended' }
          ]
        }
      }
    };

    const flatChannels = [];
    const channels = [
      {
        name: 'Advertising',
        children: [
          { name: 'Search', children: [
            { name: 'Google Adwords' },
            { name: 'Others' },
          ] },
          { name: 'Display', children: [
            { name: 'Google Adwords' },
            { name: 'Others' },
          ] },
          { name: 'Facebook Ads' },
          { name: 'Twitter Ads' },
          { name: 'LinkedIn Ads' },
          { name: 'Magazines', children: [
            { name: 'Consumers', children: [
              { name: 'Local' },
              { name: 'Nationwide' },
              { name: 'International' },
            ] },
            { name: 'Professional' },
          ] },
          { name: 'Newspapers', children: [
            { name: 'Local' },
            { name: 'Nationwide' },
            { name: 'International' },
          ] },
          { name: 'TV', children: [
            { name: 'Local' },
            { name: 'Nationwide' },
            { name: 'International' },
          ] },
          { name: 'Video', children: [
            { name: 'YouTube' },
            { name: 'Others' },
          ] },
          { name: 'Radio' },
          { name: 'SMS' },
          { name: 'Billboards' },
        ]
      },
      { name: 'Affiliate Program' },
      { name: 'Content Promotion', children: [
        { name: 'Blog', children: [
          { name: 'On Website' },
          { name: 'Guest' },
        ] },
        { name: 'Outbrain' },
        { name: 'Taboola' },
        { name: 'Forums' },
        { name: 'EBooks' },
      ] },
      { name: 'Social', children: [
        { name: 'Facebook' },
        { name: 'LinkedIn' },
        { name: 'Twitter' },
        { name: 'Instagram' },
        { name: 'Pinterest' },
        { name: 'Snapchat' },
        { name: 'Google+' },
      ] },
      { name: 'Email Marketing', children: [
        { name: 'Marketing Automation' },
        { name: 'Others' },
      ] },
      { name: 'Public Relations', children: [
        { name: 'Local' },
        { name: 'Nationwide' },
        { name: 'International' },
      ] },
      { name: 'Telemarketing' },
      { name: 'Events', children: [
        { name: 'Exhibitions' },
        { name: 'Conferences' },
      ] },
      { name: 'Mobile', children: [
        { name: 'in-game Ads' },
        { name: 'Apps' },
      ] },
      { name: 'Influencers' },
      { name: 'Collateral', children: [
        { name: 'Loyalty Card' },
        { name: 'Brochures' },
      ] },
      { name: 'Referral Programs' },
      { name: 'Website', children: [
        { name: 'Landing Pages' },
        { name: 'SEO' },
        { name: 'SEM' },
      ] },
      { name: 'Reviews' },
      { name: 'Celebrity Endorsements' },
      { name: 'Sponsorships' },
      { name: 'Popup Stores' },
      { name: 'Use Cases' },
    ].forEach((channel) => {
      mapChannel(channel, 0);
    });

    function mapChannel(channel, indent) {
      flatChannels.push({
        label: channel.name,
        indent: indent
      });

      if (channel.children) {
        channel.children.forEach((channel) => {
          mapChannel(channel, indent + 1);
        });
      }
    }

    return <div>
      <Header />
      <Sidebar />
      <Page popup={ isPopupMode() }>
        <Title title="Goals" subTitle="Tell us your goals and constrains. Different objectives dictate different strategies" />
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <div className={ this.classes.row } style={{
              width: '258px'
            }}>
              <Label question>Start Date</Label>
              <Calendar />
            </div>
            <div className={ this.classes.row }>
              <Label question>Plan Annual Budget ($)</Label>
              <div className={ this.classes.cell }>
                <Textfield defaultValue="$" style={{
                  width: '166px'
                }} />
                <NotSure style={{
                  marginLeft: '10px'
                }} />
              </div>
            </div>
            <div className={ this.classes.row } style={{
              // maxWidth: '440px',
              // minWidth: '200px',
              width: '258px'
            }}>
              <Select { ... selects.plan } />
            </div>
            <div className={ this.classes.row } style={{
              // maxWidth: '440px',
              // minWidth: '200px',
              width: '258px'
            }}>
              <Select { ... selects.primary_goal } />
            </div>
            <div className={ this.classes.row } style={{
              // maxWidth: '440px',
              // minWidth: '200px',
              width: '258px'
            }}>
              <Select { ... selects.secondary_goal } />
            </div>
            <div className={ this.classes.row } style={{
              
            }}>
              <h3 style={{
                marginBottom: '0'
              }}>Blocked Channels</h3>
              <Notice warning style={{
                margin: '12px 0'
              }}>
                * Please notice that adding channel constrains is limiting the ideal plan creation
              </Notice>
              <MultiRow>
                {({ index, data, update, removeButton }) => {
                  return <div style={{
                    width: '292px'
                  }} className={ goalsStyle.locals.channelsRow }>
                    <Select
                      className={ goalsStyle.locals.channelsSelect }
                      selected={ data && data.selected }
                      select={{
                        menuTop: true,
                        name: 'channels',
                        onChange: (selected) => {
                          update({
                            selected: selected
                          });
                        },
                        options: flatChannels
                      }}
                      label={ `#${ index + 1 } (optional)` }
                    />
                    <div className={ goalsStyle.locals.channelsRemove }>
                      { removeButton }
                    </div>
                  </div>
                }}
              </MultiRow>
            </div>
          </div>

          { isPopupMode() ?

          <div className={ this.classes.colRight }>
            <div className={ this.classes.row }>
              <ProfileProgress progress={ 61 } image={
                require('assets/flower/3.png')
              }
          text="Show me some leafs"/>
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
            history.push('/target-audience');
          }} />
          <div style={{ width: '30px' }} />
          <NextButton onClick={() => {
            history.push('/manual');
          }} />
        </div>

        : null }
      </Page>
    </div>
  }
}