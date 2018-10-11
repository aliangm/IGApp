import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import serverCommunication from 'data/serverCommunication';
import IntegrationPopup from 'components/pages/indicators/IntegrationPopup';

export default class AuthorizationIntegrationPopup extends Component {

  style = style;

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
            console.log('error getting data for api: ' + api);
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
                  this.refs.integrationPopup.propogateStep(!showPopup);
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
    this.refs.integrationPopup.close();
  };

  render() {
    return <div style={{width: '100%'}}>
      <IntegrationPopup width={this.props.width}
                        innerClassName={this.props.innerClassName}
                        contentClassName={this.props.contentClassName}
                        doneRequest={this.props.doneServerRequest}
                        ref="integrationPopup"
                        affectedIndicators={this.props.affectedIndicators}
                        actualIndicators={this.props.actualIndicators}
      >
        {this.props.children}
      </IntegrationPopup>
    </div>;
  }
}