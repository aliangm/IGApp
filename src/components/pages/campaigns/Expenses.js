import React from 'react';
import Component from 'components/Component';
import {formatBudget} from 'components/utils/budget';
import style from 'styles/campaigns/expenses.css';
import {getDates} from 'components/utils/date';
import Button from 'components/controls/Button';
import history from 'history';

export default class Expenses extends Component {

  style = style;

  render() {
    const {planDate, expenses} = this.props;
    const dates = getDates(planDate);

    const headRow = this.getTableRow(null, [
      'Expense',
      'Timeframe',
      'Due date',
      'Amount'
    ], {
      className: this.classes.headRow
    });

    const campaignExpenses = expenses.filter(item => item.assignedTo && item.assignedTo.entityType === 'campaign' && item.assignedTo.entityId === this.props.campaign.index);

    const rows = campaignExpenses && campaignExpenses
      .map((expense, index) => {

        const timeframe = expense.timeframe
          .map((amount, index) => {
            return {amount, index};
          })
          .filter(item => item.amount);

        return this.getTableRow(null, [
          expense.name,
          timeframe.map(item => dates[item.index]).join(', '),
          expense.dueDate,
          formatBudget(expense.amount)
        ], {
          key: index,
          className: this.classes.tableRow
        });
      });

    return <div>
      <table className={this.classes.table}>
        <thead>
        {headRow}
        </thead>
        <tbody className={this.classes.tableBody}>
        {rows}
        </tbody>
      </table>
      <Button type="primary" style={{
        width: '123px',
        marginTop: '30px'
      }} onClick={() => {
        const json = {
          entityType: 'campaign',
          entityId: this.props.campaign.index
        };
        history.push({
          pathname: '/campaigns/add-expense',
          search: `?assignedTo=${JSON.stringify(json)}`
        });
      }}>
        Add Expense
      </Button>
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