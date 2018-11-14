import React from 'react';
import Component from 'components/Component';
import style from 'styles/campaigns/online-campaigns.css';
import {getNickname as getChannelNickname} from 'components/utils/channels';
import {getDates} from 'components/utils/date';
import taskStyle from 'styles/campaigns/task.css';
import {formatExpenses} from 'components/utils/expenses';

export default class CampaignsExpenses extends Component {

  style = style;
  styles = [taskStyle];

  deleteExpense = (index) => {
    const expenses = [...this.props.expenses];
    expenses.splice(index, 1);
    this.props.updateUserMonthPlan({expenses}, this.props.region, this.props.planDate);
  };

  render() {
    const {expenses, planDate, calculatedData: {activeCampaigns}} = this.props;

    const headRow = this.getTableRow(null, [
      '',
      'Expense',
      'Timeframe',
      'Due date',
      'Amount',
      'Assigned in',
      'Last Edit'
    ], {
      className: this.classes.headRow
    });

    const rows = formatExpenses(expenses, getDates(planDate))
      .map((expense, index) => {

        const assignedTo = expense.assignedTo.entityType === 'campaign' ?
          activeCampaigns[expense.assignedTo.entityId].name
          : getChannelNickname(expense.assignedTo.entityId);

        return this.getTableRow(null, [
          <div className={taskStyle.locals.deleteIcon} onClick={() => this.deleteExpense(index)}
               style={{cursor: 'pointer'}}/>,
          expense.name,
          expense.formattedTimeframe,
          expense.dueDate,
          expense.formattedAmount,
          assignedTo,
          expense.formattedTimestamp
        ], {
          key: index,
          className: this.classes.tableRow
        });
      });

    return (
      <div className={this.classes.wrap}>
        <table className={this.classes.table}>
          <thead>
          {headRow}
          </thead>
          <tbody className={this.classes.tableBody}>
          {rows}
          </tbody>
        </table>
      </div>
    );
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