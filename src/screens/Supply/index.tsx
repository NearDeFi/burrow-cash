import { useContext } from "react";
import { Footer, Header, Table } from "../../components";
import { AssetsContext } from "../../context/assets";
import { BigButton, PageTitle, TotalSupply } from "../../shared";
import { IAssetDetailed } from "../../interfaces/asset";
import { ColumnData } from "../../components/Table/types";

const SUPPLY_DESKTOP_COLUMNS: ColumnData[] = [
	{
		width: 200,
		label: "Name",
		dataKey: "name",
	},
	{
		width: 120,
		label: "APY",
		dataKey: "apy",
	},
	{
		width: 120,
		label: "Collateral",
		dataKey: "collateral",
	},
	{
		width: 120,
		label: "Total Supply",
		dataKey: "totalSupply",
	},
	{
		width: 120,
		label: "Wallet",
		dataKey: "wallet",
	},
];

const SUPPLY_COLUMNS: ColumnData[] = [
	{
		width: 240,
		label: "Name",
		dataKey: "name",
		cellDataGetter: ({ rowData }) => {
			return rowData.asset_id;
		},
	},
	{
		width: 150,
		label: "APY",
		dataKey: "apy",
		numeric: true,
		cellDataGetter: ({ rowData }) => {
			return Number(rowData.current_apr);
		},
	},
	{
		width: 150,
		label: "Collateral",
		dataKey: "collateral",
		cellDataGetter: ({ rowData }) => {
			return rowData.config.can_use_as_collateral;
		},
	},
];

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
	const { assets } = useContext<{ assets: IAssetDetailed[] }>(AssetsContext);

	return (
		<>
			<Header>
				<SupplyTopButtons />
			</Header>
			<PageTitle paddingTop={"0"} first={"Supply"} second={"Assets"} />
			<Table rows={assets.filter((asset) => asset.config.can_deposit)} columns={SUPPLY_COLUMNS} />
			<TotalSupply />
			<Footer />
		</>
	);
};

export default Supply;
