import { createContext, ReactElement, useEffect, useState } from "react";
import { IAssetDetailed, IMetadata } from "../interfaces/asset";
import { getAssetsDetailed, getBalances, getPortfolio } from "../store";
import { IAccountDetailed, IBalance } from "../interfaces/account";
import { getAllMetadata } from "../store/tokens";

const initialContractsState: {
	assets: IAssetDetailed[];
	balances: IBalance[];
	metadata: IMetadata[];
	portfolio?: IAccountDetailed;
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
	const [portfolio, setPortfolio] = useState<IAccountDetailed>();

	useEffect(() => {
		(async () => {
			const assets = await getAssetsDetailed();
			setAssets(assets);

			const [metadata, balances] = await Promise.all([
				getAllMetadata(assets.map((asset) => asset.token_id)),
				getBalances(assets.map((asset) => asset.token_id)),
			]);

			setMetadata(metadata);
			setBalances(balances);

			const portfolio: IAccountDetailed = await getPortfolio(metadata);
			setPortfolio(portfolio);
		})();
	}, []);

	const state: {
		assets: IAssetDetailed[];
		balances: IBalance[];
		metadata: IMetadata[];
		portfolio?: IAccountDetailed;
	} = {
		assets,
		balances,
		metadata,
		portfolio,
	};

	return <ContractContext.Provider value={state}>{children}</ContractContext.Provider>;
};
