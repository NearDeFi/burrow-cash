import { Footer, Header, Table } from "../../components";
import { BigButton, TotalSupply } from "../../shared";
import { colors } from "../../style";
import * as SC from "./style";
import { ColumnData } from "../../components/Table/types";
import { NEAR_DECIMALS, PERCENT_DIGITS, TOKEN } from "../../store/constants";
import { useContext, useEffect, useState } from "react";
import { Burrow } from "../../index";
import { IBurrow } from "../../interfaces/burrow";
import { getAccountDetailed } from "../../store";
import { IAccountDetailed, IAsset } from "../../interfaces/account";
import { ContractContext } from "../../context/contracts";
import { shrinkToken } from "../../store/helper";

const PortfolioTopButtons = () => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr",
				justifyItems: "center",
				paddingLeft: "20em",
				paddingRight: "20em",
			}}
		>
			<BigButton />
			<BigButton />
			<BigButton />
		</div>
	);
};

const Portfolio = () => {
	const burrow = useContext<IBurrow | null>(Burrow);
	const { assets } = useContext(ContractContext);

	const [accountDetails, setAccountDetails] = useState<IAccountDetailed>();

	useEffect(() => {
		(async () => {
			const account: IAccountDetailed = await getAccountDetailed(burrow?.account.accountId!);
			console.log("account portfolio", account);

			for (const asset of [...account.borrowed, ...account.supplied]) {
				const decimals =
					assets.find((a) => a.token_id === asset.token_id)?.metadata?.decimals || NEAR_DECIMALS;
				asset.shares = shrinkToken(asset.shares, decimals);
			}

			setAccountDetails(account);
		})();
	}, [assets]);

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
			label: "Supplied",
			dataKey: "shares",
			cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
				return Number(rowData.shares).toLocaleString(undefined, TOKEN);
			},
		},
	];

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
			cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
				return Number(rowData.apr).toFixed(PERCENT_DIGITS);
			},
		},
		{
			width: 120,
			label: "Borrow APY",
			dataKey: "borrowAPY",
			numeric: true,
			cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
				return Number(rowData.apr).toFixed(PERCENT_DIGITS);
			},
		},
		{
			width: 120,
			label: "Borrowed",
			dataKey: "shares",
			cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
				return Number(rowData.shares).toLocaleString(undefined, TOKEN);
			},
		},
	];

	const collateralColumns: ColumnData[] = [
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
			label: "Borrow APY",
			dataKey: "borrowAPY",
			numeric: true,
			cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
				return Number(rowData.apr).toFixed(PERCENT_DIGITS);
			},
		},
		{
			width: 120,
			label: "Collateral",
			dataKey: "shares",
			cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
				return Number(rowData.shares).toLocaleString(undefined, TOKEN);
			},
		},
	];

	return (
		<>
			<Header>
				<PortfolioTopButtons />
			</Header>

			<SC.TitleWrapper>
				<span style={{ color: colors.primary }}>Supplied</span> Assets
			</SC.TitleWrapper>

			{accountDetails?.supplied.length ? (
				<Table height={"240px"} rows={accountDetails?.supplied} columns={suppliedColumns} />
			) : (
				<div style={{ textAlign: "center" }}>No supplied assets yet</div>
			)}

			<SC.SecondTitleWrapper>
				<span style={{ color: colors.primary }}>Borrow</span> Assets
			</SC.SecondTitleWrapper>

			{accountDetails?.borrowed.length ? (
				<Table height={"240px"} rows={accountDetails?.borrowed} columns={borrowColumns} />
			) : (
				<div style={{ textAlign: "center" }}>No borrowed assets yet</div>
			)}

			<SC.SecondTitleWrapper>
				<span style={{ color: colors.primary }}>Collateral</span> Assets
			</SC.SecondTitleWrapper>

			{accountDetails?.collateral.length ? (
				<Table height={"240px"} rows={accountDetails?.collateral} columns={collateralColumns} />
			) : (
				<div style={{ textAlign: "center" }}>No collateral assets yet</div>
			)}

			<TotalSupply displayButton={false} />
			<Footer />
		</>
	);
};

export default Portfolio;
