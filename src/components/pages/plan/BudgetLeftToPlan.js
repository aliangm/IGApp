import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/budget-left-to-plan.css';
import {formatBudget} from 'components/utils/budget';

export default class Popup extends Component {

  style = style;

  static propTypes = {
    annualBudget: PropTypes.number.isRequired,
    annualBudgetLeftToPlan: PropTypes.number.isRequired
  };

  render() {
    const {annualBudget, annualBudgetLeftToPlan} = this.props;

    const lineWidth = 216 * (annualBudgetLeftToPlan >= 0 ? Math.round(annualBudgetLeftToPlan / annualBudget) : 1);

    return <div>
      <div className={this.classes.upperText}>
        Annual Budget
      </div>
      <div className={this.classes.center}>
        <div className={this.classes.number}>
          {formatBudget(annualBudget)}
        </div>
        <div className={this.classes.dollar}>
          $
        </div>
      </div>
      <div className={this.classes.line}>
        <div className={this.classes.lineFill} style={{width: `${lineWidth}px`}}/>
      </div>
      <div className={this.classes.bottomText}>
        ${formatBudget(annualBudgetLeftToPlan)} left
      </div>
    </div>;
  }

}