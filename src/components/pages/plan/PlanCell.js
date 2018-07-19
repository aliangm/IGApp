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
          <div className={ planStyle.locals.left }>
            <div className={ cellStyle.locals.lock } onClick={ this.props.lockChannel }/>
          </div>
          <div className={ planStyle.locals.right }>
            <div className={ cellStyle.locals.like } onClick={ this.props.likeChannel }/>
          </div>
          <div className={ planStyle.locals.right }>
            <div className={ cellStyle.locals.accept } onClick={ this.props.acceptSuggestion }/>
          </div>
        </div>
      </div>
      <div className={ this.classes.cellItem } style={{ color: this.state.hoverCell ? '#D75A4A' : '#1991eb' }}>
        { this.state.hoverCell ? '' : '*' }{this.props.item}
        <div hidden={ !this.state.hoverCell } className={ cellStyle.locals.budget } style={{ color: '#25AE88'}}>
          ({ this.props.hover })
        </div>
      </div>

    </td>
  }
}