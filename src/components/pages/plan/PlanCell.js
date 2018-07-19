import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import planStyle from 'styles/plan/plan.css';
import cellStyle from 'styles/plan/plan-cell.css'

export default class PlanCell extends Component {

  style = style;
  styles = [cellStyle, planStyle];

  constructor(props) {
    super(props);
    this.state = {
      hoverCell: false
    }
  }

  render() {
    return <td className={ this.classes.valueCell }
               onMouseEnter={() => { this.setState({hoverCell: true}) }}
               onMouseLeave={() => { this.setState({hoverCell: false}) }}
               style={ this.props.style }
    >
      <div hidden={ !this.state.hoverCell }>
        <div className={ cellStyle.locals.hover }>
          <div className={ planStyle.locals.right }>
            <div className={ cellStyle.locals.accept } onClick={ this.props.approveChannel }/>
          </div>
        </div>
      </div>
      <div className={ this.classes.cellItem } style={{ color: this.state.hoverCell ? (this.props.isSecondGood ? '#D75A4A' : '#25AE88') : '#1991eb' }}>
        { this.state.hoverCell ? '' : '*' }{this.props.item}
        <div hidden={ !this.state.hoverCell } className={ cellStyle.locals.budget } style={{ color: this.props.isSecondGood ? '#25AE88' : '#D75A4A' }}>
          ({ this.props.hover })
        </div>
      </div>

    </td>
  }
}