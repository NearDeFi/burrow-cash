import { useContext } from "react";
import { Box } from "@mui/material";
import { IAssetDetailed, IMetadata } from "../../interfaces/asset";
import { ColumnData } from "../../components/Table/types";
import { PERCENT_DIGITS, TOKEN_FORMAT, USD_FORMAT } from "../../store/constants";
import { ContractContext } from "../../context/contracts";
import { toUsd } from "../../store";
import { Burrow } from "../../index";
import { IBurrow } from "../../interfaces/burrow";
import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox, Table, PageTitle } from "../../components";

const Borrow = () => {
	const { walletConnection } = useContext<IBurrow>(Burrow);
	const { assets, metadata, portfolio } = useContext(ContractContext);

	const yourBorrowBalance = portfolio?.borrowed
		.map(
			(borrowed) =>
				Number(borrowed.balance) *
				(assets.find((a) => a.token_id === borrowed.token_id)?.price?.usd || 0),
		)
		.reduce((sum, a) => sum + a, 0)
		.toLocaleString(undefined, USD_FORMAT);

	const totalBorrow = assets
		.map((asset) => {
			return toUsd(asset.borrowed.balance, {
				...asset,
				...metadata.find((m) => m.token_id === asset.token_id)!,
			});
		})
		.reduce((sum, a) => sum + a, 0)
		.toLocaleString(undefined, USD_FORMAT);

	const columns: ColumnData[] = [
		{
			width: 300,
			label: "Name",
			dataKey: "name",
		},
		{
			width: 300,
			label: "Borrow APY",
			dataKey: "borrowAPY",
			numeric: true,
			cellDataGetter: ({ rowData }: { rowData: IAssetDetailed }) => {
				return Number(rowData.borrow_apr).toFixed(PERCENT_DIGITS);
			},
		},
		{
			width: 120,
			label: "Liquidity",
			dataKey: "liquidity",
			cellDataGetter: ({ rowData }: { rowData: IAssetDetailed & IMetadata }) => {
				return rowData.price?.usd
					? toUsd(rowData.borrowed.balance, rowData).toLocaleString(undefined, USD_FORMAT)
					: "$-.-";
			},
		},
		{
			width: 120,
			label: "Collateral Factor",
			dataKey: "collateralFactor",
			cellDataGetter: () => {
				return `${(0).toFixed(PERCENT_DIGITS)}%`;
			},
		},
	];

	if (walletConnection?.isSignedIn()) {
		columns.push({
			width: 100,
			label: "Amount Borrowed",
			dataKey: "borrowed",
			cellDataGetter: ({ rowData }: { rowData: IAssetDetailed & IMetadata }) => {
				return Number(
					portfolio?.borrowed.find((b) => b.token_id === rowData.token_id)?.balance || 0,
				).toLocaleString(undefined, TOKEN_FORMAT);
			},
		});
	}

	return (
		<Box sx={{ paddingBottom: 10 }}>
			<InfoWrapper sx={{ gridTemplateColumns: "auto auto auto" }}>
				{walletConnection?.isSignedIn() && (
					<InfoBox title="Your Borrow Balance" value={yourBorrowBalance} subtitle="Portfolio" />
				)}
				<InfoBox title="Borrow Limit" value="0%" />
				<InfoBox title="Risk Factor" value="0" />
			</InfoWrapper>
			<PageTitle first="Borrow" second="Assets" />
			<Table
				rows={assets
					.filter((asset) => asset.config.can_borrow)
					.map((asset) => ({
						...asset,
						...metadata.find((m) => m.token_id === asset.token_id),
					}))}
				columns={columns}
			/>
			<InfoWrapper>
				<InfoBox title="Total Borrow" value={totalBorrow} />
			</InfoWrapper>
		</Box>
	);
};

export default Borrow;
