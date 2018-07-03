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
      subMenu: ''
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
    this.setState({subMenu: ''});
  };

  componentWillUpdate(props, state) {
    // global.setState('sidebar', state);
  }

  componentWillUnmount() {
    global.removeEventListener('sidebar:open', this.onOpen);
  }

  isHighlighted(menuPath) {
    const menuSplit = menuPath.split('/');
    const pathSplit = this.props.path.split('/');
    return menuSplit.every((item, index) => item === pathSplit[index]);
  }

  toggleSubMenu(type) {
    if (this.state.subMenu === type) {
      this.setState({subMenu: ''});
    }
    else {
      this.setState({subMenu: type})
    }
  }

  render() {
    const profileSubMenu = [
      { icon: "sidebar:company", link: "/profile/product", text: "Product", notFirstTime: true },
      { icon: "sidebar:target-audience", link: "/profile/target-audience", text: "Target Audience", notFirstTime: true },
      { icon: "sidebar:integrations", link: "/profile/integrations", text: "Integrations", notFirstTime: true },
      { icon: "sidebar:preferences", link: "/profile/preferences", text: "Preferences", notFirstTime: true },
    ];
    const measureSubMenu = [
      { icon: "sidebar:analyze", link: "/measure/analyze/overview", text: "Analyze", notFirstTime: true, isHighlighted: this.isHighlighted('/measure/analyze') },
      { icon: "sidebar:attribution", link: "/measure/attribution/setup", text: "Attribution", notFirstTime: this.props.userAccount.pages && this.props.userAccount.pages.attribution, isHighlighted: this.isHighlighted('/measure/attribution') },
    ];
    const planSubMenu =[
      { icon: "sidebar:plan", link: "/plan/plan/annual", text: "Plan", notFirstTime: this.props.userAccount.pages && this.props.userAccount.pages.plan, isHighlighted: this.isHighlighted('/plan/plan') },
      { icon: "sidebar:planned-vs-actual", link: "/plan/planned-vs-actual", text: "Planned VS Actual", notFirstTime: true },
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
              <MenuItem icon="sidebar:dashboard" link="/dashboard/CMO" text="Dashboard" onClick={this.closeSubMenu} notFirstTime={this.props.userAccount.pages && this.props.userAccount.pages.dashboard} isHighlighted={this.isHighlighted('/dashboard')}/>
              <FeatureToggle featureName="attribution">
                <MenuItem icon="sidebar:analyze" text="Analyze" link='/measure/analyze/overview'  isHighlighted={this.isHighlighted('/measure/analyze')} notFirstTime={this.props.userAccount.pages && this.props.userAccount.pages.attribution}/>
              </FeatureToggle>
              <CollapsedMenuItem icon="sidebar:planContainer" text="Plan" subMenu={ planSubMenu } isOpen={ this.state.subMenu === 'plan' } isHighlighted={this.isHighlighted('/plan')} toggleSubMenu={ this.toggleSubMenu.bind(this, 'plan') }/>
            </div>
            : null}
          <MenuItem icon="sidebar:campaigns" link="/campaigns/by-channel" isHighlighted={this.isHighlighted('/campaigns')} text="Campaigns" onClick={this.closeSubMenu} notFirstTime={this.props.userAccount.pages && this.props.userAccount.pages.campaigns}/>
          <MenuItem icon="sidebar:insights" link="/insights" isHighlighted={this.isHighlighted('/insights')} text="Insights" notFirstTime={this.props.userAccount.pages && this.props.userAccount.pages.insights} />
          <MenuItem icon="sidebar:settings" link="/settings/account" text="Settings" onClick={this.closeSubMenu} notFirstTime={true} style={{ position: 'absolute', width: '100%', bottom: '20px' }} isHighlighted={this.isHighlighted('/settings')}/>
        </div>

      </div>
    </div>
  }
}

export class MenuItem extends Component {
  style = style;

  render() {
    let className = this.classes.menuItem;

    if (this.props.isHighlighted) {
      className += ' ' + this.classes.menuItemSelected;
    }

    return <Link to={ this.props.link || '/' }
                 activeClassName={ this.classes.menuItemSelected }
                 className={ className }
                 onClick={this.props.onClick}
                 style={this.props.style}
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

    if (this.props.isHighlighted) {
      className += ' ' + this.classes.subMenuItemSelected;
    }

    return <Link to={ this.props.link || '/' }
                 activeClassName={ this.classes.subMenuItemSelected }
                 className={ className }
    >
      <div className={ this.classes.subMenuItemIcon } data-icon={ this.props.icon } />
      <div className={ this.classes.menuItemText }>
        { this.props.text }
      </div>
      <div className={this.classes.menuItemFirstTime} hidden={this.props.notFirstTime}/>
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

    if (this.props.isHighlighted) {
      className += ' ' + this.classes.collapsedMenuItemSelected;
    }

    const submenu = this.props.subMenu.map((item, index) =>
      <SubMenuItem { ... item } key={ index }/>
    );

    return <div>
      <Link className={ className } to={this.props.subMenu[0].link} onClick={ this.props.toggleSubMenu }>
        <div className={ this.classes.menuItemIcon } data-icon={ this.props.icon } />
        <div className={ this.classes.menuItemText }>
          { this.props.text }
        </div>
        <div className={ this.classes.rowArrow } data-collapsed={ this.props.isOpen || null }/>
      </Link>
      { this.props.isOpen ? submenu : null }
    </div>
  }
}