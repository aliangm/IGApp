import React from "react";
import Component from "components/Component";
import dashboardStyle from "styles/dashboard/dashboard.css";
import { ComposedChart, CartesianGrid, XAxis, YAxis, Line, Bar } from "recharts";
import { formatBudgetShortened } from 'components/utils/budget';
import { getIndicatorsWithProps, getNickname as getIndicatorNickname } from 'components/utils/indicators';
import { getChannelsWithProps, getNickname as getChannelNickname } from 'components/utils/channels';
import PlanPopup, {
  TextContent as PopupTextContent
} from 'components/pages/plan/Popup';

export default class PerformanceGraph extends Component {

  constructor() {
    super();

    this.state = {
      advancedIndicator: 'SQL',
      advancedChannels: ['total']
    };
  }

  componentDidMount() {
    this.setState({advancedIndicator: this.props.defaultIndicator});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultIndicator !== this.props.defaultIndicator) {
      this.setState({advancedIndicator: nextProps.defaultIndicator});
    }
  }

  changeIndicatorsSettings(indicator) {
    this.setState({advancedIndicator: indicator});
  }

  changeChannelsSettings(channel) {
    const advancedChannels = this.state.advancedChannels.slice();
    if (advancedChannels.includes('total')) {
      this.setState({advancedChannels: [channel]});
    }
    else if (channel === 'total') {
      this.setState({advancedChannels: ['total']});
    }
    else if (advancedChannels.length < 3) {
      advancedChannels.push(channel);
      this.setState({advancedChannels: advancedChannels});
    }
  }

  render() {
    const { advancedIndicator, advancedChannels } = this.state;
    const { isPast, months, data } = this.props;

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

    const indicatorsProperties = getIndicatorsWithProps();
    const settingsIndicators = Object.keys(indicatorsProperties)
      .filter(indicator => !!data.find(month => month[indicator]))
      .map(indicator => <div key={indicator}>
        <input type="checkbox" onChange={ this.changeIndicatorsSettings.bind(this, indicator) } checked={ indicator === advancedIndicator } style={{  }}/>
        {indicatorsProperties[indicator].nickname}
      </div>);

    const channelsProperties = getChannelsWithProps();
    const settingsChannels = Object.keys(channelsProperties)
      .filter(channel => !!data.find(month => month[channel]))
      .map(channel => <div key={channel}>
        <input type="checkbox" onChange={ this.changeChannelsSettings.bind(this, channel) } checked={ advancedChannels.includes(channel) } style={{  }}/>
        {channelsProperties[channel].nickname}
      </div>);

    const CustomizedLabel = React.createClass({
      render () {
        const {x, y, total} = this.props;
        return <svg>
          <rect
            x={x-25}
            y={y-20}
            fill="#979797"
            width={50}
            height={20}
          />
          <text
            x={x}
            y={y}
            dy={-6}
            fontSize='11'
            fill='#ffffff'
            textAnchor="middle">
            ${formatBudgetShortened(total)}
          </text>
        </svg>
      }
    });

    const bars = advancedChannels.map((channel, index) =>
      <Bar key={index} yAxisId="left" dataKey={channel} stackId="channels" fill={COLORS[(index) % COLORS.length]} label={index === 0 ? <CustomizedLabel/> : false}/>
    );

    const graphChannels = advancedChannels.map((channel, index) =>
      <div key={index} style={{ borderBottom: '6px solid ' + COLORS[index % COLORS.length], marginRight: '25px', paddingBottom: '3px' }}>
        {channel === 'total' ? 'Total' : getChannelNickname(channel)}
      </div>);

    return <div className={dashboardStyle.locals.item}
                style={{height: '350px', width: '1110px', padding: '5px 15px', fontSize: '13px'}} data-id="analysis">
      <div className={dashboardStyle.locals.columnHeader}>
        <div className={dashboardStyle.locals.timeText}>
          {isPast ? 'Last' : 'Next'} {months} Months
        </div>
        <div className={dashboardStyle.locals.text}>
          {isPast ? 'Past' : 'Future'} Spend & Impact
        </div>
        <div style={{position: 'relative'}}>
          <div className={dashboardStyle.locals.settings} onClick={() => {
            this.refs.advancedSettingsPopup.open()
          }}/>
          <PlanPopup ref="advancedSettingsPopup" style={{
            width: 'max-content',
            top: '20px',
            left: '-600px',
            height: '270px'
          }} title="Settings">
            <PopupTextContent>
              <div style={{display: 'flex'}}>
                <div style={{width: '50%', height: '220px', overflowY: 'auto'}}>
                  {settingsIndicators}
                </div>
                <div style={{width: '50%', height: '220px', overflowY: 'auto'}}>
                  <div>
                    <input type="checkbox" onChange={this.changeChannelsSettings.bind(this, 'total')}
                           checked={advancedChannels.includes('total')} style={{}}/>
                    Total
                  </div>
                  {settingsChannels}
                </div>
              </div>
            </PopupTextContent>
          </PlanPopup>
        </div>
      </div>
      <div>
        <ComposedChart width={1110} height={260} data={data} maxBarSize={85}
                       margin={{top: 20, right: 30, left: 20, bottom: 5}}>
          <CartesianGrid vertical={false}/>
          <XAxis dataKey="name" tickLine={false}/>
          <YAxis yAxisId="left" axisLine={false} tickLine={false} tickFormatter={v => '$' + formatBudgetShortened(v)}/>
          <YAxis yAxisId="right" axisLine={false} tickLine={false} tickFormatter={formatBudgetShortened}
                 orientation="right"/>
          {bars}
          <Line yAxisId="right" type='monotone' dataKey={advancedIndicator} stroke="#f5a623" fill="#f5a623"
                strokeWidth={3}/>
        </ComposedChart>
      </div>
      <div style={{ position: 'relative', marginTop: '-5px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ marginRight: '50px' }}>
          <div className={dashboardStyle.locals.graphMetricsTitle}>
            Metrics
          </div>
          <div className={dashboardStyle.locals.graphIndicator}>
            {getIndicatorNickname(advancedIndicator)}
          </div>
        </div>
        <div>
          <div className={dashboardStyle.locals.graphSpendTitle}>
            Spend
          </div>
          <div className={dashboardStyle.locals.graphChannel}>
            {graphChannels}
          </div>
        </div>
      </div>
    </div>
  }
}