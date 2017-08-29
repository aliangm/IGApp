import React from "react";
import Component from "components/Component";
import { XAxis, Tooltip, LineChart , Line, YAxis, CartesianGrid  } from "recharts";
import style from "styles/plan/indicators-graph.css";
import onboardingStyle from 'styles/onboarding/onboarding.css';
import Label from 'components/ControlsLabel';

export default class Dashboard extends Component {

  style = style;
  styles = [onboardingStyle];

  constructor(props) {
    super(props);
    this.state = {
      checkedIndicators: []
    };
  }

  toggleCheckbox(indicator) {
    let checkedIndicators = this.state.checkedIndicators;
    const index = checkedIndicators.indexOf(indicator);
    if (index !== -1) {
      checkedIndicators.splice(index, 1);
    }
    else {
      checkedIndicators.push(indicator);
    }
    this.setState({checkedIndicators: checkedIndicators});
  }

  render () {
    const indicatorsMapping = {
      MCL: {
        title: 'Leads',
        color: '#1165A3'
      },
      MQL: {
        title: 'MQL',
        color: '#25B10E'
      },
      SQL: {
        title: 'SQL',
        color: '#D5E1A3'
      },
      opps: {
        title: 'Opps',
        color: '#7CDEDC'
      },
      users: {
        title: 'Paying Accounts',
        color: '#7284A8'
      },
      sessions: {
        title: 'Sessions',
        color: '#D0101E'
      },
      MRR: {
        title: 'MRR',
        color: '#FD950B'
      },
      ARPA: {
        title: 'ARPA (monthly)',
        color: '#BDC4A7'
      },
      LTV: {
        title: 'LTV',
        color: '#06BEE1'
      },
      CAC: {
        title: 'CAC',
        color: '#A70D6E'
      }
    };

    const menuItems = Object.keys(indicatorsMapping).map(indicator =>
      <div className={ this.classes.menuItem } key={indicator}>
        <Label checkbox={ this.state.checkedIndicators.indexOf(indicator) !== -1 } onChange={ this.toggleCheckbox.bind(this, indicator) } style={{ marginBottom: '3px', fontSize: '12px' }}>{indicatorsMapping[indicator].title}</Label>
        <div className={ this.classes.coloredCircle } style={{ background:  indicatorsMapping[indicator].color}}/>
      </div>
    );
    const lines = this.state.checkedIndicators.map(indicator =>
      <Line key={indicator} type='monotone' dataKey={indicator} stroke={indicatorsMapping[indicator].color} fill={indicatorsMapping[indicator].color} strokeWidth={3}/>
    );
    return <div className={ this.classes.inner }>
      <div className={ this.classes.menuPosition }>
        <div className={ this.classes.menu }>
          <div className={ this.classes.menuTitle }>
            Metrics - Forecasting
          </div>
          { menuItems }
        </div>
      </div>
      <div className={ this.classes.chart }>
        <LineChart width={1050} height={300} data={ this.props.data }>
          <XAxis dataKey="name" style={{ fontSize: '12px', color: '#354052', opacity: '0.5' }}/>
          <YAxis width={82} style={{ fontSize: '12px', color: '#354052', opacity: '0.5' }}/>
          <CartesianGrid vertical={ false }/>
          <Tooltip />
          { lines }
        </LineChart >
      </div>
    </div>
  }

}