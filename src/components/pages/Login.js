import React from 'react';
import Component from 'components/Component';
import {newLogin} from 'components/utils/AuthService';
import Button from 'components/controls/Button';
import style from 'styles/login/login.css';

export default class Login extends Component {

  style = style;

  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null
    };

  }

  render() {
    return <div className={this.classes.page}>
      <div className={this.classes.title}>Welcome back!</div>
      <div className={this.classes.subTitle}>Don't have an account? Sign Up</div>
      <div className={this.classes.loginWrapper}>
        <div className={this.classes.inputField}>
          <div className={this.classes.inputLabel}>Work email</div>
          <input className={this.classes.input}
                 type='email'
                 onChange={(e) => this.setState({email: e.target.value})}
                 placeholder='Email'
          />
        </div>
        <div className={this.classes.inputField}>
          <div className={this.classes.inputLabel}>Password</div>
          <input className={this.classes.input}
                 type='password'
                 onChange={(e) => this.setState({password: e.target.value})}
                 placeholder='Password'
          />
        </div>
        <div>
        </div>
        <Button style={{width: 'min-content'}} type='primary'
                onClick={() => newLogin(this.state.email, this.state.password, (result) => {
                  console.log(result);
                })}>
          Sign in
        </Button>
      </div>
    </div>;
  }
}