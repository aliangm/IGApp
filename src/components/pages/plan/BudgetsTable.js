import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/budget-table.css';
import {formatBudget} from 'components/utils/budget';
import {extractNumber} from 'components/utils/utils';
import TableCell from 'components/pages/plan/TableCell';
import Popup from 'components/Popup';
import DeleteChannelPopup from 'components/pages/plan/DeleteChannelPopup';
import EditChannelNamePopup from 'components/pages/plan/EditChannelNamePopup';
import {ContextMenu, ContextMenuTrigger, SubMenu, MenuItem} from 'react-contextmenu';
import contextStyle from 'react-contextmenu/public/styles.css';
import {getChannelsWithProps, isUnknownChannel} from 'components/utils/channels';
import groupBy from 'lodash/groupBy';
import union from 'lodash/union';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import isNil from 'lodash/isNil';
import chunk from 'lodash/chunk';
import concat from 'lodash/concat';
import {shouldUpdateComponent} from 'components/pages/plan/planUtil';
import {getDatesSpecific} from 'components/utils/date';
import Button from 'components/controls/Button';
import classnames from 'classnames';

const COLLAPSE_OPTIONS = {
  COLLAPSE_ALL: 0,
  ONLY_CATEGORIES: 1,
  SHOW_ALL: 2
};

const ROW_TYPE = {
  CATEGORY: 0,
  CHANNEL: 1,
  REGION: 2
};

export default class BudgetsTable extends Component {

  style = style;
  styles = [contextStyle];

  static propTypes = {
    isEditMode: PropTypes.bool,
    isShowSecondaryEnabled: PropTypes.bool,
    isConstraintsEnabled: PropTypes.bool,
    data: PropTypes.array,
    editCommittedBudget: PropTypes.func,
    changeBudgetConstraint: PropTypes.func,
    deleteChannel: PropTypes.func,
    scrollPosition: PropTypes.number,
    changeScrollPosition: PropTypes.func,
    cellWidth: PropTypes.number,
    isPopup: PropTypes.bool,
    onPageScrollEventRegister: PropTypes.func.isRequired
  };

  static defaultProps = {
    isEditMode: false,
    isShowSecondaryEnabled: false,
    isConstraitsEnabled: false,
    data: [],
    isPopup: false
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
    this.refs.tableScroller.addEventListener('scroll', this.handleTableScroll);
    this.props.onPageScrollEventRegister(this.handleScroll);
  }

  componentWillUnmount() {
    this.refs.tableScroller.removeEventListener('scroll', this.handleTableScroll);
    this.props.onPageScrollEventRegister(null);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldUpdateComponent(nextProps, nextState, this.props, this.state, 'scrollPosition');
  }

  componentWillReceiveProps(nextProps) {
    //should only update scroll position when data already exists for this component and not empty
    if (!isNil(nextProps.scrollPosition) && this.props.data && this.props.data.length !== 0) {
      this.refs.tableScroller.scrollLeft = this.refs.stickyHeader.scrollLeft = nextProps.scrollPosition;
    }
  }

  handleTableScroll = () => {
    this.props.changeScrollPosition(this.refs.tableScroller.scrollLeft);
  };

  handleScroll = () => {
    this.setState({isSticky: (this.refs.tableRef && this.refs.tableRef.getBoundingClientRect().top) < 20});
  };

  getMonthHeaders = (numberOfPastDates, dates) => {
    const currentMonth = parseInt(this.props.planDate.split('/')[0]);
    // const events = this.props.events ?
    //   this.props.events
    //     .filter(event => {
    //       const eventMonth = parseInt(event.startDate.split('/')[1]);
    //       return (currentMonth + index) % 12 === eventMonth % 12;
    //     })
    //     .map((event, index) => {
    //       return <p key={index}>
    //         {event.link
    //           ? <a href={event.link} target="_blank">{event.eventName}</a>
    //           : event.eventName} {event.startDate} {event.location}
    //       </p>;
    //     })
    //   : null;
    const headerWidth = `${this.props.cellWidth}px`;
    const headers = dates.map((month, index) => {
      return <td key={`head:${index}`}
                 className={this.classes.headRowCell}
                 style={{minWidth: headerWidth, width: headerWidth}}
                 data-history={index < numberOfPastDates ? true : null}
                 data-first-month={index === numberOfPastDates ? true : null}>

        <div style={{width: `${this.props.cellWidth - 12}px`}}>{month}</div>
      </td>;
    });
    return headers;
  };

  dragStart = (value) => {
    this.setState({draggableValue: value, isDragging: true});
  };

  commitDrag = () => {
    const value = extractNumber(this.state.draggableValue);

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

  getRows = (data, numberOfPastDates, dataLength) => {
    return union(Object.keys(data)
      .map(category => this.getCategoryRows(category, data[category], numberOfPastDates, dataLength)));
  };

  getCategoryRows = (category, channels, numberOfPastDates, dataLength) => {
    const categoryData = this.sumChannels(channels, dataLength);
    const categoryRow = this.getTableRow({
      channel: category,
      nickname: category,
      values: categoryData
    }, ROW_TYPE.CATEGORY, numberOfPastDates);

    return !this.state.collapsedCategories[category] && this.state.tableCollapsed === COLLAPSE_OPTIONS.SHOW_ALL ?
      [categoryRow, ...channels.map((channel) => {
        const regionArrays = channel.values.filter(item => item.regions).map(item => Object.keys(item.regions));
        const channelRegions = union(...regionArrays);

        return [this.getTableRow(channel, ROW_TYPE.CHANNEL, numberOfPastDates),
          ...(channelRegions.map(region => this.getTableRow({
            channel: channel.channel,
            region: region,
            nickname: `${channel.nickname} - ${region}`,
            values: channel.values.map(item => {
              const value = (item.regions && item.regions[region]) ? item.regions[region] : 0;
              return {primaryBudget: value};
            })
          }, ROW_TYPE.REGION, numberOfPastDates)))
        ];
      })
      ]
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
        <div className={this.classes.rowTitle}>
          <div className={this.classes.title}>{data.nickname}</div>
        </div>
      </td>
      {cells}
    </tr>;
  };

  getTableRow = (data, rowType, numberOfPastDates) => {
    const titleCellKey = (rowType === ROW_TYPE.REGION ? data.region : rowType) + data.channel;

    const cells = data.values.map((monthData, key) => {
      const isHistory = key < numberOfPastDates;
      const isQuarter = monthData.isQuarter;

      return rowType === ROW_TYPE.CATEGORY || isHistory || isQuarter ?
        (rowType === ROW_TYPE.CATEGORY ?
          <td key={`category:${data.channel}:${key}`} className={classnames(this.classes.categoryCell, {
            [this.classes.historyCell]: isHistory,
            [this.classes.quarterCell]: isQuarter
          })}>
            {formatBudget(monthData.primaryBudget)}
          </td> :
          <td key={`${data.channel}:${key}`} className={classnames(this.classes.cell,
            {
              [this.classes.historyCell]: isHistory,
              [this.classes.quarterCell]: isQuarter
            })}>
            {formatBudget(monthData.primaryBudget)}
          </td>) : <TableCell
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
          onChange={(newValue) => this.props.editCommittedBudget(key, data.channel, newValue, data.region)}
          isConstraitsEnabled={this.props.isConstraintsEnabled &&
          !isUnknownChannel(data.channel) &&
          rowType !==
          ROW_TYPE.REGION}
          dragEnter={() => this.dragEnter(key, data.channel)}
          commitDrag={this.commitDrag}
          dragStart={this.dragStart}
          isDragging={this.state.isDragging}
          approveSuggestion={() => this.props.editCommittedBudget(key, data.channel, monthData.secondaryBudget)}
          enableActionButtons={true}
          cellKey={`${data.channel}:${key}`}
        />;
    });

    return <tr className={this.classes.tableRow} key={titleCellKey}
               data-row-type={rowType === ROW_TYPE.CATEGORY ? 'category' : 'regular'}
               ref={rowType === ROW_TYPE.CHANNEL ? (ref) => {
                 this.props.setRef(data.channel, ref);
               } : null}>
      {this.getTitleCell(rowType, data)}
      {cells}
    </tr>;
  };

  getTitleCell = (rowType, data) => {
    const isCategoryRow = rowType === ROW_TYPE.CATEGORY;
    return <ContextMenuTrigger id="rightClickEdit" collect={() => {
      return {channel: data.channel};
    }} disable={rowType !== ROW_TYPE.CHANNEL || !this.props.editMode}>
      <td className={this.classes.titleCell} data-row-type={isCategoryRow ? 'category' : 'regular'}
          onMouseEnter={isCategoryRow ? () => {
            this.setState({categoryOnHover: data.channel});
          } : null}
          onMouseLeave={isCategoryRow ? () => {
            this.setState({categoryOnHover: null});
          } : null}>
        <div className={this.classes.rowTitle} data-category-row={isCategoryRow ? true : null}>
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

          {this.props.isEditMode && rowType === ROW_TYPE.CHANNEL ?
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
            {rowType === ROW_TYPE.CHANNEL ? <div className={this.classes.rowIcon}
                                                 data-icon={!isUnknownChannel(data.channel)
                                                   ? `plan:${data.channel}`
                                                   : 'plan:other'}/>
              : null}

            <div className={this.classes.titleText}>{data.nickname}</div>

            {this.props.isEditMode ? <div className={this.classes.channelEditIconsWrapper}>
                {isCategoryRow ? <div className={this.classes.channelEditIcons}>
                    {this.state.categoryOnHover === data.channel
                      ? <Button icon='plan:addChannel'
                                type="primary"
                                style={{width: '80px'}}
                                onClick={() => {
                                  this.props.openAddChannelPopup(data.channel);
                                }}> Add
                      </Button> : null}
                  </div>
                  :
                  rowType === ROW_TYPE.CHANNEL ?
                    <div className={this.classes.channelEditIcons}>
                      <div className={this.classes.channelActionIcon} data-icon={'plan:editChannel'}
                           onClick={() => this.setState({editChannelName: data.channel})}/>
                      <div className={this.classes.channelActionIcon} data-icon={'plan:removeChannel'}
                           onClick={() => this.setState({deletePopup: data.channel})}/>
                    </div>
                    :
                    null
                }
              </div>
              : null
            }
          </div>
        </div>
      </td>
    </ContextMenuTrigger>;
  };

  editChannelName = (name, category, channel) => {
    let namesMapping = this.props.namesMapping || {};
    if (!namesMapping.channels) {
      namesMapping.channels = {};
    }
    namesMapping.channels[channel] = {
      title: `${category} / ${name}`,
      nickname: name,
      category: category
    };
    this.props.updateUserMonthPlan({namesMapping: namesMapping}, this.props.region, this.props.planDate);
    this.setState({editChannelName: ''});
  };

  getDataByChannel = (data, channelsProps, quarterSumStartOffset) => {
    const channels = union(...data.map(month => Object.keys(month.channels)));

    const notSorted = channels.map(channel => {
      const monthArray = Array(this.props.data.length).fill(
        {primaryBudget: 0, secondaryBudget: 0, isConstraint: false});

      data.forEach((month, index) => {
        const channels = month.channels;
        if (channels[channel]) {
          monthArray[index] = {
            ...channels[channel],
            isConstraint: channels[channel].isConstraint ? channels[channel].isConstraint : false,
            primaryBudget: channels[channel].primaryBudget ? channels[channel].primaryBudget : 0
          };
        }
      });

      const values = this.addQuarters(monthArray, quarterSumStartOffset, (quarterMonths) => {
        return {
          primaryBudget: sumBy(quarterMonths, 'primaryBudget'),
          secondaryBudget: sumBy(quarterMonths, 'secondaryBudget'),
          isQuarter: true
        };
      });

      return {channel: channel, nickname: channelsProps[channel].nickname, values: values};
    });

    return sortBy(notSorted, item => [channelsProps[item.channel].category.toLowerCase(), item.nickname.toLowerCase()]);
  };

  sumChannels = (channels, arrayLength) => {
    return Array(arrayLength).fill(0).map((value, index) => {
      return {
        primaryBudget: sumBy(channels, channel => channel.values[index].primaryBudget),
        secondaryBudget: sumBy(channels, channel => channel.values[index].secondaryBudget),
        isQuarter: channels[0].values[index].isQuarter
      };
    });
  };

  nextCollapseOption = () => {
    this.setState({
      tableCollapsed: (this.state.tableCollapsed + 1) % 3
    });
  };

  getHeadRow = (numberOfPastDates, dates, isSticky = false) => {
    const row = <tr className={this.classes.headRow}>
      <div className={this.classes.nextButton}>
        <div className={this.classes.buttonWrapper}>
          <div className={this.classes.monthNavigation} onClick={this.showNextMonth} data-icon="plan:monthNavigation"/>
        </div>
      </div>
      <div className={this.classes.prevButton}>
        <div className={this.classes.buttonWrapper}>
          <div className={this.classes.monthNavigation} onClick={this.showPrevMonth} data-icon="plan:monthNavigation"/>
        </div>
      </div>
      <td className={this.classes.titleCell} data-row-type="header">
        <div className={this.classes.rowTitle}>
          <div className={this.classes.rowArrowBox}>
            <div
              className={this.classes.rowArrowWrap}
              data-collapsed={this.state.tableCollapsed !== COLLAPSE_OPTIONS.SHOW_ALL ? true : null}
              data-headline
              onClick={() => {
                this.nextCollapseOption();
              }}>
              <div className={this.classes.rowArrow} data-headline/>
            </div>
          </div>
          <div className={this.classes.title} data-category-row>
            {'Marketing Channel'}
          </div>
        </div>
      </td>
      {this.getMonthHeaders(numberOfPastDates, dates)}
    </tr>;

    return isSticky ? <div className={this.classes.stickyWrapper} ref='stickyHeader'>{row}</div> : row;
  };

  showNextMonth = () => {
    this.refs.tableScroller.scrollLeft =
      (this.refs.tableScroller.scrollLeft + this.props.cellWidth) -
      this.refs.tableScroller.scrollLeft %
      this.props.cellWidth;
  };

  showPrevMonth = () => {
    const substractionFromMonthPixel = this.refs.tableScroller.scrollLeft % this.props.cellWidth;
    this.refs.tableScroller.scrollLeft =
      substractionFromMonthPixel
        ? this.refs.tableScroller.scrollLeft - substractionFromMonthPixel
        : this.refs.tableScroller.scrollLeft - this.props.cellWidth;
  };

  getContextMenu = () => {
    const regionsMenu = this.props.userRegions && this.props.userRegions.map(region =>
      <MenuItem key={region}
                data={{region: region}}
                onClick={(event, data) => this.props.addRegionToChannel(data.channel, data.region)}>
        {region}
      </MenuItem>);
    return <ContextMenu id="rightClickEdit">
      <SubMenu title="Segment by" hoverDelay={250}>
        {regionsMenu}
        <MenuItem data={{percent: 1.5}} onClick={(event, data) => this.props.addNewRegion(data.channel)}>
          Add new
        </MenuItem>
      </SubMenu>
    </ContextMenu>;
  };

  addQuarters = (array, quarterSumStartOffset, quarterDataFunc) => {
    const quartersSplit = [array.slice(0, quarterSumStartOffset),
      ...chunk(array.slice(quarterSumStartOffset), 4)];

    const withQuarterAddition = quartersSplit.map((quarterMonths, index) => {
      // If last quarter did not end, don't add quarter value
      if (index == quartersSplit.length - 1 && quarterSumStartOffset !== 0) {
        return quarterMonths;
      }
      else {
        return [...quarterMonths, quarterDataFunc(quarterMonths)];
      }
    });

    return concat(...withQuarterAddition);
  };


  render() {
    const quarterSumStartOffset = 3;

    const channelsProps = getChannelsWithProps();
    const parsedData = this.getDataByChannel(this.props.data, channelsProps, quarterSumStartOffset);
    const numberOfPastDates = this.props.data.filter((month) => month.isHistory).length;
    const datesWithoutQuarters = getDatesSpecific(this.props.planDate,
      numberOfPastDates,
      this.props.data.length - numberOfPastDates,
      quarterSumStartOffset);

    const dates = this.addQuarters(datesWithoutQuarters, quarterSumStartOffset, () => {
      return 'Quarter';
    });

    const dataWithCategories = groupBy(parsedData, (channel) => channelsProps[channel.channel].category);

    const rows = dataWithCategories && this.state.tableCollapsed !== COLLAPSE_OPTIONS.COLLAPSE_ALL
      ? this.getRows(dataWithCategories, numberOfPastDates, dates.length) : [];

    const footRowData = {
      channel: 'Total',
      nickname: 'Total',
      values: this.sumChannels(parsedData, dates.length)
    };

    const headRow = this.getHeadRow(numberOfPastDates, dates);
    const footRow = parsedData && this.getBottomRow(footRowData);

    return <div>
      <div className={this.classes.box} ref='tableBox'>
        <thead className={this.classes.stickyHeader}
               data-sticky={this.state.isSticky ? true : null}
               data-is-popup={this.props.isPopup ? true : null}>

        {this.getHeadRow(numberOfPastDates, dates, true)}
        </thead>
        <div className={this.classes.tableScroller} ref='tableScroller'>
          <table className={this.classes.table} ref='tableRef'>
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
        {this.getContextMenu()}
      </div>
    </div>;
  }
}