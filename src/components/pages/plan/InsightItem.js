import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/insight-item.css';
import Button from 'components/controls/Button';
import ReactTooltip from 'react-tooltip';
import {formatBudget} from 'components/utils/budget';
import groupBy from 'lodash/groupBy';
import {getNickname as getIndicatorNickname} from 'components/utils/indicators';

export default class InsightItem extends Component {

  style = style;

  static propTypes = {
    fromChannels: PropTypes.arrayOf(PropTypes.shape({
      fromBudget: PropTypes.number.isRequired,
      toBudget: PropTypes.number.isRequired,
      channel: PropTypes.any.isRequired,
      month: PropTypes.any.isRequired
    })).isRequired,
    toChannels: PropTypes.arrayOf(PropTypes.shape({
      fromBudget: PropTypes.number.isRequired,
      toBudget: PropTypes.number.isRequired,
      channel: PropTypes.any.isRequired,
      month: PropTypes.any.isRequired
    })).isRequired,
    forecasting: PropTypes.arrayOf(PropTypes.shape({
      committed: PropTypes.number.isRequired,
      ifApproved: PropTypes.number.isRequired,
      indicator: PropTypes.any.isRequired,
      month: PropTypes.any.isRequired
    })).isRequired,
    onCommit: PropTypes.func.isRequired,
    onDecline: PropTypes.func.isRequired
  };

  static defaultProps = {
    fromChannels: [{
      fromBudget: 1000,
      toBudget: 2000,
      channel: 'web_landingPages',
      month: 'APR 18'
    },
      {
        fromBudget: 1000,
        toBudget: 2000,
        channel: 'web_landingPages',
        month: 'APR 18'
      }
    ],
    toChannels: [{
      fromBudget: 1000,
      toBudget: 2000,
      channel: 'web_landingPages',
      month: 'APR 18'
    },
      {
        fromBudget: 1000,
        toBudget: 2000,
        channel: 'web_landingPages',
        month: 'APR 18'
      }
    ],
    forecasting: [{
      committed: 40,
      ifApproved: 50,
      indicator: 'MQL',
      month: 'APR 18'
    },
      {
        committed: 40,
        ifApproved: 50,
        indicator: 'opps',
        month: 'APR 18'
      },
      {
        committed: 40,
        ifApproved: 50,
        indicator: 'opps',
        month: 'MAY 18'
      }
    ]
  };

  getTooltip = () => {
    const forecastingData = groupBy(this.props.forecasting, (item) => item.month);
    return Object.keys(forecastingData).map(month => {
      const monthIndicators = forecastingData[month]
        .map(item =>
          `<div style="text-align: left; font-size: 10px; font-weight: 500">
       ${getIndicatorNickname(item.indicator)} <span style="color: #24b10e">${Math.round(item.ifApproved / item.committed * 100)}%</span> (+${item.ifApproved - item.committed})
        </div><br/>`
        );
      return `<div style="text-align: center; font-size: 10px; font-weight: 500">
        ${month}
        </div><br/>
      <div>
      ${monthIndicators.join('')}
    </div>`;
    }).join('');
  };

  render() {
    const {fromChannels, toChannels} = this.props;
    const fromChannelsItems = fromChannels.map((item, index) => <ChannelItem key={index} {...item}/>);
    const toChannelsItems = toChannels.map((item, index) => <ChannelItem key={index} {...item}/>);

    return <div>
      <ReactTooltip place='bottom' effect='solid' id='insightItem' html={true}/>
      <div className={this.classes.frame}>
        <div className={this.classes.title}>
          Optimization Opportunity
          <div className={this.classes.forecastingIcon} data-tip={this.getTooltip()} data-for='insightItem'/>
        </div>
        <div className={this.classes.inner}>
          <div>
            {fromChannelsItems}
          </div>
          <div className={this.classes.arrowIcon}/>
          <div>
            {toChannelsItems}
          </div>
        </div>
      </div>
      <div className={this.classes.buttons}>
        <Button type='reverse2' icon='buttons:approve' style={{width: '100px'}}>
          Commit
        </Button>
        <Button type='warning' icon='buttons:decline' style={{width: '100px', marginLeft: '20px'}}>
          Decline
        </Button>
      </div>
    </div>;
  }
}

export class ChannelItem extends Component {

  style = style;

  render() {
    const {fromBudget, toBudget, channel, month} = this.props;
    return <div style={{display: 'inline-flex'}}>
      <div className={this.classes.channelItem}>
        <div className={this.classes.date}>
          {month}
        </div>
        <div className={this.classes.channelIcon} data-icon={`plan:${channel}`}/>
        <div style={{display: 'flex'}}>
          <div className={this.classes.fromBudget}>
            {formatBudget(fromBudget)}
          </div>
          <div className={this.classes.shiftIcon}/>
          <div className={this.classes.toBudget}>
            {formatBudget(toBudget)}
          </div>
        </div>
      </div>
    </div>;
  }
}