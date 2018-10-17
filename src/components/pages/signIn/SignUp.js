import React from 'react';
import Component from 'components/Component';
import SignInForm from 'components/pages/signIn/SignInForm';
import {signup} from 'components/utils/AuthService';

export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      acceptedTerms: false
    };
  }

  checkboxChanged = (index) => {
    if (index === 0) {
      this.setState({
        acceptedTerms: !this.state.acceptedTerms
      });
    }
    ;
  };

  render() {
    return <SignInForm title='Create an account with InfiniGrow'
                       subTitle="Join the leading B2B SaaS marketing organizations already using InfiniGrow to hit their KPIs."
                       buttonAction={(...parameters) => signup(...parameters, (error) => {
                         if (error) {
                           alert(error.description);
                         }
                         else {
                           alert('User created successfuly!');
                         }
                       })}
                       buttonText='Create Account'
                       checkboxes={
                         [
                           <div>Accept our <a href="http://infinigrow.com/terms/">Terms and
                             Privacy Policy</a>
                           </div>,
                           <div>Request a demo</div>
                         ]}
                       checkboxChanged={this.checkboxChanged}
                       buttonDisabled={!this.state.acceptedTerms}
    />;
  }
}