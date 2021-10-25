import { useState, useEffect } from "react";
import { Header, Table } from "../../components";
import Footer from "../../components/Footer";
import { BigButton, PageTitle, TotalSupply } from "../../shared";
import { getAssetsDetailed } from "../../store";
import { IAssetDetailed } from "../../interfaces/asset";
import { ColumnData } from "../../components/Table/types";
import { PERCENT_DIGITS } from "../../store/constants";

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
			cellDataGetter: ({ rowData }: { rowData: IAssetDetailed }) => {
				return rowData.token_id;
			},
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
