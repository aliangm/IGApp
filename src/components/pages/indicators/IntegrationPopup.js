import React from 'react';
import Component from 'components/Component';
import Button from 'components/controls/Button';
import style from 'styles/onboarding/onboarding.css';
import Page from 'components/Page';

export default class IntegrationPopup extends Component {

  style = style;

  constructor(props) {
    super(props);

    this.state = {
      error: false,
    };
  }

  close = () => {
    this.setState({error: false});
    this.props.close();
  };

  done = () => {
    this.props.doneRequest()
      .then(() => {
        this.setState({error: false});
        this.props.close();
      })
      .catch((error) => {
        this.setState({error: true});
      });
  };

  render() {
    return <div hidden={!this.props.isOpen}>
      <Page popup={true}
            width={this.props.width}
            innerClassName={this.props.innerClassName}
            contentClassName={this.props.contentClassName}>
        <div style={{display: 'grid'}}>
          {this.props.children}
          <div className={this.classes.footer}>
            <div className={this.classes.footerLeft}>
              <Button type="secondary" style={{width: '100px'}} onClick={this.close}>Cancel</Button>
            </div>
            <div className={this.classes.footerRight}>
              <Button type="primary" style={{width: '100px'}} onClick={this.done}>Done</Button>
            </div>
          </div>
          <label hidden={!this.state.error} style={{color: 'red', marginTop: '20px'}}>
            Error occurred
          </label>
        </div>
      </Page>
    </div>;
  }
}