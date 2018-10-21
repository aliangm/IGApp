import React from 'react';
import Component from 'components/Component';
import SignInForm from 'components/pages/signIn/SignInForm';
import {passwordReset} from 'components/utils/AuthService';
import history from 'history';

export default class ForgotPassword extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: ''
    };
  }

  inputValueChanged = (key, value) => {
    const state = {...state};
    state[key] = value;
    this.setState(state);
  };

  render() {

    return <div>
      <SignInForm title='Welcome back!'
                  subTitle={<div>Don't have an account? <a href="/signup">Sign Up</a></div>}
                  buttonAction={() => passwordReset(this.state.email, (error) => {
                    if (error) {
                      alert(error.description);
                    }
                    else {
                      history.push('/login');
                    }
                  })}
                  buttonText='Send Me A New Password'
                  buttonDisabled={false}
                  inputValueChanged={this.inputValueChanged}
                  inputs={[
                    {
                      label: 'Work email',
                      key: 'email',
                      placeHolder: 'Email',
                      type: 'type',
                      value: this.state.email
                    }
                  ]}
                  bottomComponent={
                    <div onClick={() => history.push('/login')}>Actually, I remember my password now.</div>
                  }
      />
    </div>;
  }
}