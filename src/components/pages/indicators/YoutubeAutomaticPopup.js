import React from 'react';
import Component from 'components/Component';
import serverCommunication from 'data/serverCommunication';
import IntegrationPopup from 'components/pages/indicators/IntegrationPopup';

export default class YoutubeAutomaticPopup extends Component {

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

  close = () => {
    this.setState({hidden: true});
  };

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

  render() {
    return <IntegrationPopup getDataSuccess={this.props.setDataAsState}
                             serverRequest={() => serverCommunication.serverRequest('post',
                               'youtubeapi',
                               JSON.stringify({type: this.state.type, id: this.state.id}),
                               localStorage.getItem('region'))}
                             isOpen={!this.state.hidden}
                             close={this.close}
                             width='410px'
                             title='Please enter your youtube channel id/URL'
                             onChange={this.handleChangeIdentifier.bind(this)}
                             placeHolder='https://www.youtube.com/channel/channel_id'/>;
  }
}