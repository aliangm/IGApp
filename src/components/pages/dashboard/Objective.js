import React from "react";
import Component from "components/Component";
import icons from 'styles/icons/indicators.css';
import style from 'styles/dashboard/objective.css';

export default class Objective extends Component {

  style = style;
  styles = [icons];

  getDaysLeft() {
    const targetDate = new Date(this.props.timeFrame);
    const today = new Date();
    return Math.max(Math.ceil((targetDate.getTime() - today.getTime())/(24*60*60*1000)), 0) + " days left";
  }

  isObjectiveActive() {
    // If the objective achieved, show green.
    // Else, if date passed - red.
    // Else - none.
    const today = new Date();
    const date = new Date(this.props.timeFrame);
    if (this.props.target <= this.props.value) {
      return 'success';
    }
    if (date < today) {
      return 'fail'
    }
    return null;
  }

  render() {
    const isActive = this.isObjectiveActive();
    return <div className={ this.classes.inner }>
      <div className={ this.classes.title }>
        {this.props.title}
      </div>
      <div>
        <div className={this.classes.halfCircle}>
          <div className={this.classes.halfCircleFill} style={{ clipPath: 'ellipse(' + Math.max(24, Math.round(this.props.value / this.props.target * 320)) + 'px 124px at 0px 0px)', borderColor: this.props.color}}/>
          <div className={this.classes.target}>
            { Math.round(this.props.target) || 0 }
          </div>
        </div>
      </div>
      <div className={ this.classes.current }>
        { Math.round(this.props.value) || 0 }
      </div>
      <div className={this.classes.center}>
        <div className={this.classes.objectiveIcon} data-active={isActive}/>
      </div>
      <div className={ this.classes.textBottom }>
        {
          isActive ?
            isActive === "success" ?
              <div className={this.classes.successText}>you have reached your goal!</div>
              :
              <div className={this.classes.failText}>Your goal hasn’t been reached</div>
            :
            <div style={{ display: 'inline-flex', whiteSpace: 'pre' }}>
              {this.props.project >= this.props.target ?
                <div className={this.classes.successText}>Aligned</div>
                :
                <div className={this.classes.failText}>Not aligned</div>
              }
              {" to your current plan"}
            </div>
        }
      </div>
      <div className={ this.classes.timeLeft }>
        { this.getDaysLeft() }
      </div>
    </div>
  }

}