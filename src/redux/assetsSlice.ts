import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IAssetDetailed, IMetadata } from "../interfaces";

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

export const { receivedAssets } = assetSlice.actions;
export default assetSlice.reducer;
