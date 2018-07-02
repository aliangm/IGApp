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
    const {attribution, companyWebsite} = this.props;
    const siteStructure = attribution.siteStructure || {};
    const {homepage, pricing, blog, caseStudies, contact, aboutUs, presentations, eBooks, whitepapers, videos} = siteStructure;
    return <div style={{ padding: '20px' }}>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>Homepage</Label>
        <Textfield
          value={homepage || (companyWebsite + '/')}
          onChange={ this.handleChange.bind(this, 'homepage') }
          style={{ width: '300px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>Pricing</Label>
        <Textfield
          value={pricing || (companyWebsite + '/pricing')}
          onChange={ this.handleChange.bind(this, 'pricing') }
          style={{ width: '300px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>Blog</Label>
        <Textfield
          value={blog || (companyWebsite + '/blog')}
          onChange={ this.handleChange.bind(this, 'blog') }
          style={{ width: '300px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>Case-studies</Label>
        <Textfield
          value={caseStudies || (companyWebsite + '/case-studies')}
          onChange={ this.handleChange.bind(this, 'caseStudies') }
          style={{ width: '300px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>Contact us</Label>
        <Textfield
          value={contact || (companyWebsite + '/contact')}
          onChange={ this.handleChange.bind(this, 'contact') }
          style={{ width: '300px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>About us</Label>
        <Textfield
          value={aboutUs || (companyWebsite + '/company')}
          onChange={ this.handleChange.bind(this, 'aboutUs') }
          style={{ width: '300px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>Presentations</Label>
        <Textfield
          value={presentations || (companyWebsite + '/presentations')}
          onChange={ this.handleChange.bind(this, 'presentations') }
          style={{ width: '300px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>E-books</Label>
        <Textfield
          value={eBooks || (companyWebsite + '/e-books')}
          onChange={ this.handleChange.bind(this, 'eBooks') }
          style={{ width: '300px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>Whitepapers</Label>
        <Textfield
          value={whitepapers || (companyWebsite + '/whitepapers')}
          onChange={ this.handleChange.bind(this, 'whitepapers') }
          style={{ width: '300px'}}
        />
      </div>
      <div className={ this.classes.cell }>
        <Label style={{width: '100px', marginTop: '12px', textTransform: 'capitalize'}}>Videos</Label>
        <Textfield
          value={videos || (companyWebsite + '/videos')}
          onChange={ this.handleChange.bind(this, 'videos') }
          style={{ width: '300px'}}
        />
      </div>
      <div style={{ marginLeft: '272px', marginTop: '12px' }}>
        <SaveButton onClick={() => {
          this.setState({saveFail: false, saveSuccess: false});
          this.props.updateUserMonthPlan({'attribution.siteStructure': attribution.siteStructure}, this.props.region, this.props.planDate);
          this.setState({saveSuccess: true});
        }} success={ this.state.saveSuccess } fail={ this.state.saveFail }/>
      </div>
    </div>
  }
}