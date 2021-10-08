import { Header, Table } from "../../components";
import { TotalSupply } from "../../shared";
import * as SC from "./style";
import { useContext, useEffect, useState } from "react";
import { ViewMethodsLogic } from "../../config";
import { Burrow, IBurrow } from "../../index";
import { getAssets } from "../../store";

const Borrow = () => {
	const burrow = useContext<IBurrow | null>(Burrow);

	const mock = [
		{ name: "ABC", borrowAPY: 10 },
		{ name: "ABC", borrowAPY: 10 },
		{ name: "ABC", borrowAPY: 10 },
	];

	const [assets, setAssets] = useState<any[]>(mock);

	useEffect(() => {
		(async () => {
			const accounts = await burrow?.view(
				burrow?.logicContract,
				ViewMethodsLogic[ViewMethodsLogic.get_accounts_paged],
			);
			console.log("accounts", accounts);

			for (const account of accounts) {
				const acc = await burrow?.view(
					burrow?.logicContract,
					ViewMethodsLogic[ViewMethodsLogic.get_account],
					{
						account_id: account.account_id,
					},
				);
				console.log("account", acc);
			}

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
			width: 300,
			label: "Name",
			dataKey: "name",
		},
		{
			width: 300,
			label: "Borrow APY",
			dataKey: "borrowAPY",
		},
	];

	return (
		<>
			<Header />
			<SC.TitleWrapper>
				Available <span style={{ color: "green" }}>Borrow</span> Assets
			</SC.TitleWrapper>
			<Table rows={assets} columns={columns} />
			<TotalSupply />
		</>
	);
};

export default Borrow;
