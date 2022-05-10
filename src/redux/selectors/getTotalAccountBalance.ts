import { createSelector } from "@reduxjs/toolkit";

import { shrinkToken } from "../../store";
import { RootState } from "../store";
import { sumReducer, hasAssets } from "../utils";

export const getTotalAccountBalance = (source: "borrowed" | "supplied") =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return 0;
      const allTokens = {
        ...account.portfolio.collateral,
        ...account.portfolio.supplied,
        ...account.portfolio.borrowed,
      };

      const sourceTokens = account.portfolio[source];
      const { collateral } = account.portfolio;

      return Object.keys(allTokens)
        .map((tokenId) => {
          const { price, metadata, config } = assets.data[tokenId];
          const total =
            Number(
              shrinkToken(
                sourceTokens[tokenId]?.balance || 0,
                metadata.decimals + config.extra_decimals,
              ),
            ) * (price?.usd || 0);

          const totalCollateral =
            Number(
              shrinkToken(
                collateral[tokenId]?.balance || 0,
                metadata.decimals + config.extra_decimals,
              ),
            ) * (price?.usd || 0);

          return source === "supplied" ? total + totalCollateral : total;
        })
        .reduce(sumReducer, 0);
    },
  );
