import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/budget-table.css';
import {parseBudgets} from 'data/parseAnnualPlan';
import {formatBudget} from 'components/utils/budget';
import TableCell from 'components/pages/plan/TableCell';
import Popup from 'components/Popup';
import DeleteChannelPopup from 'components/pages/plan/DeleteChannelPopup';
import EditChannelNamePopup from 'components/pages/plan/EditChannelNamePopup';
import {ContextMenu, SubMenu, MenuItem} from 'react-contextmenu';
import {TextContent as PopupTextContent} from 'components/pages/plan/Popup';
import {getChannelsWithProps} from 'components/utils/channels';
import groupBy from 'lodash/groupBy';
import union from 'lodash/union';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';

const ROW_TYPE = {
  BOTTOM: 'bottom',
  REGULAR: 'regular',
  CATEGORY: 'category'
};

const COLLAPSE_OPTIONS = {
  COLLAPSE_ALL: 0,
  ONLY_CATEGORIES: 1,
  SHOW_ALL: 2
};

const MONTHS_TO_SHOW = 8;

export default class BudgetTable extends Component {

  style = style;

  static propTypes = {
    tableRef: PropTypes.func,
    firstColumnCell: PropTypes.func,
    dates: PropTypes.array,
    updateState: PropTypes.func,
    approveWholeChannel: PropTypes.func,
    declineWholeMonth: PropTypes.func,
    isEditMode: PropTypes.bool,
    isShowSecondaryEnabled: PropTypes.bool,
    isConstraitsEnabled: PropTypes.bool,
    data: PropTypes.array,
    editCommittedBudget: PropTypes.func,
    changeBudgetConstraint: PropTypes.func,
    deleteChannel: PropTypes.func
  };

  static defaultProps = {
    isEditMode: false,
    isShowSecondaryEnabled: true,
    isConstraitsEnabled: false,
    data: []
  };

  constructor(props) {
    super(props);

    this.state = {
      tableCollapsed: COLLAPSE_OPTIONS.SHOW_ALL,
      collapsed: {},
      draggableValues: []
    };
  }

  getMonthHeaders = () => {
    const currentMonth = parseInt(this.props.planDate.split('/')[0]);
    const headers = this.props.dates.slice(0, MONTHS_TO_SHOW).map((month, index) => {
      const events = this.props.events ?
        this.props.events
          .filter(event => {
            const eventMonth = parseInt(event.startDate.split('/')[1]);
            return (currentMonth + index) % 12 === eventMonth % 12;
          })
          .map((event, index) => {
            return <p key={index}>
              {event.link
                ? <a href={event.link} target="_blank">{event.eventName}</a>
                : event.eventName} {event.startDate} {event.location}
            </p>;
          })
        : null;
      return events.length > 0 ? <div style={{position: 'relative'}}>
          <div className={this.classes.tableButton} onClick={() => {
            this.setState({monthPopup: month});
          }}
               onMouseEnter={() => {
                 this.setState({monthPopupHover: month});
               }}
               onMouseLeave={() => {
                 this.setState({monthPopupHover: ''});
               }}>
            {month}</div>
          <Popup hidden={month !== this.state.monthPopup && month !== this.state.monthPopupHover}
                 className={this.classes.eventPopup}>
            <div className={popupStyle.locals.header}>
              <div className={popupStyle.locals.title}>
                {'Events - ' + month}
              </div>
              <div className={popupStyle.locals.close}
                   role="button"
                   onClick={() => {
                     this.setState({monthPopup: ''});
                   }}
              />
            </div>
            <PopupTextContent>
              {events}
            </PopupTextContent>
          </Popup>
        </div>
        :
        <td key={`head:${index}`}>{month}</td>;
    });
    return headers;
  };

  dragStart = (value) => {
    this.setState({draggableValue: value, isDragging: true});
  };

  commitDrag = () => {
    let value = parseInt(this.state.draggableValue.replace(/[-$,]/g, ''));

    this.state.draggableValues.forEach(({month, channel}) => {
      this.props.editCommitedBudget(month, channel, value);
    });

    this.setState({
      draggableValues: [],
      draggableValue: null,
      isDragging: false
    });
  };

  dragEnter = (month, channel) => {
    this.setState({
      draggableValues: [...this.state.draggableValues,
        {channel: channel, month: month}]
    });
  };

  getRows = (data) => {
    return union(Object.keys(data).map(category => this.getCategoryRows(category, data[category])));
  };

  getCategoryRows = (category, channels) => {
    const categoryData = this.sumChannels(channels);
    const categoryRow = this.getTableRow({channel: category, nickname: category, values: categoryData},
      ROW_TYPE.CATEGORY);

    return !this.state.collapsed[category] && this.state.tableCollapsed === COLLAPSE_OPTIONS.SHOW_ALL ?
      [categoryRow, ...channels.map((channel) => this.getTableRow(channel, ROW_TYPE.REGULAR))]
      : categoryRow;
  };

  approveMonthSuggestions = month => {
    const monthData = this.props.data[month];
    Object.keys(monthData).forEach(key => {
      //if undefined or null don't enter, any other option should enter
      if (monthData[key].secondaryBudget != null) {
        this.props.editCommittedBudget(month, key, monthData[key].secondaryBudget);
      }
    });
  };

  getTableRow = (data, rowType) => {
    const titleCellKey = ((rowType === ROW_TYPE.CATEGORY) ? 'category' : '') + data.channel;

    return <tr className={this.classes.tableRow} key={titleCellKey} data-row-type={rowType}>
      {this.getTitleCell(rowType, data)}

      {data.values.map((monthData, key) => {
        switch (rowType) {
          case(ROW_TYPE.REGULAR): {
            return <TableCell
              key={`${data.channel}:${key}`}
              primaryValue={monthData.primaryBudget}
              secondaryValue={this.props.isShowSecondaryEnabled
                ? monthData.secondaryBudget
                : null}
              isConstraint={monthData.isConstraint}
              isSoft={monthData.isSoft}
              constraintChange={(isConstraint, isSoft) => this.props.changeBudgetConstraint(
                key,
                data.channel,
                isConstraint,
                isSoft)}
              isEditMode={rowType === ROW_TYPE.REGULAR && this.props.isEditMode}
              onChange={(newValue) => this.props.editCommittedBudget(key, data.channel, newValue)}
              isConstraitsEnabled={rowType !== ROW_TYPE.CATEGORY && this.props.isConstraitsEnabled}
              dragEnter={() => this.dragEnter(key, data.channel)}
              commitDrag={this.commitDrag}
              dragStart={this.dragStart}
              isDragging={this.state.isDragging}
              approveSuggestion={() => this.props.editCommittedBudget(key, data.channel, monthData.secondaryBudget)}
              enableActionButtons={true}
            />;
          }
          case(ROW_TYPE.CATEGORY): {
            return <td className={this.classes.categoryCell}>${formatBudget(monthData.primaryBudget)}</td>;
          }
          case(ROW_TYPE.BOTTOM): {
            return <TableCell
              key={`${data.channel}:${key}`}
              primaryValue={monthData.primaryBudget}
              secondaryValue={this.props.isShowSecondaryEnabled
                ? monthData.secondaryBudget
                : null}
              isConstraitsEnabled={false}
              approveSuggestion={() => this.approveMonthSuggestions(key)}
              enableActionButtons={false}
            />;
          }
        }
      })}
    </tr>;
  };

  getTitleCell = (rowType, data) => {
    return <td className={this.classes.titleCell} data-category-row={rowType === ROW_TYPE.CATEGORY}>
      <div className={this.classes.rowTitle}>
        {rowType === ROW_TYPE.CATEGORY ?
          <div
            className={this.classes.rowArrowWrap}
            data-collapsed={this.state.collapsed[data.channel] ? true : null}
            onClick={() => {
              this.setState({
                collapsed: {
                  ...this.state.collapsed,
                  [data.channel]: !this.state.collapsed[data.channel]
                }
              });
            }}>
            <div className={this.classes.rowArrow}/>
          </div> : null}
        {this.props.isEditMode && rowType === ROW_TYPE.REGULAR ?
          <div>
            <div className={this.classes.editChannelNameWrapper}>
              <div className={this.classes.editChannelName} onClick={() => {
                this.setState({editChannelName: data.channel});
              }}/>
            </div>
            <div
              className={this.classes.rowDelete}
              onClick={() => this.setState({deletePopup: data.channel})}
            />
            <Popup hidden={data.channel !== this.state.deletePopup}
                   style={{top: '-72px', left: '130px', cursor: 'initial'}}>
              <DeleteChannelPopup
                onNext={() => {
                  this.props.deleteChannel(data.channel);
                  this.setState({deletePopup: ''});
                }}
                onBack={() => this.setState({deletePopup: ''})}
              />
            </Popup>
            <Popup hidden={data.channel !== this.state.editChannelName}
                   style={{top: '-72px', left: '130px', cursor: 'initial'}}>
              <EditChannelNamePopup
                channel={this.state.editChannelName}
                onNext={this.editChannelName}
                onBack={() => this.setState({editChannelName: ''})}
              />
            </Popup>
          </div>
          : null}
        <div className={this.classes.title}>
          {rowType === ROW_TYPE.REGULAR ? <div className={this.classes.rowIcon} data-icon={`plan:${data.channel}`}/>
            : null}

          <div className={this.classes.titleText}>{data.nickname}</div>

          {rowType === ROW_TYPE.REGULAR && this.props.isEditMode ? <div className={this.classes.channelEditIcons}>
            <div className={this.classes.channelActionIcon} data-icon={'plan:editChannel'}
                 onClick={() => this.setState({editChannelName: data.channel})}/>
            <div className={this.classes.channelActionIcon} data-icon={'plan:removeChannel'}
                 onClick={() => this.setState({deletePopup: data.channel})}/>
          </div> : null}
        </div>
      </div>
    </td>;
  };

  editChannelName = (longName, shortName, category, channel) => {
    let namesMapping = this.props.namesMapping || {};
    if (!namesMapping.channels) {
      namesMapping.channels = {};
    }
    namesMapping.channels[channel] = {
      title: longName,
      nickname: shortName,
      category: category
    };
    this.props.updateUserMonthPlan({namesMapping: namesMapping}, this.props.region, this.props.planDate);
    this.setState({editChannelName: ''});
  };

  handleChangeContextMenu = (event, data) => {
    const channel = data.channel;
    const percent = data.percent;
    let planUnknownChannels = this.props.planUnknownChannels;
    let projectedPlan = this.props.projectedPlan;
    let approvedBudgets = this.props.approvedBudgets;
    for (let i = 0; i < 12; i++) {
      if (planUnknownChannels.length > 0 && planUnknownChannels[i] && planUnknownChannels[i][channel] !== undefined) {
        planUnknownChannels[i][channel] = Math.round(planUnknownChannels[i][channel] * percent);
      }
      else {
        const newBudget = Math.round((projectedPlan[i].plannedChannelBudgets[channel] || 0) * percent);
        projectedPlan[i].plannedChannelBudgets[channel] = newBudget;
        if (!approvedBudgets[i]) {
          approvedBudgets[i] = {};
        }
        approvedBudgets[i][channel] = newBudget;
      }
      this.props.updateState({
        projectedPlan: projectedPlan,
        approvedBudgets: approvedBudgets,
        planUnknownChannels: planUnknownChannels
      });
    }
  };

  approveChannel = (event, data) => {
    this.props.approveWholeChannel(data.channel);
  };

  declineChannel = (event, data) => {
    this.props.declineWholeChannel(data.channel);
  };

  parseData = (data) => {
    const props = getChannelsWithProps();

    const notSorted = union(...data.map(month => Object.keys(month)))
      .map(channel => {
        const channelArray = Array(MONTHS_TO_SHOW).fill(
          {primaryBudget: 0, secondaryBudget: 0, isConstraint: false});

        data.forEach((month, index) => {
          if (month[channel]) {
            channelArray[index] = {
              ...month[channel],
              isConstraint: month[channel].isConstraint ? month[channel].isConstraint : false,
              primaryBudget: month[channel].primaryBudget ? month[channel].primaryBudget : 0
            };
          }
        });

        return {channel: channel, nickname: props[channel].nickname, values: channelArray};
      });

    return sortBy(notSorted, item => [props[item.channel].category.toLowerCase(), item.nickname.toLowerCase()]);
  };

  sumChannels = (channels) => {
    return Array(MONTHS_TO_SHOW).fill(0).map((value, index) => {
      return {
        primaryBudget: sumBy(channels, channel => channel.values[index].primaryBudget),
        secondaryBudget: sumBy(channels, channel => channel.values[index].secondaryBudget)
      };
    });
  };

  nextCollapseOption = () => {
    this.setState({
      tableCollapsed: (this.state.tableCollapsed + 1) % 3
    });
  };

  getHeadRow = () => {
    return <tr className={this.classes.headRow}>
      <td className={this.classes.titleCell}>
        <div className={this.classes.rowTitle} ref={this.props.firstColumnCell}>
          <div
            style={{borderColor: '#329ff1 transparent transparent transparent'}}
            className={this.classes.rowArrowWrap}
            data-collapsed={this.state.tableCollapsed !== COLLAPSE_OPTIONS.SHOW_ALL}
            data-headline
            onClick={() => {
              this.nextCollapseOption();
              this.forceUpdate();
            }}>
            <div className={this.classes.rowArrow} data-headline/>
          </div>
          {'Marketing Channel'}
        </div>
      </td>
      {this.getMonthHeaders()}
    </tr>;
  };

  render() {
    const props = getChannelsWithProps();
    const slicedData = this.props.data.slice(0, MONTHS_TO_SHOW);
    const parsedData = this.parseData(slicedData);
    const dataWithCategories = groupBy(parsedData, (channel) => props[channel.channel].category);

    const rows = this.props.data && this.state.tableCollapsed !== COLLAPSE_OPTIONS.COLLAPSE_ALL ? this.getRows(
      dataWithCategories) : [];

    const footRowData = {
      channel: 'Total',
      nickname: 'Total',
      values: this.sumChannels(parsedData)
    };

    const headRow = this.getHeadRow();
    const footRow = parsedData && this.getTableRow(footRowData, ROW_TYPE.BOTTOM);

    return <div>
      <div className={this.classes.box}>
        <table className={this.classes.table} ref={this.props.tableRef}>
          <thead>
          {headRow}
          </thead>
          <tbody className={this.classes.tableBody}>
          {rows}
          </tbody>
          <tfoot>
          {footRow}
          </tfoot>
        </table>
      </div>

      <thead className={this.classes.stickyHeader} data-sticky={this.state.isSticky ? true : null}>
      {headRow}
      </thead>

      <ContextMenu id="rightClickEdit">
        <SubMenu title="Increase by" hoverDelay={250}>
          <MenuItem data={{percent: 1.1}} onClick={this.handleChangeContextMenu}>
            10%
          </MenuItem>
          <MenuItem data={{percent: 1.2}} onClick={this.handleChangeContextMenu}>
            20%
          </MenuItem>
          <MenuItem data={{percent: 1.3}} onClick={this.handleChangeContextMenu}>
            30%
          </MenuItem>
          <MenuItem data={{percent: 1.4}} onClick={this.handleChangeContextMenu}>
            40%
          </MenuItem>
          <MenuItem data={{percent: 1.5}} onClick={this.handleChangeContextMenu}>
            50%
          </MenuItem>
        </SubMenu>
        <SubMenu title="Decrease by" hoverDelay={250}>
          <MenuItem data={{percent: 0.9}} onClick={this.handleChangeContextMenu}>
            10%
          </MenuItem>
          <MenuItem data={{percent: 0.8}} onClick={this.handleChangeContextMenu}>
            20%
          </MenuItem>
          <MenuItem data={{percent: 0.7}} onClick={this.handleChangeContextMenu}>
            30%
          </MenuItem>
          <MenuItem data={{percent: 0.6}} onClick={this.handleChangeContextMenu}>
            40%
          </MenuItem>
          <MenuItem data={{percent: 0.5}} onClick={this.handleChangeContextMenu}>
            50%
          </MenuItem>
        </SubMenu>
      </ContextMenu>

      <ContextMenu id="rightClickNormal">
        <MenuItem onClick={this.approveChannel}>
          Approve all suggestions
        </MenuItem>
        <MenuItem onClick={this.declineChannel}>
          Decline all suggestions
        </MenuItem>
      </ContextMenu>
    </div>;
  }
};