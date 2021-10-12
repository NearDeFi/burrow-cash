import Avatar from "@mui/material/Avatar";
import { createTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import TableCell from "@mui/material/TableCell";
import { withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";
import { AutoSizer, Column, Table, TableCellRenderer, TableHeaderProps } from "react-virtualized";
import { colors, Heading4, Heading6 } from "../../style";
import { ModalContext } from "../Modal";
import {
	APYCellWrapper,
	DefaultCellWrapper,
	styles,
	TableWrapper,
	TokenNameCellWrapper,
	TokenNameTextWrapper,
} from "./style";
import { MuiVirtualizedTableProps, Row, TableProps } from "./types";

const HEADER_HEIGHT = 18;
const ROW_HEIGHT = 80;

const TableTemplate = (props: MuiVirtualizedTableProps) => {
	const modal = React.useContext(ModalContext);
	const { columns, classes, onRowClick, ...tableProps } = props;
	const getRowClassName = ({ index }: Row) => {
		const { classes, onRowClick } = props;

		return clsx(classes.tableRow, classes.flexContainer, {
			[classes.tableRowHover]: index !== -1 && onRowClick != null,
		});
	};

	const CollateralCell: TableCellRenderer = ({ cellData, columnIndex }) => {
		return (
			<TableCell
				component="div"
				className={clsx(classes.flexy, classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{
					display: "grid",
					justifyContent: "end",
					height: ROW_HEIGHT,
					color: "white",
					flex: "0 1 150px !important",
				}}
			>
				<Switch
					classes={{ colorPrimary: colors.primary }}
					edge="end"
					color={"primary"}
					onChange={() => {}}
					checked={cellData}
					inputProps={{}}
				/>
			</TableCell>
		);
	};

	const TokenNameCell: TableCellRenderer = ({ cellData, columnIndex }) => {
		const tokenPrice = "2.00";

		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{ width: "200px", height: ROW_HEIGHT, color: "#000741" }}
			>
				<TokenNameCellWrapper onClick={modal.handleOpen}>
					<Avatar />
					<TokenNameTextWrapper>
						<Heading4 cellData={cellData} />
						<Heading6 cellData={`$ ${tokenPrice}`} />
					</TokenNameTextWrapper>
				</TokenNameCellWrapper>
			</TableCell>
		);
	};

	const APYCell: TableCellRenderer = ({ cellData, dataKey }) => {
		const data = String(cellData) + ".00%";
		const style = { height: ROW_HEIGHT, color: "#000741", display: "grid" };

		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={style}
			>
				<APYCellWrapper justifySelf={dataKey === "borrowAPY" ? "end" : "center"}>
					<Heading4 cellData={data} />
				</APYCellWrapper>
			</TableCell>
		);
	};

	const DefaultCell: TableCellRenderer = ({ cellData, columnIndex }) => {
		const data = String(cellData) + ".00%";
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
				<DefaultCellWrapper>
					<Heading4 cellData={data} />
				</DefaultCellWrapper>
			</TableCell>
		);
	};

	const HeaderCell = ({ label, columnIndex }: TableHeaderProps & { columnIndex: number }) => {
		const isFirstColumn = columnIndex === 0;
		const isLastColumn = columnIndex === columns?.length - 1;
		const justifyContent = isLastColumn ? "right" : isFirstColumn ? "left" : "center";
		const style = {
			fontWeight: 500,
			fontSize: "12px",
			lineHeight: "19px",
			height: HEADER_HEIGHT,
			color: "#000741",
			display: "flex",
			justifyContent: justifyContent,
			maxWidth: "200px",
		};

		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.noClick)}
				variant="head"
				style={style}
			>
				{label}
			</TableCell>
		);
	};

	const getCell = (dataKey: string) => {
		if (dataKey === "collateral") return CollateralCell;
		if (dataKey === "name") return TokenNameCell;
		if (dataKey === "borrowAPY" || "supplyAPY") return APYCell;

		return DefaultCell;
	};

	return (
		<AutoSizer>
			{({ height, width }) => (
				<Table
					height={height}
					width={width}
					rowHeight={ROW_HEIGHT}
					gridStyle={{
						direction: "inherit",
					}}
					headerHeight={HEADER_HEIGHT}
					className={classes.table}
					rowClassName={getRowClassName}
					{...tableProps}
				>
					{columns.map(({ dataKey, ...other }, index) => {
						return (
							<Column
								key={dataKey}
								flexShrink={columns?.length > 2 && dataKey === "name" ? 0 : 1}
								headerRenderer={(headerProps) =>
									HeaderCell({
										...headerProps,
										columnIndex: index,
									})
								}
								className={classes.flexContainer}
								cellRenderer={getCell(dataKey)}
								dataKey={dataKey}
								{...other}
							/>
						);
					})}
				</Table>
			)}
		</AutoSizer>
	);
};

const defaultTheme = createTheme();

const VirtualizedTable = withStyles(styles, { defaultTheme })(TableTemplate);

const ReactVirtualizedTable = ({ rows = [], columns = [], height = "400px" }: TableProps) => {
	return (
		<TableWrapper height={height}>
			<VirtualizedTable
				rowCount={rows?.length}
				rowGetter={({ index }) => rows[index]}
				columns={columns}
			/>
		</TableWrapper>
	);
};

export default ReactVirtualizedTable;
