import { omit } from "ramda";
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import { PERCENT_DIGITS, NEAR_DECIMALS, shrinkToken } from "../store";
import { IAccountDetailed } from "../interfaces";
import type { RootState } from "./store";

interface Balance {
  [tokenId: string]: string;
}

interface PortfolioAsset {
  apr: string;
  balance: string;
  shares: string;
}

interface Portfolio {
  supplied: {
    [tokenId: string]: PortfolioAsset;
  };
  collateral: {
    [tokenId: string]: PortfolioAsset;
  };
  borrowed: {
    [tokenId: string]: PortfolioAsset;
  };
}
export interface AccountState {
  accountId?: string;
  balances?: Balance;
  portfolio?: Portfolio;
}

const initialState: AccountState = {
  accountId: undefined,
  balances: undefined,
};

const listToMap = (list) =>
  list
    .map((asset) => ({ [asset.token_id]: omit(["token_id"], asset) }))
    .reduce((a, b) => ({ ...a, ...b }), {});

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    receivedAccount(
      state,
      action: PayloadAction<{
        accountId: string;
        accountBalance: string;
        balances: string[];
        portfolio: IAccountDetailed;
        tokenIds: string[];
      }>,
    ) {
      const { accountId, accountBalance, balances, portfolio, tokenIds } = action.payload;

      state.accountId = accountId;
      state.balances = {
        ...balances.map((b, i) => ({ [tokenIds[i]]: b })).reduce((a, b) => ({ ...a, ...b }), {}),
        near: accountBalance,
      };

      const { supplied, borrowed, collateral } = portfolio;

      state.portfolio = {
        supplied: listToMap(supplied),
        borrowed: listToMap(borrowed),
        collateral: listToMap(collateral),
      };
    },
  },
});

export const getAccountBalance = createSelector(
  (state: RootState) => state.account.balances,
  (balances) => {
    return balances?.near ? shrinkToken(balances?.near, NEAR_DECIMALS, PERCENT_DIGITS) : "...";
  },
);

export const { receivedAccount } = accountSlice.actions;
export default accountSlice.reducer;
