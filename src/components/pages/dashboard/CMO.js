import React from "react";
import Component from "components/Component";
import style from "styles/onboarding/onboarding.css";
import { PieChart, Pie, Cell } from "recharts";
import dashboardStyle from "styles/dashboard/dashboard.css";
import Objective from 'components/pages/dashboard/Objective';
import Funnel from 'components/pages/dashboard/Funnel';
import { getIndicatorsWithProps } from 'components/utils/indicators';
import { getMetadata } from 'components/utils/channels';
import { formatBudget } from 'components/utils/budget';
import CampaignsByFocus from 'components/pages/dashboard/CampaignsByFocus';
import { timeFrameToDate } from 'components/utils/objective';
import Steps from 'components/pages/dashboard/Steps';
import Label from 'components/ControlsLabel';
import merge from 'lodash/merge';

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
      indicator: 'SQL',
      onlyThisMonth: false
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
    const { approvedBudgets, approvedBudgetsProjection, actualIndicators, campaigns, objectives, annualBudgetArray, planUnknownChannels, previousData } = this.props;
    const merged = merge(approvedBudgets, planUnknownChannels);
    const monthBudget = Object.keys(merged && merged[0]).reduce((sum, channel) => sum + merged[0][channel], 0);
    const annualBudget = merged.reduce((annualSum, month) => Object.keys(month).reduce((monthSum, channel) => monthSum + month[channel], 0) + annualSum, 0);
    const fatherChannelsWithBudgets = [];
    Object.keys(merged && merged[0])
      .filter(channel => merged[0][channel])
      .forEach(channel => {
        const category = getMetadata('category', channel);
        const alreadyExistItem = fatherChannelsWithBudgets.find(item => item.name === category);
        if (!alreadyExistItem) {
          fatherChannelsWithBudgets.push({name: category, value: merged[0][channel]})
        }
        else {
          alreadyExistItem.value += merged[0][channel];
        }
      });
    const budgetLeftToPlan = annualBudgetArray.reduce((a, b) => a + b, 0) - annualBudget;

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

    const funnelMetricsValues = this.state.onlyThisMonth && previousData.length > 1 ?
      {
        MCL: actualIndicators.MCL - (previousData[previousData.length - 2].actualIndicators.MCL || 0),
        MQL: actualIndicators.MQL - (previousData[previousData.length - 2].actualIndicators.MQL || 0),
        SQL: actualIndicators.SQL - (previousData[previousData.length - 2].actualIndicators.SQL || 0),
        opps: actualIndicators.opps - (previousData[previousData.length - 2].actualIndicators.opps || 0),
        users: actualIndicators.users - (previousData[previousData.length - 2].actualIndicators.users || 0)
      }
      :
      {
        MCL: actualIndicators.MCL,
        MQL: actualIndicators.MQL,
        SQL: actualIndicators.SQL,
        opps: actualIndicators.opps,
        users: actualIndicators.users
      };

    const indicatorsProperties = getIndicatorsWithProps();
    const objectivesGauges = objectives.map((objective, index) => {
      if (!objective.isArchived) {
        const delta = objective.isPercentage ? objective.amount * (objective.currentValue || 0) / 100 : objective.amount;
        const target = Math.round(objective.direction === "equals" ? objective.amount : (objective.direction === "increase" ? delta + (objective.currentValue || 0) : (objective.currentValue || 0) - delta));
        const month = timeFrameToDate(objective.timeFrame).getMonth();
        const project = approvedBudgetsProjection[month] && approvedBudgetsProjection[month][objective.indicator];
        return <Objective
          target={target}
          value={actualIndicators[objective.indicator]}
          title={indicatorsProperties[objective.indicator].nickname}
          project={project}
          key={index}
          directionDown={objective.direction === "decrease"}
          timeFrame={objective.timeFrame}
          color={COLORS[index % COLORS.length]}
          isDollar={indicatorsProperties[objective.indicator].isDollar}
          isPercentage={indicatorsProperties[objective.indicator].isPercentage}
        />
      }
    });

    return <div className={ dashboardStyle.locals.wrap }>
      <Steps {... this.props}/>
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
            <div style={{ display: 'flex', position: 'relative' }}>
              <Label
                checkbox={this.state.onlyThisMonth}
                onChange={ () => { this.setState({onlyThisMonth: !this.state.onlyThisMonth}) } }
                style={{ margin: '0', alignSelf: 'center', textTransform: 'capitalize', fontSize: '12px', position: 'absolute' }}
              >
                Show only this month results
              </Label>
              <div className={ dashboardStyle.locals.text }>
                Funnel
              </div>
            </div>
            <div className={ dashboardStyle.locals.chart } style={{ justifyContent: 'center' }}>
              <Funnel {... funnelMetricsValues}/>
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
                      <div key={i} style={{ display: 'flex', marginTop: '5px' }}>
                        <div style={{border: '2px solid ' + COLORS[i % COLORS.length], borderRadius: '50%', height: '8px', width: '8px', display: 'inline-flex', marginTop: '2px', backgroundColor: this.state.activeIndex === i ? COLORS[i % COLORS.length] : 'initial'}}/>
                        <div style={{fontWeight: this.state.activeIndex === i ? "bold" : 'initial', display: 'inline', paddingLeft: '4px', fontSize: '14px', width: '135px', textTransform: 'capitalize' }}>
                          {element.name}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', width: '70px' }}>
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
        <div className={ this.classes.cols } style={{ maxWidth: '1140px' }}>
          <div className={ this.classes.colLeft }>
            <div className={ dashboardStyle.locals.item } style={{ height: 'auto', width: 'auto' }}>
              <div className={ dashboardStyle.locals.text }>
                Objectives
              </div>
              <div className={ dashboardStyle.locals.chart } style={{ justifyContent: 'center', display: 'block' }}>
                {objectivesGauges}
              </div>
            </div>
          </div>
        </div>
        : null }
    </div>
  }
}