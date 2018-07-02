import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import { Link } from 'react-router';
import style from 'styles/settings/settings-side-bar.css';

export default class SettingsSideBar extends Component {

  style = style;

  render() {
    const tabs = {
      Account: '/settings/account',
      Profile: '/settings/profile/product',
      Attribution: '/settings/attribution/setup'
    };
    const tabNames = Object.keys(tabs);

    return <div className={this.classes.wrapper}>
      {
        tabNames.map((name, i) => {
          const link = Object.values(tabs)[i];
          return <Link to={ link } activeClassName={this.classes.headTabSelected} className={this.classes.headTab} key={ i }>
            { name }
          </Link>
        })
      }
    </div>
  }
}