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
import { ModalContext } from '../Modal';
import { styles } from './style';
import { MuiVirtualizedTableProps, Row } from './types';

const HEADER_HEIGHT = 18;
const ROW_HEIGHT = 80;

export const MuiVirtualizedTable = (props: MuiVirtualizedTableProps) => {
	const modal = React.useContext(ModalContext);
	const getRowClassName = ({ index }: Row) => {
		const { classes, onRowClick } = props;

		return clsx(classes.tableRow, classes.flexContainer, {
			[classes.tableRowHover]: index !== -1 && onRowClick != null,
		});
	};

	const SwitchcellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
		const { columns, classes, onRowClick } = props;
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{ height: ROW_HEIGHT, color: "white" }}
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

	const NamecellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
		const { columns, classes, onRowClick } = props;
		const tokenPrice = "2.00"
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{ height: ROW_HEIGHT, color: "#000741" }}
				align={"left"}
			>
				<div onClick={modal.handleOpen} style={{ display: "grid", gridTemplateColumns: "0.5fr 1fr" }}>
					<Avatar
					/>
				<div style={{display: "flex", flexDirection: "column", flexGrow: 1, paddingLeft: "0.3em"}}>
					<div>{cellData}</div>
					<div>{`$ ${tokenPrice}`}</div>
					</div>
				</div>
			</TableCell>
		);
	};

	const cellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
		const { columns, classes, onRowClick } = props;
		const data = String(cellData) + ".00%"
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{ height: ROW_HEIGHT, color: "#000741", display: "grid" }}
				align={"left"}
			>
				{/* <div onClick={modal.handleOpen} style={{ display: "grid" }}> */}
					<div style={{justifySelf: "end"}}>
						<div>{data}</div>
					{/* </div> */}
				</div>
			</TableCell>
		);
	};

	const headerRenderer = ({
		label,
		columnIndex,
	}: TableHeaderProps & { columnIndex: number }) => {
		const { columns, classes } = props;
		const isLastColumn = columnIndex === columns?.length - 1;
		const justifyContent = isLastColumn ? "right" : "left";

		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.noClick)}
				variant="head"
				style={{ height: HEADER_HEIGHT, color: "#000741", display: "flex", justifyContent: justifyContent }}
			>
				{label}
			</TableCell>
		);
	};

		const { classes, columns, ...tableProps } = props;
		return (
			<AutoSizer>
				{({ height, width }) => (
					<Table
						height={height}
						width={width}
						rowHeight={ROW_HEIGHT}
						gridStyle={{
							direction: 'inherit',
						}}
						headerHeight={HEADER_HEIGHT}
						className={classes.table}
						{...tableProps}
						rowClassName={getRowClassName}
					>
						{columns.map(({ dataKey, ...other }, index) => {
							return (
								<Column
									key={dataKey}
									headerRenderer={(headerProps) =>
										headerRenderer({
											...headerProps,
											columnIndex: index,
										})
									}
									className={classes.flexContainer}
									cellRenderer={dataKey === "collateral"
										? SwitchcellRenderer
										: dataKey === "name"
											? NamecellRenderer
											: cellRenderer}
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

const defaultTheme = createTheme();
const VirtualizedTable = withStyles(styles, { defaultTheme })(MuiVirtualizedTable);

interface TableProps {
	rows: any,
	columns: any,
	height?: number,
}

const ReactVirtualizedTable = ({ rows = [], columns = [], height = 400 }: TableProps) => {
	return (
		<Paper style={{ paddingTop: "2em", height, width: '100%', backgroundColor: 'transparent', boxShadow: "none" }}>
			<VirtualizedTable
				rowCount={rows?.length}
				rowGetter={({ index }) => rows[index]}
				columns={columns}
				
			/>
		</Paper>
	);
}

export default ReactVirtualizedTable;