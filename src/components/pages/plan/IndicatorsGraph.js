import React from "react";
import Component from "components/Component";
import { XAxis, Tooltip, LineChart , Line, YAxis, CartesianGrid, ReferenceDot  } from "recharts";
import style from "styles/plan/indicators-graph.css";
import onboardingStyle from 'styles/onboarding/onboarding.css';
import Label from 'components/ControlsLabel';
import { getNickname } from 'components/utils/indicators';

export default class IndicatorsGraph extends Component {

  style = style;
  styles = [onboardingStyle];

  static defaultProps = {
    dimensions: {
      width: 0,
      margin: 0,
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      checkedIndicators: []
    };
  }

  get width() {
    return this.props.dimensions.width - this.marginLeft + 5
  }

  get marginLeft() {
    return this.props.dimensions.marginLeft - 92
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

  getTooltipContent() {
  }

  render () {
    const indicatorsMapping = {
      MCL: {
        title: getNickname('MCL'),
        color: '#1165A3'
      },
      MQL: {
        title: getNickname('MQL'),
        color: '#25B10E'
      },
      SQL: {
        title: getNickname('SQL'),
        color: '#D5E1A3'
      },
      opps: {
        title: getNickname('opps'),
        color: '#7CDEDC'
      },
      users: {
        title: getNickname('users'),
        color: '#7284A8'
      },
      sessions: {
        title: getNickname('sessions'),
        color: '#D0101E'
      },
      MRR: {
        title: getNickname('MRR'),
        color: '#FD950B'
      },
      ARPA: {
        title: getNickname('ARPA'),
        color: '#BDC4A7'
      },
      LTV: {
        title: getNickname('LTV'),
        color: '#06BEE1'
      },
      CAC: {
        title: getNickname('CAC'),
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
    const suggestedLines = this.state.checkedIndicators.map(indicator =>
      <Line key={indicator+1} type='monotone' dataKey={indicator + 'Suggested'} stroke={indicatorsMapping[indicator].color} fill={indicatorsMapping[indicator].color} strokeWidth={3} strokeDasharray="7 11" dot={{ strokeDasharray:"initial", fill: 'white' }}/>
    );

    const dots = this.state.checkedIndicators.map((indicator, index) =>
      this.props.objectives[indicator] && <ReferenceDot {... this.props.objectives[indicator]} r={10} fill="#e60000" stroke="white" stroke-width={2} key={index} label="O" alwaysShow={true}/>
    );
    const tooltip = (data) => {
      const currentIndex = this.props.data.findIndex(month => month.name === data.label);
      const prevIndex = currentIndex - 1;
      if (data.active && data.payload && data.payload.length > 0) {
        return <div className={this.classes.customTooltip}>
          <div style={{ fontWeight: 'bold' }}>
            {data.label}
          </div>
          {
            data.payload.map((item, index) => {
              if (item.value && !item.dataKey.includes('Suggested')) {
                return <div key={index}>
                  {indicatorsMapping[item.dataKey].title}: {item.value}
                  {prevIndex >= 0 ?
                    <div style={{ color: item.value - this.props.data[prevIndex][item.dataKey] >= 0 ? '#30b024' : '#d50a2e', display: 'inline', fontWeight: 'bold' }}>
                      {' (' + (item.value - this.props.data[prevIndex][item.dataKey] >= 0 ? '+' : '-') + Math.abs(item.value - this.props.data[prevIndex][item.dataKey]) + ')'}
                    </div>
                    : null}
                  <div>
                    {indicatorsMapping[item.dataKey].title + ' (InfiniGrow)'}: {this.props.data[currentIndex][item.dataKey + 'Suggested']}
                    {prevIndex >= 0 ?
                      <div style={{ color: this.props.data[currentIndex][item.dataKey + 'Suggested'] - this.props.data[prevIndex][item.dataKey + 'Suggested'] >= 0 ? '#30b024' : '#d50a2e', display: 'inline', fontWeight: 'bold' }}>
                        {' (' + (this.props.data[currentIndex][item.dataKey + 'Suggested'] - this.props.data[prevIndex][item.dataKey + 'Suggested'] >= 0 ? '+' : '-') + Math.abs(this.props.data[currentIndex][item.dataKey + 'Suggested'] - this.props.data[prevIndex][item.dataKey + 'Suggested']) + ')'}
                      </div>
                      : null}
                  </div>
                  {this.props.objectives[item.dataKey] !== undefined && this.props.objectives[item.dataKey].x === data.label ?
                    <div>
                      {indicatorsMapping[item.dataKey].title} (objective): {this.props.objectives[item.dataKey].y}
                    </div>
                    : null}
                </div>
              }
            })
          }
        </div>
      }
      return null;
    };
    return <div className={ this.classes.inner }>
      <div className={ this.classes.menuPosition }>
        <div className={ this.classes.menu }>
          <div className={ this.classes.menuTitle }>
            Metrics - Forecasting
          </div>
          { menuItems }
        </div>
      </div>
      <div className={ this.classes.chart } style={{ width: this.width, marginLeft: this.marginLeft }}>
        <LineChart width={this.width} height={300} data={ this.props.data }>
          <XAxis dataKey="name" style={{ fontSize: '12px', color: '#354052', opacity: '0.5' }}/>
          <YAxis width={82} style={{ fontSize: '12px', color: '#354052', opacity: '0.5' }}/>
          <CartesianGrid vertical={ false }/>
          { dots }
          <Tooltip content={ tooltip.bind(this) }/>
          { lines }
          { suggestedLines }
        </LineChart >
      </div>
    </div>
  }

}