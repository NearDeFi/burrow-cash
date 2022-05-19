import Decimal from "decimal.js";
import { clone } from "ramda";

import { createSelector } from "@reduxjs/toolkit";
import { MAX_RATIO, expandTokenDecimal } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getAdjustedSum } from "./getWithdrawMaxAmount";
import { decimalMin } from "../../utils";

export const recomputeHealthFactorWithdraw = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return 0;
      if (!account.portfolio || !tokenId) return 0;

      const { metadata, config } = assets.data[tokenId];
      const decimals = metadata.decimals + config.extra_decimals;

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

      const collateralBalance = new Decimal(clonedAccount.portfolio.collateral[tokenId].balance);
      const suppliedBalance = new Decimal(clonedAccount.portfolio.supplied[tokenId].balance);
      const amountDecimal = expandTokenDecimal(amount, decimals);

      const newBalanceD = decimalMin(
        collateralBalance,
        collateralBalance.plus(suppliedBalance).minus(amountDecimal),
      );

      clonedAccount.portfolio.collateral[tokenId].balance = newBalanceD.toFixed();

      const adjustedCollateralSum = getAdjustedSum(
        "collateral",
        clonedAccount.portfolio,
        assets.data,
      );
      const adjustedBorrowedSum = getAdjustedSum("borrowed", account.portfolio, assets.data);

      const healthFactor = adjustedCollateralSum.div(adjustedBorrowedSum).mul(100).toNumber();

      return healthFactor < MAX_RATIO ? healthFactor : MAX_RATIO;
    },
  );
