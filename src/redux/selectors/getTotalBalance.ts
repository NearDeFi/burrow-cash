import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { toUsd, sumReducer, hasAssets } from "../utils";

export const getTotalBalance = (source: "borrowed" | "supplied") =>
  createSelector(
    (state: RootState) => state.assets,
    (assets) => {
      if (!hasAssets(assets)) return 0;
      const { data } = assets;
      return Object.keys(data)
        .map(
          (tokenId) =>
            toUsd(data[tokenId][source].balance, data[tokenId]) +
            (source === "supplied" ? toUsd(data[tokenId].reserved, data[tokenId]) : 0),
        )
        .reduce(sumReducer, 0);
    },
  );
