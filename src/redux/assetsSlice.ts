import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { defaultNetwork, missingPriceTokens } from "../config";
import { initialState } from "./assetState";
import { transformAssets } from "../transformers/asstets";
import getAssets from "../api/get-assets";

export const fetchAssets = createAsyncThunk("assets/fetchAssets", async () => {
  const assets = await getAssets().then(transformAssets);
  return assets;
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
    builder.addCase(fetchAssets.pending, (state) => {
      state.status = "fetching";
    });
    builder.addCase(fetchAssets.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = action.meta.requestStatus;
      state.fetchedAt = new Date().toString();
    });
    builder.addCase(fetchAssets.rejected, (state, action) => {
      state.status = action.meta.requestStatus;
      console.error(action.payload);
      throw new Error("Failed to fetch assets and metadata");
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
