import { Button } from "@mui/material";
import { Header, Table } from "../../components";
import * as SC from "./style";
import { useEffect, useState } from "react";
import { getAssets } from "../../store";
import Footer from "../../components/Footer";

const Supply = () => {
	const mock = [
		{ name: "ABC", apy: 10, collateral: false },
		{ name: "ABC", apy: 10, collateral: true },
		{ name: "ABC", apy: 10, collateral: false },
	];

	const [assets, setAssets] = useState<any[]>(mock);

	useEffect(() => {
		(async () => {
			const a = (await getAssets()).map((asset: any) => {
				return {
					...asset,
					borrowAPY: 10,
				};
			});

			setAssets([...mock, ...a]);
		})();
	}, []);

	const columns = [
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

	return (
		<>
			<Header />
			<SC.TitleWrapper>
				Available <span style={{ color: "green" }}>Supply</span> Assets
			</SC.TitleWrapper>
			<Table rows={assets} columns={columns} />
			<div style={{ paddingTop: "1em", textAlign: "center", height: "8em" }}>
				<Button variant="contained" size="large" style={{ height: "6em", width: "14em" }}>
					{" Total Supply "}
					<br />
					{" 10,000,000$ "}
				</Button>
			</div>
			<Footer />
		</>
	);
};

export default Supply;
