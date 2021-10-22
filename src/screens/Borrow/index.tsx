import { useState, useEffect } from "react";
import { Header, Table } from "../../components";
import Footer from "../../components/Footer";
import { BigButton, PageTitle, TotalSupply } from "../../shared";
import { getAssetsDetailed } from "../../store";
import { IAssetDetailed } from "../../interfaces/asset";
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
	const [assets, setAssets] = useState<IAssetDetailed[]>([]);

	useEffect(() => {
		(async () => {
			const assets = await getAssetsDetailed();
			setAssets(assets.filter((asset) => asset.config.can_borrow));
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
			numeric: true,
			cellDataGetter: ({ rowData }) => {
				return Number(rowData.current_apr);
			},
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
