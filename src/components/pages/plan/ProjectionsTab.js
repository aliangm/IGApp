import React from 'react';
import Component from 'components/Component';

import Button from 'components/controls/Button';
import Item from 'components/pages/plan/ProjectionItem';

import style from 'styles/plan/projections-tab.css';
import planStyles from 'styles/plan/plan.css';

export default class ProjectionsTab extends Component {
  styles = [planStyles];
  style = style;
  state = {
    selectedTab: 0
  }

  tabs = ['One', 'Three', 'Six', 'Twelve']

  constructor(props) {
    super(props);

    this.rows = [
      [
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["3500", "3700", "4100", "4500"],
          grow: ["8", "14", "27", "39"],
          icon: "indicator:facebook",
          title: "Facebook Likes",
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["4000", "4500", "5100", "6000"],
          grow: ["12", "26", "43", "68"],
          icon: "indicator:twitter",
          title: "Twitter Followers",
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["1500", "1500", "1500", "1500"],
          grow: ["", "", "", ""],
          icon: "indicator:pinterest",
          title: "Pinterest Followers",
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["1100", "1100", "1100", "1100"],
          grow: ["", "", "", ""],
          icon: "indicator:linkedin",
          title: "LinkedIn Followers",
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["700", "700", "700", "700"],
          grow: ["", "", "", ""],
          icon: "indicator:snapchat",
          title: "Snapchat Views",
        },
        {
          defaultState: ["grow", "grow", "grow", "grow"],
          defaultValue: ["2000", "2100", "2700", "4500"],
          grow: ["4", "9", "40", "134"],
          icon: "indicator:instagram",
          title: "Instagram Followers",
        }
      ],

      [
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["17.00$", "17.00$", "15.50$", "14.50$"],
          grow: ["", "", "9", "17"],
          icon: "indicator:cac",
          title: "Customer acquisition cost",
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["500$", "500$", "500$", "500$"],
          icon: "indicator:ltv",
          title: "Life time value",
        }
      ],

      [
        {
          defaultState: ["normal", "grow", "grow", "grow"],
          defaultValue: ["2500", "2700", "4700", "6000"],
          grow: ["", "8", "88", "140"],
          icon: "indicator:lead",
          title: "Leads",
        },
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:downloads",
          title: "Downloads",
        },
        {
          defaultState: ["normal", "grow", "grow", "grow"],
          defaultValue: ["2700", "2750", "3000", "4000"],
          grow: ["", "2", "11", "67"],
          icon: "indicator:sales",
          title: "Sales",
        }
      ],

      [
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["1,700,000", "1,700,000", "1,700,000", "1,700,000"],
          icon: "indicator:alexa-rank",
          title: "Alexa Rank",
        },
        {
          defaultState: ["normal", "normal", "normal", "normal"],
          defaultValue: ["5", "5", "5", "5"],
          icon: "indicator:google-rank",
          title: "Google Rank",
        },
        {
          defaultState: ["normal", "normal", "normal", "grow"],
          defaultValue: ["1650", "1650", "1650", "1900"],
          grow: ["", "", "", "15"],
          icon: "indicator:mentions",
          title: "Mentions",
        },
        {
          defaultState: ["normal", "normal", "normal", "grow"],
          defaultValue: ["37%", "37%", "37%", "47%"],
          grow: ["", "", "", "27"],
          icon: "indicator:engagement",
          title: "Engagement",
        }
      ],

      [
        {
          defaultState: ["normal", "normal", "grow", "grow"],
          defaultValue: ["7000", "7000", "10000", "15000"],
          grow: ["", "", "42", "114"],
          icon: "indicator:users",
          title: "Users",
        },
        {
          defaultState: ["normal", "normal", "normal", "grow"],
          defaultValue: ["2800", "2800", "2800", "5000"],
          grow: ["", "", "", "78"],
          icon: "indicator:new-users",
          title: "New Users",
        },
        {
          defaultState: ["normal", "grow", "grow", "grow"],
          defaultValue: ["3700", "3780", "5800", "7800"],
          grow: ["", "2", "56", "110"],
          icon: "indicator:active-users",
          title: "Active Users",
        }
      ]
    ];
  }

  selectTab = (index) => {
    this.setState({
      selectedTab: index
    });
  }

  render() {
    const selectedTab = this.state.selectedTab;
    const rows = this.rows.map((items, i) => {
      items = items.map((item, j) => {
        return <Item
          key={ `row${i}-item${j}` }
          defaultState={ item.defaultState && item.defaultState[selectedTab] }
          defaultValue={ item.defaultValue && item.defaultValue[selectedTab] }
          grow={ item.grow && item.grow[selectedTab] }
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
}