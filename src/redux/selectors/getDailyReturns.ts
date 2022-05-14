import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getExtraDailyTotals } from "./getExtraDailyTotals";
import { getGains } from "./getNetAPY";

export const getDailyReturns = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  getExtraDailyTotals({ isStaking: false }),
  (assets, account, extraDaily) => {
    if (!hasAssets(assets)) return 0;

    const [gainCollateral] = getGains(account, assets, "collateral");
    const [gainSupplied] = getGains(account, assets, "supplied");
    const [gainBorrowed] = getGains(account, assets, "borrowed");

    const netGains = (gainCollateral + gainSupplied + extraDaily * 365 - gainBorrowed) / 365;
    return netGains;
  },
);
