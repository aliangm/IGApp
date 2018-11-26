import React from 'react';
import Component from 'components/Component';
import SaveButton from 'components/pages/profile/SaveButton';
import Button from 'components/controls/Button';
import Textfield from 'components/controls/Textfield';
import style from 'styles/plan/planned-actual-tab.css';
import budgetsStyle from 'styles/plan/budget-table.css';
import planStyles from 'styles/plan/plan.css';
import Paging from 'components/Paging';
import {getChannelIcon, getNickname as getChannelNickname, isUnknownChannel} from 'components/utils/channels';
import {formatBudget} from 'components/utils/budget';
import sumBy from 'lodash/sumBy';
import merge from 'lodash/merge';
import mapValues from 'lodash/mapValues';
import icons from 'styles/icons/plan.css';
import {extractNumber} from 'components/utils/utils';
import Table from 'components/controls/Table';
import ChannelsSelect from 'components/common/ChannelsSelect';
import isNil from 'lodash/isNil';

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

  componentDidMount() {
    // Set the default month to current
    this.setState({month: this.props.calculatedData.historyDataYear.months.length - 1});
  }

  addChannel = (event) => {
    this.setState({showText: false});
    const channel = event.value;
    if (channel === 'OTHER') {
      this.setState({showText: true});
    }
    else {
      const actualChannelBudgets = {...this.props.actualChannelBudgets};
      const {knownChannels = {}} = actualChannelBudgets;
      knownChannels[channel] = 0;
      this.props.updateState({actualChannelBudgets: {...actualChannelBudgets, knownChannels: knownChannels}});
    }
  };

  addOtherChannel = () => {
    const channel = this.state.otherChannel;
    this.props.addUnknownChannel(channel);

    const actualChannelBudgets = {...this.props.actualChannelBudgets};
    const {unknownChannels = {}} = actualChannelBudgets;
    unknownChannels[channel] = 0;
    this.props.updateState({actualChannelBudgets: {...actualChannelBudgets, unknownChannels: unknownChannels}});

  };

  updateActual = (channel, value) => {
    const actualChannelBudgets = {...this.props.actualChannelBudgets};
    const {unknownChannels = {}, knownChannels = {}} = actualChannelBudgets;
    if (isUnknownChannel(channel)) {
      unknownChannels[channel] = value;
    }
    else {
      knownChannels[channel] = value;
    }
    this.props.updateState({
      actualChannelBudgets: {
        ...actualChannelBudgets,
        knownChannels: knownChannels,
        unknownChannels: unknownChannels
      }
    });
  };

  setMonth = diff => {
    const maxMonth = this.props.calculatedData.historyDataYear.months.length - 1;
    let newMonth = this.state.month + diff;
    if (newMonth < 0) {
      newMonth = 0;
    }
    if (newMonth > maxMonth) {
      newMonth = maxMonth;
    }
    this.setState({month: newMonth});
  };

  render() {
    const {month} = this.state;
    const {calculatedData: {extarpolateRatio, integrations, historyDataYear: {months, historyDataWithCurrentMonth: {planBudgets, unknownChannels: planUnknownChannels, actualChannelBudgets}}}} = this.props;
    const {knownChannels = {}, unknownChannels = {}} = actualChannelBudgets[month];
    const actuals = merge({}, knownChannels, unknownChannels);
    const planned = merge({}, mapValues(planBudgets[month], 'committedBudget'), planUnknownChannels[month]);
    const channels = merge({}, planned, actuals);
    const parsedChannels = Object.keys(channels).map(channel => {
      const actual = actuals[channel];
      const isActualNotEmpty = !isNil(actual);
      const plan = planned[channel] || 0;
      return {
        channel,
        isActualNotEmpty,
        actual: isActualNotEmpty ? actual : plan,
        planned: plan
      };
    });

    const rows = parsedChannels.map(item => {
      const {actual, planned, isActualNotEmpty, channel} = item;
      const isAutomatic = integrations[channelPlatformMapping[channel]];
      return {
        items: [
          <div className={this.classes.cellItem}>
            <div className={budgetsStyle.locals.rowIcon} data-icon={getChannelIcon(channel)}/>
            <div className={this.classes.channelName}>{getChannelNickname(channel)}</div>
            {isAutomatic ? <div className={this.classes.automaticLabel}>Automatic</div> : null}
          </div>,
          formatBudget(planned),
          <div className={this.classes.cellItem}>
            <Textfield style={{
              minWidth: '72px',
              width: '50%'
            }} value={formatBudget(actual)} onChange={(e) => {
              this.updateActual(channel, extractNumber(e.target.value));
            }} disabled={isAutomatic}/>
          </div>,
          formatBudget(planned - actual, true),
          month === months.length - 1 ?
            formatBudget(isActualNotEmpty ? Math.round(actual / extarpolateRatio) : actual)
            : '-'
        ]
      };
    });

    const headRow = [
      'Channel',
      'Planned Budget',
      'Actual Cost to date',
      'Difference',
      'Pacing for'
    ];

    const footRow = [
      'Total',
      formatBudget(sumBy(parsedChannels, 'planned')),
      formatBudget(sumBy(parsedChannels, 'actual')),
      formatBudget(sumBy(parsedChannels, item => item.planned - item.actual, true)),
      month === months.length - 1 ? formatBudget(sumBy(parsedChannels, item => item.isActualNotEmpty ? Math.round(item.actual / extarpolateRatio) : item.actual)) : '-'
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
                   showFootRowOnHeader={true}/>
            <div>
              <div className={this.classes.bottom}>
                <div style={{
                  paddingBottom: '25px',
                  width: '460px'
                }} className={this.classes.channelsRow}>
                  <ChannelsSelect className={this.classes.channelsSelect}
                                  withOtherChannel={true}
                                  selected={-1}
                                  isChannelDisabled={channel => Object.keys(channels).includes(channel)}
                                  onChange={this.addChannel}
                                  label={`Add a channel`}
                                  labelQuestion={['']}
                                  description={['Are there any channels you invested in the last month that weren’t recommended by InfiniGrow? It is perfectly fine; it just needs to be validated so that InfiniGrow will optimize your planning effectively.\nPlease choose only a leaf channel (a channel that has no deeper hierarchy under it). If you can’t find the channel you’re looking for, please choose “other” at the bottom of the list, and write the channel name/description clearly.']}/>
                </div>
                {this.state.showText ?
                  <div className={this.classes.channelsRow}>
                    <Textfield style={{
                      width: '292px'
                    }} onChange={(e) => {
                      this.setState({otherChannel: e.target.value});
                    }}/>
                    <Button type="primary" style={{
                      width: '72px',
                      margin: '0 20px'
                    }} onClick={() => {
                      this.addOtherChannel();
                    }}> Enter
                    </Button>
                  </div>
                  : null}
                <div className={this.classes.footer} style={{marginTop: '150px'}}>
                  <SaveButton onClick={() => {
                    this.setState({saveFail: false, saveSuccess: false}, () => {
                      this.props.updateUserMonthPlan({
                        actualChannelBudgets: this.props.actualChannelBudgets,
                        namesMapping: this.props.namesMapping
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