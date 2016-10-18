import React from 'react';

import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';

import Title from 'components/onboarding/Title';
import ProfileProgress from 'components/pages/profile/Progress';
import ProfileInsights from 'components/pages/profile/Insights';
import BackButton from 'components/pages/profile/BackButton';
import NextButton from 'components/pages/profile/NextButton';
import ButtonsSet from 'components/pages/profile/ButtonsSet';
import MarketFitPopup from 'components/pages/profile/MarketFitPopup';
import ProductLaunchPopup from 'components/pages/profile/ProductLaunchPopup';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Label from 'components/ControlsLabel';

import style from 'styles/onboarding/onboarding.css';

import { isPopupMode } from 'modules/popup-mode';
import history from 'history';

export default class Profile extends Component {
  style = style;
  state = {
    highlightInsights: false,
    lifeCyclePopup: 'first'
  };

  render() {
    const selects = {
      industry: {
        label: 'Industry',
        select: {
          name: 'industry',
          onChange: () => {},
          options: [
            { val: 'Apps', label: 'Apps' },
            { val: 'Food Establishment', label: 'Food Establishment' },
            { val: 'Health And Beauty Business', label: 'Health And Beauty Business' },
            { val: 'Lodging Business', label: 'Lodging Business' },
            { val: 'Sports Activity Location', label: 'Sports Activity Location' },
            { val: 'Home And Construction Business', label: 'Home And Construction Business' }
          ]
        }
      },
      category: {
        label: 'Category',
        select: {
          name: 'category',
          onChange: () => {},
          options: [
            { val: 'gaming', label: 'Gaming' },
            { val: 'Business', label: 'Business' },
            { val: 'Education', label: 'Education' },
            { val: 'Lifestyle', label: 'Lifestyle' },
            { val: 'Utilities', label: 'Utilities' },
            { val: 'Bakery', label: 'Bakery' },
            { val: 'Bar', label: 'Bar' },
            { val: 'Coffee Shop', label: 'Coffee Shop' },
            { val: 'Restaurant', label: 'Restaurant' },
            { val: 'Ice Cream Shop', label: 'Ice Cream Shop' },
            { val: 'Beauty Salon', label: 'Beauty Salon' },
            { val: 'Hair Salon', label: 'Hair Salon' },
            { val: 'Nail Salon', label: 'Nail Salon' },
            { val: 'Hostel', label: 'Hostel' },
            { val: 'Hotel', label: 'Hotel' },
            { val: 'Motel', label: 'Motel' },
            { val: 'Gym', label: 'Gym' },
            { val: 'Golf Course', label: 'Golf Course' },
            { val: 'Swimming Pool', label: 'Swimming Pool' },
            { val: 'Ski Resort', label: 'Ski Resort' },
            { val: 'Tennis Complex', label: 'Tennis Complex' },
            { val: 'Electrician', label: 'Electrician' },
            { val: 'House Painter', label: 'House Painter' },
            { val: 'Locksmith', label: 'Locksmith' },
            { val: 'Moving Company', label: 'Moving Company' },
            { val: 'Plumber', label: 'Plumber' }
          ]
        }
      }
    };

    let lifeCyclePopup = [
      <ProductLaunchPopup onNext={() => {
        this.setState({
          lifeCyclePopup: 'second'
        });
      }} onBack={() => {
        this.refs.lifeCycle.selectPrevButton();
        this.refs.lifeCycle.hidePopup();
      }}
      hidden={ this.state.lifeCyclePopup !== 'first' }
      key="first"
      />,
      lifeCyclePopup = <MarketFitPopup onNext={() => {
        this.refs.lifeCycle.selectNextButton();
        this.refs.lifeCycle.hidePopup();

        this.setState({
          lifeCyclePopup: 'first'
        });
      }} onBack={() => {
        this.setState({
          lifeCyclePopup: 'first'
        });
      }} hidden={ this.state.lifeCyclePopup !== 'second' }
      key="second"
      />
    ];


    return <div>
      <Header />
      <Sidebar />
      <Page popup={ isPopupMode() }>
        <Title title="Profile" subTitle="We are going to explore together your company and its basics to analyze it and create the best strategies to fit your company specifications" />
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <div className={ this.classes.row } style={{
              width: '258px'
            }}>
              <Select { ... selects.industry } />
            </div>
            <div className={ this.classes.row } style={{
              width: '258px'
            }}>
              <Select { ... selects.category } />
            </div>
            <div className={ this.classes.row }>
              <Label question={['B2C', 'B2B']}>Orientation</Label>
              <ButtonsSet help buttons={[
                { text: 'B2C', icon: 'buttons:b2c' },
                { text: 'B2B', icon: 'buttons:b2b' },
              ]} />
            </div>
            <div className={ this.classes.row }>
              <Label question={['Product', 'Service']}>Provision</Label>
              <ButtonsSet buttons={[
                { text: 'Product', icon: 'buttons:product' },
                { text: 'Service', icon: 'buttons:service' },
              ]} />
            </div>
            <div className={ this.classes.row }>
              <Label question={['Intro', 'Growth', 'Mature', 'Decline']}>Life Cycle</Label>
              <ButtonsSet ref="lifeCycle" help buttons={[
                { text: 'Intro', icon: 'buttons:intro' },
                { text: 'Growth', icon: 'buttons:growth' },
                { text: 'Mature', icon: 'buttons:mature' },
                { text: 'Decline', icon: 'buttons:decline' },
              ]} popup={ lifeCyclePopup } onChange={() => {
                this.setState({
                  highlightInsights: true
                });
              }} />
            </div>
            <div className={ this.classes.row }>
              <Label question={['Worldwide', 'National', 'Local']}>Coverage</Label>
              <ButtonsSet buttons={[
                { text: 'Worldwide', icon: 'buttons:worldwide' },
                { text: 'National', icon: 'buttons:national' },
                { text: 'Local', icon: 'buttons:local' },
              ]} />
            </div>
            <div className={ this.classes.row }>
              <Label question={['Purchase', 'Subscription']}>Acquisition</Label>
              <ButtonsSet buttons={[
                { text: 'Purchase', icon: 'buttons:purchase' },
                { text: 'Subscription', icon: 'buttons:subscription' },
              ]} />
            </div>
            <div className={ this.classes.row }>
              <Label question>Price</Label>
              <Textfield defaultValue="$" style={{
                width: '166px'
              }} />
            </div>
            {/* Remove row because thought it shouldn't be there */}
            <div className={ this.classes.row }>
              <Label>Enter your main competitor’s website (up to 3)</Label>
              <Textfield defaultValue="http://" style={{
                maxWidth: '440px',
                minWidth: '200px',
                marginBottom: '16px'
              }} />
              <Textfield defaultValue="http://" style={{
                maxWidth: '440px',
                minWidth: '200px',
                marginBottom: '16px'
              }} />
              <Textfield defaultValue="http://" style={{
                maxWidth: '440px',
                minWidth: '200px',
                marginBottom: '16px'
              }} />
            </div>
          </div>

          { isPopupMode() ?

          <div className={ this.classes.colRight }>
            <div className={ this.classes.row }>
              <ProfileProgress progress={ 21 } image={
                require('assets/flower/1.png')
              }
               text="Congrats! The seeds of GROWTH have been planted"/>
            </div>
            <div className={ this.classes.row }>
              <ProfileInsights highlight={ this.state.highlightInsights } />
            </div>
          </div>

          : null }
        </div>

        { isPopupMode() ?

        <div className={ this.classes.footer }>
          <BackButton onClick={() => {
            history.push('/welcome');
          }} />
          <div style={{ width: '30px' }} />
          <NextButton onClick={() => {
            history.push('/target-audience');
          }} />
        </div>

        : null }
      </Page>
    </div>
  }
}