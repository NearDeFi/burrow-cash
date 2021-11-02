import Decimal from "decimal.js";

import { IAsset, IAssetDetailed, AssetEntry } from "../interfaces/asset";
import { getBurrow } from "../utils";
import { ViewMethodsLogic } from "../interfaces/contract-methods";
import { DEFAULT_PRECISION } from "./constants";
import { getPrices, rateToApr } from "./helper";

Decimal.set({ precision: DEFAULT_PRECISION });

export const getAssets = async (): Promise<IAsset[]> => {
	const burrow = await getBurrow();

	return (
		(await burrow?.view(
			burrow?.logicContract,
			ViewMethodsLogic[ViewMethodsLogic.get_assets_paged],
		)) as AssetEntry[]
	).map(([token_id, asset]: AssetEntry) => ({
		...asset,
		token_id,
	}));
};

export const getAssetDetailed = async (token_id: string): Promise<IAssetDetailed> => {
	const burrow = await getBurrow();

	const assetDetails: IAssetDetailed = (await burrow?.view(
		burrow?.logicContract,
		ViewMethodsLogic[ViewMethodsLogic.get_asset],
		{
			token_id,
		},
	)) as IAssetDetailed;

	console.log(
		"xxx",
		"target_utilization_rate",
		rateToApr(assetDetails.config.target_utilization_rate),
	);
	console.log("xxx", "max_utilization_rate", rateToApr(assetDetails.config.max_utilization_rate));

	return assetDetails;
};

export const getAssetsDetailed = async (): Promise<IAssetDetailed[]> => {
	const assets: IAsset[] = await getAssets();

	const priceResponse = await getPrices(assets.map((asset) => asset.token_id));
	let detailedAssets = await Promise.all(assets.map((asset) => getAssetDetailed(asset.token_id)));

	detailedAssets = detailedAssets?.map((detailedAsset) => ({
		...detailedAsset,
		price:
			priceResponse?.prices.find((p) => p.asset_id === detailedAsset.token_id)?.price || undefined,
	}));

	console.log("detailed assets", detailedAssets);
	return detailedAssets;
};
