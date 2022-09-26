import { createSelector } from "@reduxjs/toolkit";
import { MAX_RATIO } from "../../store";

import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getAdjustedSum } from "./getWithdrawMaxAmount";

export const getHealthFactor = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account.portfolio,
  (assets, portfolio) => {
    if (!hasAssets(assets)) return null;
    if (!portfolio) return null;
    if (!Object.keys(portfolio.borrowed).length) return -1;

    const adjustedCollateralSum = getAdjustedSum("collateral", portfolio, assets.data);
    const adjustedBorrowedSum = getAdjustedSum("borrowed", portfolio, assets.data);

    const healthFactor = adjustedCollateralSum.div(adjustedBorrowedSum).mul(100).toNumber();

    return healthFactor < MAX_RATIO ? healthFactor : MAX_RATIO;
  },
);
