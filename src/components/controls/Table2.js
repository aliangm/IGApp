import React from 'react'
import PropTypes from 'prop-types'
import ReactTable, { ReactTableDefaults } from 'react-table'
import { withFixedColumnsStickyPosition } from 'react-table-hoc-fixed-columns'
import Component from 'components/Component'
import style from 'styles/controls/table2.css'
import reactTableStyle from 'react-table/react-table.css'

const ReactTableFixedColumns = withFixedColumnsStickyPosition(ReactTable)

const tableStyles = style.locals

const ThComponent = ({ children, ...props }) => (
	<ReactTableDefaults.ThComponent {...props}>
		<div className={tableStyles.headCellContent}>{children}</div>
	</ReactTableDefaults.ThComponent>
)

const TdComponent = ({ children, ...props }) => (
	<ReactTableDefaults.TdComponent {...props}>
		<div className={tableStyles.cellContent}>{children}</div>
	</ReactTableDefaults.TdComponent>
)

export default class Table extends Component {
	styles = [style, reactTableStyle];

	static propTypes = {
		columns: PropTypes.arrayOf(PropTypes.shape({
			header: PropTypes.oneOfType(PropTypes.object, PropTypes.string),
			cell: PropTypes.function,
			footer: PropTypes.oneOfType(PropTypes.object, PropTypes.string),
			accessor: PropTypes.oneOfType(PropTypes.function, PropTypes.string),
		})),
		data: PropTypes.arrayOf(PropTypes.object),
	}

	makeColumns() {
		const { columns, duplicateFooterOnTop } = this.props

		return columns.map(({
			id,
			header,
			cell,
			footer,
			accessor = (item) => item,
			sortable = false,
			minWidth = 120,
			...other
		}) => {
			const cellProps = {
				id,
				accessor,
				sortable,
				minWidth,
				Cell: cell,
				...other,
			}

			return duplicateFooterOnTop
				? {
					...cellProps,
					Header: header,
					columns: [
						{
							...cellProps,
							Header: footer,
							Footer: footer,
						}
					],
				}
				: {
					...cellProps,
					Header: header,
					Footer: footer,
				}
		})
	}

	render() {
		const { data, columns, ...other } = this.props

		return (
			<div className={tableStyles.wrap}>
				<div className={tableStyles.box}>
					<ReactTableFixedColumns
						ThComponent={ThComponent}
						TdComponent={TdComponent}
						showPagination={false}
						pageSize={data.length}
						resizable={true}
						className={tableStyles.table}
						data={data}
						columns={this.makeColumns()}
						getTheadGroupTrProps={() => ({ className: tableStyles.headRow })}
						getTheadGroupThProps={() => ({ className: tableStyles.cell })}
						getTheadTrProps={() => ({ className: tableStyles.headRow })}
						getTheadThProps={() => ({ className: tableStyles.cell })}
						getTrProps={() => ({ className: tableStyles.tableRow })}
						getTdProps={() => ({ className: tableStyles.cell })}
						getTfootProps={() => ({ className: tableStyles.foot })}
						getTfootTrProps={() => ({ className: tableStyles.footRow })}
						getTfootTdProps={() => ({ className: tableStyles.cell })}
						{...other}
					/>
				</div>
			</div>
		)
	}
}