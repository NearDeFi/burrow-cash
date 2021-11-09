import { useContext } from "react";
import { Box, Typography, useTheme } from "@mui/material";

import { ColumnData } from "../../components/Table/types";
import { PERCENT_DIGITS, TOKEN_FORMAT, USD_FORMAT } from "../../store/constants";
import { IAsset } from "../../interfaces/account";
import { ContractContext } from "../../context/contracts";
import { IAssetDetailed } from "../../interfaces/asset";
import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox, Table } from "../../components";

const Portfolio = () => {
	const { assets, metadata, portfolio } = useContext(ContractContext);
	const theme = useTheme();

	const totalSupplied = portfolio?.supplied
		.map(
			(supplied) =>
				Number(supplied.balance) *
				(assets.find((a) => a.token_id === supplied.token_id)?.price?.usd || 0),
		)
		.reduce((sum, a) => sum + a, 0)
		.toLocaleString(undefined, USD_FORMAT);

	const totalBorrowed = portfolio?.borrowed
		.map(
			(borrowed) =>
				Number(borrowed.balance) *
				(assets.find((a) => a.token_id === borrowed.token_id)?.price?.usd || 0),
		)
		.reduce((sum, a) => sum + a, 0)
		.toLocaleString(undefined, USD_FORMAT);

	const suppliedRows = portfolio?.supplied.map((supplied) => ({
		...supplied,
		...assets.find((m) => m.token_id === supplied.token_id),
		...metadata.find((m) => m.token_id === supplied.token_id),
		collateral: portfolio?.collateral.find(
			(collateral) => collateral.token_id === supplied.token_id,
		),
	}));

	const suppliedColumns: ColumnData[] = [
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
			cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
				return Number(rowData.apr).toFixed(PERCENT_DIGITS);
			},
		},
		{
			width: 120,
			label: "Collateral",
			dataKey: "collateralSum",
			numeric: true,
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

	const borrowRows = portfolio?.borrowed.map((borrowed) => ({
		...borrowed,
		...assets.find((m) => m.token_id === borrowed.token_id),
		...metadata.find((a) => a.token_id === borrowed.token_id),
	}));

	const borrowColumns: ColumnData[] = [
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

	return (
		<Box sx={{ paddingBottom: 10 }}>
			<InfoWrapper sx={{ gridTemplateColumns: "auto auto auto" }}>
				<InfoBox title="Total Supplied" value={totalSupplied} />
				<InfoBox title="Net APR" value="0.00" />
				<InfoBox title="Total Bottowed" value={totalBorrowed} />
			</InfoWrapper>

			<Typography sx={{ fontSize: 24, padding: "1rem", textAlign: "center" }}>
				<span style={{ color: theme.palette.primary.main }}>Supplied</span> Assets
			</Typography>

			{portfolio?.supplied.length ? (
				<Table rows={suppliedRows} columns={suppliedColumns} />
			) : (
				<div style={{ textAlign: "center" }}>No supplied assets yet</div>
			)}

			<Typography sx={{ fontSize: 24, padding: "1rem", marginTop: "2rem", textAlign: "center" }}>
				<span style={{ color: theme.palette.primary.main }}>Borrowed</span> Assets
			</Typography>

			{portfolio?.borrowed.length ? (
				<Table rows={borrowRows} columns={borrowColumns} />
			) : (
				<div style={{ textAlign: "center" }}>No borrowed assets yet</div>
			)}
		</Box>
	);
};

export default Portfolio;
