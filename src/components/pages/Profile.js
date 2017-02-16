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
import SaveButton from 'components/pages/profile/SaveButton';
import ButtonsSet from 'components/pages/profile/ButtonsSet';
import MarketFitPopup from 'components/pages/profile/MarketFitPopup';
import ProductLaunchPopup from 'components/pages/profile/ProductLaunchPopup';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Label from 'components/ControlsLabel';

import style from 'styles/onboarding/onboarding.css';

import { isPopupMode } from 'modules/popup-mode';
import history from 'history';
import serverCommunication from 'data/serverCommunication';


export default class Profile extends Component {


  style = style;
  /*
   state = {
   highlightInsights: false,
   lifeCyclePopup: 'first'
   };
   */
  constructor(props) {
    super(props);
    this.state = { };
    this.state.userProfile = { };

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
              if (data.error) {
                history.push('/');
              }
              else {
                self.setState({
                  userProfile: data.userProfile,
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

  handleChangeSelect(parameter, event){
    let update = Object.assign({}, this.state.userProfile);
    update[parameter] = event.value;
    this.setState({userProfile: update});
  }

  handleChangeButton(parameter, event){
    let update = Object.assign({}, this.state.userProfile);
    update[parameter] = event;
    this.setState({userProfile: update});
  }

  fakeChange(parameter, value){
    let update = Object.assign({}, this.state.userProfile);
    update[parameter] = value;
    this.setState({userProfile: update});
  }

  validate(){
    return this.state.userProfile.vertical &&
      this.state.userProfile.orientation &&
      this.state.userProfile.businessModel &&
      this.state.userProfile.platform &&
      this.state.userProfile.lifeCycle &&
      this.state.userProfile.coverage &&
      this.state.userProfile.price &&
      this.state.userProfile.loyalty &&
      this.state.userProfile.differentiation
  }

  render() {
    const selects = {
      vertical: {
        label: 'Vertical',
        labelQuestion: [],
        description: [],
        select: {
          name: 'vertical',
          //onChange: () => {  },
          options: [
            { value: 'IT', label: 'IT' },
            { value: 'Martech', label: 'Martech' },
            { value: 'BI & Analytics', label: 'BI & Analytics' },
            { value: 'Sales', label: 'Sales' }
          ]
        }
      },
      category: {
        label: 'Category',
        //selected:   this.state.data.userProfile.category ,
        select: {
          name: 'category',
          //onChange: () => { {this.handleChangeGoals} },
          options: [
            { value: 'Gaming', label: 'Gaming' },
            { value: 'Business', label: 'Business' },
            { value: 'Education', label: 'Education' },
            { value: 'Lifestyle', label: 'Lifestyle' },
            { value: 'Utilities', label: 'Utilities' },
            { value: 'Bakery', label: 'Bakery' },
            { value: 'Bar', label: 'Bar' },
            { value: 'Coffee Shop', label: 'Coffee Shop' },
            { value: 'Restaurant', label: 'Restaurant' },
            { value: 'Ice Cream Shop', label: 'Ice Cream Shop' },
            { value: 'Beauty Salon', label: 'Beauty Salon' },
            { value: 'Hair Salon', label: 'Hair Salon' },
            { value: 'Nail Salon', label: 'Nail Salon' },
            { value: 'Hostel', label: 'Hostel' },
            { value: 'Hotel', label: 'Hotel' },
            { value: 'Motel', label: 'Motel' },
            { value: 'Gym', label: 'Gym' },
            { value: 'Golf Course', label: 'Golf Course' },
            { value: 'Swimming Pool', label: 'Swimming Pool' },
            { value: 'Ski Resort', label: 'Ski Resort' },
            { value: 'Tennis Complex', label: 'Tennis Complex' },
            { value: 'Electrician', label: 'Electrician' },
            { value: 'House Painter', label: 'House Painter' },
            { value: 'Locksmith', label: 'Locksmith' },
            { value: 'Moving Company', label: 'Moving Company' },
            {value: 'Test', label: 'Test'},
            { value: 'Plumber', label: 'Plumber' }
          ]
        }
      },
      loyalty: {
        label: 'Loyalty',
        labelQuestion: [''],
        description: ['What is the loyalty level of your customers? If a new/existing competitor offers a new similar product/service, what is the possibility that your user will move to his offer? Please take into consideration: the user dependency on your company in terms of data, how loyal the user is in terms of comfortability, regulation, agreements, network effect and general loyalty (just because your user really likes you 😃).'],
        select: {
          name: 'loyalty',
          onChange: () => {},
          options: [
            { value: 'Extreme', label: 'Extreme' },
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' },
          ]
        }
      },
      price: {
        label: 'Price',
        labelQuestion: [''],
        description: ['What is your main pricing point? \n *In case of SaaS, which annual subscription option is the most popular?'],
        select: {
          name: 'price',
          //onChange: () => {},
          options: [
            { value: '$0', label: '$0' },
            { value: '$1-$10', label: '$1 to $10' },
            { value: '$11-$100', label: '$11 to $100' },
            { value: '$101-$500', label: '$101 to $500' },
            { value: '$501-$1000', label: '$501 to $1000' },
            { value: '$1001-$2500', label: '$1001 to $2500' },
            { value: '$2501-$5000', label: '$2501 to $5000' },
            { value: '$5001-$7500', label: '$5001 to $7500' },
            { value: '$7501-$10000', label: '$7501 to $10,000' },
            { value: '$10001-$75000', label: '$10,001 to $75,000' },
            { value: '>$75000', label: '$75,001 or more' }
          ]
        }
      },
      differentiation: {
        label: 'Differentiation',
        labelQuestion: [''],
        description: ['What is your main differentiation from your competitors? If you’re not sure, please choose ‘Other’.'],
        select: {
          name: 'differentiation',
          options: [
            {value: 'Technology', label: 'Technology'},
            {value: 'High-End', label: 'High-End'},
            {value: 'Low Price', label: 'Low Price'},
            {value: 'Customized', label: 'Customized'},
            {value: 'Unique Value Offer', label: 'Unique Value Offer'},
            {value: 'Other', label: 'Other'},
          ]
        }
      }
    };
    /*
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
     */


    return <div>
      <Header />
      <Sidebar />
      <Page popup={ isPopupMode() }>
        <Title title="Profile" subTitle="We are going to explore together your company and its basics to analyze it and create the best strategies to fit your company specifications" />
        <div className={ this.classes.error }>
          <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our support. </label>
        </div>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            {/**<div className={ this.classes.row } style={{
              width: '258px'
            }}>
             <Select required { ... selects.vertical } selected={ this.state.userProfile.vertical} onChange= { this.handleChangeSelect.bind(this, 'vertical') }/>
             </div>**/}
            <div className={ this.classes.row }>
              <Label question={['']} description={['Which vertical/industry does your company work in?']}>Vertical</Label>
              <ButtonsSet buttons={[
                { key: 'IT', text: 'IT', icon: 'buttons:IT' },
                { key: 'Martech', text: 'Martech', icon: 'buttons:martech' },
                { key: 'BI & Analytics', text: 'BI & Analytics', icon: 'buttons:analytics_BI' },
                { key: 'Sales', text: 'Sales', icon: 'buttons:sales' },
              ]} selectedKey={ this.state.userProfile.vertical } onChange = {this.handleChangeButton.bind(this, 'vertical')} />
            </div>
            {/*<div className={ this.classes.row } style={{
             width: '258px'
             }}>
             <Select { ... selects.category } selected={ this.state.userProfile.category } onChange= { this.handleChangeSelect.bind(this, 'category') }/>
             </div> */}
            <div className={ this.classes.row }>
              <Label question={['']} description={['What is the orientation of your company?']}>Orientation</Label>
              <ButtonsSet buttons={[
                { key: 'B2C', text: 'B2C', icon: 'buttons:b2c' },
                { key: 'B2B', text: 'B2B', icon: 'buttons:b2b' },
              ]}  selectedKey={ this.state.userProfile.orientation } onChange = {this.fakeChange.bind(this, 'orientation', 'B2B')}/>
            </div>
            <div className={ this.classes.row }>
              <Label question={['']} description={['What is your company’s business model? \n *On-prem is a shortcut for On-premises software.']}>Business Model</Label>
              <ButtonsSet buttons={[
                { key: 'SaaS', text: 'SaaS', icon: 'buttons:SaaS' },
                { key: 'On-prem', text: 'On-prem', icon: 'buttons:product' },
                { key: 'Marketplace', text: 'Marketplace', icon: 'buttons:marketplace' },
                { key: 'Freemium', text: 'Freemium', icon: 'buttons:freemium' },
              ]} selectedKey={ this.state.userProfile.businessModel } onChange = {this.fakeChange.bind(this, 'businessModel', 'SaaS')} />
            </div>
            <div className={ this.classes.row }>
              <Label question={['']} description={['What is your main platform? If you’re using all platforms equally, please choose ‘Any’.']}>Platform</Label>
              <ButtonsSet buttons={[
                { key: 'Mobile', text: 'Mobile', icon: 'buttons:mobile' },
                { key: 'Web', text: 'Web', icon: 'buttons:web' },
                { key: 'Desktop', text: 'Desktop', icon: 'buttons:desktop' },
                { key: 'Any', text: 'Any', icon: 'buttons:any' },
              ]} selectedKey={ this.state.userProfile.platform } onChange = {this.handleChangeButton.bind(this, 'platform')} />
            </div>
            <div className={ this.classes.row }>
              <Label question={['', 'Intro', 'Growth', 'Mature', 'Decline']} description={['Which stage of a company lifecycle currently fits your company?', 'pre-product/market fit.', 'reached product/market fit, sales begin to increase.', 'sales reached / are reaching their peak.', 'sales begin to decline as the product reaches its saturation point.']}>Life Cycle</Label>
              <ButtonsSet ref="lifeCycle" buttons={[
                { key: 'Intro', text: 'Intro', icon: 'buttons:intro' },
                { key: 'Growth', text: 'Growth', icon: 'buttons:growth' },
                { key: 'Mature', text: 'Mature', icon: 'buttons:mature' },
                { key: 'Decline', text: 'Decline', icon: 'buttons:decline' },
              ]} selectedKey={ this.state.userProfile.lifeCycle } onChange = {this.handleChangeButton.bind(this, 'lifeCycle')}/>
            </div>
            <div className={ this.classes.row }>
              <Label question={['']} description={['What is your distribution strategy in terms of location? If you’re not sure, please choose ‘Any’.']}>Coverage</Label>
              <ButtonsSet buttons={[
                { key: 'Worldwide', text: 'Worldwide', icon: 'buttons:worldwide' },
                { key: 'Nationwide', text: 'Nationwide', icon: 'buttons:national' },
                { key: 'Local', text: 'Local', icon: 'buttons:local' },
                { key: 'Any', text: 'Any', icon: 'buttons:any2' },
              ]} selectedKey={ this.state.userProfile.coverage } onChange = {this.handleChangeButton.bind(this, 'coverage')} />
            </div>
            <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
              <Select { ... selects.price } selected={ this.state.userProfile.price} onChange= { this.handleChangeSelect.bind(this, 'price') }/>
            </div>
            <div className={ this.classes.row } style={{
                    width: '258px'
                  }}>
              <Select { ... selects.loyalty } selected={ this.state.userProfile.loyalty} onChange= { this.handleChangeSelect.bind(this, 'loyalty') }/>
            </div>
            {/*      <div className={ this.classes.row }>
             <Label question>{ selects.loyalty.label }</Label>
             <div className={ this.classes.cell }>
             <Select { ... selects.loyalty } selected={ this.state.userProfile.loyalty} onchange= { this.handleChangeSelect.bind(this, 'loyalty') } label={ null } style={{
             width: '258px'
             }} />
             </div>
             </div> */}
            {/*   <div className={ this.classes.row }>
             <Label question={['Product', 'Service']}>Differentiation</Label>
             <ButtonsSet buttons={[
             { key: 'Technology', text: 'Technology', icon: 'buttons:intro' },
             { key: 'High-End', text: 'High-End', icon: 'buttons:growth' },
             { key: 'Low Price', text: 'Low Price', icon: 'buttons:mature' },
             { key: 'Customized', text: 'Customized', icon: 'buttons:decline' },
             { key: 'Low Touch', text: 'Low Touch', icon: 'buttons:decline' },
             { key: 'Unique Value Offer', text: 'Unique Value Offer', icon: 'buttons:decline' },
             ]} selectedKey={ this.state.userProfile.differentiation } onChange = {this.handleChangeButton.bind(this, 'differentiation')} />
             </div> */}
            <div className={ this.classes.row } style={{
              			marginBottom: '200px',
                    width: '258px'
                  }}>
              <Select { ... selects.differentiation } selected={ this.state.userProfile.differentiation} onChange= { this.handleChangeSelect.bind(this, 'differentiation') }/>
            </div>
            {
              /*
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
               */
            }

          </div>


          { isPopupMode() ?

            <div className={ this.classes.colRight }>
              <div className={ this.classes.row }>
                <ProfileProgress progress={ 26 } image={
                require('assets/flower/1.png')
              }
                                 text="Congrats! The seeds of GROWTH have been planted"/>
              </div>
              {/*
               <div className={ this.classes.row }>
               <ProfileInsights highlight={ this.state.highlightInsights } />
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
             serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({userProfile: this.state.userProfile}))
			        .then(function(data){
            history.push('/welcome');
            })
          }} />
            <div style={{ width: '30px' }} />
            <NextButton onClick={() =>
              {
              if (this.validate()){
          	serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({userProfile: this.state.userProfile}))
			        .then(function(data){
			          history.push('/target-audience');
			        });
            }
            else{
              this.setState({validationError: true});
            }
          }} />
          </div>
          :
          <div className={ this.classes.footer }>
            <SaveButton onClick={() => {
              let self = this;
              self.setState({saveFail: false, saveSuceess: false});
		serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({userProfile: this.state.userProfile}))
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