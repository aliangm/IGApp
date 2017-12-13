import React from "react";
import Component from "components/Component";
import style from "styles/onboarding/onboarding.css";
import { parseAnnualPlan } from "data/parseAnnualPlan";
import { PieChart, Pie, Cell } from "recharts";
import dashboardStyle from "styles/dashboard/dashboard.css";
import Objective from 'components/pages/dashboard/Objective';
import Funnel from 'components/pages/dashboard/Funnel';
import { getIndicatorsWithNicknames } from 'components/utils/indicators';
import { formatBudget } from 'components/utils/budget';
import CampaignsByFocus from 'components/pages/dashboard/CampaignsByFocus';

export default class CMO extends Component {

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
    annualBudgetArray: []
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
    const { approvedBudgets, approvedBudgetsProjection, actualIndicators, campaigns, objectives, annualBudgetArray, planUnknownChannels } = this.props;
    const plan = approvedBudgets.map(item => {return { plannedChannelBudgets: item }});
    const planJson = parseAnnualPlan(plan, approvedBudgets, planUnknownChannels);
    const planData = planJson[Object.keys(planJson)[0]];
    const monthBudget = planData['__TOTAL__'].values[0] || 0;
    const annualBudget = planData['__TOTAL__'].values.reduce((a,b) => a+b, 0);
    const fatherChannelsWithBudgets = Object.keys(planData)
      .filter(channelName => channelName !== '__TOTAL__' && planData[channelName].values[0] !== 0)
      .map((fatherChannel)=> { return { name: fatherChannel, value: planData[fatherChannel].values[0] } });
    const budgetLeftToPlan = annualBudgetArray.reduce((a, b) => a + b, 0) - planData['__TOTAL__'].values.reduce((a, b) => a + b, 0);

    const numberOfActiveCampaigns = campaigns
      .filter(campaign => campaign.isArchived !== true && campaign.status !== 'Completed').length;

    const ratio = (actualIndicators.LTV/actualIndicators.CAC).toFixed(2) || 0;
    const COLORS = [
      '#289df5',
      '#40557d',
      '#f0b499',
      '#ffd400',
      '#3373b4',
      '#72c4b9',
      '#04E762',
      '#FB5607',
      '#FF006E',
      '#8338EC',
      '#76E5FC',
      '#036D19'
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

    const indicatorsOptions = getIndicatorsWithNicknames();
    const objectivesGauges = objectives.map((objective, index) => {
      let title;
      const delta = objective.isPercentage ? objective.amount * (objective.currentValue || 0) / 100 : objective.amount;
      const maxRange = Math.round(objective.direction === "equals" ? objective.amount : (objective.direction === "increase" ? delta + (objective.currentValue || 0) : (objective.currentValue || 0) - delta));
      const month = new Date(objective.timeFrame).getMonth();
      const project = approvedBudgetsProjection[month] && approvedBudgetsProjection[month][objective.indicator];
      indicatorsOptions.forEach((indicator) => {
        if (indicator.value === objective.indicator) {
          title = indicator.label;
        }
      });
      return <Objective maxRange={ maxRange } current={ actualIndicators[objective.indicator] } title={ title } project={ project } key={ index } directionDown={ objective.direction === "decrease" }/>
    });

    return <div className={ dashboardStyle.locals.wrap }>
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
        <div className={ this.classes.colCenter }>
          <div className={ dashboardStyle.locals.item }>
            <div className={ dashboardStyle.locals.text }>
              Annual Budget
            </div>
            <div className={ dashboardStyle.locals.number }>
              ${formatBudget(annualBudget)}
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
        </div>
      </div>
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
        <div className={ this.classes.colRight } style={{ paddingLeft: 0 }}>
          <div className={ dashboardStyle.locals.item }>
            <div className={ dashboardStyle.locals.text }>
              LTV:CAC Ratio
            </div>
            { ratio && isFinite(ratio) ?
              <div className={dashboardStyle.locals.number}>
                {ratio}
              </div>
              :
              <div>
                <div className={ dashboardStyle.locals.center }>
                  <div className={ dashboardStyle.locals.sadIcon }/>
                </div>
                <div className={ dashboardStyle.locals.noMetrics }>
                  Oh… It seems that the relevant metrics (LTV + CAC) are missing. Please update your data.
                </div>
              </div>
            }
          </div>
          <div className={ dashboardStyle.locals.item } style={{ marginTop: '30px' }}>
            <div className={ dashboardStyle.locals.text }>
              {(minRatioTitle.length > 0 ? minRatioTitle : "Funnel") + ' Ratio'}
            </div>
            { minRatio && isFinite(minRatio) ?
              <div className={dashboardStyle.locals.number}>
                {Math.round(minRatio * 10000) / 100}%
              </div>
              :
              <div>
                <div className={dashboardStyle.locals.center}>
                  <div className={dashboardStyle.locals.sadIcon}/>
                </div>
                <div className={dashboardStyle.locals.noMetrics}>
                  Oh… It seems that the relevant metrics (funnel metrics) are missing. Please update your data.
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      <div className={ this.classes.cols } style={{ width: '825px' }}>
        <div className={ this.classes.colLeft }>
          <div className={ dashboardStyle.locals.item } style={{ height: '350px', width: '540px'}}>
            <div className={ dashboardStyle.locals.text }>
              Campaigns by Focus
            </div>
            <div className={ dashboardStyle.locals.chart }>
              <CampaignsByFocus campaigns={campaigns}/>
            </div>
          </div>
        </div>
        <div className={ this.classes.colRight }>
          <div className={ dashboardStyle.locals.item } style={{ display: 'inline-block', height: '350px', width: '540px'}}>
            <div className={ dashboardStyle.locals.text }>
              Marketing Mix Summary
            </div>
            <div className={ dashboardStyle.locals.chart }>
              <div className={ this.classes.footerLeft }>
                <div className={ dashboardStyle.locals.index }>
                  {
                    fatherChannelsWithBudgets.map((element, i) => (
                      <div key={i} style={{ display: 'flex', marginTop: '-8px' }}>
                        <div style={{border: '2px solid ' + COLORS[i % COLORS.length], borderRadius: '50%', height: '8px', width: '8px', display: 'inline-flex', marginTop: '10px', backgroundColor: this.state.activeIndex === i ? COLORS[i % COLORS.length] : 'initial'}}/>
                        <div style={{fontWeight: this.state.activeIndex === i ? "bold" : 'initial', display: 'inline', paddingLeft: '4px', fontSize: '14px', width: '135px' }}>
                          {element.name}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', width: '60px' }}>
                          ${formatBudget(element.value)}
                        </div>
                        <div style={{ width: '50px', fontSize: '14px', color: '#7f8fa4' }}>
                          ({Math.round(element.value/monthBudget*100)}%)
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className={ this.classes.footerRight } style={{ marginTop: '-30px', width: '315px' }}>
                <PieChart width={429} height={350} onMouseEnter={this.onPieEnter} onMouseLeave={ () => { this.setState({activeIndex: void 0}) } }>
                  <Pie
                    data={fatherChannelsWithBudgets}
                    cx={250}
                    cy={150}
                    labelLine={true}
                    innerRadius={75}
                    outerRadius={100}
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
    </div>
  }
}