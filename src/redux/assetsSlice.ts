import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { defaultNetwork, missingPriceTokens } from "../config";
import { initialState } from "./assetState";
import { transformAssets } from "../transformers/asstets";
import getAssets from "../api/get-assets";
import getFarm from "../api/get-farm";

export const fetchAssets = createAsyncThunk("assets/fetchAssets", async () => {
  const assets = await getAssets().then(transformAssets);
  const netTvlFarm = await getFarm("NetTvl");
  return { assets, netTvlFarm };
});

export const fetchRefPrices = createAsyncThunk("assets/fetchRefPrices", async () => {
  const prices = await fetch(
    "https://raw.githubusercontent.com/NearDeFi/token-prices/main/ref-prices.json",
  ).then((r) => r.json());

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
      state.data = action.payload.assets;
      state.netTvlFarm = action.payload.netTvlFarm?.rewards || {};
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
