import { createSelector } from "@reduxjs/toolkit";

import { shrinkToken, PERCENT_DIGITS } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";

export const getCollateralAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return 0;
      const collateral = account.portfolio.collateral[tokenId];
      if (!collateral) return 0;
      const { metadata, config } = assets.data[tokenId];
      return Number(
        shrinkToken(collateral.balance, metadata.decimals + config.extra_decimals, PERCENT_DIGITS),
      );
    },
  );
