import React from "react";
import Component from "components/Component";
import icons from 'styles/icons/indicators.css';
import style from 'styles/dashboard/objective.css';

export default class Objective extends Component {

  style = style;
  styles = [icons];

  static defaultProps = {
    sqSize: 200,
    strokeWidth: 12
  };

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
    // Size of the enclosing square
    const sqSize = this.props.sqSize;
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (this.props.sqSize - this.props.strokeWidth) / 2;
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2;
    // Scale 100% coverage overlay with the actual percent
    const dashOffset = dashArray - dashArray * Math.min(1, this.props.value / this.props.target) / 2;
    const isActive = this.isObjectiveActive();
    return <div className={ this.classes.inner }>
      <div className={ this.classes.title }>
        {this.props.title}
      </div>
      <svg
        width={this.props.sqSize*1.1}
        height={this.props.sqSize}
        viewBox={viewBox}>
        <clipPath id="cut-off-bottom">
          <rect x="0" y="0" width={this.props.sqSize} height={this.props.sqSize / 2} />
        </clipPath>
        <circle
          className={ this.classes.circleBackground }
          cx={this.props.sqSize / 2}
          cy={this.props.sqSize / 2}
          r={radius}
          strokeWidth={`3px`}
          style={{
            clipPath: 'url(#cut-off-bottom)'
          }}
        />
        <text
          className={this.classes.target}
          x="97%"
          y="50%"
          dy="20px"
          textAnchor="middle"
          alignmentBaseline="text-after-edge">
          { Math.round(this.props.target) || 0 }
        </text>
        <circle
          className={ this.classes.circleProgress }
          cx={this.props.sqSize / 2}
          cy={this.props.sqSize / 2}
          r={radius}
          strokeWidth={`${this.props.strokeWidth}px`}
          // Start progress marker at 12 O'Clock
          transform={`rotate(-180 ${this.props.sqSize / 2} ${this.props.sqSize / 2})`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
            stroke: this.props.color
          }} />
        <text
          className={this.classes.current}
          x="50%"
          y="50%"
          dy="-20px"
          textAnchor="middle">
          { Math.round(this.props.value) || 0 }
        </text>
      </svg>
      <div style={{ marginTop: '-98px' }}>
        <div className={this.classes.center}>
          <div className={this.classes.objectiveIcon} data-active={isActive}/>
        </div>
        <div className={ this.classes.textBottom }>
          {
            isActive ?
              isActive === "success" ?
                <div className={this.classes.successText}>You have reached your goal!</div>
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
    </div>
  }

}