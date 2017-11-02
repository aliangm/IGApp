import React from "react";
import Component from "components/Component";
import ReactGauge from 'react-gauge-capacity';
import icons from 'styles/icons/indicators.css';
import style from 'styles/dashboard/objective.css';

export default class Objective extends Component {

  style = style;
  styles = [icons];

  render() {
    let options = {
      aperture: 180,
      radius : 85,
      marks: [null, Math.round(this.props.maxRange)],
      contentWidth: 260,
      svgContainerWidth: 260,
      svgContainerHeight: 155,
      arrowValue: this.props.maxRange < this.props.current ? (this.props.current * 1.5 - this.props.current) / (this.props.current * 1.5 - this.props.maxRange) : (this.props.current - this.props.current/2) / (this.props.maxRange - this.props.current/2),
      gaugeCenterLineHeight: 20,
      ranges: [{ start: 0, end: 1.5/6, color: "#ff0000" }, { start: 1.5/6, end: 3/6, color: "#ffa500" }, { start: 3/6, end: 4.5/6, color: "#1165A3" }, { start: 4.5/6, end: 1, color: "#25B10E" }]

    };
    return <div className={ this.classes.inner }>
      <div className={ this.classes.center }>
        {this.props.title}
      </div>
      <ReactGauge {... options}/>
      <div className={ this.classes.center }>
        Current - { Math.round(this.props.current) || 0 }
      </div>
      <div className={ this.classes.textBottom }>
        {
          this.props.maxRange - this.props.current > 0
            ?
            Math.round(this.props.maxRange - this.props.current) +" left to reach your goal"
            :
            "you have reached your goal!"
        }
      </div>
      <div className={ this.classes.center }>
        <div className={ this.classes.thumbs } data-down={ this.props.project < this.props.maxRange ? true : null }/>
      </div>
    </div>
  }

}