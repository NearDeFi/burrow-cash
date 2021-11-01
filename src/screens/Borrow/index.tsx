import { useContext } from "react";
import { Header, Table } from "../../components";
import Footer from "../../components/Footer";
import { BigButton, PageTitle, TotalSupply } from "../../shared";
import { IAssetDetailed } from "../../interfaces/asset";
import { ColumnData } from "../../components/Table/types";
import { PERCENT_DIGITS } from "../../store/constants";
import { ContractContext } from "../../context/contracts";

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
	const { assets, metadata } = useContext(ContractContext);

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
	];

	return (
		<>
			<Header>
				<BorrowTopButtons />
			</Header>
			<PageTitle paddingTop={"0"} first={"Borrow"} second={"Assets"} />
			<Table
				rows={assets
					.filter((asset) => asset.config.can_borrow)
					.map((asset) => ({
						...asset,
						...metadata.find((m) => m.token_id === asset.token_id),
					}))}
				columns={columns}
			/>
			<TotalSupply value={1} />
			<Footer />
		</>
	);
};

export default Borrow;
