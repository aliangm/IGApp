import React from 'react';
import classnames from 'classnames';
import Component from 'components/Component';
import {Area, AreaChart, CartesianGrid, ReferenceDot, Tooltip, XAxis, YAxis, Legend, ReferenceLine} from 'recharts';
import style from 'styles/plan/indicators-graph.css';
import onboardingStyle from 'styles/onboarding/onboarding.css';
import {getIndicatorsWithProps, getNickname} from 'components/utils/indicators';
import {formatBudgetShortened, formatNumber} from 'components/utils/budget';
import isEqual from 'lodash/isEqual';
import CustomCheckbox from 'components/controls/CustomCheckbox';
import isNil from 'lodash/isNil';
import findIndex from 'lodash/findIndex';
import {shouldUpdateComponent} from 'components/pages/plan/planUtil';
import ObjectiveIcon from 'components/common/ObjectiveIcon';
import {getColor} from 'components/utils/colors';

const DASHED_OPACITY = '0.7';
const DASHED_KEY_SUFFIX = '_DASEHD';

export default class IndicatorsGraph extends Component {

  style = style;
  styles = [onboardingStyle];
  areas = {}; // area refs

  constructor(props) {
    super(props);

    const initialIndicators = this.getInitialIndicators(this.props);
    this.state = {
      checkedIndicators: initialIndicators ? initialIndicators : [],
      activeTooltipIndex: 0,
      tooltipPosition: 0
    };
  }

  componentDidMount() {
    this.refs.chart.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.refs.chart.removeEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.parsedObjectives, this.props.parsedObjectives)) {
      const objectives = this.getInitialIndicators(nextProps);
      if (objectives) {
        this.setState({
          checkedIndicators: objectives
        });
      }
    }
    if (!isNil(nextProps.scrollPosition)) {
      this.refs.chart.scrollLeft = nextProps.scrollPosition;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldUpdateComponent(nextProps, nextState, this.props, this.state, 'scrollPosition');
  }

  handleScroll = () => {
    this.props.changeScrollPosition(this.refs.chart.scrollLeft);
  };

  handleMouseMove = ({activeTooltipIndex}) => {
    if (this.areas && Number.isInteger(activeTooltipIndex) && this.state.activeTooltipIndex !== activeTooltipIndex) {
      this.setState({
        activeTooltipIndex,
        tooltipPosition: Math.min(
          ...Object.values(this.areas)
            .filter((a) => !!a)
            .map((a) => a.props.points[activeTooltipIndex].y)
        )
      });
    }
  };

  getInitialIndicators = (props) => {
    const objectives = Object.keys(props.parsedObjectives);
    const objective = objectives && objectives[0];
    return objective ? [objective] : null;
  };

  toggleCheckbox = (indicator) => {
    let checkedIndicators = [...this.state.checkedIndicators];
    const index = checkedIndicators.indexOf(indicator);
    if (index !== -1) {
      checkedIndicators.splice(index, 1);
    }
    else {
      checkedIndicators.push(indicator);
    }
    this.setState({checkedIndicators: checkedIndicators});
  };

  getTooltipContent = () => {
  };

  getAreasData = () => {
    const forecastingData = [];
    const pastDates = this.props.dates.slice(0, this.props.numberOfPastDates);
    const futureDates = this.props.dates.slice(this.props.numberOfPastDates);

    this.props.mainLineData.forEach(({indicators: month, isQuarter}, monthIndex) => {
      const json = {};
      Object.keys(month).forEach(key => {
        json[key] = month[key].committed;
      });

      if (this.props.dashedLineData) {
        const dashedIndicators = this.props.dashedLineData[monthIndex].indicators;
        Object.keys(dashedIndicators).forEach((key) => {
          json[key + DASHED_KEY_SUFFIX] = dashedIndicators[key].committed;
        });
      }

      forecastingData.push({...json, name: futureDates[monthIndex], isQuarter: isQuarter});
    });

    const pastIndicators = this.props.mainLineData.slice(0, pastDates.length);
    pastIndicators.forEach(({indicators: month, isQuarter}, index) => {
      const json = {};
      Object.keys(month).forEach(key => {
        json[key] = month[key];

        if (dashedLineDataWithQuarters) {
          json[key + DASHED_KEY_SUFFIX] = json[key];
        }
      });

      forecastingData.unshift({
        ...json,
        name: pastDates[pastDates.length - 1 - index],
        isQuarter: isQuarter
      });
    });

    const zeroedIndicators = {};
    Object.keys(getIndicatorsWithProps()).forEach(key => {
      zeroedIndicators[key] = 0;
    });
    forecastingData.unshift({...zeroedIndicators, name: ''});

    return forecastingData;
  };

  getObjectiveIconFromData = (objectiveData) => {
    const {committedForecasting} = this.props.calculatedData;
    const project = committedForecasting[objectiveData.monthIndex] &&
      committedForecasting[objectiveData.monthIndex][objectiveData.indicator];
    return <ObjectiveIcon target={objectiveData.target}
                          value={this.props.actualIndicators[objectiveData.indicator]}
                          project={project}/>;
  };

  render() {
    const indicators = getIndicatorsWithProps();
    const {parsedObjectives, floating} = this.props;
    const {tooltipPosition} = this.state;
    const indicatorsMapping = {};
    Object.keys(indicators)
      .filter(item => indicators[item].isObjective)
      .forEach(item =>
        indicatorsMapping[item] = indicators[item].nickname
      );

    const areaData = this.getAreasData();
    const areaHeight = floating ? 230 : 400;

    const {collapsedObjectives} = this.props.calculatedData.objectives;
    const menuItems = Object.keys(indicatorsMapping).map((indicator, index) => {
      const objectiveIndex = findIndex(collapsedObjectives, (item) => {
        return item.indicator === indicator;
      });

      const objectiveIcon = objectiveIndex > -1
        ? <div className={this.classes.objectiveIcon}>
          {this.getObjectiveIconFromData(collapsedObjectives[objectiveIndex])}
        </div>
        : null;

      return <div className={this.classes.menuItem} key={indicator}>
        <CustomCheckbox checked={this.state.checkedIndicators.indexOf(indicator) !== -1}
                        onChange={() => this.toggleCheckbox(indicator)}
                        className={this.classes.label}
                        checkboxStyle={{
                          backgroundColor: getColor(index)
                        }}>{indicatorsMapping[indicator]}</CustomCheckbox>
        {objectiveIcon}
      </div>;
    });

    const defs = this.state.checkedIndicators.map(indicator => {
      const index = Object.keys(indicatorsMapping).indexOf(indicator);
      return <defs key={indicator}>
        <linearGradient id={indicator} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={getColor(index)} stopOpacity={0.2}/>
          <stop offset="100%" stopColor={getColor(index)} stopOpacity={0}/>
        </linearGradient>
      </defs>;
    });

    const areas = this.state.checkedIndicators.map((indicator) => {
      const index = Object.keys(indicatorsMapping).indexOf(indicator);
      return <Area key={indicator}
                   ref={ref => this.areas[indicator] = ref}
                   isAnimationActive={false}
                   type='monotone'
                   dataKey={indicator}
                   stroke={getColor(index)}
                   fill={`url(#${indicator})`}
                   fillOpacity={1}
                   strokeWidth={2}/>;
    });

    const dashedAreas = this.state.checkedIndicators.map((indicator) => {
      const index = Object.keys(indicatorsMapping).indexOf(indicator);
      return <Area key={indicator + 1}
                   type='monotone'
                   isAnimationActive={false}
                   dataKey={indicator + DASHED_KEY_SUFFIX}
                   stroke={getColor(index)}
                   strokeWidth={2}
                   fill='transparent'
                   strokeDasharray="7 11"
                   style={{opacity: DASHED_OPACITY}}
      />;
    });

    const CustomizedLabel = React.createClass({
      render() {
        const {viewBox} = this.props;
        return <image x={viewBox.x} y={viewBox.y} width="24" height="24" href="/assets/objective-dot.svg"/>;
      }
    });

    const dots = this.state.checkedIndicators.map((indicator, index) =>
      parsedObjectives[indicator] &&
      <ReferenceDot {...parsedObjectives[indicator]}
                    fill="none"
                    stroke="none"
                    key={index}
                    label={<CustomizedLabel/>}
                    alwaysShow={true}
                    isFront={true}/>
    );

    const tooltip = (data) => {
      const currentIndex = areaData.findIndex(month => month.name === data.label);
      const prevIndex = currentIndex - 1;
      if (data.active && data.payload && data.payload.length > 0) {
        const parsedIndicators = data.payload.filter((item) => !item.dataKey.includes(DASHED_KEY_SUFFIX))
          .map((item) => {
            const secondaryItem = data.payload.find((secondaryItem) => secondaryItem.dataKey ==
              item.dataKey +
              DASHED_KEY_SUFFIX);
            return {
              ...item,
              secondaryValue: secondaryItem ? secondaryItem.value : null
            };
          });

        return <div className={this.classes.customTooltip}>
          {areaData[currentIndex].isQuarter ? 'Quarter'
            : <div>{

              parsedIndicators.map((item, index) => {
                const indicator = item.dataKey;
                const colorIndex = Object.keys(indicatorsMapping).indexOf(indicator);
                if (item.value && !item.dataKey.includes(DASHED_KEY_SUFFIX)) {
                  return <div key={index}>
                    <div className={this.classes.customTooltipIndicator}>
                      {indicatorsMapping[indicator]}
                    </div>
                    <div className={this.classes.customTooltipValues}>
                      <div className={this.classes.customTooltipValue}
                           style={{color: getColor(colorIndex)}}>
                        {formatNumber(item.value)}
                      </div>
                      {item.secondaryValue ?
                        <div className={this.classes.customTooltipValue}
                             style={{
                               color: getColor(colorIndex),
                               opacity: DASHED_OPACITY
                             }}>
                          {formatNumber(item.secondaryValue)}
                        </div> : null
                      }
                    </div>
                    {parsedObjectives[indicator] !== undefined &&
                    parsedObjectives[indicator].x === data.label ?
                      <div className={this.classes.customTooltipObjective}>
                        Objective: {formatNumber(parsedObjectives[indicator].y)}
                      </div>
                      : null}
                  </div>;
                }
              })
            }</div>}
        </div>;
      }
      return null;
    };

    const xAxis = (
      <XAxis dataKey="name"
             style={{textTransform: 'uppercase'}}
             tick={{
               fontSize: '11px',
               fill: '#99a4c2',
               fontWeight: 600,
               letterSpacing: '0.1px'
             }}
             tickLine={false}
             tickMargin={21}
             interval={0}
      />
    );

    return <div className={classnames(this.classes.inner, {[this.classes.floating]: floating})}>
      <div className={this.classes.menu}>
        <div className={this.classes.menuTitle}>
          Forecasting
        </div>
        <div className={this.classes.menuItems}>
          {menuItems}
        </div>
      </div>
      <div className={this.classes.chart}>
        <CustomizedLegend hidden={!this.props.dashedLineData}/>
        <div className={this.classes.chartScroller} ref='chart'>
          <AreaChart
            className={this.classes.chartContent}
            data={areaData} height={areaHeight} width={70 + this.props.cellWidth * (areaData.length - 1)}
            margin={{top: 10, right: 25, left: 10, bottom: 21}}
            onMouseMove={this.handleMouseMove}
          >
            <CartesianGrid vertical={false} stroke='#EBEDF5' strokeWidth={1}/>
            {xAxis}
            {dots}
            <Tooltip
              content={tooltip}
              offset={0}
              position={{y: tooltipPosition}}
            />
            {defs}
            {areas}
            {dashedAreas}
          </AreaChart>
        </div>
        {/* area with fixed position and hidden content, except y-axis */}
        <AreaChart
          className={this.classes.fixedChartOverlay}
          data={areaData} height={areaHeight} width={70 + this.props.cellWidth * (areaData.length - 1)}
          margin={{top: 10, right: 25, left: 10, bottom: 21}}
        >
          {xAxis}
          {areas}
          {dashedAreas}
          <YAxis axisLine={false}
                 tickLine={false}
                 stroke="white"
                 tickFormatter={formatBudgetShortened}
                 tick={{fontSize: '14px', fill: '#b2bbd5', fontWeight: 600, letterSpacing: '0.1px'}}
                 tickMargin={21}
                 domain={['auto', 'auto']}/>
        </AreaChart>
      </div>
    </div>;
  }
};

class CustomizedLegend extends Component {

  style = style;

  render() {
    return this.props.hidden ? null :
      <div className={this.classes.legend} style={{display: 'flex'}}>
        <div style={{display: 'flex'}}>
          <div className={this.classes.legendIcon}/>
          <div className={this.classes.legendText}>
            Committed
          </div>
        </div>
        <div style={{display: 'flex'}}>
          <div className={this.classes.legendIconDashed}/>
          <div className={this.classes.legendText}>
            New Scenario
          </div>
        </div>
      </div>;
  }
}