import { IAsset, IAssetDetailed } from "../interfaces/asset";
import { getBurrow } from "../utils";
import { ViewMethodsLogic } from "../interfaces/contract-methods";

export const getAssets = async (): Promise<IAsset[]> => {
	const burrow = await getBurrow();

	return (
		await burrow?.view(burrow?.logicContract, ViewMethodsLogic[ViewMethodsLogic.get_assets_paged])
	).map((asset: IAsset[]) => ({
		...asset[1],
		asset_id: asset[0],
		apy: 10,
	}));
};

export const getAssetsDetailed = async (): Promise<IAssetDetailed[]> => {
	const burrow = await getBurrow();
	const results: IAssetDetailed[] = [];

	const assets: IAsset[] = await getAssets();

	for (const asset of assets) {
		const assetDetails: IAssetDetailed = await burrow?.view(
			burrow?.logicContract,
			ViewMethodsLogic[ViewMethodsLogic.get_asset],
			{
				token_id: asset.asset_id,
			},
		);

		console.log(assetDetails.config.target_utilization);
		console.log(assetDetails.config.target_utilization_rate);

		results.push(assetDetails);
	}

	return results;
};
