import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/controls/table.css';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

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
    showFootRowOnHeader: PropTypes.bool,
    valueCellClassName: PropTypes.string,
    titleCellClassName: PropTypes.string
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
    }, true);
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

  getTableRow(title, items, props, isHead = false) {
    const valueCellClassName = classnames(this.classes.valueCell, this.props.valueCellClassName);
    const titleCellClassName = classnames(this.classes.titleCell, this.props.titleCellClassName);
    return <tr {...props}>
      {title != null ?
        <td className={titleCellClassName}>{this.getCellItem(title)}</td>
        : null}
      {
        items.map((item, i) => {
          return isHead ?
            <td className={titleCellClassName} key={i}>{this.getCellItem(<div
              className={this.classes.titleItem}>{item}</div>)}</td>
            :
            <td className={valueCellClassName} key={i}>{
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