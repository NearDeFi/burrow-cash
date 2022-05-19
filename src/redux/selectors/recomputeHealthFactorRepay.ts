import Decimal from "decimal.js";
import { clone } from "ramda";
import { createSelector } from "@reduxjs/toolkit";

import { expandTokenDecimal, MAX_RATIO } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getAdjustedSum } from "./getWithdrawMaxAmount";

export const recomputeHealthFactorRepay = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return 0;
      if (!account.portfolio || !tokenId || !account.portfolio.borrowed[tokenId]) return 0;

      const { metadata, config } = assets.data[tokenId];
      const decimals = metadata.decimals + config.extra_decimals;

      const borrowedBalance = new Decimal(account.portfolio.borrowed[tokenId].balance);
      const newBalance = borrowedBalance.minus(expandTokenDecimal(amount, decimals));

      const clonedAccount = clone(account);
      clonedAccount.portfolio.borrowed[tokenId].balance = newBalance.toFixed();

      const adjustedCollateralSum = getAdjustedSum("collateral", account.portfolio, assets.data);
      const adjustedBorrowedSum = getAdjustedSum("borrowed", clonedAccount.portfolio, assets.data);

      const healthFactor = adjustedCollateralSum.div(adjustedBorrowedSum).mul(100).toNumber();

      return healthFactor < MAX_RATIO ? healthFactor : MAX_RATIO;
    },
  );
