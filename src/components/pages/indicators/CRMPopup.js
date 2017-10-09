import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/indicators/crm-popup.css';
import HubspotAutomaticPopup from 'components/pages/indicators/HubspotAutomaticPopup';
import SalesforceAutomaticPopup from 'components/pages/indicators/SalesforceAutomaticPopup';

export default class CRMPopup extends Component {

  style = style;

  render(){
    return <div hidden={ this.props.hidden }>
        <Page popup={ true } width={'340px'}>
          <div className={ this.classes.close } onClick={ this.props.close }/>
          <div className={ this.classes.title }>
            Choose your main CRM platform
          </div>
          <div className={ this.classes.inner }>
            <div className={ this.classes.row }>
              <HubspotAutomaticPopup setDataAsState={ this.props.setDataAsState } close={ this.props.close } updateState={ this.props.updateState }/>
            </div>
            <div  className={ this.classes.row }>
              <SalesforceAutomaticPopup setDataAsState={ this.props.setDataAsState } close={ this.props.close }/>
            </div>
          </div>
        </Page>
      </div>
  }

}