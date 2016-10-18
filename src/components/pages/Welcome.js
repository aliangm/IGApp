import React from 'react';

import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';
import BackButton from 'components/pages/profile/BackButton';
import NextButton from 'components/pages/profile/NextButton';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Button from 'components/controls/Button';
import Label from 'components/ControlsLabel';

import Title from 'components/onboarding/Title';

import style from 'styles/onboarding/onboarding.css';
import welcomeStyle from 'styles/welcome/welcome.css';

import { isPopupMode } from 'modules/popup-mode';
import history from 'history';

export default class Welcome extends Component {
  style = style;
  styles = [welcomeStyle]

  render() {
    const selects = {
      role: {
        label: 'Your role',
        labelQuestion: false,
        select: {
          menuTop: true,
          name: 'role',
          onChange: () => {},
          options: [
            { label: 'CMO' },
            { label: 'CEO' },
            { label: 'VP Marketing' },
            { label: 'CRO' },
            { label: 'Marketing Manager' },
            { label: 'Marketer' },
          ]
        }
      }
    };

    return <div>
      <Header user={ false } />
      <Sidebar />
      <Page popup={ isPopupMode() }>
        <Title title="Welcome! Let's get you started" subTitle="We are looking to better understand who you are so that we can adjust our recommendations to fit you" vertical />

        <div className={ this.classes.cols }>
          <div className={ this.classes.colCenter }>
            <div className={ this.classes.row }>
              <Label>Enter your brand/company name</Label>
              <Textfield defaultValue="" />
            </div>
            <div className={ this.classes.row }>
              <Label>Your website</Label>
              <Textfield defaultValue="http://" />
            </div>
            <div className={ this.classes.row }>
              <Label>Enter your name</Label>
              <Textfield defaultValue="" />
            </div>
            <div className={ this.classes.row }>
              <div className={ welcomeStyle.locals.logoCell }>
                <Select { ... selects.role } className={ welcomeStyle.locals.select } />
                <div className={ welcomeStyle.locals.logoWrap }>
                  <Label>Logo</Label>
                  <div className={ welcomeStyle.locals.logo }></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          height: '300px'
        }} />

        { isPopupMode() ?

        <div className={ this.classes.footerCols }>
          <div className={ this.classes.footerLeft }>
            <Button type="normal" style={{
              letterSpacing: '0.075',
              width: '150px'
            }} onClick={() => {
              history.push('/profile');
            }}>Skip this step</Button>
          </div>
          <div className={ this.classes.footerRight }>
            <BackButton onClick={() => {
              history.push('/sign-in');
            }} />
            <div style={{ width: '30px' }} />
            <NextButton onClick={() => {
              history.push('/profile');
            }} />
          </div>
        </div>

        : null }
      </Page>
    </div>
  }
}