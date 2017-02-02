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
import serverCommunication from 'data/serverCommunication';
import { disablePopupMode } from 'modules/popup-mode';

export default class SignIn extends Component {
  style = style
  styles = [onboardingStyle, tagsStyle]
  passLength = 4
  /*
   state = {
   login: true
   }*/
  constructor(props) {
    super(props);
    this.state = { login: true };
    this.handleChange = this.handleChange.bind(this);
    this.checkUserAuthorization = this.checkUserAuthorization.bind(this);
  }

  handleChange(parameter, event){
    let update = {};
    update[parameter] = event.target.value;
    this.setState(update);
  }

  checkUserAuthorization(e) {
    e.preventDefault();
    let route = this.state.login ? 'login' : 'signup';
    var self = this;
    serverCommunication.serverRequest('POST', route, JSON.stringify({email: self.state.email, password: self.state.password }))
      .then((response) => {
        response.json()
          .then(function (data) {
            if (data){
              if (route == 'login'){
                disablePopupMode();
                history.push('/profile');
              }
              else {
                history.push('/welcome');
              }
            }
            else {
              if (route == 'login') {
                self.setState({isLoginError: !data});
                self.refs.loginEmailInput.focus();
              } 
              else {
                self.setState({isSignupError: !data});
                self.refs.signupEmailInput.focus();
              }
            }
          })
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    alert('nice');
  };

  render() {
    return <div>
      <Header user={ false } />
      <Page sidebar={ false } width="600px" centered>
        <Title title="InfiniGrow" />
        <div className={ this.classes.switchButtons }>
          <Button type={ this.state.login ? 'accent' : 'normal' } style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            width: '80px'
          }} onClick={() => {
            this.setState({
              login: true
            });
          }}>Login</Button>
          <Button type={ this.state.login ? 'normal' : 'accent' } style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            width: '80px'
          }} onClick={() => {
            this.setState({
              login: false
            });
          }}>Sign Up</Button>
        </div>
        <div className={ this.classes.item } hidden={ !this.state.login }>
          <form onSubmit={ this.checkUserAuthorization } >
            <h2>Login</h2>

            <div className={ onboardingStyle.locals.row }>
              <div className={ this.classes.colsCell }>
                <Label className={ this.classes.textLabel }>Email</Label>
                <Textfield type="email" required ref="loginEmailInput" defaultValue="" className={ this.classes.rightCol } onChange={ this.handleChange.bind(this, 'email')}/>
              </div>
            </div>

            <div className={ onboardingStyle.locals.row }>
              <div className={ this.classes.colsCell }>
                <Label className={ this.classes.textLabel }>Password</Label>
                <Textfield type="password" minLength={this.passLength} required defaultValue="" className={ this.classes.rightCol } onChange={ this.handleChange.bind(this, 'password')} />
              </div>
            </div>
            {/*
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
             */}
            <div className={ onboardingStyle.locals.row }>
              <div className={ this.classes.colsCell }>
                <div className={ this.classes.leftCol }></div>
                <div className={ this.classes.enterCol }>
                  {/** <Button type="primary2" style={{
                        width: '100px'
                      }} 	onClick={() => {
                        this.checkUserAuthorization('login');
                        //history.push('/welcome')
                      }}>Login</Button>**/}
                  <button className={ this.classes.primary2 } type="submit" >Login</button>
                  <label hidden={ !this.state.isLoginError} style={{ color: 'red' }}>Wrong email or password</label>
                </div>
              </div>
            </div>
            {/*
             <div className={ this.classes.delimiter } data-text="OR" />
             <Label>Log in using your account with</Label>

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
             */}
          </form>
        </div>
        <div className={ this.classes.item } hidden={ this.state.login }>
          <form onSubmit={ this.checkUserAuthorization } >
            <h2>Sign up</h2>

            <div className={ onboardingStyle.locals.row }>
              <div className={ this.classes.colsCell }>
                <Label className={ this.classes.textLabel }>Email</Label>
                <Textfield type="email" required ref="signupEmailInput" defaultValue="" className={ this.classes.rightCol } onChange={ this.handleChange.bind(this, 'email')} />
              </div>
            </div>
            {/*
             <div className={ onboardingStyle.locals.row }>
             <div className={ this.classes.colsCell }>
             <Label className={ this.classes.textLabel }>Username</Label>
             <Textfield defaultValue="" className={ this.classes.rightCol } />
             </div>
             </div>
             */}
            <div className={ onboardingStyle.locals.row }>
              <div className={ this.classes.colsCell }>
                <Label className={ this.classes.textLabel }>Password</Label>
                <Textfield type="password" minLength={this.passLength} required defaultValue="" className={ this.classes.rightCol } onChange={ this.handleChange.bind(this, 'password')} />
              </div>
            </div>

            <div className={ onboardingStyle.locals.row }>
              <div className={ this.classes.colsCell }>
                <div className={ this.classes.leftCol }></div>
                <div className={ this.classes.enterCol }>
                  {/**  <Button type="primary2" style={{
                      width: '100px'
                    }} onClick={() => {
                    this.checkUserAuthorization('signup');
              //history.push('/welcome')
                    }}>Sign up</Button> **/}
                  <button className={ this.classes.primary2 } type="submit" >Sign up</button>
                  <label hidden={ !this.state.isSignupError} style={{ color: 'red' }}>Email already exists</label>
                </div>
              </div>
            </div>
            {/*
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
             */}
          </form>
        </div>
      </Page>
    </div>
  }
}