import React from 'react';
import Component from 'components/Component';

import Button from 'components/controls/Button';
import Item from 'components/pages/plan/ProjectionItem';

import style from 'styles/plan/projections-tab.css';
import planStyles from 'styles/plan/plan.css';
import serverCommunication from 'data/serverCommunication';

export default class ProjectionsTab extends Component {
  styles = [planStyles];
  style = style;
  state = {
    selectedTab: 0
  }

  tabs = ['One', 'Three', 'Six', 'Twelve']

  constructor(props) {
    super(props);
    this.monthMap = {
      0: 0,
      1: 2,
      2: 5,
      3: 11
    };
    this.rows = [
      [
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["3500", "3700", "4100", "4500"],
          grow: ["8", "14", "27", "39"],
          icon: "indicator:facebook",
          title: "Facebook Likes",
          key: "facebookLikes"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["3500", "3700", "4100", "4500"],
          grow: ["8", "14", "27", "39"],
          icon: "indicator:facebook",
          title: "Facebook Engagement",
          key: "facebookEngagement"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["4000", "4500", "5100", "6000"],
          grow: ["12", "26", "43", "68"],
          icon: "indicator:twitter",
          title: "Twitter Followers",
          key: "twitterFollowers"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["4000", "4500", "5100", "6000"],
          grow: ["12", "26", "43", "68"],
          icon: "indicator:twitter",
          title: "Twitter Engagement",
          key: "twitterEngagement"
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["1100", "1100", "1100", "1100"],
          grow: ["", "", "", ""],
          icon: "indicator:linkedin",
          title: "LinkedIn Followers",
          key: "linkedinFollowers"
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["1100", "1100", "1100", "1100"],
          grow: ["", "", "", ""],
          icon: "indicator:linkedin",
          title: "LinkedIn Engagement",
          key: "linkedinEngagement"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["2000", "2100", "2700", "4500"],
          grow: ["4", "9", "40", "134"],
          icon: "indicator:instagram",
          title: "Instagram Followers",
          key: "instagramFollowers"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["2000", "2100", "2700", "4500"],
          grow: ["4", "9", "40", "134"],
          icon: "indicator:instagram",
          title: "Instagram Engagement",
          key: "instagramEngagement"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["2000", "2100", "2700", "4500"],
          grow: ["4", "9", "40", "134"],
          icon: "indicator:google-rank",
          title: "Google+ Followers",
          key: "googlePlusFollowers"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["2000", "2100", "2700", "4500"],
          grow: ["4", "9", "40", "134"],
          icon: "indicator:google-rank",
          title: "Google+ Engagement",
          key: "googlePlusEngagement"
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["1500", "1500", "1500", "1500"],
          grow: ["", "", "", ""],
          icon: "indicator:pinterest",
          title: "Pinterest Followers",
          key: "pinterestFollowers"
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["1500", "1500", "1500", "1500"],
          grow: ["", "", "", ""],
          icon: "indicator:pinterest",
          title: "Pinterest Engagement",
          key: "pinterestEngagement"
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["700", "700", "700", "700"],
          grow: ["", "", "", ""],
          icon: "indicator:snapchat",
          title: "Youtube Subscribers",
          key: "youtubeSubscribers"
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["700", "700", "700", "700"],
          grow: ["", "", "", ""],
          icon: "indicator:snapchat",
          title: "Youtube Engagement",
          key: "youtubeEngagement"
        }
      ],

      [
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["500$", "500$", "500$", "500$"],
          icon: "indicator:ltv",
          title: "Life time value",
          key: "LTV"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["17.00$", "17.00$", "15.50$", "14.50$"],
          grow: ["", "", "9", "17"],
          icon: "indicator:cac",
          title: "Customer acquisition cost",
          key: "CAC"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["17.00$", "17.00$", "15.50$", "14.50$"],
          grow: ["", "", "9", "17"],
          icon: "indicator:sales",
          title: "Number Of Sales",
          key: "numberOfSales"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["17.00$", "17.00$", "15.50$", "14.50$"],
          grow: ["", "", "9", "17"],
          icon: "indicator:sales",
          title: "Revenue",
          key: "revenue"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["17.00$", "17.00$", "15.50$", "14.50$"],
          grow: ["", "", "9", "17"],
          icon: "indicator:users",
          title: "Users",
          key: "users"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["17.00$", "17.00$", "15.50$", "14.50$"],
          grow: ["", "", "9", "17"],
          icon: "indicator:active-users",
          title: "Active Users Rate",
          key: "activeUsersRate"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["17.00$", "17.00$", "15.50$", "14.50$"],
          grow: ["", "", "9", "17"],
          icon: "indicator:new-users",
          title: "Trial Users",
          key: "trialUsers"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["17.00$", "17.00$", "15.50$", "14.50$"],
          grow: ["", "", "9", "17"],
          icon: "indicator:users",
          title: "Customer Retention Rate",
          key: "customerRetentionRate"
        },

      ],

      [
        {
          defaultState: ["normal", "grow", "grow", "grow"],
          defaultValue: ["2500", "2700", "4700", "6000"],
          grow: ["", "8", "88", "140"],
          icon: "indicator:lead",
          title: "MCL",
          key: "MCL"
        },
        {
          defaultState: ["normal", "grow", "grow", "grow"],
          defaultValue: ["2500", "2700", "4700", "6000"],
          grow: ["", "8", "88", "140"],
          icon: "indicator:lead",
          title: "MQL",
          key:"MQL"
        },
        {
          defaultState: ["normal", "grow", "grow", "grow"],
          defaultValue: ["2500", "2700", "4700", "6000"],
          grow: ["", "8", "88", "140"],
          icon: "indicator:lead",
          title: "SQL",
          key: "SQL"
        },
      ],

      [
        {
          defaultState: ["normal", "normal", "normal", "grow"],
          defaultValue: ["1650", "1650", "1650", "1900"],
          grow: ["", "", "", "15"],
          icon: "indicator:mentions",
          title: "Google Mentions",
          key: "googleMentions"
        }
      ],

      [
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:downloads",
          title: "Sessions",
          key: "sessions"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:downloads",
          title: "Average Session Duration",
          key: "averageSessionDuration"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:downloads",
          title: "Bounce Rate",
          key: "bounceRate"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:downloads",
          title: "Blog Visits",
          key: "blogVisits"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:downloads",
          title: "Blog Subscribers",
          key: "blogSubscribers"
        }
      ],

      [
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:downloads",
          title: "MRR",
          key: "MRR"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:downloads",
          title: "Churn Rate",
          key: "churnRate"
        }
      ]
    ];
  }

  calculateState(item){
    if (this.state.projectedPlan[this.monthMap[this.state.selectedTab]].projectedIndicatorValues[item.key] > this.state.actualIndicators[item.key]) {
      return 'grow';
    }
    else if (this.state.projectedPlan[this.monthMap[this.state.selectedTab]].projectedIndicatorValues[item.key] < this.state.actualIndicators[item.key]) {
      return 'decline';
    }
    else return 'normal';
  }

  componentDidMount(){
    let self = this;
    serverCommunication.serverRequest('GET', 'usermonthplan')
      .then((response) => {
        response.json()
          .then(function (data) {
            if (data) {
              self.setState({actualIndicators: data.actualIndicators});
              self.setState({projectedPlan: data.projectedPlan});
              self.setState({isLoaded: true});
            }
          })
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  selectTab = (index) => {
    this.setState({
      selectedTab: index
    });
  }

  render() {
    if (this.state.isLoaded) {
      const selectedTab = this.state.selectedTab;
      const rows = this.rows.map((items, i) => {
        items = items.map((item, j) => {
          return <Item
            key={ `row${i}-item${j}` }
            //defaultState={ item.defaultState && item.defaultState[selectedTab] }
            defaultState={ this.calculateState(item) }
            //defaultValue={ item.defaultValue && item.defaultValue[selectedTab] }
            defaultValue={ this.state.projectedPlan && this.state.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues[item.key]}
            //grow={ item.grow && item.grow[selectedTab] }
            grow={ Math.ceil(Math.abs((this.state.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues[item.key] - this.state.actualIndicators[item.key]) / this.state.actualIndicators[item.key]) * 100) }
            icon={ item.icon }
            title={ item.title }
          />
        });

        return <div className={ this.classes.row } key={`row${i}`}>
          { items }
        </div>
      });

      return <div className={ this.classes.wrap }>
        <div className={ planStyles.locals.title }>
          <div className={ planStyles.locals.titleMain }>
            <div className={ planStyles.locals.titleText }>
              Projections (months)
            </div>
          </div>
          <div className={ planStyles.locals.titleButtons }>
            {
              this.tabs.map((tab, i) => {
                return <Button
                  key={i}
                  className={ this.classes.tabButton }
                  type={ i === this.state.selectedTab ? 'primary2' : 'normal' }
                  onClick={() => {
                  this.selectTab(i);
                }}
                >{ tab }</Button>
              })
            }
          </div>
        </div>
        <div className={ planStyles.locals.innerBox }>
          <div className={ this.classes.content }>
            { rows }
          </div>
        </div>
      </div>
    }
    else {
      return null;
    }
  }
}