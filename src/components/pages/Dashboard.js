import React from "react";
import Component from "components/Component";
import Page from "components/Page";
import style from "styles/onboarding/onboarding.css";
import {parseAnnualPlan} from "data/parseAnnualPlan";
import {isPopupMode} from "modules/popup-mode";
import {PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, AreaChart, Area, YAxis, CartesianGrid } from "recharts";
import dashboardStyle from "styles/dashboard/dashboard.css";
import Objective from 'components/pages/dashboard/Objective';
import Funnel from 'components/pages/dashboard/Funnel';
import Select from 'components/controls/Select';
import { getIndicatorsWithNicknames } from 'components/utils/indicators';

function formatDate(dateStr) {
  if (dateStr) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [monthNum, yearNum] = dateStr.split("/");

    return `${monthNames[monthNum - 1]} ${yearNum}`;
  }
  else return null;
}

export default class Dashboard extends Component {

  style = style;
  styles = [dashboardStyle];

  static defaultProps = {
    approvedBudgets: [],
    approvedBudgetsProjection: [],
    actualIndicators: {
      MCL: 0,
      MQL: 0,
      SQL: 0,
      opps: 0,
      users: 0
    },
    unfilteredCampaigns: {},
    objectives: [],
    annualBudgetArray: [],
    previousData: []
  };

  constructor() {
    super();

    this.state = {
      activeIndex: void 0,
      indicator: 'SQL'
    };
    this.onPieEnter = this.onPieEnter.bind(this);
  }

  onPieEnter(data, index) {
    this.setState({
      activeIndex: index,
    });
  }

  getDateString(stringDate) {
    if (stringDate) {
      const monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
      ];
      const planDate = stringDate.split("/");
      const date = new Date(planDate[1], planDate[0] - 1);

      return monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2);
    }

    return null;
  }

  render() {
    const { planDate, approvedBudgets, approvedBudgetsProjection, actualIndicators, unfilteredCampaigns, objectives, annualBudgetArray, previousData, planUnknownChannels } = this.props;
    const plan = approvedBudgets.map(item => {return { plannedChannelBudgets: item }});
    const planJson = parseAnnualPlan(plan, approvedBudgets, planUnknownChannels);
    const planData = planJson[Object.keys(planJson)[0]];
    const planDataChannels = Object.keys(planData).filter(channelName => channelName !== '__TOTAL__');
    const monthBudget = planData['__TOTAL__'].values[0] || 0;
    const fatherChannelsWithBudgets = Object.keys(planData)
      .filter(channelName => channelName !== '__TOTAL__' && planData[channelName].values[0] !== 0)
      .map((fatherChannel)=> { return { name: fatherChannel, value: planData[fatherChannel].values[0] } });
    const budgetLeftToPlan = annualBudgetArray.reduce((a, b) => a + b, 0) - planData['__TOTAL__'].values.reduce((a, b) => a + b, 0);
    const numberOfActiveCampaigns = Object.keys(unfilteredCampaigns).map((channel) =>
    {
      return unfilteredCampaigns[channel].filter(campaign=>  campaign.status !== 'Completed' && campaign.isArchived !== true ).length;
    }).reduce((a, b) => a + b, 0);
    const ratio = (actualIndicators.LTV/actualIndicators.CAC).toFixed(2) || 0;
    const COLORS = [
      '#1165A3',
      '#25B10E',
      '#D5E1A3',
      '#7CDEDC',
      '#7284A8',
      '#D0101E',
      '#FD950B',
      '#BDC4A7',
      '#06BEE1',
      '#A70D6E',
      '#D66511',
      '#95AFBA'
    ];
    const funnel = [];
    if (actualIndicators.MCL !== -2){
      funnel.push({ name: 'Leads', value: actualIndicators.MCL });
    }
    if (actualIndicators.MQL !== -2) {
      funnel.push({ name: 'MQL', value: actualIndicators.MQL });
    }
    if (actualIndicators.SQL !== -2) {
      funnel.push({ name: 'SQL', value: actualIndicators.SQL });
    }
    if (actualIndicators.opps !== -2) {
      funnel.push({ name: 'Opps', value: actualIndicators.opps });
    }

    const funnelRatios = [];
    for (let i=0; i< funnel.length - 1; i++) {
      funnelRatios.push({ name: funnel[i].name + ':' + funnel[i+1].name, value: funnel[i+1].value / funnel[i].value });
    }
    const minRatio = Math.min(... funnelRatios.map(item => item.value));
    const minRatioTitle = funnelRatios
      .filter(item => item.value == minRatio)
      .map(item => item.name);

    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      return `${(percent * 100).toFixed(0)}%`
    };
    const indicatorsOptions = getIndicatorsWithNicknames();
    const objectivesGauges = objectives.map((objective, index) => {
      let title;
      const delta = objective.isPercentage ? objective.amount * (objective.currentValue || 0) / 100 : objective.amount;
      const maxRange = Math.round(objective.direction === "equals" ? objective.amount : (objective.direction === "increase" ? delta + (objective.currentValue || 0) : (objective.currentValue || 0) - delta));
      const month = new Date(objective.timeFrame).getMonth();
      const project = approvedBudgetsProjection[month][objective.indicator];
      indicatorsOptions.forEach((indicator) => {
        if (indicator.value === objective.indicator) {
          title = indicator.label;
        }
      });
      return <Objective maxRange={ maxRange } current={ actualIndicators[objective.indicator] } title={ title } project={ project } key={ index } directionDown={ objective.direction === "decrease" }/>
    });

    const months = previousData.map((item,index) => {return {value: index, label: index} });
    let indicatorsData = {};
    const sortedPreviousData = previousData.sort((a, b) => {
      const planDate1 = a.planDate.split("/");
      const planDate2 = b.planDate.split("/");
      const date1 = new Date(planDate1[1], planDate1[0] - 1).valueOf();
      const date2 = new Date(planDate2[1], planDate2[0] - 1).valueOf();
      return (isFinite(date1) && isFinite(date2) ? (date1 > date2) - (date1 < date2) : NaN);
    });
    sortedPreviousData.forEach(item => {
      const displayDate = this.getDateString(item.planDate);
      Object.keys(item.actualIndicators).forEach(indicator => {
        if (!indicatorsData[indicator]) {
          indicatorsData[indicator] = [];
        }
        const value = item.actualIndicators[indicator];
        indicatorsData[indicator].push({name: displayDate, value: value > 0 ? value : 0});
      })
    });

    let grow = 0;
    if (indicatorsData[this.state.indicator]) {
      const current  = indicatorsData[this.state.indicator][indicatorsData[this.state.indicator].length - 1].value;
      const previous = indicatorsData[this.state.indicator][indicatorsData[this.state.indicator].length - (this.state.months ? this.state.months : 1)].value;
      if (previous) {
        grow = Math.round((current-previous) / previous * 100)
      }
    }

    return <div>
      <Page contentClassName={ dashboardStyle.locals.content } innerClassName={ dashboardStyle.locals.pageInner }>
        <div className={ dashboardStyle.locals.head }>
          <div className={ dashboardStyle.locals.headTitle }>Dashboard</div>
        </div>
        <div className={ dashboardStyle.locals.titleText }>
          {formatDate(planDate)}
        </div>
        <div className={ this.classes.cols } style={{ width: '825px' }}>
          <div className={ this.classes.colLeft }>
            <div className={ dashboardStyle.locals.item }>
              <div className={ dashboardStyle.locals.text }>
                Monthly Budget
              </div>
              <div className={ dashboardStyle.locals.number }>
                ${monthBudget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </div>
            </div>
          </div>
          <div className={ this.classes.colCenter }>
            <div className={ dashboardStyle.locals.item }>
              <div className={ dashboardStyle.locals.text }>
                Active Campaigns
              </div>
              <div className={ dashboardStyle.locals.number }>
                {numberOfActiveCampaigns}
              </div>
            </div>
          </div>
          <div className={ this.classes.colRight } style={{ paddingLeft: 0 }}>
            <div className={ dashboardStyle.locals.item }>
              <div className={ dashboardStyle.locals.text }>
                LTV:CAC Ratio
              </div>
              <div className={ dashboardStyle.locals.number }>
                {ratio}
              </div>
            </div>
          </div>
        </div>
        <div className={ this.classes.cols } style={{ width: '825px' }}>
          <div className={ this.classes.colLeft }>
            <div className={ dashboardStyle.locals.item } style={{ display: 'inline-block', height: '412px', width: '540px'}}>
              <div className={ dashboardStyle.locals.text }>
                Marketing Mix Summary
              </div>
              <div className={ dashboardStyle.locals.chart }>
                <div className={ this.classes.footerLeft }>
                  <div className={ dashboardStyle.locals.index }>
                    {
                      fatherChannelsWithBudgets.map((element, i) => (
                        <div key={i} style={{ display: 'flex' }}>
                          <div style={{background: COLORS[i % COLORS.length], borderRadius: '50%', height: '10px', width: '10px', display: 'inline-flex', marginTop: '11px'}}/>
                          <div style={{fontWeight: this.state.activeIndex === i ? "bold" : null, display: 'inline', paddingLeft: '4px'}}>
                            {element.name} : ${element.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div className={ this.classes.footerRight }>
                  <PieChart width={429} height={350} onMouseEnter={this.onPieEnter}>
                    <Pie
                      data={fatherChannelsWithBudgets}
                      cx={250}
                      cy={150}
                      labelLine={true}
                      label={renderCustomizedLabel}
                      outerRadius={120}
                      isAnimationActive={false}
                    >
                      {
                        fatherChannelsWithBudgets .map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={index}/>)
                      }
                    </Pie>
                  </PieChart>
                </div>
              </div>
            </div>
          </div>
          <div className={ this.classes.colRight } style={{ paddingLeft: 0 }}>
            <div className={ dashboardStyle.locals.item }>
              <div className={ dashboardStyle.locals.text }>
                Annual Budget Left To Plan
              </div>
              <div className={ dashboardStyle.locals.number }>
                {
                  Math.abs(budgetLeftToPlan) >= 100 ?
                    '$' + budgetLeftToPlan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : <div className={ dashboardStyle.locals.budgetLeftToPlanOk }/>
                }
              </div>
            </div>
            <div className={ dashboardStyle.locals.item } style={{ marginTop: '30px' }}>
              <div className={ dashboardStyle.locals.text }>
                {minRatioTitle + ' Ratio'}
              </div>
              <div className={ dashboardStyle.locals.number }>
                {Math.round(minRatio * 10000) /100}%
              </div>
            </div>
          </div>
          {/** OLD LEAD FUNNEL
           <div className={ this.classes.colRight } style={{ paddingLeft: 0 }}>
           <div className={ dashboardStyle.locals.item } style={{ height: '397px'}}>
           <div className={ dashboardStyle.locals.text }>
           Leads Funnel
           </div>
           <div className={ dashboardStyle.locals.chart } style={{ paddingTop: '10px' }}>
           <BarChart width={231} height={270} data={funnel}>
           <XAxis dataKey='name' tickLine={false}/>
           <Tooltip/>
           <Bar dataKey='value' label isAnimationActive={false}>
           {
             funnel.map((entry, index) => (
               <Cell fill={COLORS[index % COLORS.length]} key={`cell-${index}`}/>
             ))
           }
           </Bar>
           </BarChart>
           </div>
           </div>
           </div> **/}
        </div>
        { objectivesGauges.length > 0 ?
          <div className={ this.classes.cols } style={{ width: '825px' }}>
            <div className={ this.classes.colLeft }>
              <div className={ dashboardStyle.locals.item } style={{ display: 'inline-block', height: '350px', width: objectivesGauges.length *255 + (objectivesGauges.length-1) * 30 + 'px'}}>
                <div className={ dashboardStyle.locals.text }>
                  Objectives
                </div>
                <div className={ dashboardStyle.locals.chart } style={{ justifyContent: 'center' }}>
                  {objectivesGauges}
                </div>
              </div>
            </div>
          </div>
          : null }
        <div className={ this.classes.cols } style={{ width: '825px' }}>
          <div className={ this.classes.colLeft }>
            <div className={ dashboardStyle.locals.item } style={{ height: '412px', width: '825px' }}>
              <div className={ dashboardStyle.locals.text }>
                Lead Funnel
              </div>
              <div className={ dashboardStyle.locals.chart } style={{ justifyContent: 'center' }}>
                <Funnel actualIndicators={ actualIndicators }/>
              </div>
            </div>
          </div>
        </div>
        <div className={ this.classes.cols } style={{ width: '825px' }}>
          <div className={ this.classes.colLeft }>
            <div className={ dashboardStyle.locals.item } style={{ display: 'inline-block', height: '412px', width: '540px'}}>
              <div className={ dashboardStyle.locals.text }>
                Historical Performance
              </div>
              <div style={{ display: 'flex' }}>
                <div className={ this.classes.footerLeft }>
                  <div className={ dashboardStyle.locals.historyConfig }>
                    <div className={ dashboardStyle.locals.historyConfigText }>
                      Show
                    </div>
                    <Select selected={ this.state.indicator }
                            select={{
                              options: indicatorsOptions
                            }}
                            onChange={ (e) => { this.setState({indicator: e.value}) } }
                            style={{ width: '172px' }}
                    />
                    <div className={ dashboardStyle.locals.historyConfigText }>
                      in last
                    </div>
                    <Select selected={ this.state.months ? this.state.months : (indicatorsData[this.state.indicator] ? indicatorsData[this.state.indicator].length-1 : 0)}
                            select={{
                              options: months
                            }}
                            onChange={ (e) => { this.setState({months: e.value}) } }
                            style={{ width: '44px' }}
                    />
                    <div className={ dashboardStyle.locals.historyConfigText }>
                      months
                    </div>
                  </div>
                </div>
                { grow ?
                  <div className={ this.classes.footerRight }>
                    <div className={ dashboardStyle.locals.historyArrow }/>
                    <div className={ dashboardStyle.locals.historyGrow }>
                      { grow }%
                    </div>
                  </div>
                  : null }
              </div>
              <div className={ dashboardStyle.locals.chart }>
                <AreaChart width={550} height={280} data={indicatorsData[this.state.indicator] ? indicatorsData[this.state.indicator].slice(indicatorsData[this.state.indicator].length - this.state.months, indicatorsData[this.state.indicator].length) : []} style={{ marginLeft: '-21px' }}>
                  <XAxis dataKey="name" style={{ fontSize: '12px', color: '#354052', opacity: '0.5' }}/>
                  <YAxis style={{ fontSize: '12px', color: '#354052', opacity: '0.5' }}/>
                  <CartesianGrid vertical={ false }/>
                  <Tooltip/>
                  <Area type='monotone' dataKey='value' stroke='#6BCCFF' fill='#DFECF7' strokeWidth={3}/>
                </AreaChart>
              </div>
            </div>
          </div>
        </div>
      </Page>
    </div>
  }
}