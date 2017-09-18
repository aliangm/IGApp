import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/indicators/crm-popup.css';
import GoogleSheetsAutomaticPopup from 'components/pages/indicators/GoogleSheetsAutomaticPopup';
import StripeAutomaticPopup from 'components/pages/indicators/StripeAutomaticPopup';

export default class FinancePopup extends Component {

  style = style;

  render(){
    return <div hidden={ this.props.hidden }>
      <Page popup={ true } width={'340px'}>
        <div className={ this.classes.title }>
          Choose source
        </div>
        <div className={ this.classes.inner }>
          <div className={ this.classes.row }>
            <StripeAutomaticPopup setDataAsState={ this.props.setDataAsState } close={ this.props.close }/>
          </div>
          <div  className={ this.classes.row }>
            <GoogleSheetsAutomaticPopup setDataAsState={ this.props.setDataAsState } close={ this.props.close }/>
          </div>
        </div>
      </Page>
    </div>
  }

}