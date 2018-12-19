import React, {PropTypes} from 'react';
import Component from 'components/Component';
import dashboardStyle from 'styles/dashboard/dashboard.css';
import {formatNumber} from 'components/utils/budget';
import {capitalize, sortBy, sumBy, get} from 'lodash';
import StageSelector from 'components/pages/analyze/StageSelector';
import style from 'styles/onboarding/onboarding.css';

export default class AttributionTable extends Component {

  style = style;
  styles = [dashboardStyle];

  static propTypes = {
    data: PropTypes.array,
    titleColumnName: PropTypes.string,
    getItemCost: PropTypes.func,
    getItemData: PropTypes.func,
    formatAverage: PropTypes.func,
    formatEffciency: PropTypes.func,
    getItemTitle: PropTypes.func,
    additionalColumns: PropTypes.array,
    formatAdditionColumn: PropTypes.func,
    formatAdditionColumnTotal: PropTypes.func,
    showTotalRow: PropTypes.bool,
    costExistsForData: PropTypes.bool
  };

  static defaultProps = {
    additionalColumns: [],
    showTotalRow: true,
    costExistsForData: true
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedStageIndex: 0,
      sortByColumn: 'row-title'
    };
  }

  render() {
    const {costExistsForData, showTotalRow, additionalColumns, formatAdditionColumn, formatAdditionColumnTotal, data, titleColumnName, getItemCost, getItemData, formatAverage, formatEffciency, getItemTitle} = this.props;
    const {selectedStageIndex, sortByColumn} = this.state;

    const getInfluencedDataKey = (dataKey) => {
      return `influenced${capitalize(dataKey)}`;
    };

    const costColumns = [{
      dataKey: 'webVisits',
      columns: [
        {title: 'Cost', type: 'cost'},
        {title: 'Efficiency', type: 'efficiency'}
      ]
    },
      {
        dataKey: 'MCL',
        columns: [
          {title: 'Cost', type: 'cost'},
          {title: 'Efficiency', type: 'efficiency'}
        ]
      },
      {
        dataKey: 'MQL',
        columns: [
          {title: 'Cost', type: 'cost'},
          {title: 'Efficiency', type: 'efficiency'}
        ]
      },
      {
        dataKey: 'SQL',
        columns: [
          {title: 'Cost', type: 'cost'},
          {title: 'Efficiency', type: 'efficiency'}
        ]
      },
      {
        dataKey: 'opps', columns: [
          {title: 'Cost', type: 'cost'},
          {title: 'Efficiency', type: 'efficiency'}
        ]
      },
      {
        dataKey: 'users', columns: [
          {title: 'Cost', type: 'cost'},
          {title: 'Efficiency', type: 'efficiency'},
          {title: 'Revenue', type: 'revenue'},
          {title: 'ARPA', type: 'arpa'},
          {title: 'ROI', type: 'roi'}
        ]
      }
      ];

    const basicStages = [
      {
        name: 'Visitors',
        dataKey: 'webVisits',
        columns: [
          {title: titleColumnName, type: 'row-title'},
          {title: 'Web Visitors', type: 'stage-indicator'},
        ]
      },
      {
        name: 'Leads',
        dataKey: 'MCL',
        columns: [
          {title: titleColumnName, type: 'row-title'},
          {title: 'Influenced/Touched Leads', type: 'stage-indicator'},
          {title: 'Attributed Leads', type: 'influenced-stage-indicator'},
        ]
      },
      {
        name: 'MQLs', dataKey: 'MQL', columns: [
          {title: titleColumnName, type: 'row-title'},
          {title: 'Attributed MQLs', type: 'stage-indicator'},
          {title: 'Influenced/Touched MQLs', type: 'influenced-stage-indicator'}
        ]
      },
      {
        name: 'SQLs', dataKey: 'SQL', columns: [
          {title: titleColumnName, type: 'row-title'},
          {title: 'Attributed SQLs', type: 'stage-indicator'},
          {title: 'Influenced/Touched SQLs', type: 'influenced-stage-indicator'}
        ]
      },
      {
        name: 'Opps', dataKey: 'opps', columns: [
          {title: titleColumnName, type: 'row-title'},
          {title: 'Attributed Opps', type: 'stage-indicator'},
          {title: 'Influenced/Touched Opps', type: 'influenced-stage-indicator'}
        ]
      },
      {
        name: 'Customers', dataKey: 'users', columns: [
          {title: titleColumnName, type: 'row-title'},
          {title: 'Attributed Customers', type: 'stage-indicator'},
          {title: 'Influenced/Touched Customers', type: 'influenced-stage-indicator'},
        ]
      }];

    const stagesWithCost = costExistsForData ? basicStages.map(stage => {
      const costColumnsToAdd = get(costColumns.find(({type}) => stage.type === type), 'columns', []);
      return {...stage, columns: [...stage.columns, ...costColumnsToAdd]}
    }) : basicStages;

    const stages = stagesWithCost.map(stage => {
      const atStart = additionalColumns.filter(column => column.atStart);
      const atEnd = additionalColumns.filter(column => !column.atStart);
      return {...stage, columns: [...atStart, ...stage.columns, ...atEnd]};
    });

    const selectedStage = stages[selectedStageIndex];
    const headRow = this.getTableRow(null, selectedStage.columns.map(({title, type}) => {
      return <div style={{cursor: 'pointer'}} onClick={() => this.setState({sortByColumn: type})}>
        {title}
      </div>;
    }), {className: dashboardStyle.locals.headRow});

    const formatIndicator = (value) => formatNumber(Math.round(value));
    const stageIndicatorKey = selectedStage.dataKey;

    const getMetricNumber = (item) => getItemData(item, stageIndicatorKey);
    const getInfluencedMetricNumber = (item) => getItemData(item, getInfluencedDataKey(stageIndicatorKey));

    const getItemRevenue = (item) => getItemData(item, 'revenue');

    const getColumnData = (item, columnType) => {
      switch (columnType) {
        case 'row-title': {
          return getItemTitle(item);
        }
        case 'cost':
          return '$' + formatNumber(getItemCost(item));
        case 'stage-indicator':
          return formatIndicator(getMetricNumber(item));
        case 'influenced-stage-indicator':
          return formatIndicator(getInfluencedMetricNumber(item));
        case 'efficiency':
          return formatEffciency(getItemCost(item), getMetricNumber(item), selectedStage.name);
        case 'revenue':
          return '$' + formatNumber(getItemRevenue(item));
        case 'arpa':
          return formatAverage(getItemRevenue(item), getMetricNumber(item));
        case 'roi':
          return formatAverage(getItemRevenue(item), getItemCost(item));
        default:
          return formatAdditionColumn(item, columnType);
      }
    };

    const getTotalColumnData = (data, columnType) => {
      const getTotalCost = () => sumBy(data, getItemCost);

      const totalIndicatorGenerated = (data, getChannelData) => Math.round(data.reduce((sum,
                                                                                        item) => sum +
        getChannelData(item), 0) * 100) /
        100;

      const totalMetric = () => totalIndicatorGenerated(data, getMetricNumber);

      const totalRevenue = () => sumBy(data, getItemRevenue);

      switch (columnType) {
        case 'row-title':
          return 'Total';
        case 'cost':
          return '$' + formatNumber(getTotalCost());
        case 'stage-indicator':
          return totalMetric();
        case 'influenced-stage-indicator':
          return totalIndicatorGenerated(data, getInfluencedMetricNumber);
        case 'efficiency':
          return formatEffciency(getTotalCost(), totalMetric(), selectedStage.name);
        case 'revenue':
          return '$' + formatNumber(totalRevenue());
        case 'arpa':
          return formatAverage(totalRevenue(), totalMetric());
        case 'roi':
          return formatAverage(totalRevenue(), getTotalCost());
        default:
          return formatAdditionColumnTotal(data, columnType);
      }
    };

    const sortedData = sortBy(data, item => getColumnData(item, sortByColumn));

    const stagesData = stages.map(stage => {
      return {
        stageName: stage.name,
        number: formatNumber(Math.round(sumBy(data,
          item => getItemData(item, stage.dataKey))))
      };
    });

    const rows = sortedData
      .map((item, key) => {
        return this.getTableRow(null,
          selectedStage.columns.map(column => getColumnData(item, column.type)), {
            key,
            className: dashboardStyle.locals.tableRow
          });
      });

    const footRow = showTotalRow && this.getTableRow(null,
      selectedStage.columns.map(column => getTotalColumnData(data, column.type)),
      {
        className: dashboardStyle.locals.footRow
      });

    return <div>
      <div style={{width: '1110px', margin: '15px'}}>
        <StageSelector stages={stagesData}
                       selectedIndex={selectedStageIndex}
                       selectStage={(index) => this.setState({selectedStageIndex: index})}/>
      </div>
      <div className={dashboardStyle.locals.item}
           style={{height: '459px', width: '1110px', overflow: 'visible', padding: '15px 0'}}>
        <table className={dashboardStyle.locals.table}>
          <thead className={dashboardStyle.locals.tableHead}>
          {headRow}
          </thead>
          <tbody className={dashboardStyle.locals.tableBody}>
          {rows}
          </tbody>
          <tfoot>
          {footRow}
          </tfoot>
        </table>
      </div>
    </div>;
  }

  getTableRow(title, items, props) {
    return <tr {...props}>
      {title != null ?
        <td className={this.classes.titleCell}>{this.getCellItem(title)}</td>
        : null}
      {
        items.map((item, i) => {
          return <td className={this.classes.valueCell} key={i}>{
            this.getCellItem(item)
          }</td>;
        })
      }
    </tr>;
  }

  getCellItem(item) {
    let elem;

    if (typeof item !== 'object') {
      elem = <div className={this.classes.cellItem}>{item}</div>;
    }
    else {
      elem = item;
    }

    return elem;
  }
}