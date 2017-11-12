import React from 'react';
import Component from 'components/Component';

import Page from 'components/Page';
import Title from 'components/onboarding/Title';
import { parseAnnualPlan } from 'data/parseAnnualPlan';
import IndicatorsGraph from 'components/pages/plan/IndicatorsGraph';

import style from 'styles/plan/annual-tab.css';
import icons from 'styles/icons/plan.css';
import analyzeStyle from 'styles/analyze/analyze.css';

export default class Analyze extends Component {

  style = style;
  styles = [icons, analyzeStyle];

  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  static defaultProps = {
    planDate: '',
    previousData: [],
    objectives: []
  };

  constructor(props) {
    super(props);
    this.state = {
      hoverRow: void 0,
      collapsed: {},
      tableCollapsed: false,
    };
  }

  getDates = () => {
    const dates = [];
    for (let i = 0; i < 12; i++) {
      const planDate = this.props.planDate.split("/");
      const date = new Date(planDate[1], planDate[0]-1);
      date.setMonth(date.getMonth() - i);
      dates.unshift(this.monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2,2));
    }
    return dates;
  };

  getMonthHeaders = () => {
    const dates = this.getDates();
    return dates.map((month) => {
      return <div className={ this.classes.cellItem }>{ month }</div>
    });
  };

  render() {
    const previousData = this.props.previousData.slice();
    previousData.splice(0,1);
    previousData.forEach(item => {
      if (item.actualChannelBudgets && item.actualChannelBudgets.knownChannels) {
        Object.keys(item.actualChannelBudgets.knownChannels).forEach(channel => {
          item.approvedBudgets[0][channel] = item.actualChannelBudgets.knownChannels[channel];
        });
      }
    });
    const previousPlan = previousData.map(item => item.approvedBudgets && item.approvedBudgets[0] ? { plannedChannelBudgets: item.approvedBudgets[0] } : {});
    const unknownChannels = previousData.map(item => item.unknownChannels && item.unknownChannels[0] ? item.unknownChannels[0] : {});
    const planJson = parseAnnualPlan(previousPlan, null, unknownChannels);
    let budget = Object.keys(planJson)[0];
    const data = planJson[budget];
    let rows = [];

    const handleRows = (data, parent, level) => {
      level = level | 0;

      Object.keys(data).sort().forEach((item, i) => {
        if (item === '__TOTAL__') return null;

        let key = parent + ':' + item + '-' + i;
        let collapsed = !!this.state.collapsed[key];
        const params = data[item];
        const values = params.values.map(val => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        const  titleElem = <div
          style={{
            marginLeft: (level | 0) * 17 + 'px'
          }}
          className={ this.classes.rowTitle }>
          { params.children ?
            <div
              className={ this.classes.rowArrow }
              data-collapsed={ collapsed || null }
              onClick={() => {
                this.state.collapsed[key] = !collapsed;
                this.forceUpdate();
              }}
            />
            : null }

          { params.icon ?
            <div className={ this.classes.rowIcon } data-icon={ params.icon }/>
            : null }

          {item}
        </div>

        const rowProps = {
          className: this.classes.tableRow,
          key: key,
          onMouseEnter: () => {
            this.setState({
              hoverRow: key
            });
          },
          onMouseLeave: () => {
            this.setState({
              hoverRow: void 0
            });
          }
        };

        if (params.disabled) {
          rowProps['data-disabled'] = true;
        }

        const row = this.getTableRow(titleElem, values, rowProps);
        rows.push(row);

        if (!collapsed && params.children) {
          handleRows(params.children, key, level + 1);
        }
      });
    };

    if (data && !this.state.tableCollapsed) {
      handleRows(data);
    }

    const headers = this.getMonthHeaders();
    const headRow = this.getTableRow(<div className={ this.classes.headTitleCell }>
      <div
        className={ this.classes.rowArrow }
        data-collapsed={ this.state.tableCollapsed || null }
        onClick={() => {
          this.state.tableCollapsed = !this.state.tableCollapsed;
          this.forceUpdate();
        }}
      />
      { 'Marketing Channel' }
    </div>, headers.slice(headers.length - previousPlan.length, headers.length), {
      className: this.classes.headRow
    });

    const footRow = data && this.getTableRow(<div className={ this.classes.footTitleCell }>
      { 'TOTAL' }
    </div>, data['__TOTAL__'].values.map(val => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')), {
      className: this.classes.footRow
    });

    const dates = this.getDates();
    dates.splice(0, dates.length - this.props.previousData.length);
    const projections = this.props.previousData.map((item, index) => {
      return {... item.actualIndicators, name: dates[index]}
    });

    const objectives = {};
    this.props.objectives.forEach(objective => {
      const delta = objective.isPercentage ? objective.amount * this.props.actualIndicators[objective.indicator] / 100 : objective.amount;
      const target = objective.direction === "equals" ? objective.amount : (objective.direction === "increase" ? delta + this.props.actualIndicators[objective.indicator] : this.props.actualIndicators[objective.indicator] - delta);
      const date = new Date(objective.timeFrame);
      const monthStr = this.monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2,2);
      objectives[objective.indicator] = {x: monthStr, y: target};
    });

    return <div>
      <Page contentClassName={ this.classes.content } innerClassName={ this.classes.pageInner } width="100%">
        <Title title="Analyze"/>
        <div className={ this.classes.innerBox }>
          <div className={ analyzeStyle.locals.wrap } ref="wrap">
            <div className={ this.classes.box }>
              <table className={ this.classes.table }>
                <thead>
                { headRow }
                </thead>
                <tbody className={ this.classes.tableBody }>
                { rows }
                </tbody>
                <tfoot>
                { footRow }
                </tfoot>
              </table>
            </div>

            <div className={ this.classes.hoverBox }>
              <table className={ this.classes.hoverTable }>
                <thead>{ headRow }</thead>
                <tbody>{ rows }</tbody>
                <tfoot>{ footRow }</tfoot>
              </table>
            </div>

          </div>
        </div>
        <div className={ analyzeStyle.locals.wrap } style={{ width: 200 + 76 * (projections.length - 1) + 'px' }}>
          <IndicatorsGraph data={ projections } width={88 + 76 * (projections.length - 1)} objectives={ objectives }/>
        </div>
      </Page>
    </div>
  }

  getTableRow(title, items, props)
  {
    return <tr {... props}>
      <td className={ this.classes.titleCell }>{ this.getCellItem(title) }</td>
      {
        items.map((item, i) => {
          return <td className={ this.classes.valueCell } key={ i }>{
            this.getCellItem(item)
          }</td>
        })
      }
    </tr>
  }

  getCellItem(item)
  {
    let elem;

    if (typeof item !== 'object') {
      elem = <div className={ this.classes.cellItem }>{ item }</div>
    } else {
      elem = item;
    }

    return elem;
  }
}