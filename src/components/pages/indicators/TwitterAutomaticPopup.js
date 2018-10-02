import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import serverCommunication from 'data/serverCommunication';
import IntegrationPopup from 'components/pages/indicators/IntegrationPopup';

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
    return <IntegrationPopup width='450px'
                             getDataSuccess={this.props.setDataAsState}
                             serverRequest={() => serverCommunication.serverRequest('post',
                               'twitterapi',
                               JSON.stringify({identifier: this.state.identifier}),
                               localStorage.getItem('region'))}
                             isOpen={!this.state.hidden}
                             close={this.close}
                             title='Please enter your company Twitter page name'
                             placeHolder='@ExamplePage'
                             onChange={this.handleChangeIdentifier.bind(this)}/>;
  }
}