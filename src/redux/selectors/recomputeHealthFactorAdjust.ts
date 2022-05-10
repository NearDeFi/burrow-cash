import { clone } from "ramda";

import { createSelector } from "@reduxjs/toolkit";
import { expandToken } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getCollateralSum, getBorrowedSum } from "./getMaxBorrowAmount";

export const recomputeHealthFactorAdjust = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return 0;
      if (!account.portfolio || !tokenId) return 0;

      const { metadata, config } = assets.data[tokenId];

      const newBalance = Number(
        expandToken(amount, metadata.decimals + config.extra_decimals, 0),
      ).toString();

      const clonedAccount = clone(account);

      if (!clonedAccount.portfolio.collateral[tokenId]) {
        clonedAccount.portfolio.collateral[tokenId] = {
          balance: newBalance,
          shares: newBalance,
          apr: "0",
        };
      }

      clonedAccount.portfolio.collateral[tokenId] = {
        ...clonedAccount.portfolio.collateral[tokenId],
        balance: newBalance,
      };

      const collateralSum = getCollateralSum(assets.data, clonedAccount);
      const borrowedSum = getBorrowedSum(assets.data, account);

      const healthFactor = (collateralSum / borrowedSum) * 100;
      return healthFactor < 10000 ? healthFactor : 10000;
    },
  );
