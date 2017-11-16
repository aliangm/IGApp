import React from 'react';
import Component from 'components/Component';
import Toggle from 'components/controls/Toggle';
import Button from 'components/controls/Button';
import Item from 'components/pages/plan/ProjectionItem';
import Popup from 'components/Popup';
import Loading from 'components/pages/plan/Loading';
import style from 'styles/plan/projections-tab.css';
import planStyles from 'styles/plan/plan.css';
import { getIndicatorsWithProps } from "components/utils/indicators";

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
      approvedPlan: true,
      selectedTab: 0
    }
  }

  calculateState(item, useApprovedBudgets){
    const projectedIndicators = useApprovedBudgets ?
      this.props.approvedBudgetsProjection[this.monthMap[this.state.selectedTab]]
      : this.props.projectedPlan[this.monthMap[this.state.selectedTab]] && this.props.projectedPlan[this.monthMap[this.state.selectedTab]].projectedIndicatorValues;
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
          return this.state.approvedPlan ?
            <Item
              key={ `row${i}-item${j}` }
              defaultState={ this.calculateState({key: item, directionDown: !properties[item].isDirectionUp}, true) }
              defaultValue={ this.props.approvedBudgetsProjection && this.props.approvedBudgetsProjection[this.monthMap[selectedTab]] && this.props.approvedBudgetsProjection[this.monthMap[selectedTab]][item] }
              grow={ this.props.actualIndicators[item] ? Math.ceil(Math.abs(((this.props.approvedBudgetsProjection[this.monthMap[selectedTab]] ? this.props.approvedBudgetsProjection[this.monthMap[selectedTab]][item] : 0) - this.props.actualIndicators[item]) / this.props.actualIndicators[item]) * 100) : this.props.approvedBudgetsProjection[this.monthMap[selectedTab]] && this.props.approvedBudgetsProjection[this.monthMap[selectedTab]][item] * 100 }
              icon={ "indicator:" + item }
              title={ properties[item].title }
            />
            :
            <Item
              key={ `row${i}-item${j}` }
              defaultState={ this.calculateState({key: item, directionDown: !properties[item].isDirectionUp}) }
              defaultValue={ this.props.projectedPlan && this.props.projectedPlan[this.monthMap[selectedTab]] && this.props.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues && this.props.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues[item]}
              diff={ (this.props.projectedPlan && this.props.projectedPlan[this.monthMap[selectedTab]] && this.props.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues && this.props.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues[item]) - (this.props.approvedBudgetsProjection && this.props.approvedBudgetsProjection[this.monthMap[selectedTab]] && this.props.approvedBudgetsProjection[this.monthMap[selectedTab]][item]) }
              grow={ this.props.actualIndicators[item] ? Math.ceil(Math.abs(((this.props.projectedPlan[this.monthMap[selectedTab]] && this.props.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues ? this.props.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues[item] : 0) - this.props.actualIndicators[item]) / this.props.actualIndicators[item]) * 100) : this.props.projectedPlan[this.monthMap[selectedTab]] && this.props.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues && this.props.projectedPlan[this.monthMap[selectedTab]].projectedIndicatorValues[item] * 100 }
              icon={ "indicator:" + item }
              title={ properties[item].title }
            />
        });

        return <div className={ this.classes.row } key={`row${i}`}>
          { indicatorsItems }
        </div>
      });

      return <div className={ this.classes.wrap }>
        <div className={ planStyles.locals.title }>
          <div className={ planStyles.locals.titleMain }>
            <div className={ planStyles.locals.titleText }>
              Forecasting (months)
            </div>
          </div>
          <div className={ this.classes.titleToggle }>
            <Toggle
              leftText="Current"
              rightText="Suggested"
              leftActive={ this.state.approvedPlan }
              leftClick={ ()=>{ this.setState({approvedPlan: true}) } }
              rightClick={ ()=>{ this.setState({approvedPlan: false}) } }
            />
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