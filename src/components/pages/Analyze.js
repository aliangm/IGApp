import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/plan/plan.css';
import analyzeStyle from 'styles/analyze/analyze.css';
import FirstPageVisit from 'components/pages/FirstPageVisit';
import { Link } from 'react-router';
import Select from 'components/controls/Select';
import { formatDate } from 'components/utils/date';


export default class Analyze extends Component {

  style = style;
  styles = [analyzeStyle];

  static defaultProps = {
    previousData: []
  };

  render() {

    const { previousData } = this.props;
    const sortedPreviousData = previousData.sort((a, b) => {
      const planDate1 = a.planDate.split("/");
      const planDate2 = b.planDate.split("/");
      const date1 = new Date(planDate1[1], planDate1[0] - 1).valueOf();
      const date2 = new Date(planDate2[1], planDate2[0] - 1).valueOf();
      return (isFinite(date1) && isFinite(date2) ? (date1 > date2) - (date1 < date2) : NaN);
    });
    const months = sortedPreviousData.map((item, index) => {
      return {value: index, label: formatDate(item.planDate)}
    });

    const tabs = {
      "Overview": 'analyze/overview',
      "Channels": '/analyze/channels',
      "campaigns": '/analyze/campaigns',
      "Content": '/analyze/content',
      "Audiences": '/analyze/audiences'
    };

    const tabNames = Object.keys(tabs);
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, this.props));
    return <div>
      <Page contentClassName={ this.classes.content } innerClassName={ this.classes.pageInner } width="100%">
        <div className={ this.classes.head }>
          <div className={ this.classes.headTitle }>Analyze</div>
          <div className={ this.classes.headTabs }>
            {
              tabNames.map((name, i) => {
                const link = Object.values(tabs)[i];
                return <Link to={ link } activeClassName={this.classes.headTabSelected} className={ this.classes.headTab } key={ i }>
                  { name }
                </Link>
              })
            }
          </div>
          <Select
            selected={this.props.months === undefined ? previousData.length - 1 : this.props.months}
            select={{
              options: months
            }}
            onChange={(e) => {
              this.props.calculateAttributionData(previousData.length - e.value - 1, this.props.attributionModel)
            }}
            className = { analyzeStyle.locals.dateRange }
          />
        </div>
        { this.props.userAccount.pages && this.props.userAccount.pages.attribution ?
          <div style={{paddingTop: '90px'}}>
            {childrenWithProps}
          </div>
          :
          <FirstPageVisit
            title="Understanding data starts by collecting it"
            content="You can learn and improve a lot from your data. Track leads’ and users’ interactions with your brand to better understand your investments' effectiveness."
            action="Implement Attribution >"
            icon="step:attribution"
            onClick={ () => { this.props.updateUserAccount({'pages.attribution': true}) } }
          />
        }
      </Page>
    </div>
  }
}