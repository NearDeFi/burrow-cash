import Decimal from "decimal.js";
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import { sumReducer, shrinkToken, USD_FORMAT, TOKEN_FORMAT, PERCENT_DIGITS } from "../store";
import { IAssetDetailed, IMetadata } from "../interfaces";
import type { RootState } from "./store";
import { toUsd } from "./utils";

export type Asset = IAssetDetailed & {
  metadata: IMetadata;
};
export interface AssetsState {
  [id: string]: Asset;
}

const initialState: AssetsState = {};

export const assetSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    receivedAssets(
      state,
      action: PayloadAction<{ assets: IAssetDetailed[]; metadata: IMetadata[] }>,
    ) {
      const { assets, metadata } = action.payload;
      assets.forEach((asset) => {
        state[asset.token_id] = {
          metadata: metadata.find((m) => m.token_id === asset.token_id) as IMetadata,
          ...asset,
        };
      });
    },
  },
});

export const getTotalBalance = (source: "borrowed" | "supplied") =>
  createSelector(
    (state: RootState) => state.assets,
    (assets) =>
      Object.keys(assets)
        .map((tokenId) => toUsd(assets[tokenId][source].balance, assets[tokenId]))
        .reduce(sumReducer, 0)
        .toLocaleString(undefined, USD_FORMAT),
  );

export const getAvailableAssets = (source: "supply" | "borrow") =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      const filterKey = source === "supply" ? "can_deposit" : "can_borrow";
      const availableAssets = Object.keys(assets)
        .filter((tokenId) => assets[tokenId].config[filterKey])
        .map((tokenId) => {
          const asset = assets[tokenId];
          const totalSupply = new Decimal(asset.supplied.balance)
            .plus(new Decimal(asset.reserved))
            .toFixed();
          const supplied = account.portfolio.supplied[tokenId]?.balance || 0;

          // TODO: refactor: remove temp vars using ramda
          const temp1 = new Decimal(asset.supplied.balance)
            .plus(new Decimal(asset.reserved))
            .minus(new Decimal(asset.borrowed.balance));
          const temp2 = temp1.minus(temp1.mul(0.001)).toFixed(0);
          const availableLiquidity = toUsd(temp2, asset).toLocaleString(undefined, USD_FORMAT);
          const borrowed = account.portfolio.borrowed[tokenId]?.balance || 0;

          return {
            symbol: asset.metadata.symbol,
            icon: asset.metadata.icon,
            price: asset.price ? asset.price.usd.toLocaleString(undefined, USD_FORMAT) : "$-.-",
            supplyApy: `${(Number(asset.supply_apr) * 100).toFixed(PERCENT_DIGITS)}%`,
            totalSupply: toUsd(totalSupply, asset).toLocaleString(undefined, USD_FORMAT),
            supplied: Number(
              shrinkToken(supplied, asset.metadata.decimals + asset.config.extra_decimals),
            ).toLocaleString(undefined, TOKEN_FORMAT),
            borrowApy: `${(Number(asset.borrow_apr) * 100).toFixed(PERCENT_DIGITS)}%`,
            availableLiquidity,
            collateralFactor: `${Number(asset.config.volatility_ratio / 100)}%`,
            borrowed: Number(
              shrinkToken(borrowed, asset.metadata.decimals + asset.config.extra_decimals),
            ).toLocaleString(undefined, TOKEN_FORMAT),
          };
        });
      return availableAssets;
    },
  );

export const { receivedAssets } = assetSlice.actions;
export default assetSlice.reducer;
