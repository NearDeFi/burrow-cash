import { omit } from "ramda";
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import { sumReducer, shrinkToken, USD_FORMAT, PERCENT_DIGITS, NEAR_DECIMALS } from "../store";
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
  accountId: string;
  balances: Balance;
  portfolio: Portfolio;
}

const initialState: AccountState = {
  accountId: "",
  balances: {},
  portfolio: {
    supplied: {},
    collateral: {},
    borrowed: {},
  },
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

export const getAccountId = createSelector(
  (state: RootState) => state.account,
  (account) => account.accountId,
);

export const getAccountBalance = createSelector(
  (state: RootState) => state.account.balances,
  (balances) => {
    return balances?.near ? shrinkToken(balances?.near, NEAR_DECIMALS, PERCENT_DIGITS) : "...";
  },
);

export const getTotalAccountBalance = (source: "borrowed" | "supplied") =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      const tokens = account.portfolio[source];
      return Object.keys(tokens)
        .map((tokenId) => {
          const { price, metadata, config } = assets[tokenId];
          return price?.usd
            ? Number(
                shrinkToken(tokens[tokenId].balance, metadata.decimals + config.extra_decimals),
              ) * price.usd
            : 0;
        })
        .reduce(sumReducer, 0)
        .toLocaleString(undefined, USD_FORMAT);
    },
  );

export const { receivedAccount } = accountSlice.actions;
export default accountSlice.reducer;
