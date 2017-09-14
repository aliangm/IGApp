import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import serverCommunication from 'data/serverCommunication';

export default class StripeAutomaticPopup extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      code: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hidden && this.props.hidden != nextProps.hidden) {
      serverCommunication.serverRequest('get', 'stripeapi')
        .then((response) => {
          if (response.ok) {
            response.json()
              .then((data) => {
                const win = window.open(data);

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

  render(){
    return <div hidden={ this.props.hidden }>
    </div>
  }

}