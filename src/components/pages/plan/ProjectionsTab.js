import React from 'react';
import Component from 'components/Component';

import Button from 'components/controls/Button';
import Item from 'components/pages/plan/ProjectionItem';
import Popup from 'components/Popup';
import Loading from 'components/pages/plan/Loading';

import style from 'styles/plan/projections-tab.css';
import planStyles from 'styles/plan/plan.css';
import { getTitle } from "components/utils/indicators";

export default class ProjectionsTab extends Component {

  styles = [planStyles];
  style = style;

  state = {
    selectedTab: 0
  };

  tabs = ['One', 'Three', 'Six', 'Twelve'];

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
          title: getTitle('facebookLikes'),
          key: "facebookLikes"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["3500", "3700", "4100", "4500"],
          grow: ["8", "14", "27", "39"],
          icon: "indicator:facebookEngagement",
          title: getTitle('facebookEngagement'),
          key: "facebookEngagement"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["4000", "4500", "5100", "6000"],
          grow: ["12", "26", "43", "68"],
          icon: "indicator:twitter",
          title: getTitle('twitterFollowers'),
          key: "twitterFollowers"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["4000", "4500", "5100", "6000"],
          grow: ["12", "26", "43", "68"],
          icon: "indicator:twitterEngagement",
          title: getTitle('twitterEngagement'),
          key: "twitterEngagement"
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["1100", "1100", "1100", "1100"],
          grow: ["", "", "", ""],
          icon: "indicator:linkedin",
          title: getTitle('linkedinFollowers'),
          key: "linkedinFollowers"
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["1100", "1100", "1100", "1100"],
          grow: ["", "", "", ""],
          icon: "indicator:linkedinEngagement",
          title: getTitle('linkedinEngagement'),
          key: "linkedinEngagement"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["2000", "2100", "2700", "4500"],
          grow: ["4", "9", "40", "134"],
          icon: "indicator:instagram",
          title: getTitle('instagramFollowers'),
          key: "instagramFollowers"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["2000", "2100", "2700", "4500"],
          grow: ["4", "9", "40", "134"],
          icon: "indicator:instagramEngagement",
          title: getTitle('instagramEngagement'),
          key: "instagramEngagement"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["2000", "2100", "2700", "4500"],
          grow: ["4", "9", "40", "134"],
          icon: "indicator:google",
          title: getTitle('googlePlusFollowers'),
          key: "googlePlusFollowers"
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["2000", "2100", "2700", "4500"],
          grow: ["4", "9", "40", "134"],
          icon: "indicator:googleEngagement",
          title: getTitle('googlePlusEngagement'),
          key: "googlePlusEngagement"
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["1500", "1500", "1500", "1500"],
          grow: ["", "", "", ""],
          icon: "indicator:pinterest",
          title: getTitle('pinterestFollowers'),
          key: "pinterestFollowers"
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["1500", "1500", "1500", "1500"],
          grow: ["", "", "", ""],
          icon: "indicator:pinterestEngagement",
          title: getTitle('pinterestEngagement'),
          key: "pinterestEngagement"
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["700", "700", "700", "700"],
          grow: ["", "", "", ""],
          icon: "indicator:youtube",
          title: getTitle('youtubeSubscribers'),
          key: "youtubeSubscribers"
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["700", "700", "700", "700"],
          grow: ["", "", "", ""],
          icon: "indicator:youtubeEngagement",
          title: getTitle('youtubeEngagement'),
          key: "youtubeEngagement"
        }
      ],

      [
        {
          defaultState: ["normal", "grow", "grow", "grow"],
          defaultValue: ["2500", "2700", "4700", "6000"],
          grow: ["", "8", "88", "140"],
          icon: "indicator:mcl",
          title: getTitle('MCL'),
          key: "MCL"
        },
        {
          defaultState: ["normal", "grow", "grow", "grow"],
          defaultValue: ["2500", "2700", "4700", "6000"],
          grow: ["", "8", "88", "140"],
          icon: "indicator:mql",
          title: getTitle('MQL'),
          key:"MQL"
        },
        {
          defaultState: ["normal", "grow", "grow", "grow"],
          defaultValue: ["2500", "2700", "4700", "6000"],
          grow: ["", "8", "88", "140"],
          icon: "indicator:sql",
          title: getTitle('SQL'),
          key: "SQL"
        },
        {
          defaultState: ["normal", "grow", "grow", "grow"],
          defaultValue: ["2500", "2700", "4700", "6000"],
          grow: ["", "8", "88", "140"],
          icon: "indicator:opps",
          title: getTitle('opps'),
          key: "opps"
        },
      ],

      [
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["500$", "500$", "500$", "500$"],
          icon: "indicator:ltv",
          title: getTitle('LTV'),
          key: "LTV"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["17.00$", "17.00$", "15.50$", "14.50$"],
          grow: ["", "", "9", "17"],
          icon: "indicator:cac",
          directionDown: true,
          title: getTitle('CAC'),
          key: "CAC"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["17.00$", "17.00$", "15.50$", "14.50$"],
          grow: ["", "", "9", "17"],
          icon: "indicator:trialUsers",
          title: getTitle('trialUsers'),
          key: "trialUsers"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["17.00$", "17.00$", "15.50$", "14.50$"],
          grow: ["", "", "9", "17"],
          icon: "indicator:users",
          title: getTitle('users'),
          key: "users"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["17.00$", "17.00$", "15.50$", "14.50$"],
          grow: ["", "", "9", "17"],
          icon: "indicator:activeUsers",
          title: getTitle('activeUsersRate'),
          key: "activeUsersRate"
        },

      ],

      [
        {
          defaultState: ["normal", "normal", "normal", "grow"],
          defaultValue: ["1650", "1650", "1650", "1900"],
          grow: ["", "", "", "15"],
          icon: "indicator:googleMentions",
          title: getTitle('googleMentions'),
          key: "googleMentions"
        },
        {
          defaultState: ["normal", "normal", "normal", "grow"],
          defaultValue: ["1650", "1650", "1650", "1900"],
          grow: ["", "", "", "15"],
          icon: "indicator:domainAuthority",
          title: getTitle('domainAuthority'),
          key: "domainAuthority"
        }
      ],

      [
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:sessions",
          title: getTitle('sessions'),
          key: "sessions"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:averageSessionDuration",
          title: getTitle('averageSessionDuration'),
          key: "averageSessionDuration"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:bounceRate",
          directionDown: true,
          title: getTitle('bounceRate'),
          key: "bounceRate"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:blogVisits",
          title: getTitle('blogVisits'),
          key: "blogVisits"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:blogSubscribers",
          title: getTitle('blogSubscribers'),
          key: "blogSubscribers"
        }
      ],

      [
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:mrr",
          title: getTitle('MRR'),
          key: "MRR"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:churnRate",
          directionDown: true,
          title: getTitle('churnRate'),
          key: "churnRate"
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:arpa",
          title: getTitle('ARPA'),
          key: "ARPA"
        }
      ]
    ];
  }

  calculateState(item){
    const projectedIndicators = this.props.projectedPlan[this.monthMap[this.state.selectedTab]] && this.props.projectedPlan[this.monthMap[this.state.selectedTab]].projectedIndicatorValues;
    if (projectedIndicators && projectedIndicators[item.key] > (this.props.actualIndicators[item.key] > 0 ? this.props.actualIndicators[item.key] : 0)) {
      return item.directionDown ? 'decline' : 'grow';
    }
    else if (projectedIndicators && projectedIndicators[item.key] < (this.props.actualIndicators[item.key] > 0 ? this.props.actualIndicators[item.key] : 0)) {
      return item.directionDown ? 'grow' : 'decline';
    }
    else return 'normal';
  }

  selectTab = (index) => {
    this.setState({
      selectedTab: index
    });
  };

  render() {
    if (!this.props.isPlannerLoading) {
      const selectedTab = this.state.selectedTab;
      const rows = this.rows.map((items, i) => {
        items = items.map((item, j) => {
          return <Item
            key={ `row${i}-item${j}` }
            //defaultState={ item.defaultState && item.defaultState[selectedTab] }
            defaultState={ this.calculateState(item) }
            //defaultValue={ item.defaultValue && item.defaultValue[selectedTab] }
            defaultValue={ this.props.projectedPlan && this.props.projectedPlan[this.monthMap[selectedTab]] && this.props.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues && this.props.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues[item.key]}
            //grow={ item.grow && item.grow[selectedTab] }
            grow={ this.props.actualIndicators[item.key] ? Math.ceil(Math.abs(((this.props.projectedPlan[this.monthMap[selectedTab]] ? this.props.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues[item.key] : 0) - this.props.actualIndicators[item.key]) / this.props.actualIndicators[item.key]) * 100) : this.props.projectedPlan[this.monthMap[selectedTab]] && this.props.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues && this.props.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues[item.key] * 100 }
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
              Forecasting (months)
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
      return <div className={ this.classes.loading }>
        <Popup className={ this.classes.popup }>
          <div>
            <Loading />
          </div>

          <div className={ this.classes.popupText }>
            Please wait while the system optimizes your plan
          </div>
        </Popup>
      </div>
    }
  }
}