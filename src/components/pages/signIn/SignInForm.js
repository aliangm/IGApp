import React from 'react';
import Component from 'components/Component';
import Button from 'components/controls/Button';
import style from 'styles/signin/login.css';
import CustomCheckbox from 'components/controls/CustomCheckbox';

export default class SignInForm extends Component {

  style = style;

  constructor(props) {
    super(props);

    this.state = {
      email: this.props.preFilledEmail || '',
      password: null,
      checkboxes: Array(this.props.checkboxes.length).fill(false)
    };

  }

  toggleCheckBox = (i) => {
    const checkboxes = [...this.state.checkboxes];
    checkboxes[i] = !checkboxes[i];
    this.setState({
      checkboxes: checkboxes
    });

    this.props.checkboxChanged && this.props.checkboxChanged(i);
  };

  render() {
    const checkboxes = this.props.checkboxes && this.props.checkboxes.map((item, index) => {
      return <div key={index} className={this.classes.checkboxWrapper}>
        <CustomCheckbox style={{alignItems: 'baseline'}}
                        checkboxStyle={{
                          width: '15px',
                          height: '15px',
                          borderRadius: '4px',
                          border: 'solid 2px #e3e6f4',
                          backgroundColor: 'transparent'
                        }}
                        checked={this.state.checkboxes[index]}
                        onChange={() => this.toggleCheckBox(index)}/>
        <div className={this.classes.checkboxLabel}>{item}</div>
      </div>;
    });

    return <div className={this.classes.page}>
      <div className={this.classes.logo}/>
      <div className={this.classes.title}>{this.props.title}</div>
      <div className={this.classes.subTitle}>{this.props.subTitle}</div>
      <div className={this.classes.loginWrapper}>
        <div className={this.classes.inputField}>
          <div className={this.classes.inputLabel}>Work email</div>
          <input className={this.classes.input}
                 type='email'
                 value={this.state.email}
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
        <div className={this.classes.checkBoxes}>
          {checkboxes}
        </div>
        <Button style={{width: '110px', height: '38px', alignSelf: 'center', marginTop: '20px'}} type='primary'
                disabled={this.props.buttonDisabled}
                onClick={() => this.props.buttonAction(this.state.email, this.state.password)}>
          {this.props.buttonText}
        </Button>
      </div>
      <div className={this.classes.bottom}>
        {this.props.bottomComponent}
      </div>
    </div>;
  }
}