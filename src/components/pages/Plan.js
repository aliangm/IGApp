import React from 'react';
import _ from 'lodash';
import Component from 'components/Component';
import Page from 'components/Page';
import Popup from 'components/Popup';

import style from 'styles/plan/plan.css';

import CurrentTab from 'components/pages/plan/CurrentTab';
import ProjectionsTab from 'components/pages/plan/ProjectionsTab';
import AnnualTab from 'components/pages/plan/AnnualTab';
import ReplanButton from 'components/pages/plan/ReplanButton';
import serverCommunication from 'data/serverCommunication';
import { isPopupMode, disablePopupMode } from 'modules/popup-mode';
import PlanNextMonthPopup from 'components/pages/plan/PlanNextMonthPopup';
import history from 'history';
import events from 'data/events';

export default class Plan extends Component {
  style = style;

  static defaultProps = {
    userProfile: {},
    targetAudience: {},
    projectedPlan: []
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      numberOfPlanUpdates: 0,
      whatIf: this.plan.bind(this)
    };
    this.plan = this.plan.bind(this);
    this.popup = this.popup.bind(this);
  }

  componentDidMount() {
    this.getRelevantEvents(this.props);
    if (isPopupMode()) {
      disablePopupMode();
      this.plan(true, null, null, localStorage.getItem('region'));
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getRelevantEvents(nextProps);
  }

  getRelevantEvents(props) {
    this.setState({events: events.filter(event => event.vertical == props.userProfile.vertical || event.companyType == props.targetAudience.companyType)});
  }

  popup() {
    this.setState({popup: true});
  }

  plan(isCommitted, preferences, callback, region){
    let body = preferences ? JSON.stringify(preferences) : null;
    let func = isCommitted ? (body ? 'PUT' : 'GET') : 'POST';
    this.setState({
      isPlannerLoading: true,
      popup: false,
      serverDown: false
    });
    serverCommunication.serverRequest(func, 'plan', body, region)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (data) {
                if (data.error) {
                  this.setState({isPlannerLoading: false, isError: true});
                }
                else {
                  this.props.setDataAsState(data);
                  this.setState({
                    isPlannerLoading: false,
                    isError: false
                  });
                  if (callback) {
                    callback();
                  }
                }
              }
              else {
              }
            })
        }
        else {
          if (response.status == 401){
            history.push('/');
          }
          if (response.status == 400){
            this.setState({isError: true, isPlannerLoading: false});
          }
          else {
            this.setState({serverDown: true, isPlannerLoading: false});
          }
        }
      })
      .catch((err) => {
        this.setState({
          isPlannerLoading: false,
          serverDown: true
        });
      });
  }

  selectTab(index) {
    this.setState({
      selectedTab: index
    });
  }

  render() {
    const tabs = {
      "Current": CurrentTab,
      "Annual": AnnualTab,
      "Forecasting": ProjectionsTab
    };

    const tabNames = Object.keys(tabs);
    const selectedName = tabNames[this.state.selectedTab];
    const selectedTab = tabs[selectedName];
    return <div>
      <Page contentClassName={ this.classes.content } innerClassName={ this.classes.pageInner } width="1180px">
        <div className={ this.classes.head }>
          <div className={ this.classes.headTitle }>Plan</div>
          <div className={this.classes.headPlan } >
            <ReplanButton numberOfPlanUpdates={ this.props.numberOfPlanUpdates } onClick={ this.popup }/>
            <Popup style={{
              width: '400px',
              top: '180%',
              transform: 'translate(0, -50%)'
            }} hidden={ !this.state.popup } onClose={() => {
              this.setState({
                popup: false
              });
            }}>
              <PlanNextMonthPopup hidden={ !this.state.popup } onNext={ this.plan.bind(this, true, false, false, this.props.region) } onBack={() => {
                this.setState({
                  popup: false
                })}} />
            </Popup>
            <div className={ this.classes.error }>
              <label hidden={ !this.state.isError}>You've reached the plan updates limit.<br/> To upgrade, click <a href="mailto:support@infinigrow.com?&subject=I need replan upgrade" target='_blank'>here</a></label>
            </div>
          </div>
          <div className={ this.classes.headTabs }>
            {
              tabNames.map((name, i) => {
                let className;

                if (i === this.state.selectedTab) {
                  className = this.classes.headTabSelected;
                } else {
                  className = this.classes.headTab;
                }

                return <div className={ className } key={ i } onClick={() => {
                  this.selectTab(i);
                }}>{ name }</div>
              })
            }
          </div>
        </div>
        <div className={ this.classes.serverDown } style={{ padding: '30px 30px' }}>
          <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our support. </label>
        </div>
        <div>
          { selectedTab ? React.createElement(selectedTab, _.merge(this.props, this.state)) : null }
        </div>
      </Page>
    </div>
  }
}