import React from 'react';
import Component from 'components/Component';
import Button from 'components/controls/Button';
import style from 'styles/onboarding/onboarding.css';
import Page from 'components/Page';
import serverCommunication from 'data/serverCommunication';

export default class AuthorizationIntegrationPopup extends Component {

  style = style;

  constructor(props) {
    super(props);

    this.state = {
      error: false,
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
                  this.setState({error: false, hidden: !showPopup});
                })
                .catch((error) => {
                  this.setState({error: true, hidden: false});
                });
            });
        }
        else if (response.status == 401) {
          history.push('/');
        }
        else {
          this.setState({error: true, hidden: false});
        }
      });
  };

  close() {
    this.setState({error: false, hidden: true});
  };

  done = () => {
    this.props.doneServerRequest()
      .then(() => {
        this.setState({error: false});
        this.close();
      })
      .catch((error) => {
        this.setState({error: true});
      });
  };

  render() {
    return <div style={{width: '100%'}}>
      <div hidden={this.state.hidden}>
        <Page popup={true}
              width={this.props.width}
              innerClassName={this.props.innerClassName}
              contentClassName={this.props.contentClassName}>
          <div style={{display: 'grid'}}>
            {this.props.children}
            <div className={this.classes.footer}>
              <div className={this.classes.footerLeft}>
                <Button type='secondary' style={{width: '100px'}} onClick={this.close.bind(this)}>Cancel</Button>
              </div>
              <div className={this.classes.footerRight}>
                <Button type='primary' style={{width: '100px'}} onClick={this.done}>Done</Button>
              </div>
            </div>
            <label hidden={!this.state.error} style={{color: 'red', marginTop: '20px'}}>
              Error occurred
            </label>
          </div>
        </Page>
      </div>
    </div>;
  }
}