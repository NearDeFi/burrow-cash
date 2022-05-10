import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getCollateralSum, getBorrowedSum } from "./getMaxBorrowAmount";

export const getHealthFactor = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (assets, account) => {
    if (!hasAssets(assets)) return null;
    if (!account.portfolio) return null;
    if (!Object.keys(account.portfolio.borrowed).length) return -1;
    const collateralSum = getCollateralSum(assets.data, account);
    const borrowedSum = getBorrowedSum(assets.data, account);

    const healthFactor = (collateralSum / borrowedSum) * 100;
    return healthFactor < 10000 ? healthFactor : 10000;
  },
);
