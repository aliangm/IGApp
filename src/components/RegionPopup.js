import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import Title from 'components/onboarding/Title';
import Textfield from 'components/controls/Textfield';
import style from 'styles/onboarding/onboarding.css';
import Button from 'components/controls/Button';
import history from 'history';
import { temporaryEnablePopupMode } from 'modules/popup-mode'
export default class RegionPopup extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      regionName: ''
    };
    this.createNewRegion = this.createNewRegion.bind(this);
  }

  handleChange(event) {
    this.setState({regionName: event.target.value});
  }

  createNewRegion() {
    const regionName = this.state.regionName || 'default';
    this.props.createUserMonthPlan({ region: regionName})
      .then(() => {
        localStorage.setItem('region', this.state.regionName);
        temporaryEnablePopupMode();
        this.props.close();
        history.push('/profile/product');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render(){
    return <div hidden={ this.props.hidden }>
      <Page popup={ true } width={'300px'}>
        <Title title="New Region"/>
        <div className={ this.classes.row }>
          <Textfield value={ this.state.regionName } required={ true } onChange={ this.handleChange.bind(this)} ref="name" placeHolder="default"/>
        </div>
        <div className={ this.classes.footer }>
          <div className={ this.classes.footerLeft }>
            <Button type="normal" style={{ width: '100px' }} onClick={ this.props.close }>Cancel</Button>
          </div>
          <div className={ this.classes.footerRight }>
            <Button type="primary2" style={{ width: '100px' }} onClick={ this.createNewRegion }>Create</Button>
          </div>
        </div>
      </Page>
    </div>
  }

}