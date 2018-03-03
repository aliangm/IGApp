import React from 'react';
import Component from 'components/Component';
import style from 'styles/users/users.css';
import { getNickname } from 'components/utils/channels';
import icons from 'styles/icons/plan.css';

export default class Offline extends Component {

  style = style;
  styles = [icons];

  formatDate(dateString) {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return day + '-' + monthNames[monthIndex] + '-' + year;
  }

  render () {
    const { attribution } = this.props;
    const { offline } = attribution;
    const headRow = this.getTableRow(null, [
      'Channel',
      'Campaign',
      'Start Date',
      'End Date'
    ], {
      className: this.classes.headRow
    });

    const rows = offline.map((item, index) => {

      return this.getTableRow(null, [
        <div style={{ display: 'flex' }}>
          <div className={this.classes.icon} data-icon={"plan:" + item.channel}/>
          {getNickname(item.channel)}
        </div>,
        item.campaigns.join(', '),
        this.formatDate(item.startDate),
        this.formatDate(item.endDate),
        <div>

        </div>
      ], {
        key: index,
        className: this.classes.tableRow,
        style: {cursor: 'initial'}
      })
    });

    return <div>
      <div className={this.classes.inner}>
        <table className={ this.classes.table }>
          <thead>
          { headRow }
          </thead>
          <tbody>
          { rows }
          </tbody>
        </table>
      </div>
    </div>
  }

  getTableRow(title, items, props) {
    return <tr {... props}>
      { title != null ?
        <td className={ this.classes.titleCell }>{ this.getCellItem(title) }</td>
        : null }
      {
        items.map((item, i) => {
          return <td className={ this.classes.valueCell } key={ i }>{
            this.getCellItem(item)
          }</td>
        })
      }
    </tr>
  }

  getCellItem(item) {
    let elem;

    if (typeof item !== 'object' ) {
      elem = <div className={ this.classes.cellItem }>{ item }</div>
    } else {
      elem = item;
    }

    return elem;
  }
}