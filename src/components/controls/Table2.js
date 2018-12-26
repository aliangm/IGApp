import React from 'react'
import PropTypes from 'prop-types'
import ReactTable, { ReactTableDefaults } from 'react-table'
import Component from 'components/Component'
import style from 'styles/controls/table2.css'
import reactTableStyle from 'react-table/react-table.css'

const tableStyles = style.locals

const ThComponent = ({ children, ...props }) => (
	<ReactTableDefaults.ThComponent {...props}>
		<div className={tableStyles.cellContent}>{children}</div>
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
			footer: PropTypes.object,
			accessor: PropTypes.oneOfType(PropTypes.function, PropTypes.string),
		})),
		data: PropTypes.arrayOf(PropTypes.object),
	}

	makeColumns() {
		return this.props.columns.map(({ id, header, cell, footer, accessor, ...other }) => ({
			id,
			Header: header,
			Cell: cell,
			Footer: footer,
			accessor,
			className: tableStyles.valueCell,
			...other
		}))
	}

	render() {
		const { data, columns, ...other } = this.props

		return (
			<div className={style.wrap}>
				<div className={style.box}>
					<ReactTable
						ThComponent={ThComponent}
						TdComponent={TdComponent}
						showPagination={false}
						defaultPageSize={data.length}
						resizable={true}
						className={style.table}
						data={data}
						columns={this.makeColumns()}
						getTheadTrProps={() => ({ className: tableStyles.headRow })}
						getTheadThProps={() => ({ className: tableStyles.cell })}
						getTrProps={() => ({ className: tableStyles.tableRow })}
						getTdProps={() => ({ className: tableStyles.cell })}
						{...other}
					/>
				</div>
			</div>
		)
	}
}