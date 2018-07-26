import React from 'react';
import Component from 'components/Component';
import planStyle from 'styles/plan/plan.css';
import Page from 'components/Page';
import {formatDate} from 'components/utils/date';
import Select from 'components/controls/Select';
import Button from 'components/controls/Button';
import serverCommunication from 'data/serverCommunication';
import merge from 'lodash/merge';
import style from 'styles/users/users.css';
import {getNickname as getIndicatorNickname, getMetadata as getIndicatorMetadata} from 'components/utils/indicators';

export default class Trustability extends Component {

  style = style;
  styles = [planStyle];

  constructor(props) {
    super(props);
    this.state = {
      month: '',
      indicatorsProjection: null
    };
  }

  analyze() {
    const previousMonth = this.props.previousData[this.state.month - 1].planDate;
    serverCommunication.serverRequest('POST', 'calculateCEVAndCIM', JSON.stringify({analyzeDate: previousMonth}), this.props.region)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              const approvedBudgets = [];
              const relevantPlan = this.props.previousData[this.state.month];
              approvedBudgets.push(merge(relevantPlan.approvedBudgets && relevantPlan.approvedBudgets[0], relevantPlan.actualChannelBudgets && relevantPlan.actualChannelBudgets.knownChannels || {}));
              const json = {...data, useApprovedBudgets: true, approvedBudgets: approvedBudgets};
              this.props.plan(false, json, this.props.region)
                .then(data => {
                  this.setState({indicatorsProjection: data.projectedPlan && data.projectedPlan[0] && data.projectedPlan[0].projectedIndicatorValues});
                });
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {

    const {previousData} = this.props;

    const months = previousData.map((item, index) => {
      if (index !== 0) {
        return {value: index, label: formatDate(item.planDate)};
      }
    });
    months.shift();

    const headRow = this.getTableRow(null, [
      'Indicator',
      'Beginning',
      'Projected',
      'Actual',
      'Diff',
      'Deviation'
    ], {
      className: this.classes.headRow
    });

    const rows = this.state.indicatorsProjection && Object.keys(previousData[this.state.month].actualIndicators)
      .map(indicator => {
          const beginning = getIndicatorMetadata('isRefreshed', indicator) ? 0 : previousData[this.state.month - 1].actualIndicators[indicator];
          const projected = this.state.indicatorsProjection[indicator];
          const actual = previousData[this.state.month].actualIndicators[indicator];
          const dev = Math.round(((projected > actual ? (projected - beginning) / (actual - beginning) : (actual - beginning) / (projected - beginning)) - 1) * 100);
          return this.getTableRow(null, [
            getIndicatorNickname(indicator),
            beginning,
            projected,
            actual,
            Math.abs(projected - actual),
            (isFinite(dev) ? dev + '%' : '-')
          ], {
            key: indicator,
            className: this.classes.tableRow
          });
        }
      );

    return <div>
      <Page contentClassName={planStyle.locals.content} innerClassName={planStyle.locals.pageInner} width="100%">
        <div className={planStyle.locals.head}>
          <div className={planStyle.locals.headTitle}>Trustability</div>
        </div>
        <div className={planStyle.locals.wrap}>
          <div style={{padding: '20px'}}>
            <div style={{display: 'flex'}}>
              <Select
                selected={this.state.month}
                select={{
                  options: months
                }}
                onChange={(e) => {
                  this.setState({month: e.value, indicatorsProjection: null});
                }}
                style={{width: '100px', marginRight: '10px'}}
              />
              <Button type="primary2" style={{
                width: '72px'
              }} onClick={this.analyze.bind(this)}> Analyze
              </Button>
            </div>
            <div>
              {this.state.indicatorsProjection ?
                <div className={this.classes.inner}>
                  <table className={this.classes.table}>
                    <thead>
                    {headRow}
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                  </table>
                </div>
                : null}
            </div>
          </div>
        </div>
      </Page>
    </div>;
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
          }</td>;
        })
      }
    </tr>;
  }

  getCellItem(item) {
    let elem;

    if (typeof item !== 'object') {
      elem = <div className={this.classes.cellItem}>{item}</div>;
    } else {
      elem = item;
    }

    return elem;
  }
}