import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import serverCommunication from 'data/serverCommunication';
import IntegrationPopup from 'components/common/IntegrationPopup';

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

  loadingStarted = () => {
    this.props.loadingStarted && this.props.loadingStarted();
  };

  loadingFinished = () => {
    this.props.loadingFinished && this.props.loadingFinished();
  };

  afterAuthorization = (code) => {
    this.loadingStarted();
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
                  this.loadingFinished();
                  this.setState({hidden: !showPopup});
                })
                .catch((error) => {
                  this.loadingFinished();
                  window.alert('Error occurred');
                });
            });
        }
        else if (response.status == 401) {
          this.loadingFinished();
          history.push('/');
        }
        else {
          this.loadingFinished();
          window.alert('Error occurred');
        }
      });
  };

  makeServerRequest = () => {
    this.loadingStarted();
    this.setState({hidden: true});
    return this.props.makeServerRequest();
  };

  onDoneServerRequest = (isError) => {
    if(isError) {
      window.alert('Error occurred');
    }
    this.loadingFinished();
  };

  close = () => {
    this.setState({hidden: true});
  };

  render() {
    return <div style={{width: '100%'}}>
      <IntegrationPopup width={this.props.width}
                        innerClassName={this.props.innerClassName}
                        contentClassName={this.props.contentClassName}
                        makeServerRequest={this.makeServerRequest}
                        isOpen={!this.state.hidden}
                        close={this.close}
                        onDoneServerRequest={this.onDoneServerRequest}
      >
        {this.props.children}
      </IntegrationPopup>
    </div>;
  }
}