import React from 'react';
import Component from 'components/Component';
import style from 'styles/campaigns/expenses.css';
import {getDates} from 'components/utils/date';
import Button from 'components/controls/Button';
import history from 'history';
import {formatExpenses} from 'components/utils/expenses';

export default class CampaignExpenses extends Component {

  style = style;

  render() {
    const {planDate, expenses} = this.props;

    const headRow = this.getTableRow(null, [
      'Expense',
      'Timeframe',
      'Due date',
      'Amount'
    ], {
      className: this.classes.headRow
    });

    const campaignExpenses = expenses.filter(item => item.assignedTo && item.assignedTo.entityType === 'campaign' && item.assignedTo.entityId === this.props.campaign.index);

    const rows = campaignExpenses && formatExpenses(campaignExpenses, getDates(planDate))
      .map((expense, index) =>
        this.getTableRow(null, [
          expense.name,
          expense.formattedTimeframe,
          expense.dueDate,
          expense.formattedAmount
        ], {
          key: index,
          className: this.classes.tableRow
        })
      );

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
        const currentPath = window.location.pathname;
        history.push({
          pathname: '/campaigns/add-expense',
          state: {
            close: () => history.push({
              pathname: currentPath,
              query: {campaign: this.props.campaign.index}
            }),
            assignedTo: json
          }
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