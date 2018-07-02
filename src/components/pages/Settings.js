import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import { Link } from 'react-router';
import style from 'styles/settings/settings.css';
import SettingsSideBar from 'components/pages/settings/SettingsSideBar';

export default class Settings extends Component {

  style = style;

  render() {

    const { children, ...otherProps } = this.props;
    const childrenWithProps = React.Children.map(children,
      (child) => React.cloneElement(child, otherProps));


    return <div>
      <Page contentClassName={this.classes.content} innerClassName={this.classes.pageInner} width="100%">
        <SettingsSideBar />
          <div style={{flex:'1'}}>
            {childrenWithProps}
          </div>
      </Page>
    </div>
  }
}