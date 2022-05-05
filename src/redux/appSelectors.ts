import { createSelector } from "@reduxjs/toolkit";
import Decimal from "decimal.js";
import { clone } from "ramda";

import type { RootState } from "./store";
import { transformAsset } from "./utils";
import { getBorrowedSum, getCollateralSum } from "./accountSelectors";
import { shrinkToken, expandToken } from "../store";
import { DUST_THRESHOLD } from "../config";

export const getConfig = createSelector(
  (state: RootState) => state.app,
  (app) => app.config,
);

export const getModalStatus = createSelector(
  (state: RootState) => state.app,
  (app) => app.showModal,
);

export const getDisplayAsTokenValue = createSelector(
  (state: RootState) => state.app,
  (app) => app.displayAsTokenValue,
);

export const getSlimStats = createSelector(
  (state: RootState) => state.app,
  (app) => app.slimStats,
);

export const getFullDigits = createSelector(
  (state: RootState) => state.app,
  (app) => app.fullDigits,
);

export const getShowDust = createSelector(
  (state: RootState) => state.app,
  (app) => app.showDust,
);

export const getShowTicker = createSelector(
  (state: RootState) => state.app,
  (app) => app.showTicker,
);

export const getSelectedValues = createSelector(
  (state: RootState) => state.app,
  (app) => app.selected,
);

export const getTableSorting = createSelector(
  (state: RootState) => state.app,
  (app) => app.tableSorting,
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
      ...(asset ? transformAsset(asset, account, assets, app) : {}),
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
    (state: RootState) => state.app,
    (state: RootState) => state.assets.data,
    (state: RootState) => state.account,
    (app, assets, account) => {
      const asset = assets[tokenId];
      if (!asset || app.selected.tokenId !== tokenId) return 0;
      if (!["Withdraw", "Adjust"].includes(app.selected.action as string)) return 0;
      const { metadata, config } = asset;
      const decimals = metadata.decimals + config.extra_decimals;

      const clonedAccount = clone(account);
      const empty = {
        balance: "0",
        shares: "0",
        apr: "0",
      };

      const { supplied, collateral } = clonedAccount.portfolio;

      if (!supplied[tokenId]) {
        supplied[tokenId] = empty;
      }

      if (!collateral[tokenId]) {
        collateral[tokenId] = empty;
      }

      const collateralBalance = Number(shrinkToken(collateral[tokenId].balance, decimals));
      const suppliedBalance = Number(shrinkToken(supplied[tokenId].balance, decimals));

      const borrowedSum = getBorrowedSum(assets, account);

      if (borrowedSum <= DUST_THRESHOLD) {
        return collateralBalance + suppliedBalance;
      }

      let iterations = 0;
      const MIN_SAFE_HEALTH_FACTOR = 100.1;
      const MAX_SAFE_HEALTH_FACTOR = 101;
      const MAX_ITERATIONS = 150;

      const computeMaxWithdraw = (amount: number) => {
        const newBalance = expandToken(collateralBalance + suppliedBalance - amount, decimals);
        clonedAccount.portfolio.collateral[tokenId].balance = newBalance;
        const collateralSum = getCollateralSum(assets, clonedAccount);
        const healthFactor = (collateralSum / borrowedSum) * 100;

        iterations++;

        if (
          (healthFactor >= MIN_SAFE_HEALTH_FACTOR && healthFactor <= MAX_SAFE_HEALTH_FACTOR) ||
          iterations > MAX_ITERATIONS
        ) {
          return amount;
        }

        if (healthFactor < MIN_SAFE_HEALTH_FACTOR) {
          return computeMaxWithdraw(amount - amount / 2);
        }

        return computeMaxWithdraw(amount + amount * 2);
      };

      return computeMaxWithdraw(collateralBalance + suppliedBalance);
    },
  );

export const getSupplyMaxAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets.data,
    (state: RootState) => state.account.balances,
    (assets, balances) => {
      const asset = assets[tokenId];
      const { decimals } = asset.metadata;

      const suppliedBalance = new Decimal(balances[tokenId] || "0").div(
        new Decimal(10).pow(decimals),
      );

      return suppliedBalance.toString();
    },
  );
