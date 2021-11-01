import { createContext, ReactElement, useContext, useEffect, useState } from "react";
import { IAssetDetailed, IMetadata } from "../interfaces/asset";
import { getAssetsDetailed } from "../store";
import { IBalance } from "../interfaces/account";
import { getBalance, getMetadata } from "../store/tokens";
import { IBurrow } from "../interfaces/burrow";
import { Burrow } from "../index";

const initialContractsState: {
	assets: IAssetDetailed[];
	balances: IBalance[];
	metadata: IMetadata[];
} = {
	assets: [],
	balances: [],
	metadata: [],
};

export const ContractContext = createContext(initialContractsState);

export const ContractContextProvider = ({ children }: { children: ReactElement }) => {
	const burrow = useContext<IBurrow | null>(Burrow);

	const [assets, setAssets] = useState<IAssetDetailed[]>([]);
	const [balances, setBalances] = useState<IBalance[]>([]);
	const [metadata, setMetadata] = useState<IMetadata[]>([]);

	useEffect(() => {
		(async () => {
			const assets = await getAssetsDetailed();
			setAssets(assets);

			const metadata: IMetadata[] = (
				await Promise.all(assets.map((a) => getMetadata(a.token_id)))
			).filter((m): m is IMetadata => !!m);

			setMetadata(metadata);

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
		metadata: IMetadata[];
	} = {
		assets,
		balances,
		metadata,
	};

	return <ContractContext.Provider value={state}>{children}</ContractContext.Provider>;
};
