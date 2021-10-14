import { useContext } from "react";
import { Footer, Header, Table } from "../../components";
import { AssetsContext } from "../../context/assets";
import { PageTitle, TotalSupply } from "../../shared";

const SUPPLY_COLUMNS = [
	{
		width: 200,
		label: "Name",
		dataKey: "name",
	},
	{
		width: 200,
		label: "APY",
		dataKey: "apy",
	},
	{
		width: 200,
		label: "Collateral",
		dataKey: "collateral",
	},
];

const Supply = () => {
	const { assets } = useContext<{ assets: any[] }>(AssetsContext);

	return (
		<>
			<Header />
			<PageTitle first={"Supply"} second={"Assets"} />
			<Table rows={assets} columns={SUPPLY_COLUMNS} />
			<TotalSupply />
			<Footer />
		</>
	);
};

export default Supply;
