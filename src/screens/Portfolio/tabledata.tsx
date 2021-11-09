import { Box } from "@mui/material";

import { PERCENT_DIGITS, TOKEN_FORMAT } from "../../store/constants";
import { IAsset } from "../../interfaces/account";
import { IAssetDetailed } from "../../interfaces/asset";

export const suppliedColumns = [
	{
		width: 200,
		label: "Name",
		dataKey: "name",
		Cell: ({ rowData }) => {
			const { symbol } = rowData;
			return <Box>{symbol}</Box>;
		},
	},
	{
		width: 120,
		label: "APY",
		dataKey: "apy",
		numeric: true,
		Cell: ({ rowData }) => {
			return <Box>{Number(rowData.apr).toFixed(PERCENT_DIGITS)}%</Box>;
		},
		cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
			return Number(rowData.apr).toFixed(PERCENT_DIGITS);
		},
	},
	{
		width: 120,
		label: "Collateral",
		dataKey: "collateralSum",
		numeric: true,
		Cell: ({ rowData }) => {
			return (
				<Box>
					{rowData.collateral &&
						Number(rowData.collateral.balance).toLocaleString(undefined, TOKEN_FORMAT)}
				</Box>
			);
		},
		cellDataGetter: ({ rowData }: { rowData: any }) => {
			return (
				rowData.collateral &&
				Number(rowData.collateral.balance).toLocaleString(undefined, TOKEN_FORMAT)
			);
		},
	},
	{
		width: 120,
		label: "Supplied",
		dataKey: "balance",
		Cell: ({ rowData }) => {
			return <Box>{Number(rowData.balance).toLocaleString(undefined, TOKEN_FORMAT)}</Box>;
		},
		cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
			return Number(rowData.balance).toLocaleString(undefined, TOKEN_FORMAT);
		},
	},
	{
		width: 45,
		dataKey: "withdraw",
		cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
			return rowData.token_id;
		},
	},
];

export const borrowColumns = [
	{
		width: 200,
		label: "Name",
		dataKey: "name",
	},
	{
		width: 120,
		label: "APY",
		dataKey: "apy",
		numeric: true,
		cellDataGetter: ({ rowData }: { rowData: IAssetDetailed }) => {
			return Number(rowData.supply_apr).toFixed(PERCENT_DIGITS);
		},
	},
	{
		width: 120,
		label: "Borrow APY",
		dataKey: "borrowAPY",
		numeric: true,
		cellDataGetter: ({ rowData }: { rowData: IAssetDetailed }) => {
			return Number(rowData.borrow_apr).toFixed(PERCENT_DIGITS);
		},
	},
	{
		width: 120,
		label: "Borrowed",
		dataKey: "shares",
		cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
			return Number(rowData.balance).toLocaleString(undefined, TOKEN_FORMAT);
		},
	},
	{
		width: 45,
		dataKey: "repay",
	},
];
