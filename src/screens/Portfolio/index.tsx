import { Footer, Header, Table } from "../../components";
import { BigButton, TotalSupply } from "../../shared";
import { colors } from "../../style";
import * as SC from "./style";

const PortfolioTopButtons = () => {
	return (
		<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", justifyItems: "center", paddingLeft: "20em", paddingRight: "20em" }}>
			<BigButton />
			<BigButton />
			<BigButton />
		</div>
	)
}

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
			dataKey: "apy",
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
			dataKey: "apy",
		},
		{
			width: 120,
			label: "Supplied",
			dataKey: "supplied",
		},
	];

	const borrowedData = [
		{ name: "Token Name", apy: 10, borrowAPY: 10 },
		{ name: "Token Name", apy: 10, borrowAPY: 10 },
	];

	const suppliedData = [
		{ name: "Token Name", apy: 10, supplied: "10.00" },
		{ name: "Token Name", apy: 10, supplied: "10.00" },
	];

	return (
		<>
			<Header >
				<PortfolioTopButtons />
			</Header>
			<SC.TitleWrapper>
				<span style={{ color: colors.primary }}>Supplied</span> Assets
			</SC.TitleWrapper>
			<Table height={"240px"} rows={suppliedData} columns={suppliedColumns} />
			<SC.SecondTitleWrapper>
				<span style={{ color: colors.primary }}>Borrow</span> Assets
			</SC.SecondTitleWrapper>
			<Table height={"240px"} rows={borrowedData} columns={borrowColumns} />
			<TotalSupply displayButton={false} />
			<Footer />
		</>
	);
};

export default Portfolio;
