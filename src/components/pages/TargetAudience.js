import React from 'react';

import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Calendar from 'components/controls/Calendar';
import Label from 'components/ControlsLabel';
import Notice from 'components/Notice';
import MultiRow from 'components/MultiRow';

import Title from 'components/onboarding/Title';
import ProfileProgress from 'components/pages/profile/Progress';
import ProfileInsights from 'components/pages/profile/Insights';
import BackButton from 'components/pages/profile/BackButton';
import NextButton from 'components/pages/profile/NextButton';
import SaveButton from 'components/pages/profile/SaveButton';
import NotSure from 'components/onboarding/NotSure';
import AudienceTabs from 'components/onboarding/AudienceTabs';

import style from 'styles/onboarding/onboarding.css';
import targeStyle from 'styles/target-audience/target-audience.css';

import { isPopupMode } from 'modules/popup-mode';
import history from 'history';
import serverCommunication from 'data/serverCommunication';

export default class TargetAudience extends Component {
  style = style
  styles = [targeStyle]

  constructor(props) {
    super(props);
    this.state = { };
    this.state.targetAudience = { };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    let self = this;
    if (isPopupMode()){
      self.setState({isLoaded: true});
    }
    else {
      serverCommunication.serverRequest('GET', 'usermonthplan')
        .then((response) => {
          response.json()
            .then(function (data) {
              if (data) {
                if (data.error){
                  history.push('/');
                }
                else {
                  self.setState({
                    targetAudience: data.targetAudience,
                    isLoaded: true
                  });
                }
              }
            })
        })
        .catch(function (err) {
          self.setState({serverDown: true});
          console.log(err);
        })
    }
  }

  validate() {
    return this.state.targetAudience.role &&
      this.state.targetAudience.managementLevel &&
      this.state.targetAudience.employees &&
      this.state.targetAudience.annualRevenue &&
      this.state.targetAudience.companyType &&
      this.state.targetAudience.age &&
      this.state.targetAudience.salary &&
      this.state.targetAudience.gender &&
      this.state.targetAudience.education &&
      this.state.targetAudience.maritalStatus &&
      this.state.targetAudience.children &&
      this.state.targetAudience.community &&
      this.state.targetAudience.location &&
      this.state.targetAudience.dailyOnlinePresence
  }

  handleChange(parameter, event){
    let update = Object.assign({}, this.state.targetAudience);
    update[parameter] = event.value;
    this.setState({targetAudience: update});
  }

  fakeChange(parameter, value, event){
    let update = Object.assign({}, this.state.targetAudience);
    update[parameter] = value;
    this.setState({targetAudience: update});
  }

  render() {
    const selects = {
      role: {
        label: 'Role',
        select: {
          name: 'role',
          onChange: () => {},
          options: [
            { value: 'General', label: 'General' },
            { value: 'Sales', label: 'Sales' },
            { value: 'Marketing', label: 'Marketing' },
            { value: 'R&D', label: 'R&D' },
            { value: 'IT', label: 'IT' },
            { value: 'Finance', label: 'Finance' },
            { value: 'HR', label: 'HR' },
            { value: 'Design', label: 'Design' },
            { value: 'BizDev', label: 'BizDev' },
            { value: 'Other', label: 'Other' }
          ]
        }
      },
      managementLevel: {
        label: 'Management Level',
        select: {
          name: 'managementLevel',
          onChange: () => {},
          options: [
            { value: 'C-Level', label: 'C-Level' },
            { value: 'Management', label: 'Management' },
            { value: 'Employee', label: 'Employee' },
          ]
        }
      },
      reportsTo: {
        label: 'Reports To',
        labelQuestion: ['Coming Soon!'],
        description: [],
        select: {
          name: 'reportsTo',
          onChange: () => {},
          options: [
          ]
        }
      },
      companyType: {
        label: 'Company Type',
        select: {
          name: 'companyType',
          onChange: () => {},
          options: [
            { value: 'B2B Software', label: 'B2B Software' },
            { value: 'B2C Software', label: 'B2C Software' },
            { value: 'Consumer Services & Retail', label: 'Consumer Services & Retail' },
            { value: 'CPG', label: 'CPG' },
            { value: 'E-commerce', label: 'E-commerce' },
            { value: 'Food & Beverage', label: 'Food & Beverage' },
            { value: 'Entertainment', label: 'Entertainment' },
            { value: 'Professional Services', label: 'Professional Services' },
            { value: 'Any', label: 'Any' },
          ]
        }
      },
      annualRevenue: {
        label: 'Annual Revenue',
        select: {
          name: 'annualRevenue',
          onChange: () => {},
          options: [
            { value: '<$500K', label: 'Less than $500K' },
            { value: '$500K-$1M', label: '$500K-$1M' },
            { value: '$1M-$5M', label: '$1M-$5M' },
            { value: '$5M-$10M', label: '$5M-$10M' },
            { value: '$10M-$50M', label: '$10M-$50M' },
            { value: '$50M-$100M', label: '$50M-$100M' },
            { value: '>$100M', label: 'More than $100M' },
          ]
        }
      },
      employees: {
        label: 'Employees',
        select: {
          name: 'employees',
          onChange: () => {},
          options: [
            { value: '1-10', label: '1-10' },
            { value: '11-50', label: '11-50' },
            { value: '51-100', label: '51-100' },
            { value: '101-500', label: '101-500' },
            { value: '501-1000', label: '501-1000' },
            { value: '>1000', label: 'More than 1000' },
          ]
        }
      },
      age: {
        label: 'Age',
        select: {
          name: 'age',
          onChange: () => {},
          options: [
            { value: '20-25', label: '20-25' },
            { value: '26-30', label: '26-30' },
            { value: '31-35', label: '31-35' },
            { value: '36-40', label: '36-40' },
            { value: '41-45', label: '41-45' },
            { value: '46-50', label: '46-50' },
            { value: '>50', label: 'More than 50' },

          ]
        }
      },
      salary: {
        label: 'Salary',
        select: {
          name: 'salary',
          onChange: () => {},
          options: [
            { value: '<$49,999', label: 'Less than $49,999' },
            { value: '$50,000 to $74,999', label: '$50,000 to $74,999' },
            { value: '$75,000 to $99,999', label: '$75,000 to $99,999' },
            { value: '$100,000 to $149,999', label: '$100,000 to $149,999' },
            { value: '$150,000 to $199,999', label: '$150,000 to $199,999' },
            { value: '$200,000 to $499,999', label: '$200,000 to $499,999' },
            { value: '>$500,000', label: '$500,000 or more' }
          ]
        }
      },
      gender: {
        label: 'Gender',
        select: {
          name: 'gender',
          onChange: () => {},
          options: [
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Any', label: 'Both' },
          ]
        }
      },
      education: {
        label: 'Education',
        select: {
          name: 'education',
          onChange: () => {},
          options: [
            { value: 'Less than high school degree', label: 'Less than high school degree' },
            { value: 'High school degree or equivalent', label: 'High school degree or equivalent' },
            { value: 'Some college but no degree', label: 'Some college but no degree' },
            { value: 'Associate degree', label: 'Associate degree' },
            { value: 'Bachelor degree', label: 'Bachelor degree' },
            { value: 'Graduate degree', label: 'Graduate degree' },
            { value: 'Any', label: 'Any' }
          ]
        }
      },
      marital_status: {
        label: 'Marital Status',
        select: {
          name: 'marital_status',
          onChange: () => {},
          options: [
            { value: 'Never married', label: 'Never married' },
            { value: 'Married', label: 'Married' },
            { value: 'Separated', label: 'Separated' },
            { value: 'Divorced', label: 'Divorced' },
            { value: 'Widowed', label: 'Widowed' },
            { value: 'Any', label: 'Any' },
          ]
        }
      },
      have_children: {
        label: 'Have Children',
        select: {
          name: 'have_children',
          onChange: () => {},
          options: [
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
            { value: 'Any', label: 'Any' }
          ]
        }
      },
      community: {
        label: 'Community',
        select: {
          name: 'community',
          onChange: () => {},
          options: [
            { value: 'Suburban', label: 'Suburban' },
            { value: 'City', label: 'City' },
            { value: 'Rural', label: 'Rural' },
            { value: 'Any', label: 'Any' }
          ]
        }
      },
      location: {
        label: 'Location',
        select: {
          name: 'location',
          onChange: () => {},
          options: [
            { value: 'USA', label: 'USA' },
            { value: 'Canada', label: 'Canada' },
            { value: 'Western Europe', label: 'Western Europe' },
            { value: 'Eastern Europe', label: 'Eastern Europe' },
            { value: 'Latin America', label: 'Latin America' },
            { value: 'Asia', label: 'Asia' },
            { value: 'Australia', label: 'Australia' },
            { value: 'Any', label: 'Any' }
          ]
        }
      },
      dailyOnlinePresence: {
        label: 'Daily Online Presence',
        select: {
          name: 'dailyOnlinePresence',
          onChange: () => {},
          options: [
            { value: '<10%', label: 'Less than 10%' },
            { value: '10%-30%', label: '10%-30%' },
            { value: '31%-50%', label: '31%-50%' },
            { value: '51%-75%', label: '51%-75%' },
            { value: '>75%', label: 'More than 75%' }
          ]
        }
      },
    };

    return <div>
      <Header />
      <Sidebar />
        <Page popup={ isPopupMode() }>
          <Title title="Target Audience" subTitle="Who is your target audience? The best marketing strategies are always based on the people you want to reach" />
          <div className={ this.classes.error }>
            <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our support. </label>
          </div>
          { this.state.isLoaded ?
            <div className={ this.classes.cols }>
            <div className={ this.classes.colLeft }>

              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.role } selected={ this.state.targetAudience.role } onChange= { this.handleChange.bind(this, 'role') } />
              </div>
              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.managementLevel } selected={ this.state.targetAudience.managementLevel } onChange= { this.handleChange.bind(this, 'managementLevel') } />
              </div>
              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.reportsTo }  />
              </div>
              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.companyType } selected={ this.state.targetAudience.companyType } onChange= { this.handleChange.bind(this, 'companyType') } />
              </div>
              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.annualRevenue } selected={ this.state.targetAudience.annualRevenue } onChange= { this.handleChange.bind(this, 'annualRevenue') }/>
              </div>
              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.employees } selected={ this.state.targetAudience.employees } onChange= { this.handleChange.bind(this, 'employees') } />
              </div>
              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.age } selected={ this.state.targetAudience.age } onChange= { this.handleChange.bind(this, 'age') } />
              </div>
              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.salary } selected={ this.state.targetAudience.salary } onChange= { this.handleChange.bind(this, 'salary') } />
              </div>
              {/**	<div className={ this.classes.row }>
               <Label question>{ selects.loyalty.label }</Label>
               <div className={ this.classes.cell }>
               <Select { ... selects.loyalty } label={ null } style={{
                        width: '258px'
                      }} />
               <NotSure style={{
                        marginLeft: '10px'
                      }} />
               </div>
               </div>**/}
              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.gender } selected={ this.state.targetAudience.gender } onChange= { this.handleChange.bind(this, 'gender') } />
              </div>
              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.education } selected={ this.state.targetAudience.education } onChange= { this.handleChange.bind(this, 'education') } />
              </div>
              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.marital_status } selected={ this.state.targetAudience.maritalStatus } onChange= { this.handleChange.bind(this, 'maritalStatus') } />
              </div>
              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.have_children } selected={ this.state.targetAudience.children } onChange= { this.handleChange.bind(this, 'children') } />
              </div>
              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.community } selected={ this.state.targetAudience.community } onChange= { this.handleChange.bind(this, 'community') } />
              </div>
              <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                <Select { ... selects.location } selected={ this.state.targetAudience.location } onChange= { this.fakeChange.bind(this, 'location', 'USA') } />
              </div>
              <div className={ this.classes.row } style={{
						marginBottom: '200px',
                    width: '258px'
                  }}>
                <Select { ... selects.dailyOnlinePresence } selected={ this.state.targetAudience.dailyOnlinePresence } onChange= { this.handleChange.bind(this, 'dailyOnlinePresence') } />
              </div>
            </div>

            { isPopupMode() ?

              <div className={ this.classes.colRight }>
                <div className={ this.classes.row }>
                  <ProfileProgress progress={ 51 } image={
                require('assets/flower/3.png')
              }
                                   text=" You are starting to GROW"/>
                </div>
                {/*
                 <div className={ this.classes.row }>
                 <ProfileInsights />
                 </div>
                 */}
              </div>

              : null }
          </div>
          : null }

          { isPopupMode() ?

            <div className={ this.classes.footer }>
              <div className={ this.classes.almostFooter }>
                <label hidden={ !this.state.validationError} style={{ color: 'red' }}>Please fill all the required fields</label>
              </div>
              <BackButton onClick={() => {
            history.push('/profile');
          }} />
              <div style={{ width: '30px' }} />
              <NextButton onClick={() => {
						if (this.validate()) {
						serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({targetAudience: this.state.targetAudience}))
							.then(function(data){
							});
            history.push('/preferences');
            }
            else {
              this.setState({validationError: true});
            }
          }} />
            </div>

            :
            <div className={ this.classes.footer }>
              <SaveButton onClick={() => {
						let self = this;
		serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({targetAudience: this.state.targetAudience}))
			.then(function(data){
			  self.setState({saveSuceess: true});
			})
			.catch(function(err){
			  self.setState({saveFail: true});
			});
            }} success={ this.state.saveSuceess } fail={ this.state.saveFail }/>
            </div>
          }
        </Page>
    </div>
  }
}