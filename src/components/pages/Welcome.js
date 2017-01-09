import React from 'react';

import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';
import BackButton from 'components/pages/profile/BackButton';
import NextButton from 'components/pages/profile/NextButton';
import SaveButton from 'components/pages/profile/SaveButton';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Button from 'components/controls/Button';
import Label from 'components/ControlsLabel';

import Title from 'components/onboarding/Title';

import style from 'styles/onboarding/onboarding.css';
import welcomeStyle from 'styles/welcome/welcome.css';

import { isPopupMode } from 'modules/popup-mode';
import history from 'history';
import serverCommunication from 'data/serverCommunication';

export default class Welcome extends Component {
	style = style;
	styles = [welcomeStyle]

	constructor(props) {
		super(props);
		this.state = { };
		this.state.userAccount = { };
		this.state.userAccount.companyWebsite = 'http://';
		this.state.userAccount.competitorsWebsites = ['http://','http://','http://'];
		this.handleChange = this.handleChange.bind(this);
		this.handleChangeSelect = this.handleChangeSelect.bind(this);
		this.handleChangeArray = this.handleChangeArray.bind(this);

	}

	componentDidMount() {
		let self = this;
		if (isPopupMode()){
			self.setState({isLoaded: true});
		}
		else {
			serverCommunication.serverRequest('GET', 'useraccount')
				.then((response) => {
					response.json()
						.then(function (data) {
							self.setState({userAccount: data});
							self.setState({isLoaded: true});
						})
				})
				.catch(function (err) {
					console.log(err);
				})
		}
	}

	handleChange(parameter, event){
		let update = Object.assign({}, this.state.userAccount);
		update[parameter] = event.target.value;
		this.setState({userAccount: update});
	}

	handleChangeSelect(parameter, event){
		let update = Object.assign({}, this.state.userAccount);
		update[parameter] = event.value;
		this.setState({userAccount: update});
	}

	handleChangeArray(parameter, index, event) {

		let update = Object.assign({}, this.state.userAccount);
		//update[parameter] = this.state.userAccount[parameter].slice()
		update[parameter][index] = event.target.value;
		this.setState({userAccount: update});
	}

	render() {
		const selects = {
			role: {
				label: 'Your role',
				labelQuestion: false,
				select: {
					menuTop: true,
					name: 'role',
					onChange: () => {},
					options: [
						{ value: 'CMO', label: 'CMO' },
						{ value: 'VP Marketing', label: 'VP Marketing' },
						{ value: 'Chief Marketing Technologist (CMT)', label: 'Chief Marketing Technologist (CMT)' },
						{ value: 'Director of Marketing', label: 'Director of Marketing' },
						{ value: 'Head of Marketing', label: 'Head of Marketing' },
						{ value: 'Marketing Manager', label: 'Marketing Manager' },
						{ value: 'CEO', label: 'CEO' },
						{ value: 'CRO', label: 'CRO' },
						{ value: 'Marketer', label: 'Marketer' },
					]
				}
			}
		};

		return <div>
			<Header user={ false } />
			<Sidebar />
			{ this.state.isLoaded ?
				<Page popup={ isPopupMode() }>
					<Title title="Welcome! Let's get you started" subTitle="We are looking to better understand who you are so that we can adjust our recommendations to fit you" />

					<div className={ this.classes.cols }>
						<div className={ this.classes.colCenter }>
							<div className={ this.classes.row }>
								<Label>Enter your brand/company name</Label>
								<Textfield value={ this.state.userAccount.companyName || "" } onChange={ this.handleChange.bind(this, 'companyName')}/>
							</div>
							<div className={ this.classes.row }>
								<Label>Company Website</Label>
								<Textfield value={ this.state.userAccount.companyWebsite} onChange={ this.handleChange.bind(this, 'companyWebsite')}/>
							</div>
							<div className={ this.classes.row }>
								<Label>First Name</Label>
								<Textfield value={ this.state.userAccount.firstName || ""} onChange={ this.handleChange.bind(this, 'firstName')}/>
							</div>
							<div className={ this.classes.row }>
								<Label>Last Name</Label>
								<Textfield value={ this.state.userAccount.lastName || ""} onChange={ this.handleChange.bind(this, 'lastName')}/>
							</div>
							<div className={ this.classes.row }>
								<Select { ... selects.role } className={ welcomeStyle.locals.select } selected={ this.state.userAccount.role} onChange={ this.handleChangeSelect.bind(this, 'role')} />
								{ /*	<div className={ welcomeStyle.locals.logoCell }>
								 <Select { ... selects.role } className={ welcomeStyle.locals.select } />
								 <div className={ welcomeStyle.locals.logoWrap }>
								 <Label>Logo</Label>
								 <div className={ welcomeStyle.locals.logo }></div>
								 </div>
								 </div> */}
							</div>
							<div className={ this.classes.row }>
								<Label>Enter your main competitor’s website (up to 3)</Label>
								<Textfield value = { this.state.userAccount.competitorsWebsites[0] } style={{ marginBottom: '16px' }} onChange={ this.handleChangeArray.bind(this, 'competitorsWebsites', 0)}/>
								<Textfield value = { this.state.userAccount.competitorsWebsites[1] } style={{ marginBottom: '16px' }} onChange={ this.handleChangeArray.bind(this, 'competitorsWebsites', 1)}/>
								<Textfield value = { this.state.userAccount.competitorsWebsites[2] } style={{ marginBottom: '16px' }} onChange={ this.handleChangeArray.bind(this, 'competitorsWebsites', 2)}/>
							</div>
						</div>
					</div>

					<div style={{
          height: '30px'
        }} />

					{ isPopupMode() ?

						<div className={ this.classes.footerCols }>
							<div className={ this.classes.footerLeft }>
								<Button type="normal" style={{
              letterSpacing: '0.075',
              width: '150px'
            }} onClick={() => {
              history.push('/profile');
            }}>Skip this step</Button>
							</div>
							<div className={ this.classes.footerRight }>
								<BackButton onClick={() => {
              history.push('/signin');
            }} />
								<div style={{ width: '30px' }} />
								<NextButton onClick={() => {
		serverCommunication.serverRequest('PUT', 'useraccount', JSON.stringify(this.state.userAccount))
			.then(function(data){
			});
              history.push('/profile');
            }} />
							</div>
						</div>

						:
						<div className={ this.classes.footer }>
							<SaveButton onClick={() => {
		serverCommunication.serverRequest('PUT', 'useraccount', JSON.stringify(this.state.userAccount))
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