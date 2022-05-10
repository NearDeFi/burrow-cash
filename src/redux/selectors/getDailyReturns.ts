import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getGains } from "./getNetAPY";

export const getDailyReturns = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (state: RootState) => state.app,
  (assets, account, app) => {
    if (!hasAssets(assets)) return 0;
    const boosterTokenId = app.config.booster_token_id;

    const [gainCollateral] = getGains(account, assets, "collateral", boosterTokenId);
    const [gainSupplied] = getGains(account, assets, "supplied", boosterTokenId);
    const [gainBorrowed] = getGains(account, assets, "borrowed", boosterTokenId);

    const netGains = (gainCollateral + gainSupplied - gainBorrowed) / 365;
    return netGains;
  },
);
