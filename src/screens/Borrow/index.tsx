import { useContext } from "react";
import { Table } from "../../components";
import { BigButton, PageTitle, Total } from "../../shared";
import { IAssetDetailed, IMetadata } from "../../interfaces/asset";
import { ColumnData } from "../../components/Table/types";
import {
	DECIMAL_OVERRIDES,
	PERCENT_DIGITS,
	TOKEN_DECIMALS,
	TOKEN_FORMAT,
	USD_FORMAT,
} from "../../store/constants";
import { ContractContext } from "../../context/contracts";
import { shrinkToken } from "../../store";
import { Burrow } from "../../index";
import { IBurrow } from "../../interfaces/burrow";

const BorrowTopButtons = () => {
	const { assets, portfolio } = useContext(ContractContext);
	const { walletConnection } = useContext(Burrow);

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr",
				gap: "1.5rem",
				justifyItems: "center",
				justifyContent: "center",
				alignContent: "center",
				gridAutoFlow: "column",
			}}
		>
			{walletConnection.isSignedIn() && (
				<BigButton
					text="Your Borrow Balance"
					value={portfolio?.borrowed
						.map(
							(borrowed) =>
								Number(borrowed.balance) *
								(assets.find((a) => a.token_id === borrowed.token_id)?.price?.usd || 0),
						)
						.reduce((sum, a) => sum + a, 0)
						.toLocaleString(undefined, USD_FORMAT)}
				/>
			)}
			<BigButton text="Borrow Limit" value={0} />
			<BigButton text="Risk Factor" value={0} />
		</div>
	);
};

const Borrow = () => {
	const { walletConnection } = useContext<IBurrow>(Burrow);
	const { assets, metadata, portfolio } = useContext(ContractContext);

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
					? (
							Number(
								shrinkToken(
									rowData.borrowed.balance,
									DECIMAL_OVERRIDES[rowData.symbol] || TOKEN_DECIMALS,
								),
							) * rowData.price.usd
					  ).toLocaleString(undefined, USD_FORMAT)
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

	if (walletConnection.isSignedIn()) {
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
		<>
			<BorrowTopButtons />
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
			<Total
				type="Borrow"
				value={assets
					.map((asset) =>
						asset.price
							? Number(
									shrinkToken(
										asset.borrowed.balance,
										DECIMAL_OVERRIDES[
											metadata.find((m) => m.token_id === asset.token_id)?.symbol || ""
										] || TOKEN_DECIMALS,
									),
							  ) * asset.price.usd
							: 0,
					)
					.reduce((sum, a) => sum + a, 0)
					.toLocaleString(undefined, USD_FORMAT)}
			/>
		</>
	);
};

export default Borrow;
