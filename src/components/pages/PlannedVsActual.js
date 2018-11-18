import React from 'react';
import Component from 'components/Component';
import MultiRow from 'components/MultiRow';
import Select from 'components/controls/Select';
import SaveButton from 'components/pages/profile/SaveButton';
import Button from 'components/controls/Button';
import Textfield from 'components/controls/Textfield';
import style from 'styles/plan/planned-actual-tab.css';
import budgetsStyle from 'styles/plan/budget-table.css';
import planStyles from 'styles/plan/plan.css';
import {parsePlannedVsActual} from 'data/parsePlannedVsActual';
import Paging from 'components/Paging';
import {getTitle, isUnknownChannel} from 'components/utils/channels';
import {formatChannels} from 'components/utils/channels';
import {formatBudget} from 'components/utils/budget';
import sumBy from 'lodash/sumBy';
import icons from 'styles/icons/plan.css';
import {getCommitedBudgets} from 'components/utils/budget';
import {extractNumber} from 'components/utils/utils';
import Table from 'components/controls/Table';

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
    const committedBudgets = this.props.calculatedData.committedBudgets;
    this.state = {...props, committedBudgets};

    this.keys = [''];
    this.pagingUpdateState = this.pagingUpdateState.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.updating) {
      const committedBudgets = this.props.calculatedData.committedBudgets;
      this.setState({...nextProps, committedBudgets});
    }
  }

  pagingUpdateState(data) {
    const committedBudgets = getCommitedBudgets(data.planBudgets);
    this.setState({
      planDate: data.planDate,
      region: data.region,
      knownChannels: data.actualChannelBudgets && data.actualChannelBudgets.knownChannels || {},
      unknownChannels: data.actualChannelBudgets && data.actualChannelBudgets.unknownChannels || {},
      committedBudgets: committedBudgets || [],
      planUnknownChannels: data.unknownChannels || []
    });
  }

  addChannel(event) {
    if (!event) {
      var update = this.state.unknownChannels;
      update[this.state.otherChannel] = 0;
      this.setState({
        unknownChannels: update,
        showText: false,
        otherChannel: ''
      });
    }
    else {
      if (typeof event.value === 'string') {
        if (event.value == 'OTHER') {
          this.setState({showText: true});
        }
        else {
          var alreadyExist = Object.keys(this.state.committedBudgets[0]);
          alreadyExist =
            alreadyExist.concat(Object.keys(this.state.knownChannels), Object.keys(this.state.unknownChannels));
          if (alreadyExist.indexOf(event.value) === -1) {
            var update = this.state.knownChannels;
            update[event.value] = 0;
            this.setState({knownChannels: update});
          }
        }
      }
    }
  }

  addOtherChannel(e) {
    this.setState({otherChannel: e.target.value});
  }

  updateActual(key, value) {
    const title = getTitle(key);
    if (!title) {
      let update = this.state.unknownChannels;
      update[key] = value;
      this.setState({unknownChannels: update});
    }
    else {
      let update = this.state.knownChannels;
      update[key] = value;
      this.setState({knownChannels: update});
    }
  }

  getDates = () => {
    var dates = [];
    var monthNames = [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct',
      'Nov', 'Dec'
    ];
    var planDate = this.state.planDate ? this.state.planDate.split('/') : null;
    if (planDate) {
      var date = new Date(planDate[1], planDate[0] - 1);
      dates.push(monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2));
      return dates;
    }
    else {
      return [];
    }
  };

  getRowForData = (data, key, month, isTotalRow) => {
    const actualText = formatBudget(data.actual);

    return {
      items: [
        <div className={this.classes.cellItem}>
          {!isTotalRow
            ? <div className={budgetsStyle.locals.rowIcon}
                   data-icon={!isUnknownChannel(data.key) ? `plan:${data.key}` : 'plan:other'}/>
            : null
          }
          <div className={this.classes.channelName}>{data.channel}</div>
          {data.isAutomatic ? <div className={this.classes.automaticLabel}>Automatic</div> : null}
        </div>,
        '$' + data.planned.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        <div className={this.classes.cellItem}>
          {isTotalRow
            ? <div className={this.classes.actualText} style={{
              minWidth: '72px',
              width: '50%'
            }}>
              {actualText}
            </div>
            : <Textfield style={{
              minWidth: '72px',
              width: '50%'
            }} value={actualText} onChange={(e) => {
              this.updateActual(data.key, extractNumber(e.target.value));
            }} disabled={data.isAutomatic}/>
          }

          {this.props.planDate === this.state.planDate
            ? <div className={this.classes.expected} style={isTotalRow ? null : {color: '#b2bbd5'}}>
              Expected: {formatBudget(Math.round(data.actual / this.props.calculatedData.extarpolateRatio))}
            </div>
            : null
          }
        </div>,
        formatBudget(data.planned - data.actual, true)
      ]
    };
  };

  render() {
    let month;
    let headRow;
    let rows;
    let footRow;
    let channelOptions = [];
    this.keys = this.getDates();
    month = this.keys[this.state.month];
    const data = parsePlannedVsActual(this.state.committedBudgets[0] || {},
      this.state.planUnknownChannels[0] || {},
      this.state.knownChannels,
      this.state.unknownChannels,
      this.props.calculatedData.integrations
    );
    if (data) {

      const totalData = {
        key: 'total',
        channel: 'Total',
        isAutomatic: false,
        planned: sumBy(data, item => item.planned),
        actual: sumBy(data, item => item.actual)
      };

      footRow = this.getRowForData(totalData, '-2', month, true);

      rows = data.map((item, i) => this.getRowForData(item, i, month, false));
    }

    headRow = [
      'Channels',
      'Planned Budget',
      'Actual Cost',
      'Difference'
    ];

    channelOptions = formatChannels(channel => Object.keys(this.state.knownChannels).includes(channel) || Object.keys(this.state.committedBudgets[0] || {}).includes(channel));

    return <div>
      <div className={this.classes.wrap}>
        <div className={this.classes.innerBox}>
          <div className={planStyles.locals.title}>
            <Paging month={this.state.planDate} pagingUpdateState={this.pagingUpdateState} region={this.state.region}/>
          </div>
          <div className={planStyles.locals.innerBox}>
            <Table headRowData={{items: headRow}}
                   rowsData={rows}
                   footRowData={footRow}
                   showFootRowOnHeader={true}/>
            <div>
              <div className={this.classes.bottom}>
                <MultiRow numOfRows={1} maxNumOfRows={1}>
                  {({index, data, update, removeButton}) => {
                    return <div style={{
                      paddingBottom: '25px',
                      width: '460px'
                    }} className={this.classes.channelsRow}>
                      <Select
                        className={this.classes.channelsSelect}
                        selected={-1}
                        select={{
                          menuTop: true,
                          name: 'channels',
                          onChange: (selected) => {
                            update({
                              selected: selected
                            });
                          },
                          options: channelOptions
                        }}
                        onChange={this.addChannel.bind(this)}
                        label={`Add a channel`}
                        labelQuestion={['']}
                        description={['Are there any channels you invested in the last month that weren’t recommended by InfiniGrow? It is perfectly fine; it just needs to be validated so that InfiniGrow will optimize your planning effectively.\nPlease choose only a leaf channel (a channel that has no deeper hierarchy under it). If you can’t find the channel you’re looking for, please choose “other” at the bottom of the list, and write the channel name/description clearly.']}
                      />
                    </div>;
                  }}
                </MultiRow>
                {this.state.showText ?
                  <div className={this.classes.channelsRow}>
                    <Textfield style={{
                      width: '292px'
                    }} onChange={(e) => {
                      this.addOtherChannel(e);
                    }}/>
                    <Button type="primary" style={{
                      width: '72px',
                      margin: '0 20px'
                    }} onClick={() => {
                      this.addChannel();
                    }}> Enter
                    </Button>
                  </div>
                  : null}
                <div className={this.classes.footer} style={{marginTop: '150px'}}>
                  <SaveButton onClick={() => {
                    this.setState({saveFail: false, saveSuccess: false, updating: true}, () => {
                      this.state.updateUserMonthPlan({
                        actualChannelBudgets: {
                          knownChannels: this.state.knownChannels,
                          unknownChannels: this.state.unknownChannels
                        }
                      }, this.state.region, this.state.planDate, true)
                        .then((data) => {
                          this.setState({updating: false});
                          this.pagingUpdateState(data);
                        });
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