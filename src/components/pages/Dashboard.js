import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/plan/plan.css';
import FirstPageVisit from 'components/pages/FirstPageVisit';

export default class Dashboard extends Component {

  style = style;

  render() {

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, this.props));
    return <div>
      <Page contentClassName={this.classes.content} innerClassName={this.classes.pageInner} width="100%">
        <div className={this.classes.head}>
          <div className={this.classes.headTitle}>Dashboard</div>
        </div>
        {this.props.userAccount.pages && this.props.userAccount.pages.dashboard ?
          <div>
            {childrenWithProps}
          </div>
          :
          <FirstPageVisit
            title="360 view on all marketing data and performance"
            content="Control and visibility over your marketing mix, data and performance are crucial for marketing success. Get a one-point-view of what happens at any given moment."
            action="Show me the data >"
            icon="step:dashboard"
            onClick={() => {
              this.props.updateUserAccount({'pages.dashboard': true});
            }}
          />
        }
      </Page>
    </div>;
  }
}