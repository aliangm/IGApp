import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import Label from 'components/ControlsLabel';
import Textfield from 'components/controls/Textfield';
import SaveButton from 'components/pages/profile/SaveButton';

export default class Setup extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
    };
  };

  handleChange(type, event) {
    let update = this.props.attribution.siteStructure || {};
    update[type] = event.target.value;
    this.props.updateState({'attribution.siteStructure': update});
  }

  render() {
    const {attribution} = this.props;
    const siteStructure = attribution.siteStructure || {};
    const {homepage, pricing, blog, caseStudies, contact, aboutUs} = siteStructure;
    return <div style={{ padding: '20px' }}>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>Homepage</Label>
        <Textfield
          value={homepage || '/'}
          onChange={ this.handleChange.bind(this, 'homepage') }
          style={{ width: '200px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>Pricing</Label>
        <Textfield
          value={pricing || '/pricing'}
          onChange={ this.handleChange.bind(this, 'pricing') }
          style={{ width: '200px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>Blog</Label>
        <Textfield
          value={blog || '/blog'}
          onChange={ this.handleChange.bind(this, 'blog') }
          style={{ width: '200px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>Case-studies</Label>
        <Textfield
          value={caseStudies || '/case-studies'}
          onChange={ this.handleChange.bind(this, 'caseStudies') }
          style={{ width: '200px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>Contact us</Label>
        <Textfield
          value={contact || '/contact'}
          onChange={ this.handleChange.bind(this, 'contact') }
          style={{ width: '200px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>About us</Label>
        <Textfield
          value={aboutUs || '/company'}
          onChange={ this.handleChange.bind(this, 'aboutUs') }
          style={{ width: '200px'}}
        />
      </div>
      <div style={{ marginLeft: '172px', marginTop: '12px' }}>
        <SaveButton onClick={() => {
          this.setState({saveFail: false, saveSuccess: false});
          this.props.updateUserMonthPlan({'attribution.siteStructure': attribution.siteStructure}, this.props.region, this.props.planDate);
          this.setState({saveSuccess: true});
        }} success={ this.state.saveSuccess } fail={ this.state.saveFail }/>
      </div>
    </div>
  }
}