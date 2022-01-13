import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getAssetsDetailed, getAllMetadata } from "../store";
import { IAssetDetailed, IMetadata } from "../interfaces";

export type Asset = IAssetDetailed & {
  metadata: IMetadata;
};

export interface Assets {
  [id: string]: Asset;
}
export interface AssetsState {
  data: Assets;
  status: "pending" | "fulfilled" | "rejected" | "fetching" | null;
  fetchedAt: string | undefined;
}

const initialState: AssetsState = {
  data: {},
  status: null,
  fetchedAt: undefined,
};

export const fetchAssetsAndMetadata = createAsyncThunk(
  "assets/fetchAssetsAndMetadata",
  async () => {
    const assets = await getAssetsDetailed();
    const tokenIds = assets.map((asset) => asset.token_id);
    const metadata = await getAllMetadata(tokenIds);
    return { assets, metadata };
  },
);

export const fetchAssets = createAsyncThunk("assets/fetchAssets", async () => {
  const assets = await getAssetsDetailed();
  return { assets };
});

export const assetSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAssetsAndMetadata.pending, (state, action) => {
      state.status = action.meta.requestStatus;
    });
    builder.addCase(fetchAssetsAndMetadata.fulfilled, (state, action) => {
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
    builder.addCase(fetchAssetsAndMetadata.rejected, (state, action) => {
      state.status = action.meta.requestStatus;
    });
    builder.addCase(fetchAssets.pending, (state) => {
      state.status = "fetching";
    });
    builder.addCase(fetchAssets.fulfilled, (state, action) => {
      const { assets } = action.payload;
      assets.forEach((asset) => {
        const { metadata } = state.data[asset.token_id];
        state.data[asset.token_id] = {
          ...asset,
          metadata,
        };
      });
      state.status = action.meta.requestStatus;
      state.fetchedAt = new Date().toString();
    });
  },
});

export default assetSlice.reducer;
