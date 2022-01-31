import { createSelector } from "@reduxjs/toolkit";
import Decimal from "decimal.js";

import type { RootState } from "./store";
import { transformAsset } from "./utils";

export const getModalStatus = createSelector(
  (state: RootState) => state.app,
  (app) => app.showModal,
);

export const getDisplayAsTokenValue = createSelector(
  (state: RootState) => state.app,
  (app) => app.displayAsTokenValue,
);

export const getShowDust = createSelector(
  (state: RootState) => state.app,
  (app) => app.showDust,
);

export const getSelectedValues = createSelector(
  (state: RootState) => state.app,
  (app) => app.selected,
);

export const getAssetData = createSelector(
  (state: RootState) => state.app,
  (state: RootState) => state.assets.data,
  (state: RootState) => state.account,
  (app, assets, account) => {
    const asset = assets[app.selected?.tokenId];
    return {
      tokenId: asset?.token_id,
      action: app.selected.action,
      ...(asset ? transformAsset(asset, account) : {}),
    };
  },
);

export const getRepayMaxAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets.data,
    (state: RootState) => state.account,
    (assets, account) => {
      const asset = assets[tokenId];

      const accountBalance = new Decimal(account.balances[tokenId] || "0").div(
        new Decimal(10).pow(asset.metadata.decimals),
      );
      const borrowed = new Decimal(account.portfolio.borrowed[tokenId]?.balance || "0").div(
        new Decimal(10).pow(asset.metadata.decimals + asset.config.extra_decimals),
      );

      return Decimal.min(borrowed, accountBalance).toString();
    },
  );

export const getWithdrawMaxAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets.data,
    (state: RootState) => state.account.portfolio,
    (assets, portfolio) => {
      const asset = assets[tokenId];
      const decimals = asset.metadata.decimals + asset.config.extra_decimals;

      const suppliedBalance = new Decimal(portfolio.supplied[tokenId]?.balance || "0").div(
        new Decimal(10).pow(decimals),
      );
      const collateralBalance = new Decimal(portfolio.collateral[tokenId]?.balance || "0").div(
        new Decimal(10).pow(decimals),
      );

      return suppliedBalance.plus(collateralBalance).toString();
    },
  );
