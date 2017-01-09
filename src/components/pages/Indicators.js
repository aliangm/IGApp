import React from 'react';

import Component from 'components/Component';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Label from 'components/ControlsLabel';

import Title from 'components/onboarding/Title';
import ProfileProgress from 'components/pages/profile/Progress';
import ProfileInsights from 'components/pages/profile/Insights';
import BackButton from 'components/pages/profile/BackButton';
import PlanButton from 'components/pages/indicators/PlanButton';
import SaveButton from 'components/pages/profile/SaveButton';
import Item from 'components/pages/indicators/Item';

import style from 'styles/onboarding/onboarding.css';
import indiStyle from 'styles/indicators/indicators.css';

import { isPopupMode, disablePopupMode } from 'modules/popup-mode';
import history from 'history';
import serverCommunication from 'data/serverCommunication';

export default class Indicators extends Component {
	style = style;
	styles = [indiStyle];

	constructor(props) {
		super(props);
		this.state = {actualIndicators: {} };
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
								self.setState({actualIndicators: data.actualIndicators});
								self.setState({isLoaded: true});
							}
						})
				})
				.catch(function (err) {
					console.log(err);
				})
		}
	}


	handleChange(name, value){
		let update = Object.assign({}, this.state.actualIndicators);
		update[name] = value;
		this.setState({ actualIndicators: update});
	}

	render() {
		return <div>
			<Header />
			<Sidebar />
			{ this.state.isLoaded ?
				<Page popup={ isPopupMode() }>
					<Title title="Indicators" subTitle="Marketing is great, but without measuring the impact on your metrics, there is no real point in it." />
					<div className={ this.classes.cols }>
						<div className={ this.classes.colLeft }>
							<div className={ indiStyle.locals.row }>
								<Item icon="indicator:facebook" title="Facebook Likes" name="facebookLikes" updateIndicator={ this.handleChange } defaultStatus = { this.state.actualIndicators.facebookLikes } maxValue='7000' />
								<Item icon="indicator:facebook" title="Facebook Engagement" name="facebookEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.facebookEngagement } isPercentage = 'true' />
								<Item icon="indicator:twitter" title="Twitter Followers" name="twitterFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.twitterFollowers }  />
								<Item icon="indicator:twitter" title="Twitter Engagement" name="twitterEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.twitterEngagement } isPercentage = 'true' />
								<Item icon="indicator:linkedin" title="LinkedIn Followers" name="linkedinFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.linkedinFollowers } />
								<Item icon="indicator:linkedin" title="LinkedIn Engagement" name="linkedinEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.linkedinEngagement } isPercentage = 'true' />
								<Item icon="indicator:instagram" title="Instagram Followers" name="instagramFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.instagramFollowers } />
								<Item icon="indicator:instagram" title="Instagram Engagement" name="instagramEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.instagramEngagement } isPercentage = 'true' />
								<Item icon="indicator:google-rank" title="Google+ Followers" name="googlePlusFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.googlePlusFollowers } />
								<Item icon="indicator:google-rank" title="Google+ Engagement" name="googlePlusEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.googlePlusEngagement } isPercentage = 'true' />
								<Item icon="indicator:pinterest" title="Pinterest Followers" name="pinterestFollowers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.pinterestFollowers } />
								<Item icon="indicator:pinterest" title="Pinterest Engagement" name="pinterestEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.pinterestEngagement } isPercentage = 'true' />
								<Item icon="indicator:instagram" title="Youtube Subscribers" name="youtubeSubscribers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.youtubeSubscribers } />
								<Item icon="indicator:instagram" title="Youtube Engagement" name="youtubeEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.youtubeEngagement } isPercentage = 'true' />
								<Item icon="indicator:snapchat" title="Snapchat Unique Views" name="snapchatUniqueViews" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.snapchatUniqueViews } />
								<Item icon="indicator:snapchat" title="Snapchat Engagement" name="snapchatEngagement" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.snapchatEngagement } isPercentage = 'true' />
							</div>
							<div className={ indiStyle.locals.row }>
								<Item icon="indicator:ltv" title="Life Time Value" name="LTV" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.LTV } />
								<Item icon="indicator:cac" title="Customer Acquisition Cost" name="CAC" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.CAC } />
								<Item icon="indicator:sales" title="Number Of Sales" name="numberOfSales" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.numberOfSales } />
								<Item icon="indicator:sales" title="Sales Revenue" name="salesRevenue" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.salesRevenue } />
								<Item icon="indicator:users" title="Users" name="users" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.users } />
								<Item icon="indicator:active-users" title="Active Users" name="activeUsers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.activeUsers } />
								<Item icon="indicator:new-users" title="Trial Users" name="trialUsers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.trialUsers } />
								<Item icon="indicator:users" title="Customer Retention Rate" name="customerRetentionRate" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.customerRetentionRate } isPercentage = 'true' />
							</div>
							<div className={ indiStyle.locals.row }>
								<Item icon="indicator:lead" title="MCL" name="MCL" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.MCL } />
								<Item icon="indicator:lead" title="MQL" name="MQL" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.MQL } />
								<Item icon="indicator:lead" title="SQL" name="SQL" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.SQL } />
							</div>
							<div className={ indiStyle.locals.row }>
								<Item icon="indicator:alexa-rank" title="Alexa Rank - Global" name="alexaRankGlobal" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.alexaRankGlobal } />
								<Item icon="indicator:alexa-rank" title="Alexa Rank - USA" name="alexaRankUSA" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.alexaRankUSA } />
								<Item icon="indicator:mentions" title="Google Mentions" name="googleMentions" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.googleMentions } />
							</div>
							<div className={ indiStyle.locals.row }>
								<Item icon="indicator:engagement" title="Sessions" name="sessions" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.sessions } />
								<Item icon="indicator:engagement" title="Average Session Duration" name="averageSessionDuration" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.averageSessionDuration } />
								<Item icon="indicator:downloads" title="Bounce Rate" name="bounceRate" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.bounceRate } isPercentage = 'true' />
								<Item icon="indicator:downloads" title="Blog Visits" name="blogVisits" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.blogVisits } />
								<Item icon="indicator:downloads" title="Blog Subscribers" name="blogSubscribers" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.blogSubscribers } />
							</div>
							<div className={ indiStyle.locals.row }>
								<Item icon="indicator:engagement" title="MRR" name="MRR" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.MRR } />
								<Item icon="indicator:downloads" title="Churn Rate" name="churnRate" updateIndicator = { this.handleChange } defaultStatus = { this.state.actualIndicators.churnRate } isPercentage = 'true' />
							</div>
						</div>

						{ isPopupMode() ?

							<div className={ this.classes.colRight }>
								<div className={ this.classes.row }>
									<ProfileProgress progress={ 101 } image={
                require('assets/flower/5.png')
              }
													 text="Seems you got some new super powers. Now the journey for GROWTH really begins!"/>
								</div>
								{/**
								 <div className={ this.classes.row }>
								 <ProfileInsights />
								 </div>
								 **/}
							</div>

							: null }
					</div>

					{ isPopupMode() ?

						<div className={ this.classes.footer }>
							<BackButton onClick={() => {
            history.push('/manual');
          }} />
							<div style={{ width: '30px' }} />
							<PlanButton onClick={() => {
          console.log(this.state.actualIndicators);
          serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({actualIndicators: this.state.actualIndicators}))
			.then(function(data){
				console.log(data);
			});
            disablePopupMode();
            history.push('/plan');
          }} />
						</div>

						:
						<div className={ this.classes.footer }>
							<SaveButton onClick={() => {
		serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({actualIndicators: this.state.actualIndicators}))
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