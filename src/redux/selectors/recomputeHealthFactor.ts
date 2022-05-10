import { clone } from "ramda";
import { createSelector } from "@reduxjs/toolkit";

import { expandToken } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getCollateralSum, getBorrowedSum } from "./getMaxBorrowAmount";

export const recomputeHealthFactor = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return 0;
      if (!account.portfolio || !tokenId) return 0;

      const collateralSum = getCollateralSum(assets.data, account);
      const { metadata, config } = assets.data[tokenId];

      const newBalance = (
        Number(account.portfolio.borrowed[tokenId]?.balance || 0) +
        Number(expandToken(amount, metadata.decimals + config.extra_decimals, 0))
      ).toString();

      const clonedAccount = clone(account);

      if (!clonedAccount.portfolio.borrowed[tokenId]) {
        clonedAccount.portfolio.borrowed[tokenId] = {
          balance: newBalance,
          shares: newBalance,
          apr: "0",
        };
      }

      clonedAccount.portfolio.borrowed[tokenId] = {
        ...clonedAccount.portfolio.borrowed[tokenId],
        balance: newBalance,
      };

      const borrowedSum = getBorrowedSum(assets.data, amount === 0 ? account : clonedAccount);

      if (!Object.keys(account.portfolio.borrowed).length && amount === 0) return -1;

      const healthFactor = (collateralSum / borrowedSum) * 100;
      return healthFactor < 10000 ? healthFactor : 10000;
    },
  );
