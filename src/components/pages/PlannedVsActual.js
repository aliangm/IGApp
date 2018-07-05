import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import Title from 'components/onboarding/Title';
import MultiRow from 'components/MultiRow';
import Select from 'components/controls/Select';
import SaveButton from 'components/pages/profile/SaveButton';
import Button from 'components/controls/Button';
import Textfield from 'components/controls/Textfield';
import style from 'styles/plan/planned-actual-tab.css';
import planStyles from 'styles/plan/plan.css';
import { parsePlannedVsActual } from 'data/parsePlannedVsActual';
import Paging from 'components/Paging';
import { getTitle } from 'components/utils/channels';
import { formatChannels } from 'components/utils/channels';

export default class PlannedVsActual extends Component {

  style = style;
  styles = [planStyles];

  static defaultProps = {
    planUnknownChannels: [],
    approvedBudgets: [],
    knownChannels: {},
    unknownChannels: {},
    hoverRow: void 0,
    month: 0,
  };

  constructor(props) {
    super(props);
    this.state = props;

    this.keys = [''];
    this.pagingUpdateState = this.pagingUpdateState.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.updating) {
      this.setState(nextProps);
    }
  }

  pagingUpdateState(data) {
    this.setState({
      planDate: data.planDate,
      region: data.region,
      knownChannels: data.actualChannelBudgets && data.actualChannelBudgets.knownChannels || {},
      unknownChannels: data.actualChannelBudgets && data.actualChannelBudgets.unknownChannels || {},
      approvedBudgets: data.approvedBudgets || [],
      planUnknownChannels: data.unknownChannels || [],
    });
  }

  addChannel(event) {
    if (!event){
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
          var alreadyExist = Object.keys(this.state.approvedBudgets[0]);
          alreadyExist = alreadyExist.concat(Object.keys(this.state.knownChannels), Object.keys(this.state.unknownChannels));
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

  updateActual(key, value){
    const title = getTitle(key);
    if (!title){
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
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    var planDate = this.state.planDate ? this.state.planDate .split("/") : null;
    if (planDate) {
      var date = new Date(planDate[1], planDate[0] - 1);
      dates.push(monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2));
      return dates;
    }
    else return [];
  }

  render() {
    let month;
    let headRow;
    let rows;
    let channelOptions = [];
    this.keys = this.getDates();
    month = this.keys[this.state.month];
    const data = parsePlannedVsActual(this.state.approvedBudgets[0] || {}, this.state.planUnknownChannels[0] || {}, this.state.knownChannels, this.state.unknownChannels);
    if (data) {
      rows = data.map((item, i) => {
        return this.getTableRow(null, [
          item.channel,
          '$' + item.planned.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          <div className={ this.classes.cellItem }>
            <Textfield style={{
              minWidth: '72px'
            }} value={ '$' + item.updatedSpent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') } onChange={(e) => {
              let value = parseInt(e.target.value.replace(/^\$/, '').replace(',','')) || '';
              this.updateActual(item.key, value);
            }}/>
          </div>
        ], {
          key: month + i
        });
      });
    }

    headRow = this.getTableRow(null, [
      'Channels',
      'Planned',
      'Actual'
    ], {
      className: this.classes.headRow
    });

    channelOptions = formatChannels();

    let preventDuplicates = (value) => {
      if (value.options) {
        value.options.map(preventDuplicates);
      }
      else {
        value.disabled = Object.keys(this.state.knownChannels).includes(value.value) || Object.keys(this.state.approvedBudgets[0] || {}).includes(value.value);
        return value;
      }
    };

    channelOptions.map(preventDuplicates);

    return <div>
      <Page>
        <Title title="Planned VS Actual" subTitle="It is very important to keep the data credibility. To optimize your marketing planning every step of the way, InfiniGrow needs to know exactly what your actual marketing investments were (even if they aren’t 1:1 as recommended)."/>
        <div className={ planStyles.locals.title }>
          <Paging month={ this.state.planDate } pagingUpdateState={ this.pagingUpdateState } region={ this.state.region }/>
        </div>
        <div className={ planStyles.locals.innerBox }>
          <div className={ this.classes.wrap } ref="wrap">
            <div className={ this.classes.box }>
              <table className={ this.classes.table }>
                {/*<col style={{ width: '50%' }} />
                 <col style={{ width: '25%' }} />
                 <col style={{ width: '25%' }} />*/}
                <thead>
                { headRow }
                </thead>
                <tbody className={ this.classes.tableBody }>
                { rows }
                </tbody>
              </table>
            </div>
            <div className={ this.classes.bottom }>
              <MultiRow numOfRows={1} maxNumOfRows={1} >
                {({index, data, update, removeButton}) => {
                  return <div style={{
                    paddingBottom: '25px',
                    width: '460px'
                  }} className={ this.classes.channelsRow }>
                    <Select
                      className={ this.classes.channelsSelect }
                      selected={ -1 }
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
                      onChange={ this.addChannel.bind(this) }
                      label={ `Add a channel` }
                      labelQuestion={ [''] }
                      description={ ['Are there any channels you invested in the last month that weren’t recommended by InfiniGrow? It is perfectly fine; it just needs to be validated so that InfiniGrow will optimize your planning effectively.\nPlease choose only a leaf channel (a channel that has no deeper hierarchy under it). If you can’t find the channel you’re looking for, please choose “other” at the bottom of the list, and write the channel name/description clearly.']}
                    />
                  </div>
                }}
              </MultiRow>
              { this.state.showText ?
                <div className={ this.classes.channelsRow }>
                  <Textfield style={{
                    width: '292px'
                  }}  onChange={(e) => {
                    this.addOtherChannel(e);
                  }}/>
                  <Button type="primary2" style={{
                    width: '72px',
                    margin: '0 20px'
                  }} onClick={() => {
                    this.addChannel();
                  }}> Enter
                  </Button>
                </div>
                : null }
              <div className={ this.classes.footer } style={{ marginTop: '150px' }}>
                <SaveButton onClick={() => {
                  this.setState({saveFail: false, saveSuccess: false, updating: true}, () => {
                    this.state.updateUserMonthPlan({actualChannelBudgets: {knownChannels: this.state.knownChannels, unknownChannels: this.state.unknownChannels}}, this.state.region, this.state.planDate, true)
                      .then((data) => {
                        this.setState({updating: false});
                        this.pagingUpdateState(data);
                      });
                    this.setState({saveSuccess: true});
                    if (!this.props.userAccount.steps || !this.props.userAccount.steps.plannedVsActual) {
                      this.props.updateUserAccount({'steps.plannedVsActual': true});
                    }
                  });
                }} success={ this.state.saveSuccess} fail={ this.state.saveFail }/>
              </div>
            </div>
          </div>
        </div>
      </Page>
    </div>
  }

  getTableRow(title, items, props) {
    return <tr {... props}>
      { title != null ?
        <td className={ this.classes.titleCell }>{ this.getCellItem(title) }</td>
        : null }
      {
        items.map((item, i) => {
          return <td className={ this.classes.valueCell } key={ i }>{
            this.getCellItem(item)
          }</td>
        })
      }
    </tr>
  }

  getCellItem(item) {
    let elem;

    if (typeof item !== 'object' ) {
      elem = <div className={ this.classes.cellItem }>{ item }</div>
    } else {
      elem = item;
    }

    return elem;
  }
}