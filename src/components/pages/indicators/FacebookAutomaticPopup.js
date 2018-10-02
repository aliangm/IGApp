import React from 'react';
import Component from 'components/Component';
import serverCommunication from 'data/serverCommunication';
import IntegrationPopup from 'components/pages/indicators/IntegrationPopup';

export default class FacebookAutomaticPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      identifier: '',
      hidden: true
    };
  }

  open() {
    this.setState({hidden: false});
  }

  close = () => {
    this.setState({hidden: true, identifier: ''});
  };

  handleChangeIdentifier(event) {
    this.setState({identifier: event.target.value});
  }

  render() {
    return <IntegrationPopup getDataSuccess={this.props.setDataAsState}
                                   serverRequest={() => serverCommunication.serverRequest('post',
                                     'facebookapi',
                                     JSON.stringify({identifier: this.state.identifier}),
                                     localStorage.getItem('region'))}
                                   isOpen={!this.state.hidden}
                                   close={this.close}
                                   onChange={this.handleChangeIdentifier.bind(this)}
                                   title='Please enter your Facebook company page name/URL'
                                   placeHolder='https://www.facebook.com/ExamplePage'
                                   value={this.state.identifier}/>;
  }
}