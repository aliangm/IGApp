import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/indicators/crm-popup.css';

export default class FinancePopup extends Component {

  style = style;

  constructor(props) {
    super(props);
  }

  showStripePopup() {
    this.props.showStripePopup();
    this.props.close();
  }

  showGoogleSheetsPopup() {
    this.props.showGoogleSheetsPopup();
    this.props.close();
  }

  render(){
    return <div hidden={ this.props.hidden }>
      <Page popup={ true } width={'340px'}>
        <div className={ this.classes.title }>
          Choose source
        </div>
        <div className={ this.classes.inner }>
          <div className={ this.classes.row }>
            <div className={ this.classes.stripe } onClick={ this.showStripePopup.bind(this) }/>
          </div>
          <div  className={ this.classes.row }>
            <div className={ this.classes.googleSheets } onClick={ this.showGoogleSheetsPopup.bind(this) }/>
          </div>
        </div>
      </Page>
    </div>
  }

}