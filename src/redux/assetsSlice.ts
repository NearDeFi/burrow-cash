import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import { sumReducer, USD_FORMAT } from "../store";
import { IAssetDetailed, IMetadata } from "../interfaces";
import type { RootState } from "./store";
import { toUsd, transformAsset } from "./utils";

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
      return Object.keys(assets)
        .filter((tokenId) => assets[tokenId].config[filterKey])
        .map((tokenId) => transformAsset(assets[tokenId], account));
    },
  );

export const { receivedAssets } = assetSlice.actions;
export default assetSlice.reducer;
