import Decimal from "decimal.js";
import { clone } from "ramda";
import { createSelector } from "@reduxjs/toolkit";

import { expandTokenDecimal, MAX_RATIO } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getAdjustedSum } from "./getWithdrawMaxAmount";
import { decimalMin } from "../../utils";

export const recomputeHealthFactorRepayFromDeposits = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return 0;
      if (!account.portfolio || !tokenId || !account.portfolio.borrowed[tokenId]) return 0;

      const { metadata, config } = assets.data[tokenId];
      const decimals = metadata.decimals + config.extra_decimals;

      const amountDecimal = expandTokenDecimal(amount, decimals);

      const collateralBalance = new Decimal(account.portfolio.collateral[tokenId]?.balance || "0");
      const suppliedBalance = new Decimal(account.portfolio.supplied[tokenId]?.balance || "0");

      const newWithdrawBalance = decimalMin(
        collateralBalance,
        collateralBalance.plus(suppliedBalance).minus(amountDecimal),
      );

      const borrowedBalance = new Decimal(account.portfolio.borrowed[tokenId].balance);
      const newBorrowedBalance = borrowedBalance.minus(amountDecimal);

      const clonedAccount = clone(account);
      clonedAccount.portfolio.borrowed[tokenId].balance = newBorrowedBalance.toFixed();
      clonedAccount.portfolio.collateral[tokenId].balance = newWithdrawBalance.toFixed();

      const adjustedCollateralSum = getAdjustedSum("collateral", account.portfolio, assets.data);
      const adjustedBorrowedSum = getAdjustedSum("borrowed", clonedAccount.portfolio, assets.data);

      const healthFactor = adjustedCollateralSum.div(adjustedBorrowedSum).mul(100).toNumber();

      return healthFactor < MAX_RATIO ? healthFactor : MAX_RATIO;
    },
  );
