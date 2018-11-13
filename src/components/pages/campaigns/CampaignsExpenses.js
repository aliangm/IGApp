import React from 'react';
import Component from 'components/Component';
import style from 'styles/campaigns/online-campaigns.css';
import {formatBudget} from 'components/utils/budget';
import {getNickname as getChannelNickname} from 'components/utils/channels';
import {formatTimestamp, getDates} from 'components/utils/date';

export default class CampaignsExpenses extends Component {

  style = style;

  render() {
    const {expenses, planDate, calculatedData: {activeCampaigns}} = this.props;

    const dates = getDates(planDate);

    const headRow = this.getTableRow(null, [
      'Expense',
      'Timeframe',
      'Due date',
      'Amount',
      'Assigned in',
      'Last Edit'
    ], {
      className: this.classes.headRow
    });

    const rows = expenses
      .map((expense, index) => {

        const timeframe = expense.timeframe
          .map((amount, index) => {
            return {amount, index};
          })
          .filter(item => item.amount);

        const assignedTo = expense.assignedTo.entityType === 'campaign' ?
          activeCampaigns[expense.assignedTo.entityId].name
          : getChannelNickname(expense.assignedTo.entityId);

        return this.getTableRow(null, [
          expense.name,
          timeframe.map(item => dates[item.index]).join(', '),
          expense.dueDate,
          formatBudget(expense.amount),
          assignedTo,
          formatTimestamp(expense.lastUpdateTime)
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