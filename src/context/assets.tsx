import { createContext, useState } from "react";
import { getAssets } from "../store";

const mockDesktop = [
	{ name: "Token Name", apy: 10, collateral: false, totalSupply: 1000.00, wallet: 10.00 },
	{ name: "Token Name", apy: 10, collateral: false, totalSupply: 1000.00, wallet: 10.00 },
	{ name: "Token Name", apy: 10, collateral: false, totalSupply: 1000.00, wallet: 10.00 },
	{ name: "Token Name", apy: 10, collateral: false, totalSupply: 1000.00, wallet: 10.00 },
	{ name: "Token Name", apy: 10, collateral: false, totalSupply: 1000.00, wallet: 10.00 },
	{ name: "Token Name", apy: 10, collateral: false, totalSupply: 1000.00, wallet: 10.00 },
	{ name: "Token Name", apy: 10, collateral: false, totalSupply: 1000.00, wallet: 10.00 },
	{ name: "Token Name", apy: 10, collateral: false, totalSupply: 1000.00, wallet: 10.00 },
];

const mock = [
	{ name: "Token Name", apy: 10, collateral: false },
	{ name: "Token Name", apy: 10, collateral: true },
	{ name: "Token Name", apy: 10, collateral: false },
	{ name: "Token Name", apy: 10, collateral: false },
	{ name: "Token Name", apy: 10, collateral: true },
	{ name: "Token Name", apy: 10, collateral: false },
	{ name: "Token Name", apy: 10, collateral: false },
	{ name: "Token Name", apy: 10, collateral: true },
	{ name: "Token Name", apy: 10, collateral: false },
];

const initialAssetsState: { assets: any[] } = { assets: mock };

export const AssetsContext = createContext(initialAssetsState);

export const AssetsContextProvider = ({ children }: { children: React.ReactElement }) => {
	const [assets, setAssets] = useState<any[]>(mockDesktop);

	useEffect(() => {
		(async () => {
			const a = (await getAssets()).map((asset: any) => {
				return {
					...asset,
					apy: 10,
				};
			});

			setAssets([...mock, ...a]);
		})();
	}, []);

	const state: { assets: any[] } = { assets };

	return <AssetsContext.Provider value={state}>{children}</AssetsContext.Provider>;
};
