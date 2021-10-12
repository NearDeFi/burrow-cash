import { Header, Table } from "../../components";
import * as SC from "./style";

const Portfolio = () => {
	const borrowColumns = [
		{
			width: 200,
			label: "Name",
			dataKey: "name",
		},
		{
			width: 120,
			label: "APY",
			dataKey: "bPY",
		},
		{
			width: 120,
			label: "Borrow APY",
			dataKey: "borrowAPY",
		},
	];
	const suppliedColumns = [
		{
			width: 200,
			label: "Name",
			dataKey: "name",
		},
		{
			width: 120,
			label: "APY",
			dataKey: "supplyAPY",
		},
		{
			width: 120,
			label: "Supplied",
			dataKey: "supplied",
		},
	];

	const borrowedData = [
		{ name: "ABC", bAPY: 10, borrowAPY: 10 },
		{ name: "ABC", bAPY: 10, borrowAPY: 10 },
	];

	const suppliedData = [
		{ name: "ABC", supplied: 10, supplyAPY: 10 },
		{ name: "ABC", supplied: 10, supplyAPY: 10 },
	];

	return (
		<>
			<Header />
			<SC.TitleWrapper>
				<span style={{ color: "green" }}>Supplied</span> Assets
			</SC.TitleWrapper>
			<Table height={300} rows={suppliedData} columns={suppliedColumns} />
			<SC.TitleWrapper>
				<span style={{ color: "green" }}>Borrow</span> Assets
			</SC.TitleWrapper>
			<Table height={300} rows={borrowedData} columns={borrowColumns} />
		</>
	);
};

export default Portfolio;
