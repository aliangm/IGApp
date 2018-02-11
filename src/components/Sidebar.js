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
      open: false,
      openSubMenu: false
    };

    global.addEventListener('sidebar:open', this.onOpen);
  }

  static defaultProps = {
    userAccount: {}
  };

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

  closeSubMenu = () => {
    this.setState({openSubMenu: false});
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
              <MenuItem icon="sidebar:dashboard" link="/dashboard" text="Dashboard" onClick={this.closeSubMenu} notFirstTime={this.props.userAccount.pages && this.props.userAccount.pages.dashboard}/>
              <CollapsedMenuItem icon="sidebar:profile" text="Profile" subMenu={ subMenu } isOpen={ this.state.openSubMenu } toggleSubMenu={ () => { this.setState({openSubMenu: !this.state.openSubMenu}) } }/>
              {/** <MenuItem icon="sidebar:manual" link="/manual" text="Manual" /> **/}
              <MenuItem icon="sidebar:plan" link="/plan" text="Plan" onClick={this.closeSubMenu} notFirstTime={this.props.userAccount.pages && this.props.userAccount.pages.plan}/>
            </div>
            : null}
          <MenuItem icon="sidebar:campaigns" link="/campaigns" text="Campaigns" onClick={this.closeSubMenu} notFirstTime={this.props.userAccount.pages && this.props.userAccount.pages.campaigns}/>
          <FeatureToggle featureName="attribution">
            <MenuItem icon="sidebar:attribution" link="/attribution" text="Attribution" onClick={this.closeSubMenu} notFirstTime={this.props.userAccount.pages && this.props.userAccount.pages.attribution}/>
          </FeatureToggle>
          <FeatureToggle featureName="users">
            <MenuItem icon="sidebar:users" link="/users" text="Users" onClick={this.closeSubMenu} notFirstTime={this.props.userAccount.pages && this.props.userAccount.pages.users}/>
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
                 onClick={this.props.onClick}
    >
      <div className={ this.classes.menuItemIcon } data-icon={ this.props.icon } />
      <div className={ this.classes.menuItemText }>
        { this.props.text }
      </div>
      <div className={this.classes.menuItemFirstTime} hidden={this.props.notFirstTime}/>
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

  static defaultProps = {
    isOpen: false
  };

  render() {
    let className = this.classes.collapsedMenuItem;

    const submenu = this.props.subMenu.map((item, index) =>
      <SubMenuItem { ... item } key={ index }/>
    );

    return <div>
      <div className={ className } data-selected={ this.props.isOpen || null } onClick={ this.props.toggleSubMenu }>
        <div className={ this.classes.menuItemIcon } data-icon={ this.props.icon } />
        <div className={ this.classes.menuItemText }>
          { this.props.text }
        </div>
        <div className={ this.classes.rowArrow } data-collapsed={ this.props.isOpen || null }/>
      </div>
      { this.props.isOpen ? submenu : null }
    </div>
  }
}