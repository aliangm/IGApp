import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/indicators/crm-popup.css';
import GoogleAutomaticPopup from 'components/pages/indicators/GoogleAutomaticPopup';

export default class AnalyticsPopup extends Component {

  style = style;

  render(){
    return <div>
      <div hidden={ this.props.hidden }>
        <Page popup={ true } width={'340px'}>
          <div className={ this.classes.close } onClick={ this.props.close }/>
          <div className={ this.classes.inner }>
            <div className={ this.classes.row }>
              <GoogleAutomaticPopup setDataAsState={ this.props.setDataAsState } close={ this.props.close }/>
            </div>
          </div>
        </Page>
      </div>
    </div>
  }

}