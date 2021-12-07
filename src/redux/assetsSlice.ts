import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IAssetDetailed } from "../interfaces";

export interface AssetsState {
  [id: string]: IAssetDetailed;
}

const initialState: AssetsState = {};

export const assetSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    receivedAssets(state, action: PayloadAction<IAssetDetailed[]>) {
      const assets = action.payload;
      assets.forEach((asset) => {
        state[asset.token_id] = asset;
      });
    },
  },
});

export const { receivedAssets } = assetSlice.actions;
export default assetSlice.reducer;
