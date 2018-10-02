import React from 'react';
import Component from 'components/Component';
import serverCommunication from 'data/serverCommunication';
import IntegrationPopup from 'components/pages/indicators/IntegrationPopup';

export default class MozAutomaticPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url: props.defaultUrl || '',
      hidden: true
    };
  }

  open() {
    this.setState({hidden: false});
  }

  close = () => {
    this.setState({hidden: true});
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultUrl !== nextProps.defaultUrl) {
      this.setState({url: nextProps.defaultUrl});
    }
  }

  handleChange(event) {
    this.setState({url: event.target.value});
  }

  render() {
    return <IntegrationPopup getDataSuccess={this.props.setDataAsState}
                                   serverRequest={() => serverCommunication.serverRequest('post',
                                     'mozapi',
                                     JSON.stringify({url: this.state.url}),
                                     localStorage.getItem('region'))}
                                   isOpen={!this.state.hidden}
                                   close={this.close}
                                   title='Please enter your website'
                                   onChange={this.handleChange.bind(this)}
                                   value={this.state.url}
    />;
  }
}