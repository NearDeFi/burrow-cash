import { useContext, useState, useEffect } from "react";
import { Header, Table } from "../../components";
import Footer from "../../components/Footer";
import { Burrow, IBurrow } from "../../index";
import { BigButton, PageTitle, TotalSupply } from "../../shared";
import { getAssets } from "../../store";
import { IAsset } from "../../interfaces/asset";
import { ViewMethodsLogic } from "../../interfaces/contract-methods";
import { IAccount, IAccountDetailed } from "../../interfaces/account";
import { ColumnData } from "../../components/Table/types";

const BorrowTopButtons = () => {
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

const Borrow = () => {
	const burrow = useContext<IBurrow | null>(Burrow);
	const [assets, setAssets] = useState<IAsset[]>([]);

	useEffect(() => {
		(async () => {
			const assets = await getAssets();
			setAssets(assets);
		})();
	}, []);

	const columns: ColumnData[] = [
		{
			width: 300,
			label: "Name",
			dataKey: "name",
			cellDataGetter: ({ rowData }) => {
				return rowData.asset_id;
			},
		},
		{
			width: 300,
			label: "Borrow APY",
			dataKey: "borrowAPY",
		},
	];

	return (
		<>
			<Header>
				<BorrowTopButtons />
			</Header>
			<PageTitle paddingTop={"0"} first={"Borrow"} second={"Assets"} />
			<Table rows={assets} columns={columns} />
			<TotalSupply />
			<Footer />
		</>
	);
};

export default Borrow;
