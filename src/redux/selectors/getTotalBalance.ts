import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { toUsd, sumReducer, hasAssets } from "../utils";

export const getTotalBalance = (source: "borrowed" | "supplied", withNetTvlMultiplier = false) =>
  createSelector(
    (state: RootState) => state.assets,
    (assets) => {
      if (!hasAssets(assets)) return 0;
      return Object.keys(assets.data)
        .map((tokenId) => {
          const asset = assets.data[tokenId];
          const netTvlMultiplier = withNetTvlMultiplier
            ? asset.config.net_tvl_multiplier / 10000
            : 1;

          return (
            toUsd(asset[source].balance, asset) * netTvlMultiplier +
            (source === "supplied" ? toUsd(asset.reserved, asset) * netTvlMultiplier : 0)
          );
        })
        .reduce(sumReducer, 0);
    },
  );
