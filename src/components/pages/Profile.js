import React from 'react';

import Component from 'components/Component';
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
import MultiRow from 'components/MultiRow';
import Select from 'components/controls/Select';
import Toggle from 'components/controls/Toggle';
import Label from 'components/ControlsLabel';
import Textfield from 'components/controls/Textfield';
import style from 'styles/onboarding/onboarding.css';
import preferencesStyle from 'styles/preferences/preferences.css';
import {isPopupMode} from 'modules/popup-mode';
import history from 'history';

export default class Profile extends Component {


  style = style;
  styles = [preferencesStyle];
  /*
   state = {
   highlightInsights: false,
   lifeCyclePopup: 'first'
   };
   */
  static defaultProps = {
    userProfile: {},
    pricingTiers: []
  };

  constructor(props) {
    super(props);
    this.state = {};

    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleChangeButton = this.handleChangeButton.bind(this);
  }

  handleChangeSelect(parameter, event) {
    let update = Object.assign({}, this.props.userProfile);
    update[parameter] = event.value;
    this.props.updateState({userProfile: update});
  }

  handleChangeButton(parameter, event) {
    let update = Object.assign({}, this.props.userProfile);
    update[parameter] = event;
    this.props.updateState({userProfile: update});
  }

  fakeChange(parameter, value) {
    let update = Object.assign({}, this.props.userProfile);
    update[parameter] = value;
    this.props.updateState({userProfile: update});
  }

  validate() {
    return this.props.pricingTiers &&
      this.props.pricingTiers.length > 0 &&
      this.props.userProfile.vertical &&
      this.props.userProfile.orientation &&
      this.props.userProfile.businessModel &&
      this.props.userProfile.seatsPerAccount &&
      this.props.userProfile.platform &&
      this.props.userProfile.lifeCycle &&
      this.props.userProfile.coverage &&
      this.props.userProfile.loyalty &&
      this.props.userProfile.differentiation
  }

  handleChangePricing(parameter, index, event) {
    let pricingTiers = this.props.pricingTiers || [];
    if (!pricingTiers[index]) {
      pricingTiers.push({});
    }
    pricingTiers[index][parameter] = parseInt(event.target.value.replace(/[-%$,]/g, ''));
    this.props.updateState({pricingTiers: pricingTiers});
  }

  handleChangePricingPaid(isMonthly, index) {
    let pricingTiers = this.props.pricingTiers || [];
    if (!pricingTiers[index]) {
      pricingTiers.push({});
    }
    pricingTiers[index].isMonthly = isMonthly;
    this.props.updateState({pricingTiers: pricingTiers});
  }

  pricingTierRemove(index) {
    let pricingTiers = this.props.pricingTiers || [];
    pricingTiers.splice(index,1);
    this.props.updateState({pricingTiers: pricingTiers});
  }

  calculatePricing(callback) {
    let update = Object.assign({}, this.props.userProfile);

    const price = this.props.pricingTiers.reduce((sum, item) => {
      return sum + item.weight / 100 * item.price * (item.isMonthly ? 12 : 1);
    }, 0);

    if (price === 0)
      update.price = "$0";
    else if (price > 0 && price <= 10)
      update.price = "$1-$10";
    else if (price > 10 && price <= 100)
      update.price = "$11-$100";
    else if (price > 100 && price <= 500)
      update.price = "$101-$500";
    else if (price > 500 && price <= 1000)
      update.price = "$501-$1000";
    else if (price > 1000 && price <= 2500)
      update.price = "$1001-$2500";
    else if (price > 2500 && price <= 5000)
      update.price = "$2501-$5000";
    else if (price > 5000 && price <= 7500)
      update.price = "$5001-$7500";
    else if (price > 7500 && price <= 10000)
      update.price = "$7501-$10000";
    else if (price > 10000 && price <= 75000)
      update.price = "$10001-$75000";
    else if (price > 75000)
      update.price = ">$75000";

    this.props.updateState({userProfile: update}, callback);
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
            {value: 'IT', label: 'IT'},
            {value: 'Martech', label: 'Martech'},
            {value: 'BI & Analytics', label: 'BI & Analytics'},
            {value: 'Sales', label: 'Sales'}
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
            {value: 'Gaming', label: 'Gaming'},
            {value: 'Business', label: 'Business'},
            {value: 'Education', label: 'Education'},
            {value: 'Lifestyle', label: 'Lifestyle'},
            {value: 'Utilities', label: 'Utilities'},
            {value: 'Bakery', label: 'Bakery'},
            {value: 'Bar', label: 'Bar'},
            {value: 'Coffee Shop', label: 'Coffee Shop'},
            {value: 'Restaurant', label: 'Restaurant'},
            {value: 'Ice Cream Shop', label: 'Ice Cream Shop'},
            {value: 'Beauty Salon', label: 'Beauty Salon'},
            {value: 'Hair Salon', label: 'Hair Salon'},
            {value: 'Nail Salon', label: 'Nail Salon'},
            {value: 'Hostel', label: 'Hostel'},
            {value: 'Hotel', label: 'Hotel'},
            {value: 'Motel', label: 'Motel'},
            {value: 'Gym', label: 'Gym'},
            {value: 'Golf Course', label: 'Golf Course'},
            {value: 'Swimming Pool', label: 'Swimming Pool'},
            {value: 'Ski Resort', label: 'Ski Resort'},
            {value: 'Tennis Complex', label: 'Tennis Complex'},
            {value: 'Electrician', label: 'Electrician'},
            {value: 'House Painter', label: 'House Painter'},
            {value: 'Locksmith', label: 'Locksmith'},
            {value: 'Moving Company', label: 'Moving Company'},
            {value: 'Test', label: 'Test'},
            {value: 'Plumber', label: 'Plumber'}
          ]
        }
      },
      loyalty: {
        label: 'Loyalty',
        labelQuestion: [''],
        description: ['What is the loyalty level of your customers? If a new/existing competitor offers a new similar product/service, what is the possibility that your user will move to his offer? Please take into consideration: the user dependency on your company in terms of data, how loyal the user is in terms of comfortability, regulation, agreements, network effect and general loyalty (just because your user really likes you 😃).'],
        select: {
          name: 'loyalty',
          onChange: () => {
          },
          options: [
            {value: 'Extreme', label: 'Extreme'},
            {value: 'High', label: 'High'},
            {value: 'Medium', label: 'Medium'},
            {value: 'Low', label: 'Low'},
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
      },
      seatsPerAccount: {
        label: 'Number Of Seats Per Account',
        labelQuestion: [''],
        description: ['If SaaS, what is your average number of seats per account?'],
        select: {
          name: 'seatsPerAccount',
          options: [
            {value: '1', label: '1'},
            {value: '2-5', label: '2-5'},
            {value: '6-15', label: '6-15'},
            {value: '16-50', label: '16-50'},
            {value: '51-100', label: '51-100'},
            {value: '>100', label: 'More than 100'},
            {value: 'Any', label: 'Any'},
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
      <Page popup={ isPopupMode() }>
        <Title title="Company"
               subTitle="We are going to explore together your company and its basics to analyze it and create the best strategies to fit your company specifications"/>
        <div className={ this.classes.error }>
          <label hidden={ !this.state.serverDown }>Something is wrong... Let us check what is it and fix it for you :)</label>
        </div>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            {/**<div className={ this.classes.row } style={{
              width: '258px'
            }}>
             <Select required { ... selects.vertical } selected={ this.props.userProfile.vertical} onChange= { this.handleChangeSelect.bind(this, 'vertical') }/>
             </div>**/}
            <div className={ this.classes.row }>
              <Label question={['']}
                     description={['Which vertical/industry does your company work in?']}>Vertical</Label>
              <ButtonsSet buttons={[
                {key: 'Martech', text: 'Martech', icon: 'buttons:martech'},
                {key: 'BI & Analytics', text: 'BI & Analytics', icon: 'buttons:analytics_BI'},
                {key: 'Sales', text: 'Sales', icon: 'buttons:sales'},
                {key: 'Security', text: 'Security', icon: 'buttons:security'},
                {key: 'IT', text: 'IT', icon: 'buttons:IT'},
                {key: 'Productivity', text: 'Productivity', icon: 'buttons:productivity'},
                {key: 'Finance', text: 'Finance', icon: 'buttons:finance'},
              ]} selectedKey={ this.props.userProfile.vertical }
                          onChange={this.handleChangeButton.bind(this, 'vertical')}/>
            </div>
            {/*<div className={ this.classes.row } style={{
             width: '258px'
             }}>
             <Select { ... selects.category } selected={ this.props.userProfile.category } onChange= { this.handleChangeSelect.bind(this, 'category') }/>
             </div> */}
            <div className={ this.classes.row }>
              <Label question={['']} description={['What is the orientation of your company?']}>Orientation</Label>
              <ButtonsSet buttons={[
                {key: 'B2C', text: 'B2C', icon: 'buttons:b2c'},
                {key: 'B2B', text: 'B2B', icon: 'buttons:b2b'},
              ]} selectedKey={ this.props.userProfile.orientation }
                          onChange={this.fakeChange.bind(this, 'orientation', 'B2B')}/>
            </div>
            <div className={ this.classes.row }>
              <Label question={['']}
                     description={['What is your company’s business model? \n *On-prem is a shortcut for On-premises software.']}>Business
                Model</Label>
              <ButtonsSet buttons={[
                {key: 'SaaS', text: 'SaaS', icon: 'buttons:SaaS'},
                {key: 'On-prem', text: 'On-prem', icon: 'buttons:product'},
                {key: 'Marketplace', text: 'Marketplace', icon: 'buttons:marketplace'},
                {key: 'Freemium', text: 'Freemium', icon: 'buttons:freemium'},
              ]} selectedKey={ this.props.userProfile.businessModel }
                          onChange={this.fakeChange.bind(this, 'businessModel', 'SaaS')}/>
            </div>
            <div className={ this.classes.row } style={{
              width: '258px'
            }}>
              <Select { ... selects.seatsPerAccount } selected={ this.props.userProfile.seatsPerAccount}
                      onChange={ this.handleChangeSelect.bind(this, 'seatsPerAccount') }/>
            </div>
            <div className={ this.classes.row }>
              <Label style={{ marginBottom: '12px', fontWeight: '600' }} question={['']} description={['What is your main pricing point? \n *In case of SaaS, which annual subscription option is the most popular?']}>
                Price
              </Label>
              <MultiRow numOfRows={ this.props.pricingTiers.length } rowRemoved={ this.pricingTierRemove }>
                {({index, data, update, removeButton}) => {
                  return <div>
                    <div className={preferencesStyle.locals.channelsRow}>
                      <Label style={{
                        marginBottom: '0',
                        fontWeight: '600'
                      }}>{`Tier ${ index + 1 }`} </Label>
                    </div>
                    <div style={{
                    }} className={ preferencesStyle.locals.channelsRow }>
                      <div className={ preferencesStyle.locals.objectiveText }>Price</div>
                      <Textfield value={ this.props.pricingTiers[index] && this.props.pricingTiers[index].price ? '$' + this.props.pricingTiers[index].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '' } style={{width: '80px', marginLeft: '10px'}} onChange={ this.handleChangePricing.bind(this, 'price', index) } placeHolder="$"/>
                      <div className={ preferencesStyle.locals.objectiveText } style={{marginLeft: '20px'}}>Paid</div>
                      <Toggle leftText="Monthly" rightText="Annualy" leftActive={ this.props.pricingTiers[index] && this.props.pricingTiers[index].isMonthly } leftClick={ this.handleChangePricingPaid.bind(this, true, index) } rightClick={ this.handleChangePricingPaid.bind(this, false, index) } style={{ marginLeft: '10px' }}/>
                      <div className={ preferencesStyle.locals.objectiveText } style={{marginLeft: '20px'}}>Weight</div>
                      <Textfield value={ this.props.pricingTiers[index] && this.props.pricingTiers[index].weight ? this.props.pricingTiers[index].weight + '%' : '' } style={{width: '80px', marginLeft: '10px'}} onChange={ this.handleChangePricing.bind(this, 'weight', index) } placeHolder="%"/>
                      <div className={preferencesStyle.locals.channelsRemove} style={{marginTop: '5px'}}>
                        {removeButton}
                      </div>
                    </div>
                  </div>
                }}
              </MultiRow>
            </div>
            <div className={ this.classes.row }>
              <Label question={['']}
                     description={['What is your main platform? If you’re using all platforms equally, please choose ‘Any’.']}>Platform</Label>
              <ButtonsSet buttons={[
                {key: 'Mobile', text: 'Mobile', icon: 'buttons:mobile'},
                {key: 'Web', text: 'Web', icon: 'buttons:web'},
                {key: 'Desktop', text: 'Desktop', icon: 'buttons:desktop'},
                {key: 'Any', text: 'Any', icon: 'buttons:any'},
              ]} selectedKey={ this.props.userProfile.platform }
                          onChange={this.handleChangeButton.bind(this, 'platform')}/>
            </div>
            <div className={ this.classes.row }>
              <Label question={['', 'Intro', 'Growth', 'Mature', 'Decline']}
                     description={['Which stage of a company lifecycle currently fits your company?', 'pre-product/market fit.', 'reached product/market fit, sales begin to increase.', 'sales reached / are reaching their peak.', 'sales begin to decline as the product reaches its saturation point.']}>Life
                Cycle</Label>
              <ButtonsSet ref="lifeCycle" buttons={[
                {key: 'Intro', text: 'Intro', icon: 'buttons:intro'},
                {key: 'Growth', text: 'Growth', icon: 'buttons:growth'},
                {key: 'Mature', text: 'Mature', icon: 'buttons:mature'},
                {key: 'Decline', text: 'Decline', icon: 'buttons:decline'},
              ]} selectedKey={ this.props.userProfile.lifeCycle }
                          onChange={this.handleChangeButton.bind(this, 'lifeCycle')}/>
            </div>
            <div className={ this.classes.row }>
              <Label question={['']}
                     description={['What is your distribution strategy in terms of location? If you’re not sure, please choose ‘Any’.']}>Coverage</Label>
              <ButtonsSet buttons={[
                {key: 'Worldwide', text: 'Worldwide', icon: 'buttons:worldwide'},
                {key: 'Nationwide', text: 'Nationwide', icon: 'buttons:national'},
                {key: 'Local', text: 'Local', icon: 'buttons:local'},
                {key: 'Any', text: 'Any', icon: 'buttons:any2'},
              ]} selectedKey={ this.props.userProfile.coverage }
                          onChange={this.handleChangeButton.bind(this, 'coverage')}/>
            </div>
            <div className={ this.classes.row } style={{
              width: '258px'
            }}>
              <Select { ... selects.loyalty } selected={ this.props.userProfile.loyalty}
                      onChange={ this.handleChangeSelect.bind(this, 'loyalty') }/>
            </div>
            {/*      <div className={ this.classes.row }>
             <Label question>{ selects.loyalty.label }</Label>
             <div className={ this.classes.cell }>
             <Select { ... selects.loyalty } selected={ this.props.userProfile.loyalty} onchange= { this.handleChangeSelect.bind(this, 'loyalty') } label={ null } style={{
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
             ]} selectedKey={ this.props.userProfile.differentiation } onChange = {this.handleChangeButton.bind(this, 'differentiation')} />
             </div> */}
            <div className={ this.classes.row } style={{
              marginBottom: '200px',
              width: '258px'
            }}>
              <Select { ... selects.differentiation } selected={ this.props.userProfile.differentiation}
                      onChange={ this.handleChangeSelect.bind(this, 'differentiation') }/>
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
              <label hidden={ !this.state.validationError} style={{color: 'red'}}>Please fill all the required
                fields</label>
            </div>
            <BackButton onClick={() => {
              this.calculatePricing(()=> {
                this.props.updateUserMonthPlan({userProfile: this.props.userProfile, pricingTiers: this.props.pricingTiers, planNeedsUpdate: true}, this.props.region, this.props.planDate)
                  .then(() => {
                    history.push('/welcome');
                  });
              });
            }}/>
            <div style={{width: '30px'}}/>
            <NextButton onClick={() => {
              if (this.validate()) {
                this.calculatePricing(() => {
                  this.props.updateUserMonthPlan({userProfile: this.props.userProfile, pricingTiers: this.props.pricingTiers, planNeedsUpdate: true}, this.props.region, this.props.planDate)
                    .then(() => {
                      history.push('/target-audience');
                    });
                });
              }
              else {
                this.setState({validationError: true});
              }
            }}/>
          </div>
          :
          <div className={ this.classes.footer }>
            <SaveButton onClick={() => {
              this.setState({saveFail: false, saveSuccess: false});
              this.calculatePricing(()=> {
                this.props.updateUserMonthPlan({userProfile: this.props.userProfile, pricingTiers: this.props.pricingTiers, planNeedsUpdate: true}, this.props.region, this.props.planDate);
                this.setState({saveSuccess: true});
              });
            }} success={ this.state.saveSuccess } fail={ this.state.saveFail }/>
          </div>
        }
      </Page>
    </div>
  }
}