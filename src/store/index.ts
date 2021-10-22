import { ViewMethodsLogic } from "../config";
import { getBurrow } from "../utils";
import { IAsset } from "../interfaces/asset";

export const getAssets = async () => {
	const burrow = await getBurrow();

	return (
		await burrow?.view(burrow?.logicContract, ViewMethodsLogic[ViewMethodsLogic.get_assets_paged])
	).map((asset: IAsset[]) => ({
		...asset[1],
		name: asset[0],
	}));
};
