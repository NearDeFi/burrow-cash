import { createSelector } from "@reduxjs/toolkit";

import { USD_FORMAT } from "../store";
import type { RootState } from "./store";
import { toUsd, transformAsset, sumReducer } from "./utils";

export const getTotalBalance = (source: "borrowed" | "supplied") =>
  createSelector(
    (state: RootState) => state.assets.data,
    (assets) =>
      Object.keys(assets)
        .map(
          (tokenId) =>
            toUsd(assets[tokenId][source].balance, assets[tokenId]) +
            (source === "supplied" ? toUsd(assets[tokenId].reserved, assets[tokenId]) : 0),
        )
        .reduce(sumReducer, 0)
        .toLocaleString(undefined, USD_FORMAT),
  );

export const getAvailableAssets = (source: "supply" | "borrow") =>
  createSelector(
    (state: RootState) => state.assets.data,
    (state: RootState) => state.account,
    (state: RootState) => state.app,
    (assets, account, app) => {
      const filterKey = source === "supply" ? "can_deposit" : "can_borrow";
      return Object.keys(assets)
        .filter((tokenId) => assets[tokenId].config[filterKey])
        .map((tokenId) => transformAsset(assets[tokenId], account, assets, app));
    },
  );

export const isAssetsLoading = createSelector(
  (state: RootState) => state.assets,
  (assets) => assets.status === "pending",
);

export const isAssetsFetching = createSelector(
  (state: RootState) => state.assets,
  (assets) => assets.status === "fetching",
);
