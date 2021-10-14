import { useContext } from "react";
import { Footer, Header, Table } from "../../components";
import { AssetsContext } from "../../context/assets";
import { BigButton, PageTitle, TotalSupply } from "../../shared";

const SUPPLY_DESKTOP_COLUMNS = [
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

const SUPPLY_COLUMNS = [
	{
		width: 240,
		label: "Name",
		dataKey: "name",
	},
	{
		width: 150,
		label: "APY",
		dataKey: "apy",
	},
	{
		width: 150,
		label: "Collateral",
		dataKey: "collateral",
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
	const { assets } = useContext<{ assets: any[] }>(AssetsContext);

	return (
		<>
			<Header>
				<SupplyTopButtons />
			</Header>
			<PageTitle paddingTop={"0"} first={"Supply"} second={"Assets"} />
			<Table rows={assets} columns={SUPPLY_COLUMNS} />
			<TotalSupply />
			<Footer />
		</>
	);
};

export default Supply;
