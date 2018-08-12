import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/plan/plan.css';
import analyzeStyle from 'styles/analyze/analyze.css';
import FirstPageVisit from 'components/pages/FirstPageVisit';
import Select from 'components/controls/Select';

export default class Analyze extends Component {

  style = style;
  styles = [analyzeStyle];

  static defaultProps = {
    numberOfMonths: 0
  };

  render() {
    const {numberOfMonths, calculatedData: {historyData: {historyDataWithCurrentMonth, committedBudgets, sumBudgets, totalCost, months, indicatorsDataPerMonth, historyDataLength}}} = this.props;

    const selectOptions = [];
    for (let i = 0; i < historyDataLength + 1; i++) {
      const lastXMonth = i;
      selectOptions.push({value: i, label: lastXMonth ? `Last ${lastXMonth + 1} months` : 'This month'});
    }

    const indicatorsData = {};
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

    const historyCalculatedProps = {
      indicatorsData: indicatorsData,
      committedBudgets: committedBudgets,
      sumBudgets: sumBudgets,
      historyData: historyDataWithCurrentMonth,
      monthsNames: months,
      totalCost: totalCost,
      indicatorsDataPerMonth: indicatorsDataPerMonth,
      calculateAttributionData: (attributionModel) => this.props.calculateAttributionData(numberOfMonths,
        attributionModel)
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