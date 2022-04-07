import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getAssetsDetailed } from "../store";
import { getBurrow } from "../utils";
import { getBalance, getPortfolio } from "../api";
import { listToMap, transformAccountFarms } from "./utils";
import { ChangeMethodsLogic, IBoosterStaking } from "../interfaces";
import { identifyUser } from "../telemetry";

interface Balance {
  [tokenId: string]: string;
}

interface PortfolioAsset {
  apr: string;
  balance: string;
  shares: string;
}

interface Farm {
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
    supplied: {
      [tokenId: string]: Farm;
    };
    borrowed: {
      [tokenId: string]: Farm;
    };
  };
  staking: IBoosterStaking;
}

type Status = "pending" | "fulfilled" | "rejected" | undefined;
export interface AccountState {
  accountId: string;
  balances: Balance;
  portfolio: Portfolio;
  status: Status;
  fetchedAt: string | undefined;
  isClaiming: Status;
}

const initialStaking = {
  staked_booster_amount: "0",
  unlock_timestamp: "0",
  x_booster_amount: "0",
};

const initialState: AccountState = {
  accountId: "",
  balances: {},
  portfolio: {
    supplied: {},
    collateral: {},
    borrowed: {},
    farms: {
      supplied: {},
      borrowed: {},
    },
    staking: initialStaking,
  },
  status: undefined,
  isClaiming: undefined,
  fetchedAt: undefined,
};

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
  const { account } = await getBurrow();
  const { accountId } = account;

  if (accountId) {
    identifyUser(accountId);
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
        const { booster_staking, supplied, borrowed, collateral, farms } = portfolio;
        state.portfolio = {
          supplied: listToMap(supplied),
          borrowed: listToMap(borrowed),
          collateral: listToMap(collateral),
          farms: transformAccountFarms(farms),
          staking: booster_staking || initialStaking,
        };
      }
    });
  },
});

export const { logoutAccount } = accountSlice.actions;
export default accountSlice.reducer;
