import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import Title from 'components/onboarding/Title';
import style from 'styles/campaigns/choose-existing-template.css';
import TemplateBox from 'components/pages/campaigns/TemplateBox';
import Button from 'components/controls/Button';
import campaignTemplates from 'data/campaignTemplates';

export default class ChooseExistingTemplate extends Component {

  style = style;

  focuses = [
    "Acquisition",
    "Activation",
    "Retention"
  ];

  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      focus: ''
    };
  }

  createNew() {
    if (this.state.selected === 0) {
      this.props.close();
      this.props.showCampaign();
    }
    else {
      this.setState({selected: 0});
    }
  }

  choose() {
    if (this.state.focus && this.state.selected !== '') {
      const template = campaignTemplates[this.state.focus][this.state.selected];
      this.props.close();
      this.props.showCampaign(template);
    }
    // Create new
    else if (this.state.selected === 0){
      this.props.close();
      this.props.showCampaign();
    }
  }

  templateClick(index) {
    if (this.state.selected === index) {
      const template = campaignTemplates[this.state.focus][this.state.selected];
      this.props.close();
      this.props.showCampaign(template);
    }
    else {
      this.setState({selected: index});
    }
  }

  render() {
    const focusBoxes = this.focuses.map((item, index) =>
      <TemplateBox key={index} isCenter={true} text={item} onClick={ () => { this.setState({focus: this.focuses[index], selected: ''}) } }/>
    );
    const templates = this.state.focus && campaignTemplates[this.state.focus].map((item, index) =>
      <TemplateBox key={index} text={item.name} number={item.successRate + '%'} selected={this.state.selected === index} onClick={ this.templateClick.bind(this, index) }/>
    );
    return <div>
      <Page popup={ true } width={'870px'} contentClassName={this.classes.pageContent}>
        <div className={this.classes.content}>
          <Title title="Create a new campaign"/>
        </div>
        <div>
          {
            this.state.focus ?
              <div className={this.classes.inner}>
                <TemplateBox isWhite={true} isCenter={true} text={ this.state.focus }
                             onClick={() => {
                               this.setState({focus: '', selected: ''})
                             }}/>
                {templates}
              </div>
              :
              <div className={this.classes.inner}>
                <TemplateBox isWhite={true} isCenter={true} text="new" selected={this.state.selected === 0}
                             onClick={ this.createNew.bind(this) }/>
                {focusBoxes}
              </div>
          }
        </div>
        <div className={this.classes.bottom}>
          <Button type="normal" style={{ marginRight: '14px', marginTop: '7px' }} onClick={ this.props.close }>
            Cancel
          </Button>
          <Button type="accent2" style={{ marginRight: '14px', marginTop: '7px' }} onClick={ this.choose.bind(this) }>
            Choose
          </Button>
        </div>
      </Page>
    </div>
  }
}