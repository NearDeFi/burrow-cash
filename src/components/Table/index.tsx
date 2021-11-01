import { createTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import TableCell from "@mui/material/TableCell";
import { withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";
import { AutoSizer, Column, Table, TableCellRenderer, TableHeaderProps } from "react-virtualized";
import { colors, Heading4, Heading6 } from "../../style";
import { ModalContext, ModalState } from "../Modal";
import {
	APYCellWrapper,
	DefaultCellWrapper,
	styles,
	TableWrapper,
	TokenNameCellWrapper,
	TokenNameTextWrapper,
} from "./style";
import { MuiVirtualizedTableProps, Row, TableProps } from "./types";
import { IAssetDetailed, IMetadata } from "../../interfaces/asset";
import { useLocation } from "react-router";
import TokenIcon from "../TokenIcon";
import { useContext } from "react";
import { ContractContext } from "../../context/contracts";
import { USD_FORMAT } from "../../store/constants";
import { Button } from "@mui/material";
import { repay, withdraw } from "../../store/tokens";
import { IAsset } from "../../interfaces/account";

const HEADER_HEIGHT = 32;
const ROW_HEIGHT = 80;

const TableTemplate = (props: MuiVirtualizedTableProps) => {
	const modal: ModalState = useContext(ModalContext);
	const { balances } = useContext(ContractContext);

	const location = (useLocation().pathname as string).replace("/", "");
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
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{
					display: "grid",
					height: ROW_HEIGHT,
					color: "white",
					justifyContent: "end",
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

	const TokenNameCell: TableCellRenderer = ({
		rowData,
	}: {
		rowData: IAssetDetailed & IMetadata;
	}) => {
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{ width: "200px", height: ROW_HEIGHT, color: "#000741" }}
			>
				<TokenNameCellWrapper
					onClick={() => {
						modal.setModalData({
							type: location === "supply" ? "Supply" : "Borrow",
							title: location === "supply" ? "Supply" : "Borrow",
							totalAmountTitle: `Total ${location === "supply" ? "Supply" : "Borrow"}`,
							asset: {
								token_id: rowData.token_id,
								amount: balances.find((b) => b.token_id === rowData.token_id)?.balance || 0,
								name: rowData?.name || "Unknown",
								symbol: rowData?.symbol || "???",
								icon: rowData?.icon,
								valueInUSD: rowData.price?.usd || 0,
								apy: Number(location === "supply" ? rowData.supply_apr : rowData.borrow_apr),
							},
							buttonText: location === "supply" ? "Supply" : "Borrow",
							rates: [],
							ratesTitle: "rates",
						});
						modal.handleOpen();
					}}
				>
					<TokenIcon icon={rowData?.icon} />

					<TokenNameTextWrapper>
						<Heading4 cellData={rowData?.symbol || rowData.token_id} />
						<Heading6
							cellData={
								rowData.price
									? `${rowData.price.usd.toLocaleString(undefined, USD_FORMAT)}`
									: "Unknown"
							}
						/>
					</TokenNameTextWrapper>
				</TokenNameCellWrapper>
			</TableCell>
		);
	};

	const WithdrawCell: TableCellRenderer = ({ cellData, dataKey }) => {
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
			>
				<DefaultCellWrapper>
					<Button
						size="small"
						style={{ justifySelf: "end" }}
						variant="contained"
						onClick={() => withdraw(cellData)}
					>
						Withdraw
					</Button>
				</DefaultCellWrapper>
			</TableCell>
		);
	};

	const RepayCell: TableCellRenderer = ({ rowData }: { rowData: IAsset }) => {
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
			>
				<DefaultCellWrapper>
					<Button
						size="small"
						style={{ justifySelf: "end" }}
						variant="contained"
						onClick={() => void repay(rowData.token_id, 1)}
					>
						Repay
					</Button>
				</DefaultCellWrapper>
			</TableCell>
		);
	};

	const APYCell: TableCellRenderer = ({ cellData, dataKey }) => {
		const data = String(cellData) + "%";
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
					<Heading4 cellData={cellData} />
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
			display: "grid",
			maxWidth: "800px",
			justifyContent: justifyContent,
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
		if (dataKey === "apy" || dataKey === "borrowAPY") return APYCell;
		if (dataKey === "withdraw") return WithdrawCell;
		if (dataKey === "repay") return RepayCell;

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
					{columns.map(({ dataKey, cellDataGetter, ...other }, index) => {
						return (
							<Column
								width={width}
								key={dataKey}
								headerRenderer={(headerProps) =>
									HeaderCell({
										...headerProps,
										columnIndex: index,
									})
								}
								className={classes.flexContainer}
								cellRenderer={getCell(dataKey)}
								cellDataGetter={cellDataGetter}
								dataKey={dataKey}
								label={other.label}
								// {...other}
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
		<div style={{ display: "grid", width: "100%", gridTemplateColumns: "0.1fr 1fr 0.1fr" }}>
			<TableWrapper height={height}>
				<VirtualizedTable
					rowCount={rows?.length}
					rowGetter={({ index }) => rows[index]}
					columns={columns}
				/>
			</TableWrapper>
		</div>
	);
};

export default ReactVirtualizedTable;
