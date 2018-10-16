import React from 'react';
import Component from 'components/Component';
import SignInForm from 'components/pages/signIn/SignInForm';
import {newLogin} from 'components/utils/AuthService';

export default class Login extends Component {

  render() {
    return <SignInForm title='Welcome back!'
                       subTitle="Don't have an account? Sign Up"
                       buttonAction={(...parameters) => newLogin(...parameters)}
                       buttonText='Sign in'

    />;
  }
}