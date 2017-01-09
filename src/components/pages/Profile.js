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
		if (isPopupMode()){
			self.setState({isLoaded: true});
		}
		else {
			serverCommunication.serverRequest('GET', 'usermonthplan')
				.then((response) => {
					response.json()
						.then(function (data) {
							if (data) {
								self.setState({userProfile: data.userProfile});
								self.setState({isLoaded: true});
							}
						})
				})
				.catch(function (err) {
					console.log(err);
				})
		}
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

	render() {
		const selects = {
			vertical: {
				label: 'Vertical',
				select: {
					name: 'vertical',
					//onChange: () => {  },
					options: [
						{ value: 'Apps', label: 'Apps' },
						{ value: 'Food Establishment', label: 'Food Establishment' },
						{ value: 'Health And Beauty Business', label: 'Health And Beauty Business' },
						{ value: 'Lodging Business', label: 'Lodging Business' },
						{ value: 'Sports Activity Location', label: 'Sports Activity Location' },
						{ value: 'Home And Construction Business', label: 'Home And Construction Business' }
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
				select: {
					name: 'loyalty',
					onChange: () => {},
					options: [
						{ value: 'Extreme', label: 'Extreme' },
						{ value: 'High', label: 'High' },
						{ value: 'Medium', label: 'Medium' },
						{ value: 'Low', label: 'Low' },
						{ value: 'None', label: 'None' }
					]
				}
			},
			price: {
				label: 'Price',
				select: {
					name: 'price',
					//onChange: () => {},
					options: [
						{ value: '$0', label: '$0' },
						{ value: '$1-$10', label: '$1 to $10' },
						{ value: '$11-$100', label: '$11 to $100' },
						{ value: '$101-$1000', label: '$101 to $1000' },
						{ value: '$1001-$5000', label: '$1001 to $5000' },
						{ value: '$5000-$10000', label: '$5000 to $10,000' },
						{ value: '>$10000', label: '$10,000 or more' }
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
			{ this.state.isLoaded ?
			<Page popup={ isPopupMode() }>
				<Title title="Profile" subTitle="We are going to explore together your company and its basics to analyze it and create the best strategies to fit your company specifications" />
				<div className={ this.classes.cols }>
					<div className={ this.classes.colLeft }>
						<div className={ this.classes.row } style={{
              width: '258px'
            }}>
							<Select { ... selects.vertical } selected={ this.state.userProfile.vertical} onChange= { this.handleChangeSelect.bind(this, 'vertical') }/>
						</div>
						<div className={ this.classes.row } style={{
              width: '258px'
            }}>
							<Select { ... selects.category } selected={ this.state.userProfile.category } onChange= { this.handleChangeSelect.bind(this, 'category') }/>
						</div>
						<div className={ this.classes.row }>
							<Label question={['B2C', 'B2B']}>Orientation</Label>
							<ButtonsSet buttons={[
                { key: 'B2C', text: 'B2C', icon: 'buttons:b2c' },
                { key: 'B2B', text: 'B2B', icon: 'buttons:b2b' },
              ]} selectedKey='B2B' />
						</div>
						<div className={ this.classes.row }>
							<Label question={['Product', 'Service']}>Business Model</Label>
							<ButtonsSet buttons={[
                { key: 'SaaS', text: 'SaaS', icon: 'buttons:product' },
                { key: 'SaaP', text: 'SaaP', icon: 'buttons:product' },
                { key: 'Marketplace', text: 'Marketplace', icon: 'buttons:product' },
                { key: 'On Demand', text: 'On Demand', icon: 'buttons:service' },
                { key: 'Freemium', text: 'Freemium', icon: 'buttons:service' },
              ]} selectedKey={ this.state.userProfile.businessModel } onChange = {this.handleChangeButton.bind(this, 'businessModel') }/>
						</div>
						<div className={ this.classes.row }>
							<Label question={['Product', 'Service']}>Platform</Label>
							<ButtonsSet buttons={[
                { key: 'Mobile', text: 'Mobile', icon: 'buttons:product' },
                { key: 'Web', text: 'Web', icon: 'buttons:service' },
                { key: 'Desktop', text: 'Desktop', icon: 'buttons:service' },
              ]} selectedKey={ this.state.userProfile.platform } onChange = {this.handleChangeButton.bind(this, 'platform')} />
						</div>
						<div className={ this.classes.row }>
							<Label question={['Intro', 'Growth', 'Mature', 'Decline']}>Life Cycle</Label>
							<ButtonsSet ref="lifeCycle" buttons={[
                { key: 'Intro', text: 'Intro', icon: 'buttons:intro' },
                { key: 'Growth', text: 'Growth', icon: 'buttons:growth' },
                { key: 'Mature', text: 'Mature', icon: 'buttons:mature' },
                { key: 'Decline', text: 'Decline', icon: 'buttons:decline' },
              ]} selectedKey={ this.state.userProfile.lifeCycle } onChange = {this.handleChangeButton.bind(this, 'lifeCycle')}/>
						</div>
						<div className={ this.classes.row }>
							<Label question={['Worldwide', 'National', 'Local']}>Coverage</Label>
							<ButtonsSet buttons={[
                { key: 'Worldwide', text: 'Worldwide', icon: 'buttons:worldwide' },
                { key: 'National', text: 'National', icon: 'buttons:national' },
                { key: 'Local', text: 'Local', icon: 'buttons:local' },
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
						<div className={ this.classes.row }>
							<Label question={['Product', 'Service']}>Differentiation</Label>
							<ButtonsSet buttons={[
                { key: 'Technology', text: 'Technology', icon: 'buttons:intro' },
                { key: 'Luxury', text: 'Luxury', icon: 'buttons:growth' },
                { key: 'Low Price', text: 'Low Price', icon: 'buttons:mature' },
                { key: 'Customized', text: 'Customized', icon: 'buttons:decline' },
                { key: 'Low Touch', text: 'Low Touch', icon: 'buttons:decline' },
                { key: 'Unique Value Offer', text: 'Unique Value Offer', icon: 'buttons:decline' },
                { key: 'Other', text: 'Other', icon: 'buttons:decline' },
              ]} selectedKey={ this.state.userProfile.differentiation } onChange = {this.handleChangeButton.bind(this, 'differentiation')} />
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
								<ProfileProgress progress={ 21 } image={
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
						<BackButton onClick={() => {
            history.push('/welcome');
          }} />
						<div style={{ width: '30px' }} />
						<NextButton onClick={() => {
          	serverCommunication.serverRequest('POST', 'usermonthplan', JSON.stringify({userProfile: this.state.userProfile}))
			.then(function(data){
				console.log(data);
			});
            history.push('/target-audience');
          }} />
					</div>

					:
					<div className={ this.classes.footer }>
						<SaveButton onClick={() => {
		serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({userProfile: this.state.userProfile}))
			.then(function(data){
				console.log(data);
			});	
            }} />
					</div>
				}
			</Page>
				: null }
		</div>
	}
}