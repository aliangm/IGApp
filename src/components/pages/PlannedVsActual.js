import React from 'react';
import Component from 'components/Component';
import SaveButton from 'components/pages/profile/SaveButton';
import Textfield from 'components/controls/Textfield';
import style from 'styles/plan/planned-actual-tab.css';
import budgetsStyle from 'styles/plan/budget-table.css';
import planStyles from 'styles/plan/plan.css';
import Paging from 'components/Paging';
import {getChannelIcon, getNickname as getChannelNickname, isUnknownChannel} from 'components/utils/channels';
import {formatBudget, formatNumber, getCommitedBudgets} from 'components/utils/budget';
import sumBy from 'lodash/sumBy';
import merge from 'lodash/merge';
import icons from 'styles/icons/plan.css';
import {extractNumber, newFunnelMapping} from 'components/utils/utils';
import Table from 'components/controls/Table';
import ChannelsSelect from 'components/common/ChannelsSelect';
import isNil from 'lodash/isNil';
import get from 'lodash/get';
import set from 'lodash/set';
import {getNickname as getIndicatorNickname} from 'components/utils/indicators';

const channelPlatformMapping = {
  'advertising_socialAds_facebookAdvertising': 'isFacebookAdsAuto',
  'advertising_displayAds_googleAdwords': 'isAdwordsAuto',
  'advertising_searchMarketing_SEM_googleAdwords': 'isAdwordsAuto',
  'advertising_socialAds_linkedinAdvertising': 'isLinkedinAdsAuto',
  'advertising_socialAds_twitterAdvertising': 'isTwitterAdsAuto'
};

export default class PlannedVsActual extends Component {

  style = style;
  styles = [planStyles, budgetsStyle, icons];

  static defaultProps = {
    planUnknownChannels: [],
    committedBudgets: [],
    knownChannels: {},
    unknownChannels: {},
    hoverRow: void 0,
    month: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      month: 0
    };
  }

  getCurrentMonthIndex = () => this.props.calculatedData.lastYearHistoryData.historyDataLength;

  componentDidMount() {
    // Set the default month to current
    this.setState({month: this.getCurrentMonthIndex()});
  }

  getObjectToUpdate(currentMonthObject, historyData, historyDataKey) {
    const isCurrentMonth = this.state.month === this.props.calculatedData.lastYearHistoryData.historyDataLength;
    if (isCurrentMonth) {
      return currentMonthObject;
    }
    else {
      return get(historyData, [historyDataKey, this.state.month]);
    }
  }

  addChannel = (event) => {
    const channel = event.value;
    const actualChannelBudgets = {...this.props.actualChannelBudgets};
    const historyData = {...this.props.historyData};
    const objectToUpdate = this.getObjectToUpdate(actualChannelBudgets, historyData, 'actualChannelBudgets');
    set(objectToUpdate, ['knownChannels', channel], 0);
    this.props.updateState({actualChannelBudgets, historyData});
  };

  addOtherChannel = ({value: channel}) => {
    this.props.addUnknownChannel(channel);

    const actualChannelBudgets = {...this.props.actualChannelBudgets};
    const historyData = {...this.props.historyData};
    const objectToUpdate = this.getObjectToUpdate(actualChannelBudgets, historyData, 'actualChannelBudgets');
    set(objectToUpdate, ['unknownChannels', channel], 0);
    this.props.updateState({actualChannelBudgets, historyData});

  };

  updateActual = (channel, value) => {
    const actualChannelBudgets = {...this.props.actualChannelBudgets};
    const historyData = {...this.props.historyData};
    const objectToUpdate = this.getObjectToUpdate(actualChannelBudgets, historyData, 'actualChannelBudgets');
    if (isUnknownChannel(channel)) {
      set(objectToUpdate, ['unknownChannels', channel], value);
    }
    else {
      set(objectToUpdate, ['knownChannels', channel], value);
    }
    this.props.updateState({actualChannelBudgets, historyData});
  };

  setMonth = diff => {
    const maxMonth = this.getCurrentMonthIndex();
    let newMonth = this.state.month + diff;
    if (newMonth < 0) {
      newMonth = 0;
    }
    if (newMonth > maxMonth) {
      newMonth = maxMonth;
    }
    this.setState({month: newMonth});
  };

  updateImpact = (channel, indicator, type, value) => {
    const channelsImpact = {...this.props.channelsImpact};
    const historyData = {...this.props.historyData};
    const objectToUpdate = this.getObjectToUpdate(channelsImpact, historyData, 'channelsImpact');
    set(objectToUpdate, [channel, indicator, type], value);
    this.props.updateState({channelsImpact, historyData});
  };

  render() {
    const {month} = this.state;
    const {calculatedData: {objectives: {funnelFirstObjective}, extarpolateRatio, integrations, lastYearHistoryData: {historyDataLength, months, historyDataWithCurrentMonth: {channelsImpact, planBudgets, unknownChannels: planUnknownChannels, actualChannelBudgets, indicators, attribution}}}} = this.props;
    const attributionChannelsImpact = get(attribution, [month, 'channelsImpact'], {});

    const {knownChannels = {}, unknownChannels = {}} = actualChannelBudgets[month];

    const isCurrentMonth = month === historyDataLength;

    const actuals = merge({}, knownChannels, unknownChannels);
    const planned = merge({}, getCommitedBudgets(planBudgets)[month], planUnknownChannels[month]);
    const channels = merge({}, planned, actuals);
    const parsedChannels = Object.keys(channels).map(channel => {
      const actual = actuals[channel];
      const isActualNotEmpty = !isNil(actual);
      const plan = planned[channel] || 0;
      const channelImpact = get(channelsImpact, [month, channel], {});
      const {planned: plannedFunnel = 0, actual: actualFunnel = 0} = channelImpact[funnelFirstObjective] || {};
      const attributedFunnel = get(attributionChannelsImpact, [newFunnelMapping[funnelFirstObjective], channel], 0);
      const {planned: plannedUsers = 0, actual: actualUsers = 0} = channelImpact.newUsers || {};
      const attributedUsers = get(attributionChannelsImpact, ['users', channel], 0);
      return {
        channel,
        isActualNotEmpty,
        actual: isActualNotEmpty ? actual : plan,
        planned: plan,
        plannedFunnel,
        actualFunnel: actualFunnel || attributedFunnel,
        plannedUsers,
        actualUsers: actualUsers || attributedUsers
      };
    });

    const getTextfieldItem = (value, onChange, disabled = false) =>
      <div className={this.classes.cellItem}>
        <Textfield style={{
          width: '84px'
        }} value={value} onChange={onChange} disabled={disabled}/>
      </div>;

    const extrapolatedValue = value => Math.round(value / extarpolateRatio);

    const rows = parsedChannels.map(item => {
      const {actual, planned, isActualNotEmpty, channel, plannedFunnel, actualFunnel, plannedUsers, actualUsers} = item;
      const isAutomatic = integrations[channelPlatformMapping[channel]];
      return {
        items: [
          <div className={this.classes.cellItem}>
            <div className={budgetsStyle.locals.rowIcon} data-icon={getChannelIcon(channel)}/>
            <div className={this.classes.channelName}>{getChannelNickname(channel)}</div>
            {isAutomatic ? <div className={this.classes.automaticLabel}>Auto</div> : null}
          </div>,
          formatBudget(planned),
          getTextfieldItem(formatBudget(actual), e => this.updateActual(channel, extractNumber(e.target.value)), isAutomatic),
          formatBudget(planned - actual, true),
          isCurrentMonth ?
            formatBudget(isActualNotEmpty ? extrapolatedValue(actual) : actual)
            : '-',
          getTextfieldItem(formatNumber(plannedFunnel), e => this.updateImpact(channel, funnelFirstObjective, 'planned', extractNumber(e.target.value))),
          getTextfieldItem(formatNumber(actualFunnel), e => this.updateImpact(channel, funnelFirstObjective, 'actual', extractNumber(e.target.value))),
          formatNumber(plannedFunnel - actualFunnel),
          isCurrentMonth ? formatNumber(extrapolatedValue(actualFunnel)) : '-',
          getTextfieldItem(formatNumber(plannedUsers), e => this.updateImpact(channel, 'newUsers', 'planned', extractNumber(e.target.value))),
          getTextfieldItem(formatNumber(actualUsers), e => this.updateImpact(channel, 'newUsers', 'actual', extractNumber(e.target.value))),
          formatNumber(plannedUsers - actualUsers),
          isCurrentMonth ? formatNumber(extrapolatedValue(actualUsers)) : '-'
        ]
      };
    });

    const firstFunnelObjectiveNickname = getIndicatorNickname(funnelFirstObjective);
    const userNickname = getIndicatorNickname('newUsers');
    const headRow = [
      'Channel',
      'Planned Budget',
      'Actual Cost',
      'Plan vs Actual',
      'Pacing for',
      <div data-tip="what's your expectation?">Planned {firstFunnelObjectiveNickname}</div>,
      `Actual ${firstFunnelObjectiveNickname}`,
      'Plan vs Actual',
      'Pacing for',
      <div data-tip="what's your expectation?">Planned {userNickname}</div>,
      `Actual ${userNickname}`,
      'Plan vs Actual',
      'Pacing for'
    ];

    const totalPlannedFunnel = sumBy(parsedChannels, 'plannedFunnel');
    const totalActualFunnel = indicators[month][funnelFirstObjective];
    const totalPlannedUsers = sumBy(parsedChannels, 'plannedUsers');
    const totalActualUsers = indicators[month].newUsers;
    const footRow = [
      'Total',
      formatBudget(sumBy(parsedChannels, 'planned')),
      formatBudget(sumBy(parsedChannels, 'actual')),
      formatBudget(sumBy(parsedChannels, item => item.planned - item.actual, true)),
      isCurrentMonth ? formatBudget(sumBy(parsedChannels, item => item.isActualNotEmpty ? extrapolatedValue(item.actual) : item.actual)) : '-',
      formatNumber(totalPlannedFunnel),
      formatNumber(totalActualFunnel),
      formatNumber(totalPlannedFunnel - totalActualFunnel),
      isCurrentMonth ? formatNumber(sumBy(parsedChannels, item => extrapolatedValue(item.actualFunnel))) : '-',
      formatNumber(totalPlannedUsers),
      formatNumber(totalActualUsers),
      formatNumber(totalPlannedUsers - totalActualUsers),
      isCurrentMonth ? formatNumber(sumBy(parsedChannels, item => extrapolatedValue(item.actualUsers))) : '-'
    ];

    return <div>
      <div className={this.classes.wrap}>
        <div className={this.classes.innerBox}>
          <div className={planStyles.locals.title}>
            <Paging title={months[month]} onBack={() => this.setMonth(-1)} onNext={() => this.setMonth(1)}/>
          </div>
          <div className={planStyles.locals.innerBox}>
            <Table headRowData={{items: headRow}}
                   rowsData={rows}
                   footRowData={{items: footRow}}
                   showFootRowOnHeader={true}
                   valueCellClassName={this.classes.valueCell}
                   titleCellClassName={this.classes.titleCell}/>
            <div>
              <div className={this.classes.bottom}>
                <div style={{
                  paddingBottom: '25px',
                  width: '460px'
                }} className={this.classes.channelsRow}>
                  <ChannelsSelect className={this.classes.channelsSelect}
                                  withOtherChannels={true}
                                  selected={-1}
                                  isChannelDisabled={channel => Object.keys(channels).includes(channel)}
                                  onChange={this.addChannel}
                                  onNewOptionClick={this.addOtherChannel}
                                  label={`Add a channel`}
                                  labelQuestion={['']}
                                  description={['Are there any channels you invested in the last month that weren’t recommended by InfiniGrow? It is perfectly fine; it just needs to be validated so that InfiniGrow will optimize your planning effectively.\nPlease choose only a leaf channel (a channel that has no deeper hierarchy under it). If you can’t find the channel you’re looking for, please choose “other” at the bottom of the list, and write the channel name/description clearly.']}/>
                </div>
                <div className={this.classes.footer} style={{marginTop: '150px'}}>
                  <SaveButton onClick={() => {
                    this.setState({saveFail: false, saveSuccess: false}, () => {
                      this.props.updateUserMonthPlan({
                        actualChannelBudgets: this.props.actualChannelBudgets,
                        historyData: this.props.historyData,
                        channelsImpact: this.props.channelsImpact
                      }, this.props.region, this.props.planDate);
                      this.setState({saveSuccess: true});
                    });
                  }} success={this.state.saveSuccess} fail={this.state.saveFail}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}