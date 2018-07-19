import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import {parseBudgets} from 'data/parseAnnualPlan';
import {formatBudget} from 'components/utils/budget';
import {ContextMenuTrigger} from 'react-contextmenu';
import TableCell from 'components/pages/plan/TableCell';
import Popup from 'components/Popup';
import DeleteChannelPopup from 'components/pages/plan/DeleteChannelPopup';
import EditChannelNamePopup from 'components/pages/plan/EditChannelNamePopup';
import EditableCell from 'components/pages/plan/EditableCell';
import {ContextMenu, SubMenu, MenuItem} from 'react-contextmenu';
import {TextContent as PopupTextContent} from 'components/pages/plan/Popup';
import {getChannelsWithProps} from 'components/utils/channels';
import groupBy from 'lodash/groupBy';
import union from 'lodash/union';
import sumBy from 'lodash/sumBy';

export default class BudgetTable extends Component {

  style = style;

  static propTypes = {
    tableRef: PropTypes.func,
    firstColumnCell: PropTypes.func,
    approvedBudgets: PropTypes.array,
    planUnknownChannels: PropTypes.array,
    projectedPlan: PropTypes.array,
    dates: PropTypes.array,
    updateState: PropTypes.func,
    approveWholeChannel: PropTypes.func,
    declineWholeMonth: PropTypes.func,
    approvedPlan: PropTypes.bool,
    isEditMode: PropTypes.bool,
    isShowSecondaryEnabled: PropTypes.bool,
    isConstraitsEnabled: PropTypes.bool,
    data: PropTypes.array
  };

  static defaultProps = {
    isEditMode: false,
    isShowSecondaryEnabled: true,
    isConstraitsEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      tableCollapsed: 0,
      collapsed: {}
    };
  }

  getMonthHeaders = () => {
    const currentMonth = parseInt(this.props.planDate.split('/')[0]);
    const headers = this.props.dates.map((month, index) => {
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
        <div className={this.classes.cellItem}>{month}</div>;
    });
    return headers;
  };

  dragStart = (value) => {
    this.setState({draggableValue: value, isDragging: true});
  };

  commitDrag = () => {
    let value = parseInt(this.state.draggableValue.replace(/[-$,]/g, ''));
    let planUnknownChannels = this.props.planUnknownChannels;
    let projectedPlan = this.props.projectedPlan;
    let approvedBudgets = this.props.approvedBudgets;
    this.state.draggableValues.forEach(cell => {
      if (planUnknownChannels.length >
        0 &&
        planUnknownChannels[cell.i] &&
        planUnknownChannels[cell.i][cell.channel] !==
        undefined) {
        planUnknownChannels[cell.i][cell.channel] = value || 0;
      }
      else {
        projectedPlan[cell.i].plannedChannelBudgets[cell.channel] = value || 0;
        if (!approvedBudgets[cell.i]) {
          approvedBudgets[cell.i] = {};
        }
        approvedBudgets[cell.i][cell.channel] = value;
      }
    });
    this.props.updateState({
      projectedPlan: projectedPlan,
      approvedBudgets: approvedBudgets,
      planUnknownChannels: planUnknownChannels
    });
    this.setState({isDragging: false, draggableValues: []});
  };

  dragEnter = (i, channel) => {
    const update = this.state.draggableValues || [];
    update.push({channel: channel, i: i});
    this.setState({draggableValues: update});
  };

  deleteRow = (channel, event) => {
    this.setState({deletePopup: ''});
    event.preventDefault();
    let planUnknownChannels = this.props.planUnknownChannels;
    let projectedPlan = this.props.projectedPlan;
    let approvedBudgets = this.props.approvedBudgets;
    for (let i = 0; i < 12; i++) {
      if (planUnknownChannels.length > 0 && planUnknownChannels[i][channel] !== undefined) {
        delete planUnknownChannels[i][channel];
      }
      else {
        delete projectedPlan[i].plannedChannelBudgets[channel];
        if (approvedBudgets[i]) {
          delete approvedBudgets[i][channel];
        }
      }
    }
    this.props.updateState({
      projectedPlan: projectedPlan,
      approvedBudgets: approvedBudgets,
      planUnknownChannels: planUnknownChannels
    });
  };

  getTableRow = (title, items, props, channel, hoverValues, isSecondGood) => {
    return <tr {...props}>
      <td className={this.classes.titleCell} ref={this.props.firstColumnCell}><TableCell primaryValue={title}/></td>
      {
        items.map((item, i) => {
          if (channel && this.props.isEditMode) {
            return <td className={this.classes.valueCell} key={i}>{
              <EditableCell
                title={(hoverValues && item !== hoverValues[i]) ? 'previous: ' + hoverValues[i] : null}
                value={item}
                onChange={(newValue) => this.editChannel(i, channel, newValue)}
                i={i}
                channel={channel}
                draggableValue={this.state.draggableValue}
                dragStart={this.dragStart}
                dragEnter={() => this.dragEnter(i, channel)}
                drop={this.commitDrag}
                isDragging={this.state.isDragging}/>
            }</td>;
          }
          else {
            const shouldShowSecondValue = this.props.isShowSecondaryEnabled &&
              channel &&
              hoverValues &&
              item !==
              hoverValues[i];
            return <TableCell
              primaryValue={item}
              secondaryValue={shouldShowSecondValue ? hoverValues[i] : null}
              key={i}
              approveSecondary={shouldShowSecondValue ? () => {
                this.props.approveChannel(i, channel, hoverValues[i]);
              } : null}
              style={shouldShowSecondValue ? {backgroundColor: '#329ff136'} : null}
            />;
          }
        })
      }
    </tr>;
  };

  getRowsNew = (data) => {
    return union(Object.keys(data).map(category => this.getCategoryRows(category, data[category])));
  };

  getCategoryRows = (category, channels) => {
    const categoryData = Array(12).fill(0).map((value, index) => {
      return {
        primaryBudget: sumBy(channels, channel => channel.values[index].primaryBudget),
        secondaryBudget: sumBy(channels, channel => channel.values[index].secondaryBudget)
      };
    });

    const categoryRow = this.GetTableRowNew({channel: category, nickname: category, values: categoryData}, true);

    return !this.state.collapsed[category] ?
      [categoryRow, ...channels.map((channel) => this.GetTableRowNew(channel, false))]
      : categoryRow;
  };

  updateBudget = (month, channel, newValue) => {
    console.log(`month ${month} + channel ${channel} + newValue ${newValue}`);
  };

  GetTableRowNew = (data, isCategoryRow) => {
    return <tr key={data.channel} data-category-row={isCategoryRow}>
      <div className={this.classes.rowTitle}>
        {isCategoryRow ?
          <div
            className={this.classes.rowArrow}
            data-collapsed={this.state.collapsed[data.channel] ? true : null}
            onClick={() => {
              this.setState({
                collapsed: {
                  ...this.state.collapsed,
                  [data.channel]: !this.state.collapsed[data.channel]
                }
              });
            }}
          /> : null}
        <div className={this.classes.rowIcon} data-icon={'plan:' + data.channel}/>
        <TableCell primaryValue={data.nickname}/>
      </div>

      {data.values.map((monthData, key) => {
        return <TableCell
          key={`${data.channel}:${key}`}
          primaryValue={monthData.primaryBudget}
          secondaryValue={!isCategoryRow && this.props.isShowSecondaryEnabled ? monthData.secondaryBudget : null}
          approveSecondary={() => this.updateBudget(key, data.channel, monthData.secondaryBudget)}
          isEditMode={!isCategoryRow && this.props.isEditMode}
          onChange={(newValue) => this.updateBudget(key, data.channel, newValue)}
        />;
      })}
    </tr>;
  };

  getRows = (data, parent, level) => {
    let rows = [];

    level = level | 0;

    Object.keys(data).sort().forEach((item, i) => {
      if (item === '__TOTAL__') {
        return null;
      }

      let key = parent + ':' + item + '-' + i;
      let collapsed = !!this.state.collapsed[key];
      const params = data[item];
      let values;
      let hoverValues;
      let isSecondGood = false;
      if (this.props.approvedPlan) {
        values = params.approvedValues.map(val => {
          if (val) {
            return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
          else {
            return '$0';
          }
        });
        hoverValues = params.values.map(val => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        isSecondGood = true;
      }
      else {
        values = params.values.map(val => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        hoverValues = params.approvedValues ? params.approvedValues.map(val => {
          if (val) {
            return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
          else {
            return '$0';
          }
        }) : undefined;
      }
      const titleElem = <div ref={params.channel ? this.props.setRef.bind(this, params.channel) : null}>
        {this.props.isEditMode && params.channel && !params.isOtherChannel ?
          <div className={this.classes.editChannelNameWrapper}>
            <div className={this.classes.editChannelName} onClick={() => {
              this.setState({editChannelName: params.channel});
            }}/>
          </div>
          : null}
        <ContextMenuTrigger id="rightClickNormal" collect={() => {
          return {channel: params.channel};
        }} disable={!params.channel || this.props.isEditMode}>
          <ContextMenuTrigger id="rightClickEdit" collect={() => {
            return {channel: params.channel};
          }} disable={!params.channel || !this.props.isEditMode}>
            <div
              style={{
                marginLeft: (level | 0) * 17 + 'px',
                cursor: (params.channel && !this.props.isEditMode) ? 'pointer' : 'initial'
              }}
              className={this.classes.rowTitle}>
              {params.children ?
                <div
                  hidden={this.state.tableCollapsed === 2}
                  className={this.classes.rowArrow}
                  data-collapsed={collapsed || null}
                  onClick={() => {
                    const newArray = [...this.state.collapsed];
                    newArray[key] = !collapsed;
                    this.setState({
                      collapsed: newArray
                    });

                    this.forceUpdate();
                  }}
                />
                :
                this.props.isEditMode ?
                  <div>
                    <div
                      className={this.classes.rowDelete}
                      onClick={() => this.setState({deletePopup: params.channel})}
                    />
                    <Popup hidden={params.channel !== this.state.deletePopup}
                           style={{top: '-72px', left: '130px', cursor: 'initial'}}>
                      <DeleteChannelPopup
                        onNext={(e) => this.deleteRow(params.channel, e)}
                        onBack={() => this.setState({deletePopup: ''})}
                      />
                    </Popup>
                    <Popup hidden={params.channel !== this.state.editChannelName}
                           style={{top: '-72px', left: '130px', cursor: 'initial'}}>
                      <EditChannelNamePopup
                        channel={this.state.editChannelName}
                        onNext={this.editChannelName}
                        onBack={() => this.setState({editChannelName: ''})}
                      />
                    </Popup>
                  </div>
                  : null}

              {params.icon ?
                <div className={this.classes.rowIcon} data-icon={params.icon}/>
                : null}

              {params.icon_mask ?
                <div className={this.classes.rowMaskIcon}>
                  <div className={this.classes.rowMaskIconInside} data-icon={params.icon_mask}/>
                </div>
                : null}
              {/**   { item.length > 13 ?
                <div>{ item.substr(0, item.lastIndexOf(' ', 13)) }
                  <br/> { item.substr(item.lastIndexOf(' ', 13) + 1, item.length) }
                </div>
                : item }**/}
              {item}
            </div>
          </ContextMenuTrigger>
        </ContextMenuTrigger>
      </div>;

      const rowProps = {
        className: this.props.isEditMode ? null : this.classes.tableRow,
        key: key,
        onMouseEnter: () => {
          this.setState({
            hoverRow: key
          });
        },
        onMouseLeave: () => {
          this.setState({
            hoverRow: void 0
          });
        }
      };

      if (params.disabled) {
        rowProps['data-disabled'] = true;
      }

      const row = this.getTableRow(titleElem, values, rowProps, params.channel, hoverValues, isSecondGood);
      rows.push(row);

      if (!collapsed && params.children && this.state.tableCollapsed !== 2) {
        rows = [...rows, this.getRows(params.children, key, level + 1)];
      }
    });

    return rows;
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

  editChannel = (i, channel, newValue) => {
    let value = parseInt(newValue.replace(/[-$,]/g, '')) || 0;
    let planUnknownChannels = this.props.planUnknownChannels || [];
    if (planUnknownChannels.length > 0 && planUnknownChannels[i] && planUnknownChannels[i][channel] !== undefined) {
      planUnknownChannels[i][channel] = value;
      this.props.updateState({planUnknownChannels: planUnknownChannels});
    }
    else {
      let projectedPlan = this.props.projectedPlan;
      let approvedBudgets = this.props.approvedBudgets;
      projectedPlan[i].plannedChannelBudgets[channel] = value;
      if (!approvedBudgets[i]) {
        approvedBudgets[i] = {};
      }
      approvedBudgets[i][channel] = value;
      this.props.updateState({projectedPlan: projectedPlan, approvedBudgets: approvedBudgets});
    }
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

  getDataWithCategories = (data) => {
    const props = getChannelsWithProps();

    const channelsArray = union(...data.map(month => Object.keys(month)))
      .map(channel => {
        const channelArray = Array(12).fill(
          {'primaryBudget': 0, 'secondaryBudget': 0});

        data.forEach((month, index) => {
          if (month[channel]) {
            channelArray[index] = month[channel];
          }
        });

        return {channel: channel, nickname: props[channel].nickname, values: channelArray};
      });

    return groupBy(channelsArray, (channel) => props[channel.channel].category);
  };

  render() {
    const data = parseBudgets(this.props.approvedBudgets,
      this.props.planUnknownChannels,
      null,
      this.props.projectedPlan);

    const dataWithCategories = this.getDataWithCategories(this.props.data);

    let values = data['__TOTAL__'].values.map(val => '$' + formatBudget(val));
    let hoverValues = data['__TOTAL__'].approvedValues.map(val => '$' + formatBudget(val));
    let isSecondGood = false;
    if (this.props.approvedPlan) {
      values = data['__TOTAL__'].approvedValues.map(val => '$' + formatBudget(val));
      hoverValues = data['__TOTAL__'].values.map(val => '$' + formatBudget(val));
      isSecondGood = true;
    }

    const headRow = this.getTableRow(<div className={this.classes.headTitleCell}>
      <div
        style={{borderColor: '#329ff1 transparent transparent transparent'}}
        className={this.classes.rowArrow}
        data-collapsed={this.state.tableCollapsed || null}
        onClick={() => {
          this.setState({
            tableCollapsed: ++this.state.tableCollapsed % 3
          });
          this.forceUpdate();
        }}
      />
      {'Marketing Channel'}
    </div>, this.getMonthHeaders(), {
      className: this.classes.headRow
    });

    const rows = data && this.state.tableCollapsed !== 1 ? this.getRowsNew(dataWithCategories) : [];

    const footRow = data && this.getTableRow(<div className={this.classes.footTitleCell}>
        {'TOTAL'}
      </div>,
      values.map((item, i) => {
        if (!this.props.isShowSecondaryEnabled) {
          return <TableCell primaryValue={item}/>;
        }
        else {
          return item === hoverValues[i] ?
            item
            :
            <TableCell
              primaryValue={item}
              secondaryValue={hoverValues[i]}
              key={i}
              approveSecondary={() => this.props.approveWholeMonth(i)}/>;
        }
      })
      , {
        className: this.classes.footRow
      });


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
}