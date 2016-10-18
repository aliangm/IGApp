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
import NotSure from 'components/onboarding/NotSure';
import AudienceTabs from 'components/onboarding/AudienceTabs';

import style from 'styles/onboarding/onboarding.css';
import targeStyle from 'styles/target-audience/target-audience.css';

import { isPopupMode } from 'modules/popup-mode';
import history from 'history';

export default class TargetAudience extends Component {
  style = style
  styles = [targeStyle]

  render() {
    const selects = {
      niche: {
        label: 'Niche',
        select: {
          name: 'niche',
          onChange: () => {},
          options: [
            { label: 'Engineer' },
            { label: 'Marketer' },
            { label: 'Academician' },
            { label: 'Medical' },
            { label: 'Accountant' },
            { label: 'Lawyer' },
          ]
        }
      },
      age: {
        label: 'Age',
        select: {
          name: 'age',
          onChange: () => {},
          options: [
            { label: '0 - 4' },
            { label: '5 - 11' },
            { label: '12 - 17' },
            { label: '18 - 24' },
            { label: '25 - 34' },
            { label: '35 - 45' },
            { label: '46 - 59' },
            { label: '60 - 74' },
            { label: '75 - 89' },
            { label: '90+' }
          ]
        }
      },
      income: {
        label: 'Income',
        select: {
          name: 'income',
          onChange: () => {},
          options: [
            { label: 'Less than $20,000' },
            { label: '$20,000 to $34,999' },
            { label: '$35,000 to $49,999' },
            { label: '$50,000 to $74,999' },
            { label: '$75,000 to $99,999' },
            { label: '$100,000 to $149,999' },
            { label: '$150,000 to $199,999' },
            { label: '$200,000 or more' }
          ]
        }
      },
      loyalty: {
        label: 'Loyalty',
        select: {
          name: 'loyalty',
          onChange: () => {},
          options: [
            { label: 'Extreme' },
            { label: 'High' },
            { label: 'Medium' },
            { label: 'Low' },
            { label: 'None' }
          ]
        }
      },
      gender: {
        label: 'Gender',
        select: {
          name: 'gender',
          onChange: () => {},
          options: [
            { label: 'Male' },
            { label: 'Female' },
            { label: 'Both' },
          ]
        }
      },
      education: {
        label: 'Education',
        select: {
          name: 'education',
          onChange: () => {},
          options: [
            { label: 'Less than high school degree' },
            { label: 'High school degree or equivalent' },
            { label: 'Some college but no degree' },
            { label: 'Associate degree' },
            { label: 'Bachelor degree' },
            { label: 'Graduate degree' }
          ]
        }
      },
      employment: {
        label: 'Employment',
        select: {
          name: 'employment',
          onChange: () => {},
          options: [
            { label: 'Looking for work' },
            { label: 'Employed, working 1-39 hours per week' },
            { label: 'Employed, working 40 or more hours per week' },
            { label: 'Not(Un?) employed' },
            { label: 'Not looking for work' },
            { label: 'Retired' },
            { label: 'Disabled' },
            { label: 'Not(Un?)able to work' }
          ]
        }
      },
      martial_status: {
        label: 'Martial Status',
        select: {
          name: 'martial_status',
          onChange: () => {},
          options: [
            { label: 'Never married' },
            { label: 'Married' },
            { label: 'Separated' },
            { label: 'Divorced' },
            { label: 'Widowed' }
          ]
        }
      },
      have_children: {
        label: 'Have Children',
        select: {
          name: 'have_children',
          onChange: () => {},
          options: [
            { label: 'Yes, they do' },
            { label: 'No, they do not' },
            { label: 'They may or may not' }
          ]
        }
      },
      community: {
        label: 'Community',
        select: {
          name: 'community',
          onChange: () => {},
          options: [
            { label: 'Suburban' },
            { label: 'City or urban' },
            { label: 'Rural' },
            { label: 'Other' }
          ]
        }
      },
    };

    return <div>
      <Header />
      <Sidebar />
      <Page popup={ isPopupMode() }>
        <Title title="Target Audience" subTitle="Who is your target audience? The best marketing strategies are always based on the people you want to reach" />
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <AudienceTabs
              ref="tabs"
              defaultSelected={ 0 }
              getTabName={(index) => `Persona ${index + 1}`}
              defaultTabs={[null]}
            >
              {({ name, index }) => {
                return <div>
                  <div className={ this.classes.row }>
                    <div className={ targeStyle.locals.personaCell }>
                      <Label style={{
                        marginRight: '10px',
                        marginTop: '12px'
                      }}>Name</Label>
                      <Textfield value={ name } onChange={(e) => {
                        this.refs.tabs.setTabName(index, e.target.value);
                      }} />
                      <div style={{ margin: '0 20px' }} />
                      <Label style={{
                        marginRight: '10px',
                        marginTop: '12px'
                      }}>Weight (%)</Label>
                      <Textfield defaultValue={ 50 } style={{
                        width: '70px'
                      }} />
                    </div>
                  </div>
                  <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                    <Select { ... selects.niche } />
                  </div>
                  <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                    <Select { ... selects.age } />
                  </div>
                  <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                    <Select { ... selects.income } />
                  </div>
                  <div className={ this.classes.row }>
                    <Label question>{ selects.loyalty.label }</Label>
                    <div className={ this.classes.cell }>
                      <Select { ... selects.loyalty } label={ null } style={{
                        width: '258px'
                      }} />
                      <NotSure style={{
                        marginLeft: '10px'
                      }} />
                    </div>
                  </div>
                  <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                    <Select { ... selects.gender } />
                  </div>
                  <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                    <Select { ... selects.education } />
                  </div>
                  <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                    <Select { ... selects.employment } />
                  </div>
                  <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                    <Select { ... selects.martial_status } />
                  </div>
                  <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                    <Select { ... selects.have_children } />
                  </div>
                  <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
                    <Select { ... selects.community } />
                  </div>
                </div>
              }}
            </AudienceTabs>
          </div>

          { isPopupMode() ?

          <div className={ this.classes.colRight }>
            <div className={ this.classes.row }>
              <ProfileProgress progress={ 41 } image={
                require('assets/flower/2.png')
              }
                               text=" You are starting to GROW"/>
            </div>
            <div className={ this.classes.row }>
              <ProfileInsights />
            </div>
          </div>

          : null }
        </div>

        { isPopupMode() ?

        <div className={ this.classes.footer }>
          <BackButton onClick={() => {
            history.push('/profile');
          }} />
          <div style={{ width: '30px' }} />
          <NextButton onClick={() => {
            history.push('/goals');
          }} />
        </div>

        : null }
      </Page>
    </div>
  }
}