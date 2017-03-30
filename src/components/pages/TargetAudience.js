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
import ButtonsSet from 'components/pages/profile/ButtonsSet';

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
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleChangeButton = this.handleChangeButton.bind(this);
  }

  componentDidMount(){
    let self = this;
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

  validate() {
    return this.state.targetAudience.role &&
      this.state.targetAudience.managementLevel &&
      this.state.targetAudience.teamSize &&
      this.state.targetAudience.employees &&
      this.state.targetAudience.annualRevenue &&
      this.state.targetAudience.companyType &&
      this.state.targetAudience.age &&
      this.state.targetAudience.salary &&
      this.state.targetAudience.gender &&
      this.state.targetAudience.education &&
      this.state.targetAudience.location &&
      this.state.targetAudience.dailyOnlinePresence;
  }

  handleChangeSelect(parameter, event){
    let update = Object.assign({}, this.state.targetAudience);
    update[parameter] = event.value;
    this.setState({targetAudience: update});
  }

  handleChangeButton(parameter, event){
    let update = Object.assign({}, this.state.targetAudience);
    update[parameter] = event;
    this.setState({targetAudience: update});
  }

  fakeChange(parameter, value, event){
    let update = Object.assign({}, this.state.targetAudience);
    update[parameter] = value;
    this.setState({targetAudience: update});
  }

  render() {
    const selects = {
      reportsTo: {
        label: 'Reports To',
        select: {
          name: 'reportsTo',
          onChange: () => {},
          options: [
            { value: 'Coming Soon', label: 'Coming Soon' },
          ]
        }
      },
      teamSize: {
        label: 'Team Size',
        select: {
          name: 'teamSize',
          onChange: () => {},
          options: [
            { value: '1', label: '1' },
            { value: '2-5', label: '2-5' },
            { value: '6-15', label: '6-15' },
            { value: '16-50', label: '16-50' },
            { value: '51-100', label: '51-100' },
            { value: '>100', label: 'More than 100' },
            { value: 'Any', label: 'Any' },
          ]
        }
      },
      annualRevenue: {
        label: 'Company\'s Annual Revenue',
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
        label: 'Number Of Employees',
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
      location: {
        label: 'Location',
        select: {
          name: 'location',
          onChange: () => {},
          options: [
            { value: 'USA', label: 'USA' },
            { value: 'Canada', label: 'Canada- Coming Soon!' },
            { value: 'Western Europe', label: 'Western Europe- Coming Soon!' },
            { value: 'Eastern Europe', label: 'Eastern Europe- Coming Soon!' },
            { value: 'Latin America', label: 'Latin America- Coming Soon!' },
            { value: 'Asia', label: 'Asia- Coming Soon!' },
            { value: 'Australia', label: 'Australia- Coming Soon!' },
            { value: 'Any', label: 'Any- Coming Soon!' }
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
      <Page popup={ isPopupMode() } width={isPopupMode() ? 'initial' : '1051px'}>
        <Title title="Target Audience" subTitle="Who is your target audience? Who is your buyer persona? The best marketing strategies are always based on the people you want to reach" />
        <div className={ this.classes.error }>
          <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our support. </label>
        </div>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <div className={ this.classes.row }>
              <Label>Company Type</Label>
              <ButtonsSet buttons={[
                { key: 'B2B Software', text: 'B2B Software', icon: 'buttons:b2bSoftware' },
                { key: 'B2C Software', text: 'B2C Software', icon: 'buttons:b2cSoftware' },
                { key: 'Consumer Services & Retail', text: 'Retailer', icon: 'buttons:retailer' },
                { key: 'CPG', text: 'CPG', icon: 'buttons:cpg' },
                { key: 'E-commerce', text: 'E-commerce', icon: 'buttons:ecommerce' },
                { key: 'Food & Beverage', text: 'Food', icon: 'buttons:foodAndBeverage' },
                { key: 'Entertainment', text: 'Entertaiment', icon: 'buttons:entertaiment' },
                { key: 'Professional Services', text: 'Pro Services', icon: 'buttons:professional' },
                { key: 'Any', text: 'Any', icon: 'buttons:any' },
              ]} selectedKey={ this.state.targetAudience.companyType } onChange = {this.handleChangeButton.bind(this, 'companyType')} />
            </div>
            <div className={ this.classes.row } style={{
              width: '258px'
            }}>
              <Select { ... selects.annualRevenue } selected={ this.state.targetAudience.annualRevenue } onChange= { this.handleChangeSelect.bind(this, 'annualRevenue') }/>
            </div>
            <div className={ this.classes.row } style={{
              width: '258px'
            }}>
              <Select { ... selects.employees } selected={ this.state.targetAudience.employees } onChange= { this.handleChangeSelect.bind(this, 'employees') } />
            </div>
            <div className={ this.classes.row }>
              <Label>Role</Label>
              <ButtonsSet buttons={[
                { key: 'General', text: 'General', icon: 'buttons:general' },
                { key: 'Sales', text: 'Sales', icon: 'buttons:sales-role' },
                { key: 'Marketing', text: 'Marketing', icon: 'buttons:marketing' },
                { key: 'R&D', text: 'R&D', icon: 'buttons:rd' },
                { key: 'IT', text: 'IT', icon: 'buttons:IT' },
                { key: 'Security', text: 'Security', icon: 'buttons:security' },
                { key: 'Finance', text: 'Finance', icon: 'buttons:finance' },
                { key: 'HR', text: 'HR', icon: 'buttons:hr' },
                { key: 'Design', text: 'Design', icon: 'buttons:design' },
                { key: 'BizDev', text: 'BizDev', icon: 'buttons:bizdev' },
                { key: 'Other', text: 'Other', icon: 'buttons:any' },
              ]} selectedKey={ this.state.targetAudience.role } onChange = {this.handleChangeButton.bind(this, 'role')} />
            </div>
            <div className={ this.classes.row }>
              <Label>Management Level</Label>
              <ButtonsSet buttons={[
                { key: 'C-Level', text: 'C-Level', icon: 'buttons:cxo' },
                { key: 'Management', text: 'Management', icon: 'buttons:manager' },
                { key: 'Employee', text: 'Employee', icon: 'buttons:employee' },
              ]} selectedKey={ this.state.targetAudience.managementLevel } onChange = {this.handleChangeButton.bind(this, 'managementLevel')} />
            </div>
            <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
              <Select { ... selects.reportsTo } selected="Coming Soon"/>
            </div>
            <div className={ this.classes.row } style={{
              width: '258px'
            }}>
              <Select { ... selects.teamSize } selected={ this.state.targetAudience.teamSize } onChange= { this.handleChangeSelect.bind(this, 'teamSize') } />
            </div>
            <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
              <Select { ... selects.age } selected={ this.state.targetAudience.age } onChange= { this.handleChangeSelect.bind(this, 'age') } />
            </div>
            <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
              <Select { ... selects.salary } selected={ this.state.targetAudience.salary } onChange= { this.handleChangeSelect.bind(this, 'salary') } />
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
            <div className={ this.classes.row }>
              <Label>Gender</Label>
              <ButtonsSet buttons={[
                { key: 'Male', text: 'Male', icon: 'buttons:male' },
                { key: 'Female', text: 'Female', icon: 'buttons:female' },
                { key: 'Any', text: 'Both', icon: 'buttons:both' },
              ]} selectedKey={ this.state.targetAudience.gender } onChange = {this.handleChangeButton.bind(this, 'gender')} />
            </div>
            <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
              <Select { ... selects.education } selected={ this.state.targetAudience.education } onChange= { this.handleChangeSelect.bind(this, 'education') } />
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
              <Select { ... selects.dailyOnlinePresence } selected={ this.state.targetAudience.dailyOnlinePresence } onChange= { this.handleChangeSelect.bind(this, 'dailyOnlinePresence') } />
            </div>
          </div>

          { isPopupMode() ?

            <div className={ this.classes.colRight }>
              <div className={ this.classes.row }>
                <ProfileProgress progress={ 51 } image={
                require('assets/flower/3.png')
              }
                                 text="You are starting to GROW"/>
              </div>
              {/*
               <div className={ this.classes.row }>
               <ProfileInsights />
               </div>
               */}
            </div>

            : null }
        </div>

        { isPopupMode() ?

          <div className={ this.classes.footer }>
            <div className={ this.classes.almostFooter }>
              <label hidden={ !this.state.validationError} style={{ color: 'red' }}>Please fill all the required fields</label>
            </div>
            <BackButton onClick={() => {
            serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({targetAudience: this.state.targetAudience}))
							.then(function(data){
                history.push('/profile');
            });
          }} />
            <div style={{ width: '30px' }} />
            <NextButton onClick={() => {
						if (this.validate()) {
						serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({targetAudience: this.state.targetAudience}))
							.then(function(data){
                history.push('/preferences');
							});
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
						self.setState({saveFail: false, saveSuceess: false});
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