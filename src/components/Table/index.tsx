import { createTheme } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import { withStyles } from "@mui/styles";
import clsx from "clsx";
import { AutoSizer, Column, Table, TableCellRenderer, TableHeaderProps } from "react-virtualized";
import { useLocation } from "react-router";
import { useContext } from "react";
import { Button } from "@mui/material";

import { Heading4, Heading6 } from "../../style";
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
import TokenIcon from "../TokenIcon";
import { ContractContext } from "../../context/contracts";
import { DECIMAL_OVERRIDES, USD_FORMAT } from "../../store/constants";
import { getAvailableAmount, repay, withdraw, shrinkToken } from "../../store";
import { IAsset } from "../../interfaces/account";

const HEADER_HEIGHT = 32;
const ROW_HEIGHT = 80;

const TableTemplate = (props: MuiVirtualizedTableProps) => {
	const modal: ModalState = useContext(ModalContext);
	const { balances } = useContext(ContractContext);

	const location = (useLocation().pathname as string).replace("/", "");
	const { columns, classes, onRowClick, ...tableProps } = props;

	const getRowClassName = ({ index }: Row) => {
		return clsx(classes.tableRow, classes.flexContainer, {
			[classes.tableRowHover]: index !== -1 && onRowClick !== null && location !== "portfolio",
		});
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
					[classes.noClick]: onRowClick === null,
				})}
				variant="body"
				style={{ width: "200px", height: ROW_HEIGHT, color: "#000741" }}
			>
				<TokenNameCellWrapper>
					<TokenIcon icon={rowData?.icon} />

					<TokenNameTextWrapper>
						<Heading4 cellData={rowData?.symbol || rowData.token_id} />
						<Heading6
							cellData={
								rowData.price
									? `${rowData.price.usd.toLocaleString(undefined, USD_FORMAT)}`
									: "$-.-"
							}
						/>
					</TokenNameTextWrapper>
				</TokenNameCellWrapper>
			</TableCell>
		);
	};

	const WithdrawCell: TableCellRenderer = ({ rowData }: { rowData: IAsset & IMetadata }) => {
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick === null,
				})}
				variant="body"
				style={{ height: ROW_HEIGHT }}
			>
				<DefaultCellWrapper>
					<Button
						size="small"
						style={{ justifySelf: "end" }}
						variant="contained"
						onClick={(event) => {
							event.stopPropagation();
							void withdraw(rowData.token_id);
						}}
					>
						Withdraw
					</Button>
				</DefaultCellWrapper>
			</TableCell>
		);
	};

	const RepayCell: TableCellRenderer = ({ rowData }: { rowData: IAsset & IMetadata }) => {
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick === null,
				})}
				variant="body"
				style={{ height: ROW_HEIGHT }}
			>
				<DefaultCellWrapper>
					<Button
						size="small"
						style={{ justifySelf: "end" }}
						variant="contained"
						onClick={(event) => {
							event.stopPropagation();
							void repay(rowData.token_id, Number(shrinkToken(rowData.balance, rowData.decimals)));
						}}
					>
						Repay
					</Button>
				</DefaultCellWrapper>
			</TableCell>
		);
	};

	const AdjustCell: TableCellRenderer = ({ rowData }: { rowData: IAsset }) => {
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick === null,
				})}
				variant="body"
				style={{ height: ROW_HEIGHT }}
			>
				<DefaultCellWrapper>
					<Button
						size="small"
						style={{ justifySelf: "end" }}
						variant="contained"
						onClick={(event) => {
							event.stopPropagation();
							void repay(rowData.token_id, 1);
						}}
					>
						Adjust
					</Button>
				</DefaultCellWrapper>
			</TableCell>
		);
	};

	const APYCell: TableCellRenderer = ({ cellData, dataKey }) => {
		const data = `${cellData}%`;
		const style = { height: ROW_HEIGHT, color: "#000741", display: "grid" };

		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick === null,
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

	const DefaultCell: TableCellRenderer = ({ cellData }) => {
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick === null,
				})}
				variant="body"
				style={{ height: ROW_HEIGHT, color: "#000741", display: "grid" }}
				align="left"
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
			justifyContent,
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
		if (dataKey === "name") return TokenNameCell;
		if (dataKey === "apy" || dataKey === "borrowAPY") return APYCell;
		if (dataKey === "withdraw") return WithdrawCell;
		if (dataKey === "repay") return RepayCell;
		if (dataKey === "adjust") return AdjustCell;

		return DefaultCell;
	};

	const handleModalOpen = ({ rowData }: { rowData: IAssetDetailed & IMetadata }) => {
		modal.setModalData({
			type: location === "supply" ? "Supply" : "Borrow",
			title: location === "supply" ? "Supply" : "Borrow",
			totalAmountTitle: `Total ${location === "supply" ? "Supply" : "Borrow"}`,
			asset: {
				token_id: rowData.token_id,
				amount:
					location === "supply"
						? balances.find((b) => b.token_id === rowData.token_id)?.balance || 0
						: Number(
								shrinkToken(
									getAvailableAmount(rowData),
									DECIMAL_OVERRIDES[rowData.symbol] || rowData.decimals,
								),
						  ),
				name: rowData?.name || "Unknown",
				symbol: rowData?.symbol || "???",
				icon: rowData?.icon,
				valueInUSD: rowData.price?.usd || 0,
				apy: Number(location === "supply" ? rowData.supply_apr : rowData.borrow_apr),
				canBeUsedAsCollateral: rowData.config.can_use_as_collateral,
			},
			buttonText: location === "supply" ? "Supply" : "Borrow",
			rates: [],
			ratesTitle: "rates",
		});
		modal.handleOpen();
	};

	return (
		<div style={{ height: "100%" }}>
			<AutoSizer>
				{({ height, width }) => (
					<Table
						autoHeight
						height={height}
						width={width}
						rowHeight={ROW_HEIGHT}
						gridStyle={{
							direction: "inherit",
						}}
						headerHeight={HEADER_HEIGHT}
						className={classes.table}
						rowClassName={getRowClassName}
						onRowClick={location !== "portfolio" ? handleModalOpen : undefined}
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
								/>
							);
						})}
					</Table>
				)}
			</AutoSizer>
		</div>
	);
};

const defaultTheme = createTheme();

const VirtualizedTable = withStyles(styles, { defaultTheme })(TableTemplate);

const ReactVirtualizedTable = ({ rows = [], columns = [] }: TableProps) => (
	<div style={{ display: "grid", width: "100%", gridTemplateColumns: "0.1fr 1fr 0.1fr" }}>
		<TableWrapper height="400px">
			<VirtualizedTable
				rowCount={rows?.length}
				rowGetter={({ index }) => rows[index]}
				columns={columns}
			/>
		</TableWrapper>
	</div>
);

export default ReactVirtualizedTable;
