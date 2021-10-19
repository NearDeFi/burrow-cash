import { createContext, useEffect, useState } from "react";
import { mockSupplyDesktopData } from "../mockData";
import { getAssets } from "../store";

const initialAssetsState: { assets: any[] } = { assets: mockSupplyDesktopData };

export const AssetsContext = createContext(initialAssetsState);

export const AssetsContextProvider = ({ children }: { children: React.ReactElement }) => {
	const [assets, setAssets] = useState<any[]>(mockSupplyDesktopData);

	useEffect(() => {
		(async () => {
			const a = (await getAssets()).map((asset: any) => {
				return {
					...asset,
					apy: 10,
				};
			});

			setAssets([...mockSupplyDesktopData, ...a]);
		})();
	}, []);

	const state: { assets: any[] } = { assets };

	return <AssetsContext.Provider value={state}>{children}</AssetsContext.Provider>;
};
