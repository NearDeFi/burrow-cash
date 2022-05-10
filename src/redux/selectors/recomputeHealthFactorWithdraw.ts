import { clone } from "ramda";

import { createSelector } from "@reduxjs/toolkit";
import { shrinkToken, expandToken } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getCollateralSum, getBorrowedSum } from "./getMaxBorrowAmount";

export const recomputeHealthFactorWithdraw = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return 0;
      if (!account.portfolio || !tokenId) return 0;

      const { metadata, config } = assets.data[tokenId];

      const clonedAccount = clone(account);

      if (!clonedAccount.portfolio.supplied[tokenId]) {
        clonedAccount.portfolio.supplied[tokenId] = {
          balance: "0",
          shares: "0",
          apr: "0",
        };
      }

      if (!clonedAccount.portfolio.collateral[tokenId]) {
        clonedAccount.portfolio.collateral[tokenId] = {
          balance: "0",
          shares: "0",
          apr: "0",
        };
      }

      const collateralBalanceInt = Number(
        shrinkToken(
          clonedAccount.portfolio.collateral[tokenId].balance,
          metadata.decimals + config.extra_decimals,
        ),
      );

      const suppliedBalanceInt = Number(
        shrinkToken(
          clonedAccount.portfolio.supplied[tokenId].balance,
          metadata.decimals + config.extra_decimals,
        ),
      );

      const newBalance = Number(
        expandToken(
          Math.min(
            collateralBalanceInt,
            collateralBalanceInt + suppliedBalanceInt - Number(amount),
          ),
          metadata.decimals + config.extra_decimals,
          0,
        ),
      ).toString();

      clonedAccount.portfolio.collateral[tokenId].balance = newBalance;

      const collateralSum = getCollateralSum(assets.data, clonedAccount);
      const borrowedSum = getBorrowedSum(assets.data, account);

      const healthFactor = (collateralSum / borrowedSum) * 100;
      return healthFactor < 10000 ? healthFactor : 10000;
    },
  );
