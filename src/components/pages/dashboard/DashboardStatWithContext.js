import React, { PropTypes } from "react";
import Component from "components/Component";
import style from "styles/dashboard/dashboard-stat-with-context.css";
import StatSquare from 'components/common/StatSquare';

export default class DashboardStatWithContext extends Component {

  static propTypes = {
    title:PropTypes.string.isRequired,
    stat:PropTypes.node,
    contextStat:PropTypes.node,
    statWithArrow: PropTypes.bool,
    contextText: PropTypes.string,
    isPositive: PropTypes.bool,
    tooltipText: PropTypes.string,
    showEmptyStat : PropTypes.bool,
    emptyStatMessage: PropTypes.string
  };

  static defaultProps = {
    tooltipText: '',
    statWithArrow: false,
    showEmptyStat: false,
    contextText: ''
  };

  style = style;

  render() {
    const stat = <div style={{display: "inline-flex"}}>
      {this.props.contextStat ? <div className={this.classes.contextStat + ' ' + this.classes.contextText} data-negative={ this.props.isPositive ? null : 'negative' }>
        {this.props.statWithArrow ? <div className={this.classes.arrow} data-arrow-type={ !this.props.isPositive ? 'decline' : null } /> : ''}
        {this.props.contextStat}
      </div> : ''
      }

      { ' '+ this.props.contextText }
    </div>;

    return <StatSquare {...this.props} contextStat={stat}/>
  }
}