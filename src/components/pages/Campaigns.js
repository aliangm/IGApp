import React from 'react';

import Component from 'components/Component';
import Page from 'components/Page';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import ByChannelTab from 'components/pages/campaigns/ByChannelTab';
import serverCommunication from 'data/serverCommunication';
import style from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
import history from 'history';

export default class Campaigns extends Component {

  style = style
  styles = [icons]

  constructor(props) {
    super(props);
    this.state = {
      saveCampaigns: this.saveCampaigns.bind(this),
      getUserMonthPlan: this.getUserMonthPlan.bind(this)
    };
  }

  componentDidMount(){
    let self = this;
    let requests = 0;
    this.getUserMonthPlan();
    serverCommunication.serverRequest('GET', 'useraccount')
      .then((response) => {
        response.json()
          .then(function (data) {
            if (data) {
              if (data.error) {
                history.push('/');
              }
              else {
                requests++;
                let teamMembers = data.teamMembers;
                teamMembers.push({name: (data.firstName ? data.firstName + " (me)" : "Me"), email: data.email, role: data.role});
                self.setState({
                  teamMembers: teamMembers
                });
              }
            }
          })
      })
      .catch(function (err) {
        self.setState({serverDown: true});
        console.log(err);
      });
  }

  saveCampaigns(campaigns) {
    let self = this;
    return serverCommunication.serverRequest('PUT', 'usermonthplan', JSON.stringify({campaigns: campaigns}), this.state.planDate)
      .then(function(response){
        if (response.ok){
          response.json()
            .then(function (data) {
              self.setState({
                plannedChannelBudgets: data.projectedPlan[0].plannedChannelBudgets,
                knownChannels: data.actualChannelBudgets && data.actualChannelBudgets.knownChannels || {},
                unknownChannels: data.actualChannelBudgets && data.actualChannelBudgets.unknownChannels || {},
                planDate: data.planDate,
                campaigns: data.campaigns,
                isLoaded: true
              });
            });
        }
        else {
          console.log(response);
        }
      })
      .catch(function(err){
        console.log(err);
      });
  }

  getUserMonthPlan(newPlanDate){
    let self = this;
    serverCommunication.serverRequest('GET', 'usermonthplan', null, newPlanDate)
      .then((response) => {
        response.json()
          .then(function (data) {
            if (data) {
              if (data.error) {
                history.push('/');
              }
              else {
                self.setState({
                  plannedChannelBudgets: data.projectedPlan[0].plannedChannelBudgets,
                  monthBudget: data.projectedPlan[0].monthBudget,
                  knownChannels: data.actualChannelBudgets && data.actualChannelBudgets.knownChannels || {},
                  unknownChannels: data.actualChannelBudgets && data.actualChannelBudgets.unknownChannels || {},
                  planDate: data.planDate,
                  campaigns: data.campaigns || {},
                  isLoaded: true
                });
              }
            }
          })
      })
      .catch(function (err) {
        self.setState({serverDown: true});
        console.log(err);
      });
  }


  render() {
    const tabs = {
      "Campaigns": ByChannelTab,
    };

    const tabNames = Object.keys(tabs);
    const selectedName = tabNames[0];
    const selectedTab = tabs[selectedName];

    return <div>
      <Header />
      <Sidebar />
      <Page contentClassName={ this.classes.content } width="1180px">
        <div className={ this.classes.head }>
          <div className={ this.classes.headTitle }>Campaign Management</div>
          <div className={ this.classes.headTabs }>
            {
              tabNames.map((name, i) => {
                let className;

                if (i === 0) {
                  className = this.classes.headTabSelected;
                } else {
                  className = this.classes.headTab;
                }

                return <div className={ className } key={ i } onClick={() => {
                  this.selectTab(i);
                }}>{ name }</div>
              })
            }
          </div>
        </div>
        <div className={ this.classes.serverDown } style={{ padding: '30px 30px' }}>
          <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our support. </label>
        </div>
        <div>
          { selectedTab ? React.createElement(selectedTab, this.state) : null }
        </div>
      </Page>
    </div>
  }
}