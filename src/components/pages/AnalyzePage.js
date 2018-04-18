import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/plan/plan.css';
import FirstPageVisit from 'components/pages/FirstPageVisit';
import { Link } from 'react-router';

export default class AnalyzePage extends Component {

  style = style;

  render() {
    const tabs = {
      "Analyze": '/analyze/analyze/analyze',
      "Content": '/analyze/analyze/content'
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