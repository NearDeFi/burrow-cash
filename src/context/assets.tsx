import { createContext, useEffect, useState } from "react";
import { IAssetDetailed } from "../interfaces/asset";
import { getAssetsDetailed } from "../store";

const initialAssetsState: { assets: IAssetDetailed[] } = { assets: [] };

export const AssetsContext = createContext(initialAssetsState);

export const AssetsContextProvider = ({ children }: { children: React.ReactElement }) => {
	const [assets, setAssets] = useState<IAssetDetailed[]>([]);

	useEffect(() => {
		(async () => {
			const assets = await getAssetsDetailed();
			setAssets(assets);
		})();
	}, []);

	const state: { assets: IAssetDetailed[] } = { assets };

	return <AssetsContext.Provider value={state}>{children}</AssetsContext.Provider>;
};
