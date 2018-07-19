import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import PlanCell from 'components/pages/plan/PlanCell';

export default class TableCell extends Component {

  style = style;

  static propTypes = {
    primaryValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    secondaryValue: PropTypes.string,
    key: PropTypes.number,
    approveSecondary: PropTypes.func,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    return this.props.secondaryValue && (this.props.secondaryValue !== this.props.primaryValue) ?
      <PlanCell
        item={this.props.primaryValue}
        hover={this.props.secondaryValue}
        key={this.props.key}
        approveChannel={this.props.approveSecondary}
        isSecondGood={true}/>
      :
      <td className={this.classes.valueCell} key={this.props.key}>
        <div className={this.classes.cellItem + ' '+ this.props.className}>{this.props.primaryValue}</div>
      </td>;
  }
}