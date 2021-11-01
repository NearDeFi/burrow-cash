import { useContext } from "react";
import { Footer, Header, Table } from "../../components";
import { ContractContext } from "../../context/contracts";
import { BigButton, PageTitle, TotalSupply } from "../../shared";
import { IAssetDetailed, IMetadata } from "../../interfaces/asset";
import { ColumnData } from "../../components/Table/types";
import {
	DECIMAL_OVERRIDES,
	PERCENT_DIGITS,
	TOKEN_DECIMALS,
	TOKEN_FORMAT,
	USD_FORMAT,
} from "../../store/constants";
import * as React from "react";
import { shrinkToken } from "../../store/helper";
import { Burrow } from "../../index";
import { IBurrow } from "../../interfaces/burrow";

const SupplyTopButtons = () => {
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
			<div style={{ justifySelf: "end" }}>
				<BigButton />
			</div>
			<div style={{ justifySelf: "start" }}>
				<BigButton />
			</div>
		</div>
	);
};

const Supply = () => {
	const burrow = useContext<IBurrow | null>(Burrow);
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
			width: 150,
			label: "Collateral",
			dataKey: "collateral",
			cellDataGetter: ({ rowData }: { rowData: IAssetDetailed }) => {
				return rowData.config.can_use_as_collateral;
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
					: "";
			},
		},
	];

	if (burrow?.walletConnection.isSignedIn()) {
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
			<Header>
				<SupplyTopButtons />
			</Header>
			<PageTitle paddingTop={"0"} first={"Supply"} second={"Assets"} />
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
				<TotalSupply
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
						.reduce((sum, a) => (sum += a))
						.toLocaleString(undefined, USD_FORMAT)}
				/>
			)}
			<Footer />
		</>
	);
};

export default Supply;
