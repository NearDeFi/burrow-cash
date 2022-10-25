import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getExtraDailyTotals } from "./getExtraDailyTotals";
import { getAccountRewards, getGains } from "./getAccountRewards";

export const getDailyReturns = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  getExtraDailyTotals({ isStaking: false }),
  getAccountRewards,
  (assets, account, extraDaily, rewards) => {
    if (!hasAssets(assets)) return 0;

    const [gainCollateral] = getGains(account.portfolio, assets, "collateral");
    const [gainSupplied] = getGains(account.portfolio, assets, "supplied");
    const [gainBorrowed] = getGains(account.portfolio, assets, "borrowed");

    const netTvlDaily = Object.entries(rewards.net).reduce(
      (acc, [, { dailyAmount, price }]) => acc + dailyAmount * price,
      0,
    );

    const netGains =
      (gainCollateral + gainSupplied + extraDaily * 365 + netTvlDaily * 365 - gainBorrowed) / 365;
    return netGains;
  },
);
