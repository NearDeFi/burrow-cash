import Decimal from "decimal.js";
import { clone } from "ramda";
import { createSelector } from "@reduxjs/toolkit";

import { expandTokenDecimal, MAX_RATIO } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getAdjustedSum } from "./getWithdrawMaxAmount";

export const recomputeHealthFactor = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return 0;
      if (!account.portfolio || !tokenId) return 0;
      if (!Object.keys(account.portfolio.borrowed).length && amount === 0) return -1;

      const { metadata, config } = assets.data[tokenId];
      const decimals = metadata.decimals + config.extra_decimals;

      const newBalance = expandTokenDecimal(amount, decimals)
        .plus(new Decimal(account.portfolio.borrowed[tokenId]?.balance || 0))
        .toFixed();

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

      const portfolio = amount === 0 ? account.portfolio : clonedAccount.portfolio;

      const adjustedCollateralSum = getAdjustedSum("collateral", account.portfolio, assets.data);
      const adjustedBorrowedSum = getAdjustedSum("borrowed", portfolio, assets.data);

      const healthFactor = adjustedCollateralSum.div(adjustedBorrowedSum).mul(100).toNumber();

      return healthFactor < MAX_RATIO ? healthFactor : MAX_RATIO;
    },
  );
