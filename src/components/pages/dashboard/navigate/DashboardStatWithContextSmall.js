import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/dashboard/navigate/dashboard-stat-with-context-small.css';
import NumberWithArrow from 'components/NumberWithArrow';

export default class DashboardStatWithContextSmall extends Component {

  style = style;

  static propTypes = {
    value: PropTypes.any,
    sign: PropTypes.any,
    name: PropTypes.string
  };

  render() {
    return <div className={this.classes.outer}>
      <div className={this.classes.statValue}>
        {this.props.value}
        <div className={this.classes.statSign}>
          {this.props.sign}
        </div>
        <NumberWithArrow/>
      </div>
      <div className={this.classes.statName}>
        {this.props.name}
      </div>
    </div>;
  }
}