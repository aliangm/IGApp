import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/buttons.css';
import Button from 'components/controls/Button';
import planStyle from 'styles/plan/plan.css';
import ReactTooltip from 'react-tooltip';
import planButtonStyle from 'styles/plan/plan-button.css';

export default class PlanButton extends Component {

  style = style;
  styles = [planStyle, planButtonStyle];

  tooltipHtml = `You've reached the plan updates limit.<br/> To
    upgrade,
    click <a href="mailto:support@infinigrow.com?&subject=I need replan upgrade"
    target='_blank'>here</a>`;

  render() {
    const disabled = this.props.numberOfPlanUpdates === 0;

    return <div style={{display: 'flex', position: 'relative'}}
                data-tip={disabled ? this.tooltipHtml : null}
                data-for='plan-button'>
      <Button type='primary'
              disabled={disabled}
              onClick={this.props.onClick}
              style={this.props.style}
              icon={this.props.showIcons ? 'buttons:plan' : null}
      >
        {this.props.label}({this.props.numberOfPlanUpdates})
        {
          this.props.showIcons && this.props.planNeedsUpdate ?
            <div className={planStyle.locals.planCircle}/>
            : null
        }
      </Button>
      <ReactTooltip effect='solid' place='bottom' html={true} delayHide={1000} id='plan-button' className={planButtonStyle.locals.tooltipClass}/>
    </div>;
  }
}