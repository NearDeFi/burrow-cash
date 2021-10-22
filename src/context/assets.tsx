import { createContext, useEffect, useState } from "react";
import { IAsset } from "../interfaces/asset";
import { getAssets } from "../store";

const initialAssetsState: { assets: IAsset[] } = { assets: [] };

export const AssetsContext = createContext(initialAssetsState);

export const AssetsContextProvider = ({ children }: { children: React.ReactElement }) => {
	const [assets, setAssets] = useState<IAsset[]>([]);

	useEffect(() => {
		(async () => {
			const assets = (await getAssets()).map((asset: any) => ({
				...asset,
				apy: 10,
			}));

			console.log("assets", assets);
			setAssets([...assets]);
		})();
	}, []);

	const state: { assets: IAsset[] } = { assets };

	return <AssetsContext.Provider value={state}>{children}</AssetsContext.Provider>;
};
