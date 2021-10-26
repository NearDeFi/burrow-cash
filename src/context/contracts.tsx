import { createContext, useEffect, useState } from "react";
import { IAssetDetailed } from "../interfaces/asset";
import { getAssetsDetailed } from "../store";
import { IBalance } from "../interfaces/account";
import { getBalance } from "../store/tokens";
import { getBurrow } from "../utils";

const initialContractsState: {
	assets: IAssetDetailed[];
	balances: IBalance[];
} = {
	assets: [],
	balances: [],
};

export const ContractContext = createContext(initialContractsState);

export const ContractContextProvider = ({ children }: { children: React.ReactElement }) => {
	const [assets, setAssets] = useState<IAssetDetailed[]>([]);
	const [balances, setBalances] = useState<IBalance[]>([]);

	useEffect(() => {
		(async () => {
			const burrpw = await getBurrow();
			const assets = await getAssetsDetailed();
			setAssets(assets);

			const balances: IBalance[] = await Promise.all(
				assets.map(
					async (asset) =>
						({
							token_id: asset.token_id,
							account_id: burrpw.account.accountId,
							balance: (await getBalance(asset, burrpw.account.accountId)) || 0,
						} as IBalance),
				),
			);

			console.log("store balances", balances);
			setBalances(balances);
		})();
	}, []);

	const state: {
		assets: IAssetDetailed[];
		balances: IBalance[];
	} = {
		assets,
		balances,
	};

	return <ContractContext.Provider value={state}>{children}</ContractContext.Provider>;
};
