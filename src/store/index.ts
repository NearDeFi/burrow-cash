import { ViewMethodsLogic } from "../config";
import { getBurrow } from "../utils";

export const getAssets = async () => {
	const burrow = await getBurrow();

	return (
		await burrow?.view(burrow?.logicContract, ViewMethodsLogic[ViewMethodsLogic.get_assets_paged])
	).map((asset: any[]) => {
		return {
			name: asset[0],
			...asset[1],
		};
	});
};
