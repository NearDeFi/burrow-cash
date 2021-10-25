import { IAsset, IAssetDetailed } from "../interfaces/asset";
import { getBurrow } from "../utils";
import { ViewMethodsLogic } from "../interfaces/contract-methods";
import Decimal from "decimal.js";
import { NANOS_PER_YEAR } from "./constants";
import { getBalance, getMetadata } from "./tokens";
import { getPrices } from "./helper";
import { IPrices } from "../interfaces/oracle";

export const getAssets = async (): Promise<IAsset[]> => {
	const burrow = await getBurrow();

	return (
		await burrow?.view(burrow?.logicContract, ViewMethodsLogic[ViewMethodsLogic.get_assets_paged])
	).map(([token_id, asset]: [string, IAsset]) => ({
		...asset,
		token_id,
	}));
};

export const getAssetDetailed = async (token_id: string): Promise<IAssetDetailed> => {
	const burrow = await getBurrow();

	const assetDetails: IAssetDetailed = await burrow?.view(
		burrow?.logicContract,
		ViewMethodsLogic[ViewMethodsLogic.get_asset],
		{
			token_id,
		},
	);

	assetDetails.metadata = await getMetadata(token_id);

	const exp = new Decimal(1).dividedBy(new Decimal(NANOS_PER_YEAR));

	await getBalance(assetDetails.token_id, burrow.account.accountId);

	console.log(
		"apy",
		exp.toString(),
		assetDetails.config.target_utilization_rate,
		exp.pow(new Decimal(assetDetails.config.target_utilization_rate)).toString(),
		"c_apr",
		assetDetails.borrow_apr,
		new Decimal(assetDetails.borrow_apr).mul(NANOS_PER_YEAR).toString(),
	);

	return assetDetails;
};

export const getAssetsDetailed = async (): Promise<IAssetDetailed[]> => {
	const assets: IAsset[] = await getAssets();

	const priceReponse = await getPrices(assets.map((asset) => asset.token_id));
	let detailedAssets = await Promise.all(assets.map((asset) => getAssetDetailed(asset.token_id)));

	detailedAssets = detailedAssets?.map((d) => ({
		...d,
		price: priceReponse?.prices.find((p) => p.asset_id === d.token_id)?.price,
	}));

	console.log("detailed assets", detailedAssets);
	return detailedAssets;
};
