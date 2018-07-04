import React from "react";
import Component from "components/Component";
import style from "styles/dashboard/dashboard-number-with-context.css";
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

class DashboardNumberWithContext extends Component {

  constructor(props){
    super(props);
    this.uniqueID = Math.random().toString(36).substr(2, 9);
  }
  style=style;

  render() {
    return <div className={ this.classes.colCenter }>
      <ReactTooltip place='bottom' effect='solid' id={this.uniqueID}/>
      <div className={ this.classes.item }>
        <div className={ this.classes.text }>
          {this.props.title}
        </div>
        <div className={ this.classes.number }>
          {this.props.stat}
        </div>
        <div className={this.classes.context} data-tip={this.props.tooltipText} data-for={this.uniqueID}>

          <div className={this.classes.contextStat +' ' +this.classes.contextText} data-positive={this.props.isPositive ? 'positive': 'not-positive'}>
            {this.props.statWithArrow ? <div className={this.classes.arrow} data-arrow-type={this.props.isPositive ? 'incline' : 'decline'}></div> : ''}
            {this.props.contextStat}
          </div>
          {/*<div className={this.classes.contextText} content=" " />*/}
          {' '+this.props.contextText}
          {/*<div className={this.classes.contextText}></div>*/}
        </div>
      </div>
    </div>
  }
}

DashboardNumberWithContext.propTypes = {
  title:PropTypes.string.isRequired,
  stat:PropTypes.string.isRequired,
  contextStat:PropTypes.string.isRequired,
  statWithArrow: PropTypes.bool,
  contextText: PropTypes.string.isRequired,
  isPositive: PropTypes.bool.isRequired,
  tooltipText: PropTypes.string
};

DashboardNumberWithContext.defaultProps = {
  tooltipText: '',
  statWithArrow: true
}

export default DashboardNumberWithContext