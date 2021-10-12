import { createContext, useEffect, useState } from "react";
import { getAssets } from "../store";

const mock = [
	{ name: "Token Name", supplyAPY: 10, collateral: false },
	{ name: "Token Name", supplyAPY: 10, collateral: true },
	{ name: "Token Name", supplyAPY: 10, collateral: false },
];

const initialAssetsState: { assets: any[] } = { assets: mock };

export const AssetsContext = createContext(initialAssetsState);

export const AssetsContextProvider = ({ children }: { children: React.ReactElement }) => {
	const [assets, setAssets] = useState<any[]>(mock);

	useEffect(() => {
		(async () => {
			const a = (await getAssets()).map((asset: any) => {
				return {
					...asset,
					borrowAPY: 10,
				};
			});

			setAssets([...mock, ...a]);
		})();
	}, []);

	const state: { assets: any[] } = { assets };

	return (
		<AssetsContext.Provider value={state}>
			{children}
		</AssetsContext.Provider>
	)
};