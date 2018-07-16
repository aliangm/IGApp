import React from 'react';
import Component from 'components/Component';
import {XAxis, Tooltip, LineChart, Line, YAxis, CartesianGrid, ReferenceDot} from 'recharts';
import style from 'styles/plan/indicators-graph.css';
import onboardingStyle from 'styles/onboarding/onboarding.css';
import Label from 'components/ControlsLabel';
import {getNickname, getIndicatorsWithProps} from 'components/utils/indicators';
import PlanPopup, {
  TextContent as PopupTextContent
} from 'components/pages/plan/Popup';
import {formatBudgetShortened} from 'components/utils/budget';
import isEqual from 'lodash/isEqual';

export default class IndicatorsGraph extends Component {

  style = style;
  styles = [onboardingStyle];

  static defaultProps = {
    dimensions: {
      width: 0,
      marginLeft: 0
    }
  };

  constructor(props) {
    super(props);

    const initialIndicators = this.getInitialeIndicators(this.props);
    this.state = {
      checkedIndicators: initialIndicators ? initialIndicators : []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.objectives, this.props.objectives)) {
      const objectives = this.getInitialeIndicators(nextProps);
      if (objectives) {
        this.setState({
          checkedIndicators: objectives
        });
      }
    }
  }

  getInitialeIndicators = (props) => {
    const objectives = Object.keys(props.objectives);
    const objective = objectives && objectives[0];
    return objective ? [objective] : null;
  };

  get width() {
    return this.props.dimensions.width - this.marginLeft + 5;
  }

  get marginLeft() {
    return this.props.dimensions.marginLeft - 65;
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

  render() {
    const COLORS = [
      '#189aca',
      '#3cca3f',
      '#a8daec',
      '#70d972',
      '#56b5d9',
      '#8338EC',
      '#40557d',
      '#f0b499',
      '#ffd400',
      '#3373b4',
      '#72c4b9',
      '#FB5607',
      '#FF006E',
      '#76E5FC',
      '#036D19'
    ];
    const indicators = getIndicatorsWithProps();
    const indicatorsMapping = {};
    Object.keys(indicators)
      .filter(item => indicators[item].isObjective)
      .forEach(item =>
        indicatorsMapping[item] = indicators[item].nickname
      );
    const popupItems = Object.keys(indicatorsMapping).map(indicator =>
      <div className={this.classes.menuItem} key={indicator}>
        <Label checkbox={this.state.checkedIndicators.indexOf(indicator) !== -1}
               onChange={this.toggleCheckbox.bind(this, indicator)}
               style={{
                 marginBottom: '3px',
                 fontSize: '12px',
                 textTransform: 'capitalize'
               }}>{indicatorsMapping[indicator]}</Label>
      </div>
    );
    const menuItems = this.state.checkedIndicators.map((indicator, index) =>
      <div className={this.classes.menuItem} key={indicator}>
        <Label style={{
          marginBottom: '3px',
          fontSize: '12px',
          textTransform: 'capitalize'
        }}>{indicatorsMapping[indicator]}</Label>
        <div className={this.classes.coloredCircle} style={{background: COLORS[index % COLORS.length]}}/>
      </div>
    );
    const lines = this.state.checkedIndicators.map((indicator, index) =>
      <Line key={indicator}
            type='monotone'
            dataKey={indicator}
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
            strokeWidth={3}/>
    );
    const suggestedLines = this.state.checkedIndicators.map((indicator, index) =>
      <Line key={indicator + 1}
            type='monotone'
            dataKey={indicator + 'Suggested'}
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
            strokeWidth={3}
            strokeDasharray="7 11"
            dot={{strokeDasharray: 'initial', fill: 'white'}}/>
    );

    const dots = this.state.checkedIndicators.map((indicator, index) =>
      this.props.objectives[indicator] &&
      <ReferenceDot {... this.props.objectives[indicator]}
                    r={10}
                    fill="#e60000"
                    stroke="white"
                    stroke-width={2}
                    key={index}
                    label="O"
                    alwaysShow={true}/>
    );
    const tooltip = (data) => {
      const currentIndex = this.props.data.findIndex(month => month.name === data.label);
      const prevIndex = currentIndex - 1;
      if (data.active && data.payload && data.payload.length > 0) {
        return <div className={this.classes.customTooltip}>
          <div style={{fontWeight: 'bold'}}>
            {data.label}
          </div>
          {
            data.payload.map((item, index) => {
              if (item.value && !item.dataKey.includes('Suggested')) {
                return <div key={index}>
                  {indicatorsMapping[item.dataKey]}: {item.value}
                  {prevIndex >= 0 ?
                    <div style={{
                      color: item.value - this.props.data[prevIndex][item.dataKey] >= 0 ? '#30b024' : '#d50a2e',
                      display: 'inline',
                      fontWeight: 'bold'
                    }}>
                      {' (' + (item.value - this.props.data[prevIndex][item.dataKey] >= 0 ? '+' : '-') +
                      Math.abs(item.value - this.props.data[prevIndex][item.dataKey]) + ')'}
                    </div>
                    : null}
                  <div>
                    {prevIndex >= 0 && this.props.data[prevIndex][item.dataKey + 'Suggested'] ?
                      <div>
                        {indicatorsMapping[item.dataKey] +
                        ' (InfiniGrow)'}: {this.props.data[currentIndex][item.dataKey + 'Suggested']}
                        <div style={{
                          color: this.props.data[currentIndex][item.dataKey + 'Suggested'] -
                          this.props.data[prevIndex][item.dataKey + 'Suggested'] >= 0 ? '#30b024' : '#d50a2e',
                          display: 'inline',
                          fontWeight: 'bold'
                        }}>
                          {' (' +
                          (this.props.data[currentIndex][item.dataKey + 'Suggested'] -
                          this.props.data[prevIndex][item.dataKey + 'Suggested'] >= 0 ? '+' : '-') +
                          Math.abs(this.props.data[currentIndex][item.dataKey + 'Suggested'] -
                            this.props.data[prevIndex][item.dataKey + 'Suggested']) + ')'}
                        </div>
                      </div>
                      : null}
                  </div>
                  {this.props.objectives[item.dataKey] !== undefined &&
                  this.props.objectives[item.dataKey].x === data.label ?
                    <div>
                      {indicatorsMapping[item.dataKey]} (objective): {this.props.objectives[item.dataKey].y}
                    </div>
                    : null}
                </div>;
              }
            })
          }
        </div>;
      }
      return null;
    };
    return <div className={this.classes.inner}>
      <div className={this.classes.menuPosition}>
        <div className={this.classes.menu}>
          <div className={this.classes.menuTitle}>
            Forecasting
            <div style={{position: 'relative'}}>
              <div className={this.classes.settings} onClick={() => {
                this.refs.settingsPopup.open();
              }}/>
              <PlanPopup ref="settingsPopup" style={{
                top: '20px'
              }} title="Settings">
                <PopupTextContent>
                  {popupItems}
                </PopupTextContent>
              </PlanPopup>
            </div>
          </div>
          {menuItems}
        </div>
      </div>
      <div className={this.classes.chart} style={{width: this.width, marginLeft: this.marginLeft, marginTop: '30px'}}>
        <LineChart width={this.width} height={400} data={this.props.data}>
          <XAxis dataKey="name" style={{fontSize: '12px', color: '#354052', opacity: '0.5'}}/>
          <YAxis tickFormatter={(tick) => formatBudgetShortened(tick)}
                 style={{fontSize: '12px', color: '#354052', opacity: '0.5'}}
                 domain={['dataMin', 'dataMax']}/>
          <CartesianGrid vertical={false}/>
          {dots}
          <Tooltip content={tooltip.bind(this)}/>
          {lines}
          {suggestedLines}
        </LineChart>
      </div>
    </div>;
  }

}