import React from 'react';
import Component from 'components/Component';
import {getDates} from 'components/utils/date';
import Button from 'components/controls/Button';
import history from 'history';
import {formatExpenses} from 'components/utils/expenses';
import SmallTable from 'components/controls/SmallTable';

export default class CampaignExpenses extends Component {

  render() {
    const {planDate, expenses} = this.props;

    const campaignExpenses = expenses.filter(item => item.assignedTo && item.assignedTo.entityType === 'campaign' && item.assignedTo.entityId === this.props.campaign.index);

    const rows = campaignExpenses && formatExpenses(campaignExpenses, getDates(planDate))
      .map(expense => {
          return {
            items: [
              expense.name,
              expense.formattedTimeframe,
              expense.dueDate,
              expense.formattedAmount
            ]
          };
        }
      );

    return <div>
      <SmallTable headRowData={{items: ['Expense', 'Timeframe', 'Due date', 'Amount']}}
                  rowsData={rows}/>
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
}