import { createSelector } from "@reduxjs/toolkit";

import { shrinkToken } from "../../store";
import { RootState } from "../store";
import { sumReducer, hasAssets } from "../utils";
import { Assets } from "../assetsSlice";
import { AccountState } from "../accountState";

const MAX_RATIO = 10000;

export const getCollateralSum = (assets: Assets, account: AccountState) =>
  Object.keys(account.portfolio.collateral)
    .map((id) => {
      const asset = assets[id];
      const balance = Number(account.portfolio.collateral[id].balance) * (asset.price?.usd || 0);
      const volatiliyRatio = asset.config.volatility_ratio || 0;

      return (
        Number(shrinkToken(balance, asset.metadata.decimals + asset.config.extra_decimals)) *
        (volatiliyRatio / MAX_RATIO)
      );
    })
    .reduce(sumReducer, 0);

export const getBorrowedSum = (assets: Assets, account: AccountState) =>
  Object.keys(account.portfolio.borrowed)
    .map((id) => {
      const asset = assets[id];
      const balance = Number(account.portfolio.borrowed[id].balance) * (asset.price?.usd || 0);
      const volatiliyRatio = asset.config.volatility_ratio || 0;
      return (
        Number(shrinkToken(balance, asset.metadata.decimals + asset.config.extra_decimals)) /
        (volatiliyRatio / MAX_RATIO)
      );
    })
    .reduce(sumReducer, 0);

export const getMaxBorrowAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!account.accountId || !tokenId) return 0;
      if (!hasAssets(assets)) return 0;
      const collateralSum = getCollateralSum(assets.data, account);
      const borrowedSum = getBorrowedSum(assets.data, account);

      const volatiliyRatio = assets.data[tokenId].config.volatility_ratio || 0;
      return (
        (((collateralSum - borrowedSum) * (volatiliyRatio / MAX_RATIO)) /
          (assets.data[tokenId].price?.usd || Infinity)) *
        0.95
      );
    },
  );
