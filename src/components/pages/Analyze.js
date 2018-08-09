import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/plan/plan.css';
import analyzeStyle from 'styles/analyze/analyze.css';
import FirstPageVisit from 'components/pages/FirstPageVisit';
import Select from 'components/controls/Select';
import {formatDate} from 'components/utils/date';
import {getDatesSpecific} from 'components/utils/date';

export default class Analyze extends Component {

  style = style;
  styles = [analyzeStyle];

  static defaultProps = {
    numberOfMonths: 0
  };

  render() {
    const historyDataLength = (data) => data.indicators.length;

    const {historyData, planDate, numberOfMonths} = this.props;
    const historyDataWithCurrentMonth = {};
    Object.keys(historyData).forEach(key => {
      const sliceNumber = historyDataLength(historyData) - numberOfMonths;
      if (key === 'indicators') {
        historyDataWithCurrentMonth[key] = [...historyData[key], this.props.actualIndicators].slice(sliceNumber);
      }
      else {
        historyDataWithCurrentMonth[key] = [...historyData[key], this.props[key][0]].slice(sliceNumber);
      }
    });

    const selectOptions = [];
    for (let i = 0; i < historyDataLength(historyData) + 1; i++) {
      const lastXMonth = i;
      selectOptions.push({value: i, label: lastXMonth ? `Last ${lastXMonth + 1} months` : 'This month'});
    }

    const indicatorsData = {};
    const months = getDatesSpecific(planDate, historyDataLength(historyDataWithCurrentMonth) - 1, 1);

    historyDataWithCurrentMonth.indicators.forEach((item, key) => {
      const displayDate = months[key];
      Object.keys(item).forEach(indicator => {
        if (!indicatorsData[indicator]) {
          indicatorsData[indicator] = [];
        }
        const value = item[indicator];
        indicatorsData[indicator].push({name: displayDate, value: value > 0 ? value : 0});
      });
    });

    const committedBudgets = historyDataWithCurrentMonth.planBudgets.map((month) => {
      const newMonth = {};
      Object.keys(month).map((key) => {
        const committedBudget = month[key].committedBudget;
        newMonth[key] = committedBudget ? committedBudget : 0;
      });

      return newMonth;
    });

    const sumBudgets = {};
    committedBudgets.forEach(month => {
      Object.keys(month).forEach(channel => {
        if (!sumBudgets[channel]) {
          sumBudgets[channel] = 0;
        }
        sumBudgets[channel] += month[channel];
      });
    });

    const historyCalculatedProps = {
      indicatorsData: indicatorsData,
      committedBudgets: committedBudgets,
      sumBudgets: sumBudgets,
      historyData: historyDataWithCurrentMonth,
      monthsNames: months,
      calculateAttributionData: (attributionModel) => this.props.calculateAttributionData(numberOfMonths, attributionModel)
    };

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {...this.props, ...historyCalculatedProps}));
    return <div>
      <Page contentClassName={this.classes.content} innerClassName={this.classes.pageInner} width="100%">
        <div className={this.classes.head}>
          <div className={this.classes.headTitle}>Analyze</div>
          <div className={this.classes.headPlan}>
            <Select
              selected={numberOfMonths}
              select={{options: selectOptions}}
              onChange={(e) => {
                this.props.calculateAttributionData(e.value,
                  this.props.attributionModel);
              }}
              className={analyzeStyle.locals.dateSelect}
            />
          </div>
        </div>
        {this.props.userAccount.pages && this.props.userAccount.pages.attribution ?
          <div style={{paddingTop: '90px'}}>
            {childrenWithProps}
          </div>
          :
          <FirstPageVisit
            title="Understanding data starts by collecting it"
            content="You can learn and improve a lot from your data. Track leads’ and users’ interactions with your brand to better understand your investments' effectiveness."
            action="Implement Attribution >"
            icon="step:attribution"
            onClick={() => {
              this.props.updateUserAccount({'pages.attribution': true});
            }}
          />
        }
      </Page>
    </div>;
  }
}