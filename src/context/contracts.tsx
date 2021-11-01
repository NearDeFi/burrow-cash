import { createContext, ReactElement, useEffect, useState } from "react";
import { IAssetDetailed, IMetadata } from "../interfaces/asset";
import { getAssetsDetailed, getBalances } from "../store";
import { IBalance } from "../interfaces/account";
import { getAllMetadata } from "../store/tokens";

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
	const [assets, setAssets] = useState<IAssetDetailed[]>([]);
	const [balances, setBalances] = useState<IBalance[]>([]);
	const [metadata, setMetadata] = useState<IMetadata[]>([]);

	useEffect(() => {
		(async () => {
			const assets = await getAssetsDetailed();
			setAssets(assets);

			const metadata = await getAllMetadata(assets.map((asset) => asset.token_id));
			setMetadata(metadata);

			const balances: IBalance[] = await getBalances(assets.map((asset) => asset.token_id));
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
