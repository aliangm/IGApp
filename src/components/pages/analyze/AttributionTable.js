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
    getItemTitle: PropTypes.func,
    additionalColumns: PropTypes.array,
    additionalColumnValue: PropTypes.func,
    formatAdditionColumn: PropTypes.func,
    formatAdditionColumnTotal: PropTypes.func,
    showTotalRow: PropTypes.bool,
    showCostColumns: PropTypes.bool
  };

  static defaultProps = {
    additionalColumns: [],
    showTotalRow: true,
    showCostColumns: true
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedStageIndex: 0,
      sortByColumn: 'row-title',
      isReverse: true
    };
  }

  render() {
    const {showCostColumns, showTotalRow, additionalColumns, formatAdditionColumn, formatAdditionColumnTotal, data, titleColumnName, getItemCost, getItemData, getItemTitle, additionalColumnValue} = this.props;
    const {selectedStageIndex, sortByColumn, isReverse} = this.state;

    const getInfluencedDataKey = (dataKey) => {
      return `influenced${capitalize(dataKey)}`;
    };

    const costDependentColumnTypes = ['cost', 'efficiency', 'roi', 'pipeline-roi'];

    const basicStages = [
      {
        name: 'Visitors',
        dataKey: 'webVisits',
        columns: [
          {title: titleColumnName, type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Web Visitors', type: 'stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'}
        ]
      },
      {
        name: 'Leads',
        dataKey: 'MCL',
        columns: [
          {title: titleColumnName, type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Touched Leads', type: 'stage-indicator'},
          {title: 'Attributed Leads', type: 'influenced-stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'}
        ]
      },
      {
        name: 'MQLs', dataKey: 'MQL', columns: [
          {title: titleColumnName, type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Touched MQLs', type: 'influenced-stage-indicator'},
          {title: 'Attributed MQLs', type: 'stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'}
        ]
      },
      {
        name: 'SQLs', dataKey: 'SQL', columns: [
          {title: titleColumnName, type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Touched SQLs', type: 'influenced-stage-indicator'},
          {title: 'Attributed SQLs', type: 'stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'}
        ]
      },
      {
        name: 'Opps', dataKey: 'opps', columns: [
          {title: titleColumnName, type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Touched Opps', type: 'influenced-stage-indicator'},
          {title: 'Attributed Opps', type: 'stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'},
          {title: 'Pipeline', type: 'pipeline'},
          {title: 'Pipeline ROI', type: 'pipeline-roi'}
        ]
      },
      {
        name: 'Customers', dataKey: 'users', columns: [
          {title: titleColumnName, type: 'row-title'},
          {title: 'Cost', type: 'cost'},
          {title: 'Touched Customers', type: 'influenced-stage-indicator'},
          {title: 'Attributed Customers', type: 'stage-indicator'},
          {title: 'Efficiency', type: 'efficiency'},
          {title: 'Touched Revenue', type: 'influenced-revenue'},
          {title: 'Attributed Revenue', type: 'revenue'},
          {title: 'ROI', type: 'roi'},
          {title: 'ARPA', type: 'arpa'},
          {title: 'LTV', type: 'ltv'}
        ]
      }];

    const stagesWithCost = showCostColumns ? basicStages
      : basicStages.map(stage => {
        const filterColumns = stage.columns.filter(column => !costDependentColumnTypes.includes(column.type));
        return {...stage, columns: filterColumns};
      });

    const stages = stagesWithCost.map(stage => {
      const atStart = additionalColumns.filter(column => column.atStart);
      const atEnd = additionalColumns.filter(column => !column.atStart);
      return {...stage, columns: [...atStart, ...stage.columns, ...atEnd]};
    });

    const selectedStage = stages[selectedStageIndex];
    const headRow = this.getTableRow(null, selectedStage.columns.map(({title, type}) => {
      return <div style={{cursor: 'pointer'}} onClick={() => {
        if(type === sortByColumn){
          this.setState({isReverse: !isReverse});
        }
        else {
          this.setState({sortByColumn: type, isReverse: true});
        }
      }}>
        {title}
      </div>;
    }), {className: dashboardStyle.locals.headRow});

    const formatIndicator = (value) => formatNumber(Math.round(value));
    const stageIndicatorKey = selectedStage.dataKey;

    const getMetricNumber = (item) => getItemData(item, stageIndicatorKey);
    const getInfluencedMetricNumber = (item) => getItemData(item, getInfluencedDataKey(stageIndicatorKey));

    const getItemRevenue = (item) => getItemData(item, 'revenue');

    const getPipeline = (item) => getItemData(item, 'pipeline');
    const getLTV = (item) => getItemData(item, 'LTV');
    const getInfluencedRevenue = (item) => getItemData(item, 'influencedRevenue');

    const getColumnRawData = (item, columnType) => {
      switch (columnType) {
        case 'row-title': {
          return getItemTitle(item);
        }
        case 'cost':
          return formatNumber(getItemCost(item));
        case 'stage-indicator':
          return getMetricNumber(item);
        case 'influenced-stage-indicator':
          return getInfluencedMetricNumber(item);
        case 'efficiency':
          return getItemCost(item) / getMetricNumber(item);
        case 'revenue':
          return getItemRevenue(item);
        case 'arpa':
          return getItemRevenue(item) / getMetricNumber(item);
        case 'roi':
          return getItemRevenue(item) / getItemCost(item);
        case 'pipeline':
          return getPipeline(item);
        case 'pipeline-roi':
          return getPipeline(item) / getItemCost(item);
        case 'ltv':
          return getLTV(item);
        case 'influenced-revenue':
          return getInfluencedRevenue(item);
        default:
          return additionalColumnValue(item, columnType);
      }
    };

    const dollarFormatter = (value) => '$' + formatNumber(value);
    const averageFormatter = (value) => isFinite(value) ? '$' + value : (isNaN(value) ? '0' : '-');
    const efficiencyFormatter = (value) => {
      const efficiency = averageFormatter(value);
      return efficiency === '0' || efficiency === '-' ? efficiency :
        efficiency + '/' + selectedStage.name;
    };

    const formatColumnData =
      {
        'row-title': value => value,
        'cost': dollarFormatter,
        'stage-indicator': formatIndicator,
        'influenced-stage-indicator': formatIndicator,
        'efficiency': efficiencyFormatter,
        'revenue': dollarFormatter,
        'arpa': averageFormatter,
        'roi': averageFormatter,
        'pipeline': dollarFormatter,
        'pipeline-roi': averageFormatter,
        'ltv': dollarFormatter,
        'influenced-revenue': dollarFormatter
      };

    const getColumnData = (item, columnType) => {
      const value = getColumnRawData(item, columnType);
      const formatter = get(formatColumnData, columnType, (value) => formatAdditionColumn(value, columnType));
      return formatter(value);
    };

    const getTotalColumnData = (data, columnType) => {
      const getTotalCost = () => sumBy(data, getItemCost);

      const totalIndicatorGenerated = (data, getChannelData) => Math.round(data.reduce((sum,
                                                                                        item) => sum +
        getChannelData(item), 0) * 100) /
        100;

      const totalMetric = () => totalIndicatorGenerated(data, getMetricNumber);

      const totalRevenue = () => sumBy(data, getItemRevenue);
      const totalInfluencedRevenue = () => sumBy(data, getInfluencedRevenue);
      const totalPipeline = () => sumBy(data, getPipeline);
      const totalLTV = () => sumBy(data, getLTV);

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
          return efficiencyFormatter(getTotalCost(), totalMetric(), selectedStage.name);
        case 'revenue':
          return '$' + formatNumber(totalRevenue());
        case 'arpa':
          return averageFormatter(totalRevenue(), totalMetric());
        case 'roi':
          return averageFormatter(totalRevenue(), getTotalCost());
        case 'pipeline':
          return '$' + formatNumber(totalPipeline());
        case 'pipeline-roi':
          return averageFormatter(totalPipeline(), getTotalCost());
        case 'ltv':
          return '$' + totalLTV();
        case 'influenced-revenue':
          return '$' + totalInfluencedRevenue();
        default:
          return formatAdditionColumnTotal(data, columnType);
      }
    };

    const sortedData = sortBy(data, item => getColumnRawData(item, sortByColumn));
    const reversedSortedData = isReverse ? [...sortedData].reverse() : sortedData;

    const stagesData = stages.map(stage => {
      return {
        stageName: stage.name,
        number: formatNumber(Math.round(sumBy(data,
          item => getItemData(item, stage.dataKey))))
      };
    });

    const rows = reversedSortedData
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