import React from 'react';

import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import cellStyle from 'styles/plan/plan-cell.css'
import Textfield from 'components/controls/Textfield';


export default class PlanCell extends Component {
  style=style
  styles=[cellStyle]

  constructor(props) {
    super(props);
    this.state = {
      hoverCell: false
    }
  }

  render() {


    return <td className={ this.classes.valueCell } onMouseEnter={() => {
      this.setState({
        hoverCell: true
      });
    }}
               onMouseLeave={() => {
                 this.setState({
                   hoverCell: false
                 });
               }}>
      <div hidden={ !this.state.hoverCell }>
        <div className={ cellStyle.locals.hover }>
          <div className={ this.classes.left }>
            {/*<div className={ cellStyle.locals.edit }/>*/}
            <div className={ cellStyle.locals.reject } onClick={ this.props.declineChannel }/>
          </div>
          <div className={ this.classes.right }>
            <div className={ cellStyle.locals.accept } onClick={ this.props.approveChannel }/>
          </div>
        </div>
      </div>
      <div className={ this.classes.cellItem } style={{ color: this.state.hoverCell ? '#25AE88' : '#1991eb' }}>
        { this.state.hoverCell ? '' : '*' }{this.props.item}
      <div hidden={ !this.state.hoverCell } className={ cellStyle.locals.budget } style={{ color: '#D75A4A' }}>
          ({ this.props.approved })
        </div>
      </div>

    </td>
  }
}