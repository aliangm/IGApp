import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/number-with-arrow.css';
import {isNil} from 'lodash';

export default class NumberWithArrow extends Component {

  style = style;

  static propTypes = {
    stat: PropTypes.any,
    isNegative: PropTypes.bool
  };

  render() {
    const {stat, isNegative} = this.props;
    const notExist = isNil(stat);
    return notExist ? null :
      <div className={this.classes.inner} data-negative={isNegative ? true : null}>
        <div className={this.classes.arrow}/>
        <div className={this.classes.stat}>
          {stat}
        </div>
      </div>;
  }
}