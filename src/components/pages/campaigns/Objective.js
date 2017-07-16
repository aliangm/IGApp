import React from "react";
import Component from "components/Component";
import ReactGauge from 'react-gauge-capacity';
import icons from 'styles/icons/indicators.css';

export default class Objective extends Component {

  styles=[icons];

  render() {
    let options = {
      aperture: 180,
      radius : 85,
      marks: [null, this.props.maxRange],
      contentWidth: 260,
      svgContainerWidth: 260,
      svgContainerHeight: 155,
      arrowValue: this.props.maxRange < this.props.current ? (this.props.current * 1.5 - this.props.current) / (this.props.current * 1.5 - this.props.maxRange) : (this.props.current - this.props.current/2) / (this.props.maxRange - this.props.current/2),
      gaugeCenterLineHeight: 20,
      ranges: [{ start: 0, end: 1.5/6, color: "#ff0000" }, { start: 1.5/6, end: 3/6, color: "#ffa500" }, { start: 3/6, end: 4.5/6, color: "#1165A3" }, { start: 4.5/6, end: 1, color: "#25B10E" }]

    };
    return <div style={{ fontWeight: 'bold' }}>
      <div style={{ justifyContent: 'center', display: 'flex', fontWeight: 'bold' }}>
        {this.props.title}
      </div>
      <ReactGauge {... options}/>
      <div style={{ justifyContent: 'center', display: 'flex', fontWeight: 'bold' }}>
        Current - { this.props.current }
      </div>
      <div style={{ justifyContent: 'center', display: 'flex', fontSize: '14px', fontWeight: 'normal' }}>
        { Math.abs(this.props.maxRange - this.props.current) } left to reach your goal
      </div>
    </div>
  }

}