import React from 'react';
import Component from 'components/Component';
import SignInForm from 'components/pages/signIn/SignInForm';
import {newLogin} from 'components/utils/AuthService';

export default class Login extends Component {

  render() {
    return <SignInForm title='Welcome back!'
                       subTitle={<div>Don't have an account? <a href="/signup">Sign Up</a></div>}
                       buttonAction={(...parameters) => newLogin(...parameters)}
                       buttonText='Sign in'
                       buttonDisabled={false}
                       checkboxes={
                         [
                           <div>Remember me</div>
                         ]}
    />;
  }
}