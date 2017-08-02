import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import Textfield from 'components/controls/Textfield';
import style from 'styles/onboarding/onboarding.css';
import Button from 'components/controls/Button';
import serverCommunication from 'data/serverCommunication';
import Label from 'components/ControlsLabel';

export default class AutomaticIndicatorPopup extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      identifier: ''
    };
  }

  handleChangeIdentifier(event) {
    this.setState({identifier: event.target.value});
  }

  getUserData() {
    serverCommunication.serverRequest('post', 'facebookapi', JSON.stringify({identifier: this.state.identifier}), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.props.setDataAsState(data);
              this.props.close();
            });
        }
        else if (response.status == 401) {
          history.push('/');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  render(){
    return <div hidden={ this.props.hidden }>
      <Page popup={ true } width={'400px'}>
        <div className={ this.classes.row }>
          <Label>Please enter your Facebook page name/URL</Label>
        </div>
        <div className={ this.classes.row }>
          <Textfield value={this.state.identifier} onChange={ this.handleChangeIdentifier.bind(this)} placeHolder="https://www.facebook.com/ExamplePage"/>
        </div>
        <div className={ this.classes.footer }>
          <div className={ this.classes.footerLeft }>
            <Button type="normal" style={{ width: '100px' }} onClick={ this.props.close }>Cancel</Button>
          </div>
          <div className={ this.classes.footerRight }>
            <Button type="primary2" style={{ width: '100px' }} onClick={ this.getUserData.bind(this) }>Done</Button>
          </div>
        </div>
      </Page>
    </div>
  }

}