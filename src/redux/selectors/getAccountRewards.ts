import { createSelector } from "@reduxjs/toolkit";
import { omit } from "lodash";

import { shrinkToken } from "../../store";
import { RootState } from "../store";
import { Asset } from "../assetState";
import { Farm, FarmData, Portfolio } from "../accountState";
import { getStaking } from "./getStaking";

interface IPortfolioReward {
  icon: string;
  name: string;
  symbol: string;
  tokenId: string;
  totalAmount: number;
  dailyAmount: number;
  unclaimedAmount: number;
  boosterLogBase: number;
  newDailyAmount: number;
  multiplier: number;
}

export interface IAccountRewards {
  brrr: IPortfolioReward;
  extra: {
    [tokenId: string]: IPortfolioReward;
  };
}

export const computeDailyAmount = (
  type: "supplied" | "borrowed",
  asset: Asset,
  rewardAsset: Asset,
  portfolio: Portfolio,
  xBRRRAmount: number,
  farmData: FarmData,
  boosterDecimals: number,
) => {
  const boosterLogBase = Number(
    shrinkToken(farmData.asset_farm_reward.booster_log_base, boosterDecimals),
  );

  const assetDecimals = asset.metadata.decimals + asset.config.extra_decimals;
  const rewardAssetDecimals = rewardAsset.metadata.decimals + rewardAsset.config.extra_decimals;

  const log = Math.log(xBRRRAmount) / Math.log(boosterLogBase);
  const multiplier = log >= 0 ? 1 + log : 1;

  const boostedShares = Number(shrinkToken(farmData.boosted_shares, assetDecimals));

  const totalBoostedShares = Number(
    shrinkToken(farmData.asset_farm_reward.boosted_shares, assetDecimals),
  );
  const totalRewardsPerDay = Number(
    shrinkToken(farmData.asset_farm_reward.reward_per_day, rewardAssetDecimals),
  );

  const dailyAmount = (boostedShares / totalBoostedShares) * totalRewardsPerDay;

  const suppliedShares = Number(
    shrinkToken(portfolio.supplied[asset.token_id]?.shares || 0, assetDecimals),
  );
  const collateralShares = Number(
    shrinkToken(portfolio.collateral[asset.token_id]?.shares || 0, assetDecimals),
  );
  const borrowedShares = Number(
    shrinkToken(portfolio.borrowed[asset.token_id]?.shares || 0, assetDecimals),
  );

  const shares = type === "supplied" ? suppliedShares + collateralShares : borrowedShares;
  const newBoostedShares = shares * multiplier;
  const newTotalBoostedShares = totalBoostedShares + newBoostedShares - boostedShares;
  const newDailyAmount = (newBoostedShares / newTotalBoostedShares) * totalRewardsPerDay;

  return { dailyAmount, newDailyAmount, multiplier, totalBoostedShares, shares };
};

export const getAccountRewards = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (state: RootState) => state.app,
  getStaking,
  (assets, account, app, staking) => {
    const brrrTokenId = app.config.booster_token_id;
    const { xBRRR, extraXBRRRAmount } = staking;

    const computeRewards =
      (type: "supplied" | "borrowed") =>
      ([tokenId, farm]: [string, Farm]) => {
        return Object.entries(farm).map(([rewardTokenId, farmData]) => {
          const asset = assets.data[tokenId];
          const rewardAsset = assets.data[rewardTokenId];
          const rewardAssetDecimals =
            rewardAsset.metadata.decimals + rewardAsset.config.extra_decimals;

          const { icon, symbol, name } = rewardAsset.metadata;

          const unclaimedAmount = Number(
            shrinkToken(farmData.unclaimed_amount, rewardAssetDecimals),
          );

          const xBRRRAmount = xBRRR + extraXBRRRAmount;

          const { dailyAmount, newDailyAmount, multiplier } = computeDailyAmount(
            type,
            asset,
            rewardAsset,
            account.portfolio,
            xBRRRAmount,
            farmData,
            app.config.booster_decimals,
          );

          return {
            icon,
            name,
            symbol,
            tokenId: rewardTokenId,
            unclaimedAmount,
            dailyAmount,
            newDailyAmount,
            multiplier,
          };
        });
      };

    const { supplied, borrowed } = account.portfolio.farms;

    const suppliedRewards = Object.entries(supplied).map(computeRewards("supplied")).flat();
    const borrowedRewards = Object.entries(borrowed).map(computeRewards("borrowed")).flat();

    const sumRewards = [...suppliedRewards, ...borrowedRewards].reduce((rewards, asset) => {
      if (!rewards[asset.tokenId]) return { ...rewards, [asset.tokenId]: asset };

      const updatedAsset = rewards[asset.tokenId];

      updatedAsset.unclaimedAmount += asset.unclaimedAmount;
      updatedAsset.dailyAmount += asset.dailyAmount;
      updatedAsset.newDailyAmount += asset.newDailyAmount;

      return { ...rewards, [asset.tokenId]: updatedAsset };
    }, {});

    return {
      brrr: sumRewards[brrrTokenId] || {},
      extra: omit(sumRewards, brrrTokenId) || {},
    } as IAccountRewards;
  },
);
