import React from 'react';
import Component from 'components/Component';
import NavLink from 'components/controls/NavLink';
import style from 'styles/settings/settings-side-bar.css';

export default class SettingsSideBar extends Component {

  style = style;

  render() {
    const tabs = [{
        name: 'Account',
        path: '/settings/account',
        representivePath: '/settings/account'
      },
      {
        name: 'Profile',
        path: '/settings/profile/product',
        representivePath: '/settings/profile'
      },
      {
        name: 'Attribution',
        path: '/settings/attribution/setup',
        representivePath: '/settings/attribution'
      }];

    return <div className={this.classes.wrapper}>
      {
        tabs.map(({name, path, representivePath}) => {
          return <NavLink pathToCheck={representivePath} currentPath={this.props.currentPath} to={ path } activeClassName={this.classes.headTabSelected} className={this.classes.headTab} key={ name }>
            { name }
          </NavLink>
        })
      }
    </div>
  }
}