import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";

import { USD_FORMAT, getAssetsDetailed, getAllMetadata } from "../store";
import { IAssetDetailed, IMetadata } from "../interfaces";
import type { RootState } from "./store";
import { toUsd, transformAsset, sumReducer } from "./utils";

export type Asset = IAssetDetailed & {
  metadata: IMetadata;
};

export interface Assets {
  [id: string]: Asset;
}
export interface AssetsState {
  data: Assets;
  status: "pending" | "fulfilled" | "rejected" | undefined;
  fetchedAt: string | undefined;
}

const initialState: AssetsState = {
  data: {},
  status: undefined,
  fetchedAt: undefined,
};

export const fetchAssets = createAsyncThunk("assets/fetchAssets", async () => {
  const assets = await getAssetsDetailed();
  const tokenIds = assets.map((asset) => asset.token_id);
  const metadata = await getAllMetadata(tokenIds);
  return { assets, metadata };
});

export const assetSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAssets.pending, (state, action) => {
      state.status = action.meta.requestStatus;
    });
    builder.addCase(fetchAssets.fulfilled, (state, action) => {
      const { assets, metadata } = action.payload;
      assets.forEach((asset) => {
        state.data[asset.token_id] = {
          metadata: metadata.find((m) => m.token_id === asset.token_id) as IMetadata,
          ...asset,
        };
      });
      state.status = action.meta.requestStatus;
      state.fetchedAt = new Date().toString();
    });
    builder.addCase(fetchAssets.rejected, (state, action) => {
      state.status = action.meta.requestStatus;
    });
  },
});

export const getTotalBalance = (source: "borrowed" | "supplied") =>
  createSelector(
    (state: RootState) => state.assets.data,
    (assets) =>
      Object.keys(assets)
        .map(
          (tokenId) =>
            toUsd(assets[tokenId][source].balance, assets[tokenId]) +
            (source === "supplied" ? toUsd(assets[tokenId].reserved, assets[tokenId]) : 0),
        )
        .reduce(sumReducer, 0)
        .toLocaleString(undefined, USD_FORMAT),
  );

export const getAvailableAssets = (source: "supply" | "borrow") =>
  createSelector(
    (state: RootState) => state.assets.data,
    (state: RootState) => state.account,
    (assets, account) => {
      const filterKey = source === "supply" ? "can_deposit" : "can_borrow";
      return Object.keys(assets)
        .filter((tokenId) => assets[tokenId].config[filterKey])
        .map((tokenId) => transformAsset(assets[tokenId], account));
    },
  );

export default assetSlice.reducer;
