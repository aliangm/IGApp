import React from 'react';
import Component from 'components/Component';
import SignInForm from 'components/pages/signIn/SignInForm';
import {signup} from 'components/utils/AuthService';

export default class Login extends Component {

  render() {
    return <SignInForm title='Create an account with InfiniGrow'
                       subTitle="Join the leading B2B SaaS marketing organizations already using InfiniGrow to hit their KPIs."
                       buttonAction={(...parameters) => signup(...parameters)}
                       buttonText='Create Account'
    />;
  }
}