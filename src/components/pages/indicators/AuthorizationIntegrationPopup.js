import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import serverCommunication from 'data/serverCommunication';
import IntegrationPopup from 'components/pages/indicators/IntegrationPopup';

export default class AuthorizationIntegrationPopup extends Component {

  style = style;

  constructor(props) {
    super(props);

    this.state = {
      hidden: true
    };
  }

  componentDidMount() {
    if (!this.props.data) {
      serverCommunication.serverRequest('get', this.props.api)
        .then((response) => {
          if (response.ok) {
            response.json()
              .then((data) => {
                this.setState({url: data});
              });
          }
          else if (response.status == 401) {
            history.push('/');
          }
          else {
            console.log('error getting data from for api: ' + api);
          }
        });
    }
  }

  open() {
    this.getAuthorization();
  }

  getAuthorization = () => {
    if (!this.props.data) {
      const win = window.open(this.state.url);
      const timer = setInterval(() => {
        if (win.closed) {
          clearInterval(timer);
          const code = localStorage.getItem('code');
          if (code) {
            localStorage.removeItem('code');
            this.afterAuthorization(code);
          }
        }
      }, 1000);
    }
    else {
      this.afterAuthorization();
    }
  };

  afterAuthorization = (code) => {
    serverCommunication.serverRequest('post',
      this.props.api,
      JSON.stringify({code: code}),
      localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.props.afterDataRetrieved(data)
                .then((showPopup) => {
                  this.setState({hidden: !showPopup});
                })
                .catch((error) => {
                  window.alert('error getting data');
                });
            });
        }
        else if (response.status == 401) {
          history.push('/');
        }
        else {
          window.alert('error getting data');
        }
      });
  };

  close = () => {
    this.setState({hidden: true});
  };

  render() {
    return <div style={{width: '100%'}}>
      <IntegrationPopup width={this.props.width}
                        innerClassName={this.props.innerClassName}
                        contentClassName={this.props.contentClassName}
                        doneRequest ={this.props.doneServerRequest}
                        isOpen={!this.state.hidden}
                        close={this.close}
      >
        {this.props.children}
      </IntegrationPopup>
    </div>;
  }
}