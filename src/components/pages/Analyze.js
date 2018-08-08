import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/plan/plan.css';
import analyzeStyle from 'styles/analyze/analyze.css';
import FirstPageVisit from 'components/pages/FirstPageVisit';
import Select from 'components/controls/Select';
import {formatDate} from 'components/utils/date';
import {getDatesSpecific} from 'components/utils/date'
import merge from 'lodash/merge';

export default class Analyze extends Component {

  style = style;
  styles = [analyzeStyle];

  static defaultProps = {
    previousData: []
  };

  render() {

    const {previousData, historyData, planDate} = this.props;
    const sortedPreviousData = previousData.sort((a, b) => {
      const planDate1 = a.planDate.split('/');
      const planDate2 = b.planDate.split('/');
      const date1 = new Date(planDate1[1], planDate1[0] - 1).valueOf();
      const date2 = new Date(planDate2[1], planDate2[0] - 1).valueOf();
      return (isFinite(date1) && isFinite(date2) ? (date1 > date2) - (date1 < date2) : NaN);
    });
    const selectOptions = sortedPreviousData.map((item, index) => {
      const lastXMonth = sortedPreviousData.length - index - 1;
      return {value: index, label: lastXMonth ? `Last ${lastXMonth + 1} months` : 'This month'};
    });

    const indicatorsData = {};
    const months = getDatesSpecific(planDate, historyData.indicators.length, 0);

    historyData.indicators.forEach((item, key) => {
      const displayDate = months[key];
      Object.keys(item).forEach(indicator => {
        if (!indicatorsData[indicator]) {
          indicatorsData[indicator] = [];
        }
        const value = item[indicator];
        indicatorsData[indicator].push({name: displayDate, value: value > 0 ? value : 0});
      })
    });

    const committedBudgets = historyData.planBudgets.map((month) => {
      const newMonth = {};
      Object.keys(month).map((key) => {
        const committedBudget = month[key].committedBudget;
        newMonth[key] = committedBudget ? committedBudget : 0
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
      })
    });

    const historyCalculatedProps = {indicatorsData: indicatorsData, committedBudgets: committedBudgets, sumBudgets: sumBudgets};

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, merge(historyCalculatedProps,this.props)));
    return <div>
      <Page contentClassName={this.classes.content} innerClassName={this.classes.pageInner} width="100%">
        <div className={this.classes.head}>
          <div className={this.classes.headTitle}>Analyze</div>
          <div className={this.classes.headPlan}>
            <Select
              selected={this.props.months === undefined ? previousData.length - 1 : this.props.months}
              select={{options: selectOptions}}
              onChange={(e) => {
                this.props.calculateAttributionData(previousData.length - e.value - 1, this.props.attributionModel);
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