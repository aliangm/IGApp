import React from 'react';
import Component from 'components/Component';
import { FeatureToggle } from 'react-feature-toggles';
import { Link } from 'react-router';
import global from 'global';

import style from 'styles/sidebar.css';

export default class Sidebar extends Component {
  style = style;

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
  };

  close = () => {
    this.setState({
      open: false
    });
  };

  componentWillUpdate(props, state) {
    // global.setState('sidebar', state);
  }

  componentWillUnmount() {
    global.removeEventListener('sidebar:open', this.onOpen);
  }

  render() {
    const subMenu = [
      { icon: "sidebar:company", link: "/profile", text: "Company" },
      { icon: "sidebar:target-audience", link: "/target-audience", text: "Target Audience" },
      { icon: "sidebar:indicators", link: "/indicators", text: "Metrics" },
      { icon: "sidebar:preferences", link: "/preferences", text: "Preferences" },
    ];
    return <div>
      <div className={ this.classes.backface }
           onClick={ this.close }
           data-open={ this.state.open ? true : null }
      />
      <div className={ this.classes.box } data-open={ this.state.open ? true : null }>
        <div className={ this.classes.logo } />
        <div className={ this.classes.menu }>
          {this.props.auth.getProfile().app_metadata && this.props.auth.getProfile().app_metadata.isAdmin ?
            <div>
              <MenuItem icon="sidebar:dashboard" link="/dashboard" text="Dashboard"/>
              <CollapsedMenuItem icon="sidebar:profile" text="Profile" subMenu={ subMenu }/>
              {/** <MenuItem icon="sidebar:manual" link="/manual" text="Manual" /> **/}
              <MenuItem icon="sidebar:plan" link="/plan" text="Plan"/>
              <MenuItem icon="sidebar:analyze" link="/analyze" text="Analyze"/>
            </div>
            : null}
          <MenuItem icon="sidebar:campaigns" link="/campaigns" text="Campaigns"/>
          <FeatureToggle featureName="attribution">
            <MenuItem icon="sidebar:attribution" link="/attribution" text="Attribution"/>
          </FeatureToggle>
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

export class SubMenuItem extends Component {
  style = style;

  render() {
    let className = this.classes.subMenuItem;

    return <Link to={ this.props.link || '/' }
                 activeClassName={ this.classes.subMenuItemSelected }
                 className={ className }
    >
      <div className={ this.classes.subMenuItemIcon } data-icon={ this.props.icon } />
      <div className={ this.classes.menuItemText }>
        { this.props.text }
      </div>
    </Link>
  }
}

export class CollapsedMenuItem extends Component {
  style = style;
  state = {
    showSubMenu: false
  };
  render() {
    let className = this.classes.collapsedMenuItem;

    const submenu = this.props.subMenu.map((item, index) =>
      <SubMenuItem { ... item } key={ index }/>
    );

    return <div>
      <div className={ className } data-selected={ this.state.showSubMenu || null } onClick={() => { this.setState({showSubMenu: !this.state.showSubMenu}) }}>
        <div className={ this.classes.menuItemIcon } data-icon={ this.props.icon } />
        <div className={ this.classes.menuItemText }>
          { this.props.text }
        </div>
        <div className={ this.classes.rowArrow } data-collapsed={ this.state.showSubMenu || null }/>
      </div>
      { this.state.showSubMenu ? submenu : null }
    </div>
  }
}