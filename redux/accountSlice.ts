import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getBurrow } from "../utils";
import { ChangeMethodsLogic } from "../interfaces";
import { identifyUser } from "../utils/telemetry";
import { transformAccount } from "../transformers/account";
import { initialState } from "./accountState";
import getAccount from "../api/get-account";

export const farmClaimAll = createAsyncThunk("account/farmClaimAll", async () => {
  const { call, logicContract } = await getBurrow();
  return call(
    logicContract,
    ChangeMethodsLogic[ChangeMethodsLogic.account_farm_claim_all],
    undefined,
    "0",
  );
});

export const fetchAccount = createAsyncThunk("account/fetchAccount", async () => {
  const account = await getAccount().then(transformAccount);

  if (account?.accountId) {
    const wallet = JSON.parse(
      localStorage.getItem("near-wallet-selector:selectedWalletId") || `"undefined"`,
    );
    identifyUser(account.accountId, { wallet });
  }
  return account;
});

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    logoutAccount: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(farmClaimAll.pending, (state, action) => {
      state.isClaiming = action.meta.requestStatus;
    });
    builder.addCase(farmClaimAll.fulfilled, (state, action) => {
      state.isClaiming = action.meta.requestStatus;
    });
    builder.addCase(farmClaimAll.rejected, (state, action) => {
      state.status = action.meta.requestStatus;
    });
    builder.addCase(fetchAccount.pending, (state, action) => {
      state.status = action.meta.requestStatus;
    });
    builder.addCase(fetchAccount.rejected, (state, action) => {
      state.status = action.meta.requestStatus;
      console.error(action.payload);
      throw new Error("Failed to fetch account");
    });
    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      state.isClaiming = undefined;
      state.status = action.meta.requestStatus;
      state.fetchedAt = new Date().toString();
      if (!action.payload?.accountId) return;

      const { accountId, balances, portfolio } = action.payload;

      state.accountId = accountId;
      state.balances = balances;

      if (portfolio) {
        state.portfolio = portfolio;
      }
    });
  },
});

export const { logoutAccount } = accountSlice.actions;
export default accountSlice.reducer;
