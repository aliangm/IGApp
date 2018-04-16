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

  isHighlighted(subMenu) {
    return subMenu.some(item => item.link === this.props.path);
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
      { icon: "sidebar:company", link: "/profile", text: "Product", notFirstTime: true },
      { icon: "sidebar:target-audience", link: "/target-audience", text: "Target Audience", notFirstTime: true },
      { icon: "sidebar:indicators", link: "/indicators", text: "Metrics", notFirstTime: true },
      { icon: "sidebar:preferences", link: "/preferences", text: "Preferences", notFirstTime: true },
    ];
    const analyzeSubMenu = [
      { icon: "sidebar:analyze", link: "/analyze", text: "Analyze", notFirstTime: true },
      { icon: "sidebar:users", link: "/audiences", text: "Audiences", notFirstTime: this.props.userAccount.pages && this.props.userAccount.pages.users },
      { icon: "sidebar:attribution", link: "/attribution", text: "Attribution", notFirstTime: this.props.userAccount.pages && this.props.userAccount.pages.attribution },
    ];
    const planSubMenu =[
      { icon: "sidebar:plan", link: "/plan", text: "Plan", notFirstTime: this.props.userAccount.pages && this.props.userAccount.pages.plan },
      { icon: "sidebar:insights", link: "/insights", text: "Insights", notFirstTime: this.props.userAccount.pages && this.props.userAccount.pages.insights },
      { icon: "sidebar:planned-vs-actual", link: "/planned-vs-actual", text: "Planned VS Actual", notFirstTime: true },
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
              <CollapsedMenuItem icon="sidebar:profile" text="Profile" subMenu={ profileSubMenu } isOpen={ this.state.subMenu === 'profile' } isHighlighted={this.isHighlighted(profileSubMenu)} toggleSubMenu={ this.toggleSubMenu.bind(this, 'profile') }/>
              <FeatureToggle featureName="attribution">
                <CollapsedMenuItem icon="sidebar:analyzeContainer" text="Analyze" subMenu={ analyzeSubMenu } isOpen={ this.state.subMenu === 'analyze' } isHighlighted={this.isHighlighted(analyzeSubMenu)} toggleSubMenu={ this.toggleSubMenu.bind(this, 'analyze') }/>
              </FeatureToggle>
              <CollapsedMenuItem icon="sidebar:planContainer" text="Plan" subMenu={ planSubMenu } isOpen={ this.state.subMenu === 'plan' } isHighlighted={this.isHighlighted(planSubMenu)} toggleSubMenu={ this.toggleSubMenu.bind(this, 'plan') }/>
            </div>
            : null}
          <MenuItem icon="sidebar:campaigns" link="/campaigns" text="Campaigns" onClick={this.closeSubMenu} notFirstTime={this.props.userAccount.pages && this.props.userAccount.pages.campaigns}/>
          <MenuItem icon="sidebar:settings" link="/settings" text="Settings" onClick={this.closeSubMenu} notFirstTime={true} style={{ position: 'absolute', width: '100%', bottom: '20px' }}/>
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

    const submenu = this.props.subMenu.map((item, index) =>
      <SubMenuItem { ... item } key={ index }/>
    );

    return <div>
      <Link className={ className } to={this.props.subMenu[0].link} data-selected={ this.props.isHighlighted ? this.props.isHighlighted : null } onClick={ this.props.toggleSubMenu }>
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