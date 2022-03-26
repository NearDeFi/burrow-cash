import { createSelector } from "@reduxjs/toolkit";
import Decimal from "decimal.js";
import { clone } from "ramda";

import type { RootState } from "./store";
import { transformAsset } from "./utils";
import { nearTokenId } from "../utils";
import { getBorrowedSum, getCollateralSum } from "./accountSelectors";
import { shrinkToken, expandToken } from "../store";

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
      ...(asset ? transformAsset(asset, account, assets) : {}),
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

export const getWithdrawMaxNEARAmount = createSelector(
  (state: RootState) => state.app,
  (state: RootState) => state.assets.data,
  (state: RootState) => state.account,
  (app, assets, account) => {
    const asset = assets[nearTokenId];
    if (!asset || app.selected.tokenId !== nearTokenId) return 0;
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

    if (!supplied[nearTokenId]) {
      supplied[nearTokenId] = empty;
    }

    if (!collateral[nearTokenId]) {
      collateral[nearTokenId] = empty;
    }

    const collateralBalance = Number(shrinkToken(collateral[nearTokenId].balance, decimals));
    const suppliedBalance = Number(shrinkToken(supplied[nearTokenId].balance, decimals));

    const computeMaxNearWithdraw = (amount: number) => {
      const newBalance = expandToken(collateralBalance + suppliedBalance - amount, decimals);
      clonedAccount.portfolio.collateral[nearTokenId].balance = newBalance;
      const borrowedSum = getBorrowedSum(assets, account);
      const collateralSum = getCollateralSum(assets, clonedAccount);
      const healthFactor = (collateralSum / borrowedSum) * 100;

      if (healthFactor >= 105) {
        return amount;
      }

      return computeMaxNearWithdraw(amount - 1e-2);
    };

    return computeMaxNearWithdraw(collateralBalance + suppliedBalance);
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
