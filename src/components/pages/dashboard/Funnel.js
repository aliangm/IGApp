import React from "react";
import Component from "components/Component";
import Column from 'components/pages/dashboard/Column';
import Arrow from 'components/pages/dashboard/Arrow';
import Circle from 'components/pages/dashboard/Circle';
import style from 'styles/dashboard/funnel.css';
import { getNickname } from 'components/utils/indicators';

export default class Funnel extends Component {

  style=style;

  render() {
    const funnel = {
      MCL: {
        value: this.props.actualIndicators.MCL,
        title: getNickname('MCL'),
        fillColor: '#0099cc',
        backgroundColor: 'rgba(0, 153, 204, 0.1)'
      },
      MQL: {
        value: this.props.actualIndicators.MQL,
        title: getNickname('MQL'),
        fillColor: '#0099ccb3',
        backgroundColor: 'rgba(0, 153, 204, 0.1)'
      },
      SQL: {
        value: this.props.actualIndicators.SQL,
        title: getNickname('SQL'),
        fillColor: '#0099cc4d',
        backgroundColor: 'rgba(0, 153, 204, 0.1)'
      },
      opps: {
        value: this.props.actualIndicators.opps,
        title: getNickname('opps'),
        fillColor: '#33cc33b3',
        backgroundColor: 'rgba(50, 204, 50, 0.1)'
      }
    };
    // Find max value for the columns height
    const maxValue = Math.max.apply(null,Object.keys(funnel).map(item=>funnel[item].value));
    const funnelObject = Object.keys(funnel)
      .filter(item => funnel[item].value >= 0)
      .map((item, index, values) => {
        return <div className={ this.classes.inner } key={ index }>
          <Column {... funnel[item]} maxValue={maxValue}/>
          <Arrow value={ index + 1 == values.length ? this.props.actualIndicators.users/funnel[item].value : funnel[values[index + 1]].value/funnel[item].value }/>
        </div>
      });

    return <div className={ this.classes.inner }>
      {funnelObject}
      <Circle value={ this.props.actualIndicators.users } title={ getNickname('users') }/>
      <div className={ this.classes.line }/>
    </div>
  }

}