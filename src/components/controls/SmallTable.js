import React from 'react';
import Component from 'components/Component';
import style from 'styles/controls/small-table.css';
import Table from 'components/controls/Table';

export default class SmallTable extends Component {

  style = style;

  render() {
    const {headRowData: {items: headRowItems, props: headRowProps = {}}, rowsData, ...otherProps} = this.props;
    const rowsDataWithStyling = rowsData.map(row => {
      const {items, props} = row;
      return {
        items: items,
        props: {
          className: this.classes.tableRow,
          ...props
        }
      };
    });
    return <Table headRowData={{items: headRowItems, props: {className: this.classes.headRow, ...headRowProps}}}
                  rowsData={rowsDataWithStyling}
                  {...otherProps}
    />;
  }
}