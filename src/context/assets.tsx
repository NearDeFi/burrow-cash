import { createContext, useEffect, useState } from "react";
import { IAsset } from "../interfaces/asset";
import { getAssets, getAssetsDetailed } from "../store";

const initialAssetsState: { assets: IAsset[] } = { assets: [] };

export const AssetsContext = createContext(initialAssetsState);

export const AssetsContextProvider = ({ children }: { children: React.ReactElement }) => {
	const [assets, setAssets] = useState<IAsset[]>([]);

	useEffect(() => {
		(async () => {
			const assets = await getAssets();
			console.log("assets", assets);
			setAssets(assets);

			console.log("asset detailed", await getAssetsDetailed());
		})();
	}, []);

	const state: { assets: IAsset[] } = { assets };

	return <AssetsContext.Provider value={state}>{children}</AssetsContext.Provider>;
};
