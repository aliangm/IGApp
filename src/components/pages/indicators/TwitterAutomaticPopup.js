import React from 'react';
import Component from 'components/Component';
import serverCommunication from 'data/serverCommunication';
import SimpleIntegrationPopup from 'components/pages/indicators/SimpleIntegrationPopup';

export default class TwitterAutomaticPopup extends Component {

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
    this.setState({hidden: true});
  };

  handleChangeIdentifier(event) {
    this.setState({identifier: event.target.value});
  }

  render() {
    return <SimpleIntegrationPopup width='400px'
                                   getDataSuccess={this.props.setDataAsState}
                                   serverRequest={() => serverCommunication.serverRequest('post',
                                     'twitterapi',
                                     JSON.stringify({identifier: this.state.identifier}),
                                     localStorage.getItem('region'))}
                                   isOpen={!this.state.hidden}
                                   close={this.close}
                                   title='Please enter your Twitter company page name'
                                   placeHolder='@ExamplePage'
                                   onChange={this.handleChangeIdentifier.bind(this)}
                                   value={this.state.identifier}
    />;
  }
}