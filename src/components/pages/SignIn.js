import React from 'react';

import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Button from 'components/controls/Button';
import Label from 'components/ControlsLabel';

import Title from 'components/onboarding/Title';

import onboardingStyle from 'styles/onboarding/onboarding.css';
import tagsStyle from 'styles/tags.css';
import style from 'styles/signin/signin.css';

import history from 'history';

export default class SignIn extends Component {
  style = style
  styles = [onboardingStyle, tagsStyle]

  state = {
    login: true
  }

  render() {
    return <div>
      <Header user={ false } />
      <Page sidebar={ false } width="600px" centered>
        <Title title="InfiniGrow - Demo" />
        <div className={ this.classes.switchButtons }>
          <Button type={ this.state.login ? 'accent' : 'normal' } style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            width: '80px'
          }} onClick={() => {
            this.setState({
              login: true
            });
          }}>Log in</Button>
          <Button type={ this.state.login ? 'normal' : 'accent' } style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            width: '80px'
          }} onClick={() => {
            this.setState({
              login: false
            });
          }}>Sign up</Button>
        </div>
        <div className={ this.classes.item } hidden={ !this.state.login }>
          <h2>Log in</h2>

          <div className={ onboardingStyle.locals.row }>
            <div className={ this.classes.colsCell }>
              <Label className={ this.classes.textLabel }>E-mail / Username</Label>
              <Textfield defaultValue="" className={ this.classes.rightCol } />
            </div>
          </div>

          <div className={ onboardingStyle.locals.row }>
            <div className={ this.classes.colsCell }>
              <Label className={ this.classes.textLabel }>Password</Label>
              <Textfield type="password" defaultValue="" className={ this.classes.rightCol } />
            </div>
          </div>

          <div className={ onboardingStyle.locals.row }>
            <div className={ this.classes.colsCell }>
              <div className={ this.classes.leftCol }></div>
              <div className={ this.classes.rememberCol }>
                <label className={ this.classes.rememberMe }>
                  <input type="checkbox" onChange={() => {}} defaultChecked={ true } style={{
                    marginRight: '6px'
                  }} /> Remember me
                </label>
                <a className={ tagsStyle.locals.a } href="#">
                  Forgot Your Password?
                </a>
              </div>
            </div>
          </div>

          <div className={ onboardingStyle.locals.row }>
            <div className={ this.classes.colsCell }>
              <div className={ this.classes.leftCol }></div>
              <div className={ this.classes.enterCol }>
                <Button type="primary2" style={{
                  width: '100px'
                }} onClick={() => {
                  history.push('/welcome')
                }}>Log in</Button>
              </div>
            </div>
          </div>

          {/*<div className={ onboardingStyle.locals.row }>*/}
            <div className={ this.classes.delimiter } data-text="OR" />
            <Label>Log in using your account with</Label>
          {/*</div>*/}

          <div className={ onboardingStyle.locals.row }>
            <div className={ this.classes.socialLogin }>
              <Button
                className={ this.classes.linkedinButton }
                contClassName={ this.classes.socialButtonCont }
              >
                <div className={ this.classes.linkedinIcon } data-icon="signin:linkedin" />
                Sign in with LinkedIn
              </Button>
              <div style={{ width: '60px', height: '20px' }} />
              <Button
                className={ this.classes.googleButton }
                contClassName={ this.classes.socialButtonCont }
              >
                <div className={ this.classes.googleIcon } data-icon="signin:google" />
                Sign in with Google
              </Button>
            </div>
          </div>
        </div>
        <div className={ this.classes.item } hidden={ this.state.login }>
          <h2>Sign up</h2>

          <div className={ onboardingStyle.locals.row }>
            <div className={ this.classes.colsCell }>
              <Label className={ this.classes.textLabel }>E-mail</Label>
              <Textfield defaultValue="" className={ this.classes.rightCol } />
            </div>
          </div>

          <div className={ onboardingStyle.locals.row }>
            <div className={ this.classes.colsCell }>
              <Label className={ this.classes.textLabel }>Username</Label>
              <Textfield defaultValue="" className={ this.classes.rightCol } />
            </div>
          </div>

          <div className={ onboardingStyle.locals.row }>
            <div className={ this.classes.colsCell }>
              <Label className={ this.classes.textLabel }>Password</Label>
              <Textfield type="password" defaultValue="" className={ this.classes.rightCol } />
            </div>
          </div>

          <div className={ onboardingStyle.locals.row }>
            <div className={ this.classes.colsCell }>
              <div className={ this.classes.leftCol }></div>
              <div className={ this.classes.enterCol }>
                <Button type="primary2" style={{
                  width: '100px'
                }} onClick={() => {
                  history.push('/welcome')
                }}>Sign up</Button>
              </div>
            </div>
          </div>

          <div className={ this.classes.delimiter } data-text="OR" />
          <Label>Sign up using your account with</Label>

          <div className={ onboardingStyle.locals.row }>
            <div className={ this.classes.socialLogin }>
              <Button
                className={ this.classes.linkedinButton }
                contClassName={ this.classes.socialButtonCont }
              >
                <div className={ this.classes.linkedinIcon } data-icon="signin:linkedin" />
                Sign up with LinkedIn
              </Button>
              <div style={{ width: '60px', height: '20px' }} />
              <Button
                className={ this.classes.googleButton }
                contClassName={ this.classes.socialButtonCont }
              >
                <div className={ this.classes.googleIcon } data-icon="signin:google" />
                Sign up with Google
              </Button>
            </div>
          </div>
        </div>
      </Page>
    </div>
  }
}