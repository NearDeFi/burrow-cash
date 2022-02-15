import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getAssetsDetailed } from "../store";
import { getBurrow } from "../utils";
import { getBalance, getPortfolio } from "../api";
import { listToMap, transformFarms } from "./utils";

interface Balance {
  [tokenId: string]: string;
}

interface PortfolioAsset {
  apr: string;
  balance: string;
  shares: string;
}

interface Farm {
  borrowed: {
    [reward_token_id: string]: {
      boosted_shares: string;
      unclaimed_amount: string;
      asset_farm_reward: {
        reward_per_day: string;
        booster_log_base: string;
        remaining_rewards: string;
        boosted_shares: string;
      };
    };
  };
}

export interface Portfolio {
  supplied: {
    [tokenId: string]: PortfolioAsset;
  };
  collateral: {
    [tokenId: string]: PortfolioAsset;
  };
  borrowed: {
    [tokenId: string]: PortfolioAsset;
  };
  farms: {
    [tokenId: string]: Farm;
  };
}
export interface AccountState {
  accountId: string;
  balances: Balance;
  portfolio: Portfolio;
  status: "pending" | "fulfilled" | "rejected" | undefined;
  fetchedAt: string | undefined;
}

const initialState: AccountState = {
  accountId: "",
  balances: {},
  portfolio: {
    supplied: {},
    collateral: {},
    borrowed: {},
    farms: {},
  },
  status: undefined,
  fetchedAt: undefined,
};

export const fetchAccount = createAsyncThunk("account/fetchAccount", async () => {
  const { account } = await getBurrow();
  const { accountId } = account;

  if (accountId) {
    const assets = await getAssetsDetailed();
    const tokenIds = assets.map((asset) => asset.token_id);
    const accountBalance = (await account.getAccountBalance()).available;
    const balances = await Promise.all(tokenIds.map((id) => getBalance(id, accountId)));
    const portfolio = await getPortfolio(accountId);
    return { accountId, accountBalance, balances, portfolio, tokenIds };
  }

  return undefined;
});

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    logoutAccount: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccount.pending, (state, action) => {
      state.status = action.meta.requestStatus;
    });
    builder.addCase(fetchAccount.rejected, (state, action) => {
      state.status = action.meta.requestStatus;
    });
    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      state.status = action.meta.requestStatus;
      state.fetchedAt = new Date().toString();
      if (!action.payload?.accountId) return;
      const { accountId, accountBalance, balances, portfolio, tokenIds } = action.payload;

      state.accountId = accountId;
      state.balances = {
        ...balances.map((b, i) => ({ [tokenIds[i]]: b })).reduce((a, b) => ({ ...a, ...b }), {}),
        near: accountBalance,
      };

      if (portfolio) {
        const { supplied, borrowed, collateral, farms } = portfolio;
        state.portfolio = {
          supplied: listToMap(supplied),
          borrowed: listToMap(borrowed),
          collateral: listToMap(collateral),
          farms: transformFarms(farms),
        };
      }
    });
  },
});

export const { logoutAccount } = accountSlice.actions;
export default accountSlice.reducer;
