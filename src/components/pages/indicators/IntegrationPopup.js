import React from 'react';
import Component from 'components/Component';
import Button from 'components/controls/Button';
import style from 'styles/onboarding/onboarding.css';
import Page from 'components/Page';
import Label from 'components/ControlsLabel';
import Textfield from 'components/controls/Textfield';

export default class IntegrationPopup extends Component {

  style = style;

  static defaultProps = {
    placeHolder: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      error: false,
    };
  }

  close = () => {
    this.setState({error: false});
    this.props.close();
  };

  done = () => {
    this.props.serverRequest()
      .then((response) => {
        if (response.ok) {
          response.json()
            .then(data => {
              this.setState({error: false});
              this.props.getDataSuccess(data);
              this.close();
            });
        }
        else if (response.status == 401) {
          history.push('/');
        }
        else {
          this.setState({error: true});
        }
      })
      .catch((error) => {
        this.setState({error: true});
      });
  };

  render() {
    return <div hidden={!this.props.isOpen}>
      <Page popup={true} width={this.props.width || '400px'}>
        <div style={{display: 'grid'}}>
          <div className={this.classes.row}>
            <Label>{this.props.title}</Label>
          </div>
          <div className={this.classes.row}>
            <Textfield value={this.state.identifier} onChange={this.props.onChange}
                       placeHolder={this.props.placeHolder}/>
          </div>
          <div className={this.classes.footer}>
            <div className={this.classes.footerLeft}>
              <Button type="secondary" style={{width: '100px'}} onClick={this.close}>Cancel</Button>
            </div>
            <div className={this.classes.footerRight}>
              <Button type="primary" style={{width: '100px'}} onClick={this.done}>Done</Button>
            </div>
          </div>
          <label hidden={!this.state.error} style={{color: 'red', marginTop: '20px'}}>
            Error occurred
          </label>
        </div>
      </Page>
    </div>;
  }
}