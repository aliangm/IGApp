import React from 'react';
import Component from 'components/Component';
import {newLogin} from 'components/utils/AuthService';
import Button from 'components/controls/Button';
import style from 'styles/signin/login.css';

export default class SignInForm extends Component {

  style = style;

  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null
    };

  }

  render() {
    const checkboxes = this.props.checkboxes.map((item, index) => {
      return <div key={index} className={this.classes.checkboxWrapper}>
        <input type='checkbox' className={this.classes.checkbox}
               onChange={() => this.props.checkboxChanged && this.props.checkboxChanged(index)}/>
        <div className={this.classes.checkboxLabel}>{item}</div>
      </div>;
    });

    return <div className={this.classes.page}>
      <div className={this.classes.logo} />
      <div className={this.classes.title}>{this.props.title}</div>
      <div className={this.classes.subTitle}>{this.props.subTitle}</div>
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
        {checkboxes}
        <Button style={{width: '110px', height:'38px', alignSelf: 'center', marginTop: '20px'}} type='primary'
                disabled={this.props.buttonDisabled}
                onClick={() => this.props.buttonAction(this.state.email, this.state.password, (result) => {
                  alert(result.description);
                })}>
          {this.props.buttonText}
        </Button>
      </div>
    </div>;
  }
}