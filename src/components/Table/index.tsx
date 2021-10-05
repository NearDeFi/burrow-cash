//@ts-nocheck
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import { createTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import { withStyles } from '@mui/styles';
import clsx from 'clsx';
import * as React from 'react';
import {
	AutoSizer,
	Column,
	Table,
	TableCellRenderer,
	TableHeaderProps
} from 'react-virtualized';
import { styles } from './style';

class MuiVirtualizedTable extends React.PureComponent<MuiVirtualizedTableProps> {
	static defaultProps = {
		headerHeight: 18,
		rowHeight: 80,
	};

	getRowClassName = ({ index }: Row) => {
		const { classes, onRowClick } = this.props;

		return clsx(classes.tableRow, classes.flexContainer, {
			[classes.tableRowHover]: index !== -1 && onRowClick != null,
		});
	};

	SwitchcellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
		const { columns, classes, rowHeight, onRowClick } = this.props;
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{ height: rowHeight, color: "white" }}
				align={"left"}
			>
				<Switch
					edge="end"
					onChange={() => {}}
					checked={cellData}
					inputProps={{
						'aria-labelledby': 'switch-list-label-wifi',
					}}
				/>
			</TableCell>
		);
	};

	NamecellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
		const { columns, classes, rowHeight, onRowClick } = this.props;
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{ height: rowHeight, color: "#000741" }}
				align={"left"}
			>
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
					<Avatar
					/>
				<div style={{display: "flex", flexDirection: "column", flexGrow: "1", paddingLeft: "0.3em"}}>
					<div>{cellData}</div>
					<div>{'$10.00'}</div>
					</div>
				</div>
			</TableCell>
		);
	};

	cellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
		const { columns, classes, rowHeight, onRowClick } = this.props;
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{ height: rowHeight, color: "#000741" }}
				align={
					"left"}
			>
				{`${cellData}.00%`}
			</TableCell>
		);
	};

	headerRenderer = ({
		label,
		columnIndex,
	}: TableHeaderProps & { columnIndex: number }) => {
		const { headerHeight, columns, classes } = this.props;

		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.noClick)}
				variant="head"
				style={{ height: headerHeight, color: "#000741" }}
				align={"left"}
			>
				<span>{label}</span>
			</TableCell>
		);
	};

	render() {
		const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
		return (
			<AutoSizer>
				{({ height, width }) => (
					<Table
						height={height}
						width={width}
						rowHeight={rowHeight!}
						gridStyle={{
							direction: 'inherit',
						}}
						headerHeight={headerHeight!}
						className={classes.table}
						{...tableProps}
						rowClassName={this.getRowClassName}
					>
						{columns.map(({ dataKey, ...other }, index) => {
							return (
								<Column
									key={dataKey}
									headerRenderer={(headerProps) =>
										this.headerRenderer({
											...headerProps,
											columnIndex: index,
										})
									}
									className={classes.flexContainer}
									cellRenderer={dataKey === "collateral"
										? this.SwitchcellRenderer
										: dataKey === "name"
											? this.NamecellRenderer
											:
											this.cellRenderer}
									dataKey={dataKey}
									{...other}
								/>
							);
						})}
					</Table>
				)}
			</AutoSizer>
		);
	}
}

const defaultTheme = createTheme();
const VirtualizedTable = withStyles(styles, { defaultTheme })(MuiVirtualizedTable);

interface TableProps {
	rows: any,
	columns: any
}

const ReactVirtualizedTable = ({ rows = [], columns = [] }: TableProps) => {
	return (
		<Paper style={{ paddingTop: "2em", height: 400, width: '100%' , backgroundColor: 'transparent', boxShadow: "none" }}>
			<VirtualizedTable
				rowCount={rows?.length}
				rowGetter={({ index }) => rows[index]}
				columns={columns}
			/>
		</Paper>
	);
}

export default ReactVirtualizedTable;