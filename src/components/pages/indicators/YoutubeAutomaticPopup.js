import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import Textfield from 'components/controls/Textfield';
import style from 'styles/onboarding/onboarding.css';
import Button from 'components/controls/Button';
import serverCommunication from 'data/serverCommunication';
import Label from 'components/ControlsLabel';

export default class YoutubeAutomaticPopup extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      fullIdentifier: '',
      type: '',
      hidden: true
    };
  }

  open() {
    this.setState({hidden: false});
  }

  close() {
    this.setState({hidden: true});
  }

  handleChangeIdentifier(event) {
    this.setState({fullIdentifier: event.target.value});
    if (event.target.value.match(/.*youtube.com\/channel\/.*/)) {
      this.setState({
        type: 'channel',
        id: event.target.value.replace(/.*youtube.com\/channel\//, '')
      });
    }
    else if (event.target.value.match(/.*youtube.com\/user\/.*/)) {
      this.setState({
        type: 'user',
        id: event.target.value.replace(/.*youtube.com\/user\//, '')
      });
    }
  }

  getUserData() {
    serverCommunication.serverRequest('post', 'youtubeapi', JSON.stringify({type: this.state.type, id: this.state.id}), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.props.setDataAsState(data);
              this.close();
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
    return <div hidden={ this.state.hidden }>
      <Page popup={ true } width={'410px'}>
        <div className={ this.classes.row }>
          <Label>Please enter your youtube channel id/URL</Label>
        </div>
        <div className={ this.classes.row }>
          <Textfield value={this.state.fullIdentifier} onChange={ this.handleChangeIdentifier.bind(this)} placeHolder="https://www.youtube.com/channel/channel_id"/>
        </div>
        <div className={ this.classes.footer }>
          <div className={ this.classes.footerLeft }>
            <Button type="normal" style={{ width: '100px' }} onClick={ this.close.bind(this) }>Cancel</Button>
          </div>
          <div className={ this.classes.footerRight }>
            <Button type="primary2" style={{ width: '100px' }} onClick={ this.getUserData.bind(this) }>Done</Button>
          </div>
        </div>
      </Page>
    </div>
  }

}