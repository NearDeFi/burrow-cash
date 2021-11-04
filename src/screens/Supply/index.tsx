import { useContext } from "react";

import { Table } from "../../components";
import { ContractContext } from "../../context/contracts";
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
import { shrinkToken } from "../../store/helper";
import { Burrow } from "../../index";
import { IBurrow } from "../../interfaces/burrow";

const SupplyTopButtons = () => {
	const { assets, portfolio } = useContext(ContractContext);
	const { walletConnection } = useContext(Burrow);

	return (
		<div
			style={{
				display: "grid",
				gap: "1em",
				gridTemplateColumns: "1fr 1fr",
				paddingLeft: "20em",
				paddingRight: "20em",
			}}
		>
			{walletConnection.isSignedIn() && (
				<div style={{ justifySelf: "end" }}>
					<BigButton
						text="Your supply balance"
						value={portfolio?.supplied
							.map(
								(supplied) =>
									Number(supplied.balance) *
									(assets.find((a) => a.token_id === supplied.token_id)?.price?.usd || 0),
							)
							.reduce((sum, a) => sum + a, 0)
							.toLocaleString(undefined, USD_FORMAT)}
					/>
				</div>
			)}
			<div style={{ justifySelf: "start" }}>
				<BigButton text="Net APY" value={0} />
			</div>
		</div>
	);
};

const Supply = () => {
	const { walletConnection } = useContext<IBurrow>(Burrow);
	const { assets, metadata, balances } = useContext(ContractContext);

	const columns: ColumnData[] = [
		{
			width: 240,
			label: "Name",
			dataKey: "name",
		},
		{
			width: 100,
			label: "BRRR Boost",
			dataKey: "boost",
			cellDataGetter: () => {
				return "xxx";
			},
		},
		{
			width: 150,
			label: "APY",
			dataKey: "apy",
			numeric: true,
			cellDataGetter: ({ rowData }: { rowData: IAssetDetailed }) => {
				return Number(rowData.supply_apr).toFixed(PERCENT_DIGITS);
			},
		},
		{
			width: 100,
			label: "Total Supply",
			dataKey: "supply",
			cellDataGetter: ({ rowData }: { rowData: IAssetDetailed & IMetadata }) => {
				return rowData.price?.usd
					? (
							Number(
								shrinkToken(
									rowData.supplied.balance,
									DECIMAL_OVERRIDES[rowData.symbol] || TOKEN_DECIMALS,
								),
							) * rowData.price.usd
					  ).toLocaleString(undefined, USD_FORMAT)
					: "$-.-";
			},
		},
	];

	if (walletConnection.isSignedIn()) {
		columns.push({
			width: 100,
			label: "Wallet",
			dataKey: "balance",
			cellDataGetter: ({ rowData }: { rowData: IAssetDetailed & IMetadata }) => {
				return balances
					.find((b) => b.token_id === rowData.token_id)
					?.balance.toLocaleString(undefined, TOKEN_FORMAT);
			},
		});
	}

	return (
		<>
			<SupplyTopButtons />
			<PageTitle first="Supply" second="Assets" />
			<Table
				rows={assets
					.filter((asset) => asset.config.can_deposit)
					.map((a) => ({
						...a,
						...metadata.find((m) => m.token_id === a.token_id),
					}))}
				columns={columns}
			/>
			{assets.length > 0 && (
				<Total
					type="Supply"
					value={assets
						.map((asset) =>
							asset.price
								? Number(
										shrinkToken(
											asset.supplied.balance,
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
			)}
		</>
	);
};

export default Supply;
