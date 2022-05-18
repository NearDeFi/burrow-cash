import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getAssetsDetailed, getAllMetadata } from "../store";
import { IMetadata } from "../interfaces";
import { transformAssetFarms } from "../transformers/farms";
import { defaultNetwork, missingPriceTokens } from "../config";
import { initialState } from "./assetState";

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

export const fetchRefPrices = createAsyncThunk("assets/fetchRefPrices", async () => {
  const res = await fetch("https://indexer.ref-finance.net/list-token-price", {
    mode: "cors",
  });
  const prices = await res.json();
  return prices;
});

export const assetSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAssetsAndMetadata.pending, (state) => {
      state.status = "fetching";
    });
    builder.addCase(fetchAssetsAndMetadata.fulfilled, (state, action) => {
      const { assets, metadata } = action.payload;
      assets.forEach((asset) => {
        state.data[asset.token_id] = {
          metadata: metadata.find((m) => m.token_id === asset.token_id) as IMetadata,
          ...asset,
          farms: transformAssetFarms(asset.farms),
        };
      });
      state.status = action.meta.requestStatus;
      state.fetchedAt = new Date().toString();
    });
    builder.addCase(fetchAssetsAndMetadata.rejected, (state, action) => {
      state.status = action.meta.requestStatus;
      console.error(action.payload);
      throw new Error("Failed to fetch assets and metadata");
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
          farms: transformAssetFarms(asset.farms),
        };
      });
      state.status = action.meta.requestStatus;
      state.fetchedAt = new Date().toString();
    });
    builder.addCase(fetchAssets.rejected, (state, action) => {
      state.status = action.meta.requestStatus;
      console.error(action.payload);
      throw new Error("Failed to fetch assets");
    });
    builder.addCase(fetchRefPrices.fulfilled, (state, action) => {
      missingPriceTokens.forEach((missingToken) => {
        const missingTokenId = missingToken[defaultNetwork];

        if (missingTokenId && state.data[missingTokenId]) {
          state.data[missingTokenId]["price"] = {
            decimals: action.payload[missingToken.mainnet].decimal,
            usd: Number(action.payload[missingToken.mainnet].price),
            multiplier: "1",
          };
        }
      });
    });
    builder.addCase(fetchRefPrices.pending, (state) => {
      state.status = "fetching";
    });
    builder.addCase(fetchRefPrices.rejected, (state, action) => {
      state.status = action.meta.requestStatus;
      console.error(action.payload);
      throw new Error("Failed to fetch REF prices");
    });
  },
});

export default assetSlice.reducer;
