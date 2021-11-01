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
	const { assets, metadata } = useContext(ContractContext);

	const [accountDetails, setAccountDetails] = useState<IAccountDetailed>();

	useEffect(() => {
		(async () => {
			const account: IAccountDetailed = await getAccountDetailed(burrow?.account.accountId!);
			console.log("account portfolio", account);

			for (const asset of [...account.borrowed, ...account.supplied, ...account.collateral]) {
				const decimals =
					metadata.find((m) => m.token_id === asset.token_id)!.decimals || NEAR_DECIMALS;
				console.log("wwww", asset.token_id, decimals);
				asset.shares = shrinkToken(asset.shares, decimals);
				asset.balance = shrinkToken(asset.balance, decimals);
			}

			setAccountDetails(account);
		})();
	}, [assets, metadata]);

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
				console.log("aaa", rowData);
				return rowData.collateral?.balance;
			},
		},
		{
			width: 120,
			label: "Supplied",
			dataKey: "balance",
			cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
				return Number(rowData.balance).toLocaleString(undefined, TOKEN);
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
		{
			width: 45,
			dataKey: "repay",
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
				<Table
					height={"240px"}
					rows={accountDetails?.supplied.map((supplied) => ({
						...supplied,
						...metadata.find((m) => m.token_id === supplied.token_id),
						collateral: accountDetails?.collateral.find(
							(collateral) => collateral.token_id === supplied.token_id,
						),
					}))}
					columns={suppliedColumns}
				/>
			) : (
				<div style={{ textAlign: "center" }}>No supplied assets yet</div>
			)}

			<SC.SecondTitleWrapper>
				<span style={{ color: colors.primary }}>Borrowed</span> Assets
			</SC.SecondTitleWrapper>

			{accountDetails?.borrowed.length ? (
				<Table
					height={"240px"}
					rows={accountDetails?.borrowed.map((borrowed) => ({
						...borrowed,
						...assets.find((a) => a.token_id === borrowed.token_id),
					}))}
					columns={borrowColumns}
				/>
			) : (
				<div style={{ textAlign: "center" }}>No borrowed assets yet</div>
			)}

			<TotalSupply displayButton={false} />
			<Footer />
		</>
	);
};

export default Portfolio;
