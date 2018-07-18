import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';

export default class TableCell extends Component {

  style = style;

  static propTypes = {
    primaryValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return <div className={this.classes.cellItem}>{this.props.primaryValue}</div>;
  }
}