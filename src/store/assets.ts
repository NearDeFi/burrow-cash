import Decimal from "decimal.js";

import { IAssetEntry, IAssetDetailed, AssetEntry, ViewMethodsLogic } from "../interfaces";
import { getBurrow } from "../utils";
import { DEFAULT_PRECISION } from "./constants";
import { getPrices } from "./helper";

Decimal.set({ precision: DEFAULT_PRECISION });

export const getAssets = async (): Promise<IAssetEntry[]> => {
  const { view, logicContract } = await getBurrow();

  return (
    (await view(logicContract, ViewMethodsLogic[ViewMethodsLogic.get_assets_paged])) as AssetEntry[]
  ).map(([token_id, asset]: AssetEntry) => ({
    ...asset,
    token_id,
  }));
};

export const getAssetDetailed = async (token_id: string): Promise<IAssetDetailed> => {
  const { view, logicContract } = await getBurrow();

  const assetDetails: IAssetDetailed = (await view(
    logicContract,
    ViewMethodsLogic[ViewMethodsLogic.get_asset],
    {
      token_id,
    },
  )) as IAssetDetailed;

  return assetDetails;
};

export const getAssetsDetailed = async (): Promise<IAssetDetailed[]> => {
  const assets: IAssetEntry[] = await getAssets();

  const priceResponse = await getPrices(assets.map((asset) => asset.token_id));
  let detailedAssets = await Promise.all(assets.map((asset) => getAssetDetailed(asset.token_id)));

  detailedAssets = detailedAssets?.map((detailedAsset) => ({
    ...detailedAsset,
    price:
      priceResponse?.prices.find((p) => p.asset_id === detailedAsset.token_id)?.price || undefined,
  }));

  return detailedAssets;
};
