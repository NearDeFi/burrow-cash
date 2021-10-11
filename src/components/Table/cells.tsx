export {};
// import Avatar from '@mui/material/Avatar';
// import Switch from '@mui/material/Switch';
// import TableCell from '@mui/material/TableCell';
// import clsx from 'clsx';
// import * as React from 'react';
// import {
// 	TableCellRenderer
// } from 'react-virtualized';

// export const SwitchcellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
// 	const { columns, classes, rowHeight, onRowClick } = this.props;
// 	return (
// 		<TableCell
// 			component="div"
// 			className={clsx(classes.tableCell, classes.flexContainer, {
// 				[classes.noClick]: onRowClick == null,
// 			})}
// 			variant="body"
// 			style={{ height: rowHeight, color: "white" }}
// 			align={"left"}
// 		>
// 			<Switch
// 				edge="end"
// 				onChange={() => { }}
// 				checked={cellData}
// 				inputProps={{
// 					'aria-labelledby': 'switch-list-label-wifi',
// 				}}
// 			/>
// 		</TableCell>
// 	);
// };

// export const NamecellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
// 	const { columns, classes, rowHeight, onRowClick } = this.props;
// 	return (
// 		<TableCell
// 			component="div"
// 			className={clsx(classes.tableCell, classes.flexContainer, {
// 				[classes.noClick]: onRowClick == null,
// 			})}
// 			variant="body"
// 			style={{ height: rowHeight, color: "#000741" }}
// 			align={"left"}
// 		>
// 			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
// 				<Avatar
// 				/>
// 				<div style={{ display: "flex", flexDirection: "column", flexGrow: "1", paddingLeft: "0.3em" }}>
// 					<div>{cellData}</div>
// 					<div>{'$10.00'}</div>
// 				</div>
// 			</div>
// 		</TableCell>
// 	);
// };

// export const cellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
// 	console.log("🚀 ~ file: index.tsx ~ line 86 ~ MuiVirtualizedTable ~ cellData", cellData)
// 	const { columns, classes, rowHeight, onRowClick } = this.props;
// 	return (
// 		<TableCell
// 			component="div"
// 			className={clsx(classes.tableCell, classes.flexContainer, {
// 				[classes.noClick]: onRowClick == null,
// 			})}
// 			variant="body"
// 			style={{ height: rowHeight, color: "#000741" }}
// 			align={
// 				"left"}
// 		>
// 			{`${cellData}.00%`}
// 		</TableCell>
// 	);
// };
