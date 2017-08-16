import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/indicators/crm-popup.css';

export default class AutomaticIndicatorPopup extends Component {

  style = style;

  constructor(props) {
    super(props);
  }

  showHubspotPopup() {
    this.props.showHubspotPopup();
    this.props.close();
  }

  showSalesforcePopup() {
    this.props.showSalesforcePopup();
    this.props.close();
  }

  render(){
    return <div hidden={ this.props.hidden }>
      <Page popup={ true } width={'340px'}>
        <div className={ this.classes.title }>
          Choose your main CRM platform
        </div>
        <div className={ this.classes.inner }>
          <div className={ this.classes.row }>
            <div className={ this.classes.hubspot } onClick={ this.showHubspotPopup.bind(this) }/>
          </div>
          <div  className={ this.classes.row }>
            <div className={ this.classes.salesforce } onClick={ this.showSalesforcePopup.bind(this) }/>
          </div>
        </div>
      </Page>
    </div>
  }

}