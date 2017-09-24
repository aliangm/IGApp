import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/indicators/crm-popup.css';
import LinkedinAutomaticPopup from 'components/pages/indicators/LinkedinAutomaticPopup';

export default class CRMPopup extends Component {

  style = style;

  render(){
    return <div>
      <div hidden={ this.props.hidden }>
        <Page popup={ true } width={'340px'}>
          <div className={ this.classes.inner }>
            <div className={ this.classes.row }>
              <LinkedinAutomaticPopup setDataAsState={ this.props.setDataAsState } close={ this.props.close }/>
            </div>
          </div>
        </Page>
      </div>
    </div>
  }

}