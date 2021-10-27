import { createContext, useContext, useEffect, useState } from "react";
import { IAssetDetailed } from "../interfaces/asset";
import { getAssetsDetailed } from "../store";
import { IBalance } from "../interfaces/account";
import { getBalance } from "../store/tokens";
import { IBurrow } from "../interfaces/burrow";
import { Burrow } from "../index";

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
	const burrow = useContext<IBurrow | null>(Burrow);

	useEffect(() => {
		(async () => {
			const assets = await getAssetsDetailed();
			setAssets(assets);

			const balances: IBalance[] = await Promise.all(
				assets.map(
					async (asset) =>
						({
							token_id: asset.token_id,
							account_id: burrow?.account.accountId,
							balance:
								(burrow?.walletConnection.isSignedIn() &&
									(await getBalance(asset, burrow.account.accountId))) ||
								0,
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
