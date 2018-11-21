import React from 'react';
import Component from 'components/Component';
import style from 'styles/controls/small-table.css';
import Table from 'components/controls/Table';

export default class SmallTable extends Component {

  style = style;

  render() {
    const {headRowData, rowsData, ...otherProps} = this.props;
    const rowsDataWithStyling = rowsData.map(row => {
      return {
        ...row,
        props: {
          className: this.classes.tableRow,
          ...row.props
        }
      };
    });
    return <Table headRowData={{
      ...headRowData,
      props: {
        className: this.classes.headRow,
        ...headRowData.props
      }
    }}
                  rowsData={rowsDataWithStyling}
                  {...otherProps}
    />;
  }
}