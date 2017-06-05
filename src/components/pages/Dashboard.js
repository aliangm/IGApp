import React from "react";
import Component from "components/Component";
import Page from "components/Page";
import style from "styles/onboarding/onboarding.css";
import {parseAnnualPlan} from "data/parseAnnualPlan";
import {isPopupMode} from "modules/popup-mode";
import {PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip } from "recharts";
import dashboardStyle from "styles/dashboard/dashboard.css";

function formatDate(dateStr) {
  if (dateStr) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [monthNum, yearNum] = dateStr.split("/");

    return `${monthNames[monthNum - 1]} ${yearNum}`;
  }
  else return null;
}

export default class Profile extends Component {

  style = style;
  styles = [dashboardStyle];

  static defaultProps = {
    projectedPlan: [],
    actualIndicators: {
      MCL: 0,
      MQL: 0,
      SQL: 0
    },
    campaigns: {}
  };

  constructor() {
    super();

    this.state = {
      activeIndex: void 0
    };
    this.onPieEnter = this.onPieEnter.bind(this);
  }

  onPieEnter(data, index) {
    this.setState({
      activeIndex: index,
    });
  }

  render() {
    const { planDate, projectedPlan, actualIndicators, campaigns } = this.props;
    const planJson = parseAnnualPlan(projectedPlan);
    const planData = planJson[Object.keys(planJson)[0]];
    const planDataChannels = Object.keys(planData).filter(channelName => channelName !== '__TOTAL__');
    const monthBudget = planDataChannels.reduce((res, key) => res + planData[key].values[0], 0);
    const fatherChannelsWithBudgets = Object.keys(planData)
      .filter(channelName => channelName !== '__TOTAL__' && planData[channelName].values[0] !== 0)
      .map((fatherChannel)=> { return { name: fatherChannel, value: planData[fatherChannel].values[0] } });
    const numberOfActiveCampaigns = Object.keys(campaigns).map((channel) =>
    {
      return campaigns[channel].filter(campaign=>  campaign.status !== 'Completed' ).length;
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
      funnel.push({ name: 'MCL', value: actualIndicators.MCL });
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

    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      return `${(percent * 100).toFixed(0)}%`
    };

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
                Budget
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
            <div className={ dashboardStyle.locals.item } style={{ display: 'inline-block', height: '397px', width: '540'}}>
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
          </div>
        </div>
      </Page>
    </div>
  }
}