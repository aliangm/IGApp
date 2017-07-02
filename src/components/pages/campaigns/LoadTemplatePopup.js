import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import Title from 'components/onboarding/Title';
import Select from 'components/controls/Select';
import style from 'styles/onboarding/onboarding.css';
import Button from 'components/controls/Button';
import loadTemplateStyle from 'styles/campaigns/load-template-popup.css';

export default class AddTemplatePopup extends Component {

  style = style;
  styles = [loadTemplateStyle];

  constructor(props) {
    super(props);
    this.state = {
      templateName: ''
    };
  }

  static defaultProps = {
    campaignsTemplates: {}
  };

  handleChange(event) {
    this.setState({templateName: event.value});
  }

  loadTemplate(){
    if (this.state.templateName) {
      this.props.updateState({campaign: this.props.campaignsTemplates[this.state.templateName]});
      this.props.closeLoadTemplatePopup();
    }
  }

  render(){
    const select = {
      name: 'template',
      //onChange: () => {  },
      options: Object.keys(this.props.campaignsTemplates).map(name => { return {value: name, label: name} })
    };
    return <div hidden={ this.props.hidden }>
      <Page popup={ true } width={'385px'} contentClassName={ loadTemplateStyle.locals.content } innerClassName={ loadTemplateStyle.locals.inner }>
        <Title title="Select Template"/>
        <div className={ this.classes.row } style={{ marginBottom: '70px' }}>
          <Select select={ select } selected={ this.state.templateName } onChange={ this.handleChange.bind(this) }/>
        </div>
        <div className={ this.classes.footer }>
          <div className={ this.classes.footerLeft }>
            <Button type="normal" style={{ width: '100px' }} onClick={ this.props.closeLoadTemplatePopup }>Cancel</Button>
          </div>
          <div className={ this.classes.footerRight }>
            <Button type="primary2" style={{ width: '100px' }} onClick={ this.loadTemplate.bind(this) }>Load</Button>
          </div>
        </div>
      </Page>
    </div>
  }

}