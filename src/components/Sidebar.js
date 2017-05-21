import React from 'react';
import Component from 'components/Component';

import history from 'history';
import { Link } from 'react-router';
import global from 'global';

import style from 'styles/sidebar.css';

export default class Sidebar extends Component {
  style = style

  constructor(props) {
    super(props);

    this.state = /*global.getState('sidebar') ||*/ {
      open: false
    };

    global.addEventListener('sidebar:open', this.onOpen);
  }

  onOpen = () => {
    this.setState({
      open: true
    });
  }

  close = () => {
    this.setState({
      open: false
    });
  }

  componentWillUpdate(props, state) {
    // global.setState('sidebar', state);
  }

  componentWillUnmount() {
    global.removeEventListener('sidebar:open', this.onOpen);
  }

  render() {
    return <div>
      <div className={ this.classes.backface }
           onClick={ this.close }
           data-open={ this.state.open ? true : null }
      />
      <div className={ this.classes.box } data-open={ this.state.open ? true : null }>
        <div className={ this.classes.logo } />
        <div className={ this.classes.menu }>
          {this.props.auth.getProfile().app_metadata.isAdmin ?
            <div>
              <MenuItem icon="sidebar:dashboard" link="/dashboard" text="Dashboard"/>
              < MenuItem icon="sidebar:profile" link="/profile" text="Profile" />
              <MenuItem icon="sidebar:targeting" link="/target-audience" text="Target Audience" />
              <MenuItem icon="sidebar:goals" link="/preferences" text="Preferences" />
              {/** <MenuItem icon="sidebar:manual" link="/manual" text="Manual" /> **/}
              <MenuItem icon="sidebar:indicators" link="/indicators" text="Metrics" />
              <MenuItem icon="sidebar:plan" link="/plan" text="Plan" />
              <MenuItem icon="sidebar:planned-vs-actual" link="/planned-vs-actual" text="Planned VS Actual" />
            </div>
            : null}
          <MenuItem icon="sidebar:campaigns" link="/campaigns" text="Campaigns" />
        </div>

      </div>
    </div>
  }
}

export class MenuItem extends Component {
  style = style;

  render() {
    let className = this.classes.menuItem;

    /*if (this.props.selected) {
     className = this.classes.menuItemSelected;
     }*/

    return <Link to={ this.props.link || '/' }
                 activeClassName={ this.classes.menuItemSelected }
                 className={ className }
    >
      <div className={ this.classes.menuItemIcon } data-icon={ this.props.icon } />
      <div className={ this.classes.menuItemText }>
        { this.props.text }
      </div>
    </Link>
  }
}