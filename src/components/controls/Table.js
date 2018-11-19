import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/controls/table.css';
import isEmpty from 'lodash/isEmpty';

export default class Table extends Component {

  style = style;

  static propTypes = {
    headRowData: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.any),
      props: PropTypes.object
    }).isRequired,
    rowsData: PropTypes.arrayOf(
      PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.any),
        props: PropTypes.object
      })).isRequired,
    footRowData: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.any),
      props: PropTypes.object
    }),
    showFootRowOnHeader: PropTypes.bool
  };

  static defaultProps = {
    footRowData: {
      items: [],
      props: {}
    },
    showFootRowOnHeader: false
  };

  render() {
    const {headRowData, rowsData, footRowData, showFootRowOnHeader} = this.props;

    const headRow = this.getTableRow(null, headRowData.items, {
      className: this.classes.headRow,
      ...headRowData.props
    });
    const rows = rowsData.map((row, index) => this.getTableRow(null, row.items, {
      className: this.classes.tableRow,
      key: index,
      ...row.props
    }));
    const footRow = this.getTableRow(null, footRowData.items, {
      className: this.classes.footRow,
      ...footRowData.props
    });

    const showFootRow = footRowData && !isEmpty(footRowData.items);

    return <div className={this.classes.wrap} ref="wrap">
      <div className={this.classes.box}>
        <table className={this.classes.table}>
          <thead>
          {headRow}
          {(showFootRow && showFootRowOnHeader) ? footRow : null}
          </thead>
          <tbody className={this.classes.tableBody}>
          {rows}
          </tbody>
          {showFootRow ?
            <tfoot>
            {footRow}
            </tfoot>
            : null}
        </table>
      </div>
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