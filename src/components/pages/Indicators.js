import React from 'react';

import Component from 'components/Component';
import Page from 'components/Page';

import Title from 'components/onboarding/Title';
import ProfileProgress from 'components/pages/profile/Progress';
import BackButton from 'components/pages/profile/BackButton';
import PlanButton from 'components/pages/indicators/PlanButton';
import SaveButton from 'components/pages/profile/SaveButton';
import Item from 'components/pages/indicators/Item';

import style from 'styles/onboarding/onboarding.css';
import indiStyle from 'styles/indicators/indicators.css';

import { isPopupMode, disablePopupMode } from 'modules/popup-mode';
import history from 'history';
import FacebookAutomaticPopup from 'components/pages/indicators/FacebookAutomaticPopup';
import CRMPopup from 'components/pages/indicators/CRMPopup';
import AnalyticsPopup from 'components/pages/indicators/AnalyticsPopup';
import FinancePopup from 'components/pages/indicators/FinancePopup';
import SocialPopup from 'components/pages/indicators/SocialPopup';
import TwitterAutomaticPopup from 'components/pages/indicators/TwitterAutomaticPopup';
import Loading from 'components/pages/indicators/Loading';
import { getIndicatorsWithProps } from 'components/utils/indicators';

export default class Indicators extends Component {
  style = style;
  styles = [indiStyle];

  static defaultProps = {
    actualIndicators: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(name, value){
    let update = Object.assign({}, this.props.actualIndicators);
    value = parseInt(value);
    if (!isNaN(value)) {
      update[name] = value;
      this.props.updateState({actualIndicators: update});
    }
  }

  showFacebookPopup() {
    this.setState({showFacebookPopup: true});
  }

  showCRMPopup() {
    this.setState({showCRMPopup: true});
  }

  showAnalyticsPopup() {
    this.setState({showAnalyticsPopup: true});
  }

  showFinancePopup() {
    this.setState({showFinancePopup: true});
  }

  showSocialPopup() {
    this.setState({showSocialPopup: true});
  }

  showTwitterPopup() {
    this.setState({showTwitterPopup: true});
  }

  isFunnelAuto(indicator) {
    if (this.props.hubspotAuto && this.props.hubspotAuto.mapping && this.props.hubspotAuto.mapping[indicator]) {
      return "provider:hubspot";
    }
    if (this.props.salesforceAuto && this.props.salesforceAuto.mapping && this.props.salesforceAuto.mapping[indicator]) {
      return "provider:salesforce";
    }
    return false;
  }

  isSheetAuto(indicator) {
    return this.props.googleSheetsAuto && this.props.googleSheetsAuto.mapping && this.props.googleSheetsAuto.mapping[indicator]
  }

  isFinanceAuto(indicator) {
    if (this.isSheetAuto(indicator)) {
      return "provider:sheets";
    }
    if (this.props.isStripeAuto) {
      return "provider:stripe";
    }
    return false;
  }

  isGoogleAuto() {
    return !!this.props.googleAuto;
  }

  isBlogAuto() {
    return this.props.googleAuto && this.props.googleAuto.blogProfileId;
  }

  updateState = (newState) => {
    this.setState(newState);
  };

  render() {
    const indicatorsSpecialProp = {
      facebookLikes: {
        showAutomaticPopup: this.showFacebookPopup.bind(this),
        automaticIndicators: this.props.isFacebookAuto
      },
      facebookEngagement: {
        link: 'fb',
        showAutomaticPopup: this.showFacebookPopup.bind(this),
        automaticIndicators: this.props.isFacebookAuto
      },
      twitterFollowers: {
        showAutomaticPopup: this.showTwitterPopup.bind(this),
        automaticIndicators: this.props.isTwitterAuto
      },
      twitterEngagement: {
        showAutomaticPopup: this.showTwitterPopup.bind(this),
        automaticIndicators: this.props.isTwitterAuto,
        link: 'twtr'
      },
      linkedinFollowers: {
        showAutomaticPopup: this.showSocialPopup.bind(this),
        automaticIndicators: this.props.isLinkedinAuto
      },
      linkedinEngagement: {
        showAutomaticPopup: this.showSocialPopup.bind(this),
        automaticIndicators: this.props.isLinkedinAuto,
        link: 'in'
      },
      instagramEngagement: {
        link: 'inst'
      },
      googlePlusEngagement: {
        link: 'gp'
      },
      pinterestEngagement: {
        link: 'pin'
      },
      youtubeEngagement: {
        link: 'utu'
      },
      MCL: {
        showAutomaticPopup: this.showCRMPopup.bind(this),
        automaticIndicators: this.isFunnelAuto('MCL')
      },
      MQL: {
        showAutomaticPopup: this.showCRMPopup.bind(this),
        automaticIndicators: this.isFunnelAuto('MQL')
      },
      SQL: {
        showAutomaticPopup: this.showCRMPopup.bind(this),
        automaticIndicators: this.isFunnelAuto('SQL')
      },
      opps: {
        showAutomaticPopup: this.showCRMPopup.bind(this),
        automaticIndicators: this.isFunnelAuto('opps')
      },
      LTV: {
        showAutomaticPopup: this.showFinancePopup.bind(this),
        automaticIndicators: this.isFinanceAuto('LTV')
      },
      CAC: {
        showAutomaticPopup: this.showFinancePopup.bind(this),
        automaticIndicators: this.isSheetAuto('CAC')
      },
      users: {
        showAutomaticPopup: this.showCRMPopup.bind(this),
        automaticIndicators: this.isFunnelAuto('users')
      },
      sessions: {
        showAutomaticPopup: this.showAnalyticsPopup.bind(this),
        automaticIndicators: this.isGoogleAuto()
      },
      averageSessionDuration: {
        showAutomaticPopup: this.showAnalyticsPopup.bind(this),
        automaticIndicators: this.isGoogleAuto()
      },
      bounceRate: {
        showAutomaticPopup: this.showAnalyticsPopup.bind(this),
        automaticIndicators: this.isGoogleAuto()
      },
      blogVisits: {
        showAutomaticPopup: this.showAnalyticsPopup.bind(this),
        automaticIndicators: this.isBlogAuto()
      },
      blogSubscribers: {
        automaticIndicators: this.isFunnelAuto('blogSubscribers')
      },
      MRR: {
        showAutomaticPopup: this.showFinancePopup.bind(this),
        automaticIndicators: this.isFinanceAuto('MRR')
      },
      churnRate: {
        showAutomaticPopup: this.showFinancePopup.bind(this),
        automaticIndicators: this.isFinanceAuto('churnRate')
      }
    };
    const { actualIndicators } = this.props;
    let groups = [];
    const properties = getIndicatorsWithProps() || {};
    const indicators = Object.keys(properties);
    indicators.forEach(indicator => {
      if (!groups.includes(properties[indicator].group)) {
        groups.push(properties[indicator].group);
      }
    });
    groups.sort();

    const page = groups.map(group => {
      const groupIndicators = indicators
        .filter(indicator => properties[indicator].group === group)
        .sort((a, b) => properties[a].orderInGroup - properties[b].orderInGroup);
      const indicatorsItems = groupIndicators.map(indicator =>
        <Item
          key={indicator}
          icon={"indicator:" + indicator}
          title={ properties[indicator].title }
          name={indicator}
          updateIndicator={ this.handleChange }
          defaultStatus = { actualIndicators[indicator] }
          maxValue={ properties[indicator].range.max }
          isPercentage={ properties[indicator].isPercentage }
          description ={ properties[indicator].description }
          isDirectionDown={ !properties[indicator].isDirectionUp }
          isDollar={ properties[indicator].isDollar }
          {... indicatorsSpecialProp[indicator]}
        />
      );
      return <div className={ indiStyle.locals.row } key={group}>
        { indicatorsItems }
      </div>
    });
    return <div>
      <Page popup={ isPopupMode() } width={isPopupMode() ? 'initial' : '1051px'}>
        <Title title="Metrics" subTitle="Marketing is great, but without measuring the impact on your metrics, there is no real point in it." />
        <div className={ this.classes.error }>
          <label hidden={ !this.state.serverDown }> It look's like our server is down... :( <br/> Please contact our support. </label>
        </div>
        <FacebookAutomaticPopup hidden={ !this.state.showFacebookPopup } setDataAsState={ this.props.setDataAsState } close={ ()=>{ this.setState({showFacebookPopup: false}) }}/>
        <TwitterAutomaticPopup hidden={ !this.state.showTwitterPopup } setDataAsState={ this.props.setDataAsState } close={ ()=>{ this.setState({showTwitterPopup: false}) }}/>
        <CRMPopup hidden={ !this.state.showCRMPopup } close={ ()=>{ this.setState({showCRMPopup: false}) } } setDataAsState={ this.props.setDataAsState } updateState={ this.updateState } salesforceAuto={this.props.salesforceAuto} hubspotAuto={this.props.hubspotAuto}/>
        <AnalyticsPopup hidden={ !this.state.showAnalyticsPopup } close={ ()=>{ this.setState({showAnalyticsPopup: false}) } } setDataAsState={ this.props.setDataAsState } googleAuto={this.props.googleAuto}/>
        <FinancePopup hidden={ !this.state.showFinancePopup } close={ ()=>{ this.setState({showFinancePopup: false}) } } setDataAsState={ this.props.setDataAsState } googleSheetsAuto={this.props.googleSheetsAuto}/>
        <SocialPopup hidden={ !this.state.showSocialPopup } close={ ()=>{ this.setState({showSocialPopup: false}) } } setDataAsState={ this.props.setDataAsState }/>
        <Loading hidden={ !this.state.loading }/>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            { page }
          </div>

          { isPopupMode() ?

            <div className={ this.classes.colRight }>
              <div className={ this.classes.row }>
                <ProfileProgress progress={ 101 } image={
                  require('assets/flower/5.png')
                }
                                 text="Seems you got some new super powers. Now the journey for GROWTH really begins!"/>
              </div>
              {/**
               <div className={ this.classes.row }>
               <ProfileInsights />
               </div>
               **/}
            </div>

            : null }
        </div>

        { isPopupMode() ?

          <div className={ this.classes.footer }>
            <BackButton onClick={() => {
              this.props.updateUserMonthPlan({actualIndicators: this.props.actualIndicators}, this.props.region, this.props.planDate)
                .then(() => {
                  history.push('/preferences');
                });
            }} />
            <div style={{ width: '30px' }} />
            <PlanButton onClick={() => {
              this.props.updateUserMonthPlan({actualIndicators: this.props.actualIndicators}, this.props.region, this.props.planDate)
                .then(() => {
                  history.push('/plan');
                });
            }} />
          </div>

          :
          <div className={ this.classes.footer }>
            <SaveButton onClick={() => {
              this.setState({saveFail: false, saveSuccess: false});
              this.props.updateUserMonthPlan({actualIndicators: this.props.actualIndicators}, this.props.region, this.props.planDate)
                .then(() => {
                  this.setState({saveSuccess: true});
                })
                .catch(() => {
                  this.setState({saveFail: true});
                });
            }} success={ this.state.saveSuccess } fail={ this.state.saveFail }/>
          </div>
        }
      </Page>
    </div>
  }
}