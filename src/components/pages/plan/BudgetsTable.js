import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/budget-table.css';
import {formatBudget, extractNumberFromBudget} from 'components/utils/budget';
import TableCell from 'components/pages/plan/TableCell';
import Popup from 'components/Popup';
import DeleteChannelPopup from 'components/pages/plan/DeleteChannelPopup';
import EditChannelNamePopup from 'components/pages/plan/EditChannelNamePopup';
//import {ContextMenu, SubMenu, MenuItem} from 'react-contextmenu';
import {TextContent as PopupTextContent} from 'components/pages/plan/Popup';
import {getChannelsWithProps} from 'components/utils/channels';
import groupBy from 'lodash/groupBy';
import union from 'lodash/union';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';

const COLLAPSE_OPTIONS = {
  COLLAPSE_ALL: 0,
  ONLY_CATEGORIES: 1,
  SHOW_ALL: 2
};

const CELL_WIDTH = 123;

export default class BudgetsTable extends Component {

  style = style;

  static propTypes = {
    tableRef: PropTypes.func,
    firstColumnCell: PropTypes.func,
    dates: PropTypes.array,
    isEditMode: PropTypes.bool,
    isShowSecondaryEnabled: PropTypes.bool,
    isConstraintsEnabled: PropTypes.bool,
    data: PropTypes.array,
    editCommittedBudget: PropTypes.func,
    changeBudgetConstraint: PropTypes.func,
    deleteChannel: PropTypes.func
  };

  static defaultProps = {
    isEditMode: false,
    isShowSecondaryEnabled: false,
    isConstraitsEnabled: false,
    data: []
  };

  constructor(props) {
    super(props);

    this.state = {
      tableCollapsed: COLLAPSE_OPTIONS.SHOW_ALL,
      collapsedCategories: {},
      draggedCells: [],
      isSticky: false
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.tableScroller.addEventListener('scroll', this.handleTableScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.tableScroller.removeEventListener('scroll', this.handleTableScroll);
  }

  handleTableScroll = () => {
    this.stickyHeader.scrollLeft = this.tableScroller.scrollLeft;
  };

  handleScroll = () => {
    this.setState({isSticky: (this.tableRef && this.tableRef.getBoundingClientRect().top) < 70});
  };

  getMonthHeaders = () => {
    const currentMonth = parseInt(this.props.planDate.split('/')[0]);
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
    const headers = this.props.dates.map((month, index) => {
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
        <td key={`head:${index}`} className={this.classes.headRowCell} style={{width: `${CELL_WIDTH}px`}}>{month}</td>;
    });
    return headers;
  };

  dragStart = (value) => {
    this.setState({draggableValue: value, isDragging: true});
  };

  commitDrag = () => {
    const value = extractNumberFromBudget(this.state.draggableValue);

    this.state.draggedCells.forEach(({month, channel}) => {
      this.props.editCommitedBudget(month, channel, value);
    });

    this.setState({
      draggedCells: [],
      draggableValue: null,
      isDragging: false
    });
  };

  dragEnter = (month, channel) => {
    this.setState({
      draggedCells: [...this.state.draggedCells,
        {channel: channel, month: month}]
    });
  };

  getRows = (data) => {
    return union(Object.keys(data).map(category => this.getCategoryRows(category, data[category])));
  };

  getCategoryRows = (category, channels) => {
    const categoryData = this.sumChannels(channels);
    const categoryRow = this.getTableRow({channel: category, nickname: category, values: categoryData},
      true);

    return !this.state.collapsedCategories[category] && this.state.tableCollapsed === COLLAPSE_OPTIONS.SHOW_ALL ?
      [categoryRow, ...channels.map((channel) => this.getTableRow(channel, false))]
      : categoryRow;
  };

  approveMonthSuggestions = month => {
    const monthData = this.props.data[month];
    Object.keys(monthData).forEach(key => {
      if (!isNil(monthData[key].secondaryBudget)) {
        this.props.editCommittedBudget(month, key, monthData[key].secondaryBudget);
      }
    });
  };

  getBottomRow = (data) => {
    const cells = data.values.map((monthData, key) => {
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
    });

    return <tr className={this.classes.tableRow} data-row-type={'bottom'}>
      <td className={this.classes.titleCell} data-row-type={'bottom'}>
        <div className={this.classes.rowTitle} >
          <div className={this.classes.title}>{data.nickname}</div>
        </div>
      </td>
      {cells}
    </tr>;
  }

  getTableRow = (data, isCategoryRow) => {
    const titleCellKey = (isCategoryRow ? 'category' : '') + data.channel;

    const cells = data.values.map((monthData, key) => {
      return !isCategoryRow ? <TableCell
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
        isEditMode={this.props.isEditMode}
        onChange={(newValue) => this.props.editCommittedBudget(key, data.channel, newValue)}
        isConstraitsEnabled={this.props.isConstraintsEnabled}
        dragEnter={() => this.dragEnter(key, data.channel)}
        commitDrag={this.commitDrag}
        dragStart={this.dragStart}
        isDragging={this.state.isDragging}
        approveSuggestion={() => this.props.editCommittedBudget(key, data.channel, monthData.secondaryBudget)}
        enableActionButtons={true}
      />
        : <td key={`category:${data.channel}:${key}`} className={this.classes.categoryCell}>
          {formatBudget(monthData.primaryBudget)}
        </td>;
    });

    return <tr className={this.classes.tableRow} key={titleCellKey} data-row-type={isCategoryRow ? 'category' : 'regular'}>
      {this.getTitleCell(isCategoryRow, data)}
      {cells}
    </tr>;
  };

  getTitleCell = (isCategoryRow, data) => {
    return <td className={this.classes.titleCell} data-row-type={isCategoryRow ? 'category' : 'regular'}>
      <div className={this.classes.rowTitle} data-category-row={isCategoryRow ? true: null}>
        {isCategoryRow ?
          <div className={this.classes.rowArrowBox}>
            <div
              className={this.classes.rowArrowWrap}
              data-collapsed={this.state.collapsedCategories[data.channel] ? true : null}
              onClick={() => {
                this.setState({
                  collapsedCategories: {
                    ...this.state.collapsedCategories,
                    [data.channel]: !this.state.collapsedCategories[data.channel]
                  }
                });
              }}>
              <div className={this.classes.rowArrow}/>
            </div>
          </div> : null}

        {this.props.isEditMode && !isCategoryRow ?
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

        <div className={this.classes.title} data-category-row={isCategoryRow ? true : null}>
          {!isCategoryRow ? <div className={this.classes.rowIcon} data-icon={`plan:${data.channel}`}/>
            : null}

          <div className={this.classes.titleText}>{data.nickname}</div>

          {!isCategoryRow && this.props.isEditMode ? <div
            className={this.classes.channelEditIconsWrapper}>
            <div className={this.classes.channelEditIcons}>
              <div className={this.classes.channelActionIcon} data-icon={'plan:editChannel'}
                   onClick={() => this.setState({editChannelName: data.channel})}/>
              <div className={this.classes.channelActionIcon} data-icon={'plan:removeChannel'}
                   onClick={() => this.setState({deletePopup: data.channel})}/>
            </div>
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

  // handleChangeContextMenu = (event, data) => {
  //   const channel = data.channel;
  //   const percent = data.percent;
  //   let planUnknownChannels = this.props.planUnknownChannels;
  //   let projectedPlan = this.props.projectedPlan;
  //   let approvedBudgets = this.props.approvedBudgets;
  //   for (let i = 0; i < 12; i++) {
  //     if (planUnknownChannels.length > 0 && planUnknownChannels[i] && planUnknownChannels[i][channel] !== undefined)
  // { planUnknownChannels[i][channel] = Math.round(planUnknownChannels[i][channel] * percent); } else { const
  // newBudget = Math.round((projectedPlan[i].plannedChannelBudgets[channel] || 0) * percent);
  // projectedPlan[i].plannedChannelBudgets[channel] = newBudget; if (!approvedBudgets[i]) { approvedBudgets[i] = {}; }
  // approvedBudgets[i][channel] = newBudget; } this.props.updateState({ projectedPlan: projectedPlan, approvedBudgets:
  // approvedBudgets, planUnknownChannels: planUnknownChannels }); } };

  // approveChannel = (event, data) => {
  //   this.props.approveWholeChannel(data.channel);
  // };
  //
  // declineChannel = (event, data) => {
  //   this.props.declineWholeChannel(data.channel);
  // };

  getDataByChannel = (data, channelsProps) => {
    const channels = union(...data.map(month => Object.keys(month)));

    const notSorted = channels.map(channel => {
      const monthArray = Array(this.props.data.length).fill(
        {primaryBudget: 0, secondaryBudget: 0, isConstraint: false});

      data.forEach((month, index) => {
        if (month[channel]) {
          monthArray[index] = {
            ...month[channel],
            isConstraint: month[channel].isConstraint ? month[channel].isConstraint : false,
            primaryBudget: month[channel].primaryBudget ? month[channel].primaryBudget : 0
          };
        }
      });

      return {channel: channel, nickname: channelsProps[channel].nickname, values: monthArray};
    });

    return sortBy(notSorted, item => [channelsProps[item.channel].category.toLowerCase(), item.nickname.toLowerCase()]);
  };

  sumChannels = (channels) => {
    return Array(this.props.data.length).fill(0).map((value, index) => {
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

  getHeadRow = (isSticky = false) => {
    const row = <tr className={this.classes.headRow}>
      <td className={this.classes.titleCell} data-row-type="header">
        <div className={this.classes.rowTitle} ref={this.props.firstColumnCell}>
          <div className={this.classes.rowArrowBox}>
            <div
              className={this.classes.rowArrowWrap}
              data-collapsed={this.state.tableCollapsed !== COLLAPSE_OPTIONS.SHOW_ALL}
              data-headline
              onClick={() => {
                this.nextCollapseOption();
              }}>
              <div className={this.classes.rowArrow} data-headline/>
            </div>
          </div>
          <div className={this.classes.title} data-category-row >
            {'Marketing Channel'}
          </div>
        </div>
      </td>
      {this.getMonthHeaders()}
    </tr>;

    return isSticky ? <div className={this.classes.stickyWrapper} ref={ref => {
      this.stickyHeader = ref;
    }}>{row}</div> : row;
  };

  showNextMonth = () => {
    this.tableScroller.scrollLeft =
      (this.tableScroller.scrollLeft + CELL_WIDTH) - this.tableScroller.scrollLeft % CELL_WIDTH;
  };

  showPrevMonth = () => {
    const substractionFromMonthPixel = this.tableScroller.scrollLeft % CELL_WIDTH;
    this.tableScroller.scrollLeft =
      substractionFromMonthPixel
        ? this.tableScroller.scrollLeft - substractionFromMonthPixel
        : this.tableScroller.scrollLeft - CELL_WIDTH;
  };

  render() {
    const channelsProps = getChannelsWithProps();
    const parsedData = this.getDataByChannel(this.props.data, channelsProps);
    const dataWithCategories = groupBy(parsedData, (channel) => channelsProps[channel.channel].category);

    const rows = dataWithCategories && this.state.tableCollapsed !== COLLAPSE_OPTIONS.COLLAPSE_ALL
      ? this.getRows(dataWithCategories) : [];

    const footRowData = {
      channel: 'Total',
      nickname: 'Total',
      values: this.sumChannels(parsedData)
    };

    const headRow = this.getHeadRow();
    const footRow = parsedData && this.getBottomRow(footRowData);

    return <div style={{'margin-left': '40px'}}>
      <div className={this.classes.box}>
        <div className={this.classes.tableScroller} ref={(ref) => {
          this.tableScroller = ref;
        }}>
          <table className={this.classes.table}
                 ref={(ref) => {
                   this.tableRef = ref;
                   this.props.tableRef(ref);
                 }}>
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
        <div onClick={this.showPrevMonth}>
          prev
        </div>
        <div onClick={this.showNextMonth}>
          next
        </div>
      </div>
      <thead className={this.classes.stickyHeader} data-sticky={this.state.isSticky ? true : null}>
        {this.getHeadRow(true)}
      </thead>
    </div>;

    {/*<ContextMenu id="rightClickEdit">*/
    }
    {/*<SubMenu title="Increase by" hoverDelay={250}>*/
    }
    {/*<MenuItem data={{percent: 1.1}} onClick={this.handleChangeContextMenu}>*/
    }
    {/*10%*/
    }
    {/*</MenuItem>*/
    }
    {/*<MenuItem data={{percent: 1.2}} onClick={this.handleChangeContextMenu}>*/
    }
    {/*20%*/
    }
    {/*</MenuItem>*/
    }
    {/*<MenuItem data={{percent: 1.3}} onClick={this.handleChangeContextMenu}>*/
    }
    {/*30%*/
    }
    {/*</MenuItem>*/
    }
    {/*<MenuItem data={{percent: 1.4}} onClick={this.handleChangeContextMenu}>*/
    }
    {/*40%*/
    }
    {/*</MenuItem>*/
    }
    {/*<MenuItem data={{percent: 1.5}} onClick={this.handleChangeContextMenu}>*/
    }
    {/*50%*/
    }
    {/*</MenuItem>*/
    }
    {/*</SubMenu>*/
    }
    {/*<SubMenu title="Decrease by" hoverDelay={250}>*/
    }
    {/*<MenuItem data={{percent: 0.9}} onClick={this.handleChangeContextMenu}>*/
    }
    {/*10%*/
    }
    {/*</MenuItem>*/
    }
    {/*<MenuItem data={{percent: 0.8}} onClick={this.handleChangeContextMenu}>*/
    }
    {/*20%*/
    }
    {/*</MenuItem>*/
    }
    {/*<MenuItem data={{percent: 0.7}} onClick={this.handleChangeContextMenu}>*/
    }
    {/*30%*/
    }
    {/*</MenuItem>*/
    }
    {/*<MenuItem data={{percent: 0.6}} onClick={this.handleChangeContextMenu}>*/
    }
    {/*40%*/
    }
    {/*</MenuItem>*/
    }
    {/*<MenuItem data={{percent: 0.5}} onClick={this.handleChangeContextMenu}>*/
    }
    {/*50%*/
    }
    {/*</MenuItem>*/
    }
    {/*</SubMenu>*/
    }
    {/*</ContextMenu>*/
    }

    {/*<ContextMenu id="rightClickNormal">*/
    }
    {/*<MenuItem onClick={this.approveChannel}>*/
    }
    {/*Approve all suggestions*/
    }
    {/*</MenuItem>*/
    }
    {/*<MenuItem onClick={this.declineChannel}>*/
    }
    {/*Decline all suggestions*/
    }
    {/*</MenuItem>*/
    }
    {/*</ContextMenu>*/
    }
  }
}