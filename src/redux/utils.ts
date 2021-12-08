import { shrinkToken, TOKEN_FORMAT } from "../store";
import type { Asset } from "./assetsSlice";

export const toUsd = (balance: string, asset: Asset) =>
  asset.price?.usd
    ? Number(shrinkToken(balance, asset.metadata.decimals + asset.config.extra_decimals)) *
      asset.price.usd
    : 0;

export const emptyAsset = (asset: { supplied: string; collateral: string }): boolean =>
  asset.supplied !== (0).toLocaleString(undefined, TOKEN_FORMAT) &&
  asset.collateral !== (0).toLocaleString(undefined, TOKEN_FORMAT);
