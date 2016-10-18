import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'components/Component';

import Popup from 'components/Popup';
import Loading from 'components/pages/plan/Loading';
import Button from 'components/controls/Button';
import Textfield from 'components/controls/Textfield';
import PlanPopup, {
  TextContent as PopupTextContent
} from 'components/pages/plan/Popup';

import style from 'styles/plan/planned-actual-tab.css';
import planStyles from 'styles/plan/plan.css';

import clone from 'clone';

import plannedActualData from 'data/planned_actual';

export default class AnnualTab extends Component {
  styles = [planStyles];
  style = style

  constructor(props) {
    super(props);

    this.state = {
      hoverRow: void 0,
      month: 0,
    };

    this.data = clone(plannedActualData);
    this.keys = Object.keys(this.data);
  }

  changeMonth(dir) {
    let month = this.state.month + dir;

    if (month >= this.keys.length) {
      month = 0;
    } else if (month < 0) {
      month = this.keys.length - 1;
    }

    this.setState({
      month: month
    });
  }

  render() {
    const month = this.keys[this.state.month];
    const data = this.data[month];
    let rows;

    if (data) {
      rows = data.map((item, i) => {
        let actual = item.actual;

        if (typeof actual !== 'string') {
          actual = item.planned;
        }

        return this.getTableRow(null, [
          item.channel,
          '$' + item.planned,
          <div className={ this.classes.cellItem }>
            <Textfield style={{
              minWidth: '72px'
            }} onBlur={() => {
              this.forceUpdate();
            }} onChange={(e) => {
              item.actual = e.target.value.replace(/^\$/, '');
            }} defaultValue={ '$' + actual } />
          </div>
        ], {
          key: month + i
        });
      });
    }

    const headRow = this.getTableRow(null, [
      'Channels',
      'Planned',
      'Actual'
    ], {
      className: this.classes.headRow
    });

    return <div>
      <div className={ planStyles.locals.title }>
        <div className={ this.classes.titleBox }>
          <Button type="primary2" style={{
            width: '36px',
            // margin: '0 20px'
          }} onClick={() => {
            this.changeMonth(-1);
          }}>
            <div className={ this.classes.arrowLeft } />
          </Button>
          <div className={ planStyles.locals.titleText } style={{
            width: '200px',
            textAlign: 'center'
          }}>
            { month }
          </div>
          <Button type="primary2" style={{
            width: '36px',
            // margin: '0 20px'
          }} onClick={() => {
            this.changeMonth(1);
          }}>
            <div className={ this.classes.arrowRight } />
          </Button>
        </div>
      </div>
      <div className={ planStyles.locals.innerBox }>
        <div className={ this.classes.wrap } ref="wrap">
          <div className={ this.classes.box }>
            <table className={ this.classes.table }>
              {/*<col style={{ width: '50%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />*/}
              <thead>
                { headRow }
              </thead>
              <tbody className={ this.classes.tableBody }>
                { rows }
              </tbody>
            </table>
          </div>
        </div>
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