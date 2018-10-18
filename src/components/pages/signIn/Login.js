import React from 'react';
import Component from 'components/Component';
import SignInForm from 'components/pages/signIn/SignInForm';
import {login, passwordReset} from 'components/utils/AuthService';
import {TextContent as PopupTextContent} from 'components/pages/plan/Popup';
import textFieldStyles from 'styles/controls/textfield.css';
import Button from 'components/controls/Button';
import PlanPopup from 'components/pages/plan/Popup';

export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {to: null};
  }

  render() {

    return <div>
      <SignInForm title='Welcome back!'
                  subTitle={<div>Don't have an account? <a href="/signup">Sign Up</a></div>}
                  buttonAction={(...parameters) => login(...parameters, (error) => {
                    if (error) {
                      alert(error.description);
                    }
                  })}
                  buttonText='Sign in'
                  buttonDisabled={false}
                  bottomComponent={<div style={{position: 'relative'}}>
                    <div onClick={() => this.popup.open()}>Forgot your password? Send yourself a new one.</div>
                    <PlanPopup onClose={() => {
                      this.setState({to: null});
                    }} ref={ref => this.popup = ref} style={{
                      width: 'max-content',
                      left: '253px'
                    }} title="Send email">
                      <PopupTextContent>
                        <div style={{display: 'inline-flex'}}>
                          <input type='email'
                                 value={this.state.to || ''}
                                 onChange={(e) => this.setState({to: e.target.value})}
                                 placeholder='email'
                                 className={textFieldStyles.locals.input}
                          />
                          <Button type='primary' onClick={() => {
                            passwordReset(this.state.to, () => {
                              console.log('password reset mail sent');
                            });
                            this.popup.close();
                          }}>Send</Button>
                        </div>
                      </PopupTextContent>
                    </PlanPopup>
                  </div>}
      />
    </div>;
  }
}