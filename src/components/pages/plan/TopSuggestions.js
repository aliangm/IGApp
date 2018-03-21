import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/top-suggestions.css';
import suggestionStyle from 'styles/plan/suggestion.css';
import Suggestion from 'components/pages/plan/Suggestion';
import { FeatureToggle } from 'react-feature-toggles';
import Page from 'components/Page';
import { getNickname as getIndicatorNickname, getMetadata } from 'components/utils/indicators';
import { getNickname as getChannelNickname } from 'components/utils/channels';
import { formatBudget } from 'components/utils/budget';
import { formatDate } from 'components/utils/date';
import Loading from 'components/pages/plan/Loading';
import cloneDeepWith  from 'lodash/cloneDeepWith';
import merge from "lodash/merge";

export default class TopSuggestions extends Component {

  style = style;
  styles = [suggestionStyle];

  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
  }

  forecastMetrics(item) {
    this.setState({showPopup: true, item: item});
    const approvedBudgets = cloneDeepWith(this.props.approvedBudgets, (item => { if (item !== null && typeof item === 'object') { Object.assign(item) }}));
    approvedBudgets[0][item.channel] = item.suggested;
    const callback = (data) => {
      this.setState({ifApprovedMetrics: data.projectedPlan[0].projectedIndicatorValues});
    };
    this.props.plan(false, {useApprovedBudgets: true, approvedBudgets: approvedBudgets}, callback, this.props.region, true);
  }

  render() {

    const { active, showPopup, item, ifApprovedMetrics } = this.state;
    const { approvedBudgets, projectedPlan, approveChannel, declineChannel, planDate, actualIndicators, approvedBudgetsProjection } = this.props;
    const zeroBudgetSuggestions = {};
    Object.keys(approvedBudgets[0]).forEach(key => zeroBudgetSuggestions[key] = 0);
    const nextMonthBudgets = merge(zeroBudgetSuggestions, projectedPlan[0].plannedChannelBudgets);
    const suggestionsOrdered = nextMonthBudgets ? Object.keys(nextMonthBudgets)
        .filter(item => (projectedPlan[0].plannedChannelBudgets[item] || 0) !== (approvedBudgets[0][item] || 0))
        .map(item => {
          return {
            channel: item,
            suggested: projectedPlan[0].plannedChannelBudgets[item] || 0,
            current: approvedBudgets[0][item] || 0
          } })
        .sort((a, b) => Math.abs(b.suggested - b.current) - Math.abs(a.suggested - a.current))
      : [];
    const topSuggestions = suggestionsOrdered.slice(0, 5).map(item =>
      <Suggestion
        {... item}
        key={item.channel}
        approveChannel={ () => { approveChannel(0, item.channel, item.suggested) } }
        declineChannel={ () => { declineChannel(0, item.channel, item.current) } }
        forecast={ this.forecastMetrics.bind(this, item) }
      />
    );

    const headRow = this.getTableRow(null, [
      'Metric',
      'Current',
      'Expected',
      'If approved',
      'Diff'
    ], {
      className: this.classes.headRow
    });

    const rows = ifApprovedMetrics && Object.keys(ifApprovedMetrics)
      .filter(metric => ifApprovedMetrics[metric] - approvedBudgetsProjection[0][metric] !== 0 && getMetadata('isObjective', metric))
      .map(metric => {
        const diff = Math.round(ifApprovedMetrics[metric] - approvedBudgetsProjection[0][metric]);
        return this.getTableRow(null, [
          <b>{getIndicatorNickname(metric)}</b>,
          formatBudget(actualIndicators[metric]),
          formatBudget(approvedBudgetsProjection[0][metric]),
          formatBudget(ifApprovedMetrics[metric]),
          <div style={{display: 'flex'}}>
            <div className={this.classes.historyArrow} data-decline={diff < 0 ? true : null}/>
            <div className={this.classes.historyGrow} data-decline={diff < 0 ? true : null}>
              {formatBudget(Math.abs(diff))} ({Math.round(((ifApprovedMetrics[metric]-actualIndicators[metric]) / (approvedBudgetsProjection[0][metric]-actualIndicators[metric]) - 1) * 100)}%)
            </div>
          </div>
        ], {
          className: this.classes.tableRow,
          key: metric
        })
      });

    return <FeatureToggle featureName="plannerAI">
      <div>
        <div className={this.classes.title} onClick={ () => { this.setState({active: !active}) } } data-active={ active ? true : null }>
          Top Suggestions
        </div>
        <div hidden={ !active }>
          <div className={this.classes.innerPos}>
            <div className={this.classes.inner}>
              {
                topSuggestions && topSuggestions.length > 0
                  ?
                  topSuggestions
                  :
                  <div className={this.classes.noSuggestionsPos}>
                    <div className={this.classes.noSuggestionsText}>
                      Great - no more suggestions for this month :)
                    </div>
                  </div>
              }
            </div>
          </div>
        </div>
        <div hidden={!showPopup}>
          <Page popup={true} width="700">
            <div style={{ position: 'relative' }}>
              <div className={ this.classes.topRight }>
                <div className={ this.classes.close } onClick={ () => { this.setState({showPopup: false, ifApprovedMetrics: false, item: false}) } }/>
              </div>
              <div className={suggestionStyle.locals.center}>
                <div className={suggestionStyle.locals.channelIcon} data-icon={"plan:" + (item && item.channel)}/>
                <div className={suggestionStyle.locals.title} style={{ marginLeft: '10px' }}>
                  {item && getChannelNickname(item.channel)}
                </div>
              </div>
              <div className={suggestionStyle.locals.budgets} style={{ fontSize: '16px' }}>
                <div className={suggestionStyle.locals.current}>
                  ${item && formatBudget(item.current)}
                </div>
                {" -> "}
                <div className={suggestionStyle.locals.suggested}>
                  ${item && formatBudget(item.suggested)}
                </div>
              </div>
              <div  className={this.classes.forecastHeadline}>
                Impact Forecasting - {formatDate(planDate)}
              </div>
              <div>
                { ifApprovedMetrics ?
                  <table className={this.classes.table}>
                    <thead>
                    {headRow}
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                  </table>
                  :
                  <div className={suggestionStyle.locals.center}>
                    <Loading/>
                  </div>
                }
              </div>
            </div>
          </Page>
        </div>
      </div>
    </FeatureToggle>
  }

  getTableRow(title, items, props) {
    return <tr {...props}>
      {title != null ?
        <td className={this.classes.titleCell}>{this.getCellItem(title)}</td>
        : null}
      {
        items.map((item, i) => {
          return <td className={this.classes.valueCell} key={i}>{
            this.getCellItem(item)
          }</td>
        })
      }
    </tr>
  }

  getCellItem(item) {
    let elem;

    if (typeof item !== 'object') {
      elem = <div className={this.classes.cellItem}>{item}</div>
    } else {
      elem = item;
    }

    return elem;
  }

}