import React from 'react';
import Component from 'components/Component';
import Toggle from 'components/controls/Toggle';
import Button from 'components/controls/Button';
import Item from 'components/pages/plan/ProjectionItem';
import Popup from 'components/Popup';
import Loading from 'components/pages/plan/Loading';
import style from 'styles/plan/projections-tab.css';
import planStyles from 'styles/plan/plan.css';
import {getIndicatorsWithProps} from 'components/utils/indicators';
import {FeatureToggle} from 'react-feature-toggles';

export default class ProjectionsTab extends Component {

  styles = [planStyles];
  style = style;

  tabs = ['One', 'Three', 'Six', 'Twelve'];

  constructor(props) {
    super(props);
    this.monthMap = {
      0: 0,
      1: 2,
      2: 5,
      3: 11
    };
    this.state = {
      selectedTab: 0
    };
  }

  calculateState(item) {
    const projectedIndicators = this.props.forecastedIndicators[this.monthMap[this.state.selectedTab]]
    const committedProjection = projectedIndicators && projectedIndicators[item.key] && projectedIndicators[item.key].committed;
    if (committedProjection > (this.props.actualIndicators[item.key] > 0 ? this.props.actualIndicators[item.key] : 0)) {
      return item.directionDown ? 'decline' : 'grow';
    }
    else if (committedProjection < (this.props.actualIndicators[item.key] > 0 ? this.props.actualIndicators[item.key] : 0)) {
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
    const selectedTab = this.state.selectedTab;
    let groups = [];
    const properties = getIndicatorsWithProps() || {};
    const indicators = Object.keys(properties);
    indicators.forEach(indicator => {
      if (!groups.includes(properties[indicator].group)) {
        groups.push(properties[indicator].group);
      }
    });
    groups.sort();
    const rows = groups.map((group, i) => {
      const groupIndicators = indicators
        .filter(indicator => properties[indicator].group === group)
        .sort((a, b) => properties[a].orderInGroup - properties[b].orderInGroup);
      const indicatorsItems = groupIndicators.map((item, j) => {
        return <Item
          key={`row${i}-item${j}`}
          defaultState={this.calculateState({key: item, directionDown: !properties[item].isDirectionUp})}
          defaultValue={this.props.approvedBudgetsProjection && this.props.approvedBudgetsProjection[this.monthMap[selectedTab]] && this.props.approvedBudgetsProjection[this.monthMap[selectedTab]][item]}
          grow={this.props.actualIndicators[item] ? Math.ceil(Math.abs(((this.props.approvedBudgetsProjection[this.monthMap[selectedTab]] ? this.props.approvedBudgetsProjection[this.monthMap[selectedTab]][item] : 0) - this.props.actualIndicators[item]) / this.props.actualIndicators[item]) * 100) : this.props.approvedBudgetsProjection[this.monthMap[selectedTab]] && this.props.approvedBudgetsProjection[this.monthMap[selectedTab]][item] * 100}
          icon={'indicator:' + item}
          title={properties[item].title}
          isDollar={properties[item].isDollar}
          isPercentage={properties[item].isPercentage}
        />
      });

      return <div className={this.classes.row} key={`row${i}`}>
        {indicatorsItems}
      </div>;
    });

    return <div className={this.classes.wrap}>
      <div className={planStyles.locals.title}>
        <div className={planStyles.locals.titleMain}>
          <div className={planStyles.locals.titleText}>
            Forecasting (months)
          </div>
        </div>
        <div className={planStyles.locals.titleButtons}>
          {
            this.tabs.map((tab, i) => {
              return <Button
                key={i}
                className={this.classes.tabButton}
                type={i === this.state.selectedTab ? 'primary2' : 'normal'}
                onClick={() => {
                  this.selectTab(i);
                }}
              >{tab}</Button>;
            })
          }
        </div>
      </div>
      <div className={planStyles.locals.innerBox}>
        <div className={this.classes.content}>
          {rows}
        </div>
      </div>
    </div>;
  }
}