import React from 'react';
import _ from 'lodash';
import Component from 'components/Component';
import Page from 'components/Page';
import ByChannelTab from 'components/pages/campaigns/ByChannelTab';
import style from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';

export default class Campaigns extends Component {

  style = style
  styles = [icons]

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const tabs = {
      "Campaigns": ByChannelTab,
    };

    const tabNames = Object.keys(tabs);
    const selectedName = tabNames[0];
    const selectedTab = tabs[selectedName];
    return <div>
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
          { selectedTab ? React.createElement(selectedTab, _.merge(this.props, this.state)) : null }
        </div>
      </Page>
    </div>
  }
}