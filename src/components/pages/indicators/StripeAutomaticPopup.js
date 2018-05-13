import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import serverCommunication from 'data/serverCommunication';
import CRMStyle from 'styles/indicators/crm-popup.css';

export default class StripeAutomaticPopup extends Component {

  style = style;
  styles = [CRMStyle];

  constructor(props) {
    super(props);
    this.state = {
      code: null
    };
  }

  componentDidMount() {
    serverCommunication.serverRequest('get', 'stripeapi')
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
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  open() {
    this.setState({hidden: false});
  }

  close() {
    this.setState({hidden: true});
  }

  getAuthorization() {
    const win = window.open(this.state.url);
    const timer = setInterval(() => {
      if (win.closed) {
        clearInterval(timer);
        const code = localStorage.getItem('code');
        if (code) {
          localStorage.removeItem('code');
          this.setState({code: code});
          serverCommunication.serverRequest('post', 'stripeapi', JSON.stringify({code: code}), localStorage.getItem('region'))
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
      }
    }, 1000);
  }

  render(){
    return <div style={{ width: '100%' }}>
      <div hidden={this.state.hidden}>
      </div>
    </div>
  }

}