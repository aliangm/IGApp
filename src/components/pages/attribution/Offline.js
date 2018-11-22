import React from 'react';
import Component from 'components/Component';
import style from 'styles/users/users.css';
import {getNickname} from 'components/utils/channels';
import icons from 'styles/icons/plan.css';
import Table from 'components/controls/Table';

export default class Offline extends Component {

  style = style;
  styles = [icons];

  formatDate(dateString) {
    const date = new Date(dateString);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return day + '-' + monthNames[monthIndex] + '-' + year;
  }

  render() {
    const {attribution} = this.props;
    const {offline} = attribution;
    const headRow = [
      'Channel',
      'Campaign',
      'Start Date',
      'End Date'
    ];

    const rows = offline && offline.map(item => {
      return {
        items: [
          <div style={{display: 'flex'}}>
            <div className={this.classes.icon} data-icon={'plan:' + item.channel}/>
            {getNickname(item.channel)}
          </div>,
          item.campaigns.join(', '),
          this.formatDate(item.startDate),
          this.formatDate(item.endDate),
          <div>
          </div>
        ]
      };
    });

    return <div>
      <Table headRowData={{items: headRow}}
             rowsData={rows}/>
    </div>;
  }
}