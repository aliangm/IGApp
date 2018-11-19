import React from 'react';
import Component from 'components/Component';
import {getNickname as getChannelNickname} from 'components/utils/channels';
import {getDates} from 'components/utils/date';
import taskStyle from 'styles/campaigns/task.css';
import {formatExpenses} from 'components/utils/expenses';
import Table from 'components/controls/Table';

export default class Expenses extends Component {

  styles = [taskStyle];

  deleteExpense = (index) => {
    const expenses = [...this.props.expenses];
    expenses.splice(index, 1);
    this.props.updateUserMonthPlan({expenses}, this.props.region, this.props.planDate);
  };

  render() {
    const {expenses, planDate, calculatedData: {activeCampaigns}} = this.props;

    const headRow = [
      '',
      'Expense',
      'Timeframe',
      'Due date',
      'Amount',
      'Assigned in',
      'Last Edit'
    ];

    const rows = formatExpenses(expenses, getDates(planDate))
      .map((expense, index) => {

        const assignedTo = expense.assignedTo.entityId ?
          (expense.assignedTo.entityType === 'campaign' ?
            activeCampaigns[expense.assignedTo.entityId].name
            : getChannelNickname(expense.assignedTo.entityId))
          : '';

        return {
          items: [
            <div className={taskStyle.locals.deleteIcon} onClick={() => this.deleteExpense(index)}
                 style={{cursor: 'pointer'}}/>,
            expense.name,
            expense.formattedTimeframe,
            expense.dueDate,
            expense.formattedAmount,
            assignedTo,
            expense.formattedTimestamp
          ]
        };
      });

    return <Table headRowData={{items: headRow}}
                  rowsData={rows}/>;
  }
}