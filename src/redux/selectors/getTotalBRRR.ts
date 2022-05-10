import { createSelector } from "@reduxjs/toolkit";

import { shrinkToken } from "../../store";
import { RootState } from "../store";
import { sumReducer } from "../utils";

export const getTotalBRRR = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (state: RootState) => state.app,
  (assets, account, app) => {
    const brrrTokenId = app.config.booster_token_id;
    if (!account.accountId || !assets.data[brrrTokenId]) return [0, 0];
    const { farms } = account.portfolio;
    const { decimals } = assets.data[brrrTokenId].metadata;
    const unclaimedSupplied = Object.keys(farms.supplied)
      .map((token) => farms.supplied[token]?.[brrrTokenId]?.unclaimed_amount || "0")
      .map((token) => Number(shrinkToken(token, decimals)))
      .reduce(sumReducer, 0);
    const unclaimedBorrowed = Object.keys(farms.borrowed)
      .map((token) => farms.borrowed[token]?.[brrrTokenId]?.unclaimed_amount || "0")
      .map((token) => Number(shrinkToken(token, decimals)))
      .reduce(sumReducer, 0);

    const totalBrrr = Number(
      shrinkToken(account.portfolio.supplied[brrrTokenId]?.balance || "0", decimals),
    );

    return [totalBrrr, unclaimedSupplied + unclaimedBorrowed];
  },
);
