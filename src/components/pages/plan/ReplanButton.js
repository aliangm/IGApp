import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/buttons.css';
import Button from 'components/controls/Button';
import planStyle from 'styles/plan/plan.css';

export default class NextButton extends Component {

  style = style;
  styles = [planStyle];

  render() {
    return <div style={{display: 'flex', position: 'relative'}}>
      <Button type='primary'
              onClick={this.props.onClick}
              className={this.classes.planButton}
              style={{
                width: '160px'
              }}
              icon='buttons:plan'
      >
        Optimize Plan ({this.props.numberOfPlanUpdates})
        {
          this.props.planNeedsUpdate ?
            <div className={planStyle.locals.planCircle}/>
            : null
        }
      </Button>
    </div>;
  }
}