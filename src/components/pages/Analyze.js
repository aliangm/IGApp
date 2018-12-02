import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/plan/plan.css';
import analyzeStyle from 'styles/analyze/analyze.css';
import Select from 'components/controls/Select';
import setupStyle from 'styles/attribution/attribution-setp.css';

export default class Analyze extends Component {

  style = style;
  styles = [analyzeStyle, setupStyle];

  static defaultProps = {
    monthsExceptThisMonth: 0
  };

  render() {
    const {attribution: {channelsImpact}, attributionModel, monthsExceptThisMonth, calculatedData: {historyData: {historyDataLength}}} = this.props;

    const attributionModels = [
      {value: false, label: 'Full Journey'},
      {value: 'firsttouch', label: 'Introducer'},
      {value: 'lasttouch', label: 'Converter'}
    ];

    const selectOptions = [];
    for (let i = 0; i < historyDataLength + 1; i++) {
      const lastXMonth = i;
      selectOptions.push({value: i, label: lastXMonth ? `Last ${lastXMonth + 1} months` : 'This month'});
    }

    const getTotalParam = param => (channelsImpact && channelsImpact[param]
      ? Object.keys(channelsImpact[param])
        .reduce((channelsSum, item) => channelsSum + channelsImpact[param][item], 0)
      : 0);

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child,
        {
          ...this.props,
          getTotalParam: getTotalParam,
          totalRevenue: getTotalParam('revenue')
        }));
    return <div>
      <Page contentClassName={this.classes.content} innerClassName={this.classes.pageInner} width="100%">
        <div className={this.classes.head}>
          <div className={this.classes.headTitle}>Analyze</div>
          <div className={this.classes.headPlan}>
            <div className={analyzeStyle.locals.text}>Time Frame:</div>
            <Select
              selected={monthsExceptThisMonth}
              select={{options: selectOptions}}
              onChange={(e) => {
                this.props.calculateAttributionData(e.value, attributionModel);
              }}
              iconRendererOnValue={true}
              iconFromValue={() => 'icons:calendar'}
              className={analyzeStyle.locals.dateSelect}
            />
            <div className={analyzeStyle.locals.text}>Attribution Model:</div>
            <Select
              selected={this.props.attributionModel ? this.props.attributionModel : false}
              select={{
                options: attributionModels
              }}
              onChange={(e) => {
                this.props.calculateAttributionData(monthsExceptThisMonth, e.value);
              }}
              className={analyzeStyle.locals.dateSelect}
            />
          </div>
        </div>
        <div style={{paddingTop: '90px'}}>
          {childrenWithProps}
        </div>
      </Page>
    </div>;
  }
}