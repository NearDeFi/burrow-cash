import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import { sumReducer, shrinkToken, USD_FORMAT } from "../store";
import { IAssetDetailed, IMetadata } from "../interfaces";
import type { RootState } from "./store";

export interface AssetsState {
  [id: string]: IAssetDetailed & {
    metadata: IMetadata;
  };
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
        .map((tokenId) => {
          const asset = assets[tokenId];
          const { balance } = asset[source];

          return asset.price?.usd
            ? Number(shrinkToken(balance, asset.metadata.decimals + asset.config.extra_decimals)) *
                asset.price.usd
            : 0;
        })
        .reduce(sumReducer, 0)
        .toLocaleString(undefined, USD_FORMAT),
  );

export const { receivedAssets } = assetSlice.actions;
export default assetSlice.reducer;
