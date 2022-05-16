import Decimal from "decimal.js";
import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import { hiddenAssets } from "../config";
import { toUsd, transformAsset } from "./utils";

export const getAvailableAssets = (source: "supply" | "borrow") =>
  createSelector(
    (state: RootState) => state.assets.data,
    (state: RootState) => state.account,
    (state: RootState) => state.app,
    (assets, account, app) => {
      const filterKey = source === "supply" ? "can_deposit" : "can_borrow";
      return Object.keys(assets)
        .filter((tokenId) => assets[tokenId].config[filterKey])
        .filter((tokenId) => !hiddenAssets.includes(assets[tokenId].token_id))
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

export const getAssets = createSelector(
  (state: RootState) => state.assets,
  (assets) => assets,
);

export const getTotalSupplyUSD = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets,
    (assets) => {
      const asset = assets.data[tokenId];
      if (!asset) return 0;

      const totalSupplyD = new Decimal(asset.supplied.balance)
        .plus(new Decimal(asset.reserved))
        .toFixed();

      return toUsd(totalSupplyD, asset);
    },
  );
