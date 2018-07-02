import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/profile/profile.css';
import FirstPageVisit from 'components/pages/FirstPageVisit';
import { Link } from 'react-router';

export default class Profile extends Component {

  style = style;

  render() {
    const tabs = {
      Product: '/settings/profile/product',
      TargetAudience: '/settings/profile/target-audience',
      Integrations: '/settings/profile/integrations',
      Preferences: '/settings/profile/preferences',
    };

    const tabNames = Object.keys(tabs);
    const { children, ...otherProps } = this.props;
    const childrenWithProps = React.Children.map(children,
      (child) => React.cloneElement(child, otherProps));


    return <div>
      <Page contentClassName={ this.classes.content } innerClassName={ this.classes.pageInner} className={this.classes.static} width="100%">
        <div className={ this.classes.head }>
          <div className={ this.classes.headTitle }>Profile</div>
          <div className={ this.classes.headTabs }>
            {
              tabNames.map((name, i) => {
                const link = Object.values(tabs)[i];
                return <Link to={ link } activeClassName={this.classes.headTabSelected} className={this.classes.headTab} key={ i }>
                  { name }
                </Link>
              })
            }
          </div>
        </div>
          <div>
            {childrenWithProps}
          </div>
      </Page>
    </div>
  }
}