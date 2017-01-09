import React, { PropTypes } from 'react';
import Component from 'components/Component';

import style from 'styles/multi-row.css';

export default class MultiRow extends Component {
  static propTypes = {
    children: PropTypes.func
  }

  style = style;
  state = {
    rows: []
  }

  _uid = this.props.numOfRows;

  componentDidMount() {
    let currentRows = [];
    for(let i=0; i< this.props.numOfRows; i++) {
      currentRows.push({key: i});
    }
    this.setState({rows: currentRows});
  }

  addRow = () => {
    const rows = this.state.rows;

    rows.push({
      key: this._uid++
    });

    this.setState({
      rows: rows
    });
  }

  removeRow = (index) => {
    const rows = this.state.rows;
    if (rows) {
      rows.splice(index, 1);
    }
    this.setState({
      rows: rows
    });
    this.props.rowRemoved(index);
  }

  render() {
    const renderRow = this.props.children;
    const canRemove = this.state.rows.length > 1;
    const canAdd = this.state.rows.length < 3;
    const rows = this.state.rows.map((row, i) => {
      const rendered = renderRow({
        key: row.key,
        index: i,
        data: row.data,
        update: (data) => {
          row.data = data;
        },
        removeButton: canRemove ? <div
          className={ this.classes.removeButton }
          onClick={() => this.removeRow(i)}
        /> : null
      });

      return <div className={ this.classes.row } key={ row.key }>
        { rendered }
      </div>
    });

    return <div className={ this.classes.box }>
      { rows }
      {canAdd ? <div role="button"
                     className={ this.classes.addButton }
                     onClick={ this.addRow }
      /> : null}
    </div>
  }
}