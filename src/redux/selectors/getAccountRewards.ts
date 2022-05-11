import { createSelector } from "@reduxjs/toolkit";
import { omit } from "lodash";

import { shrinkToken } from "../../store";
import { RootState } from "../store";
import { Farm } from "../accountSlice";
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

export const getAccountRewards = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (state: RootState) => state.app,
  getStaking,
  (assets, account, app, staking) => {
    const brrrTokenId = app.config.booster_token_id;
    const { xBRRR, extraXBRRRAmount } = staking;

    const computeRewards = ([tokenId, farm]: [string, Farm]) => {
      return Object.entries(farm).map(([rewardTokenId, farmData]) => {
        const asset = assets.data[tokenId];
        const assetDecimals = asset.metadata.decimals + asset.config.extra_decimals;
        const rewardAsset = assets.data[rewardTokenId];
        const rewardAssetDecimals =
          rewardAsset.metadata.decimals + rewardAsset.config.extra_decimals;

        const totalRewardsPerDay = Number(
          shrinkToken(farmData.asset_farm_reward.reward_per_day, assetDecimals),
        );

        const totalBoostedShares = Number(
          shrinkToken(farmData.asset_farm_reward.boosted_shares, assetDecimals),
        );

        const boostedShares = Number(shrinkToken(farmData.boosted_shares, rewardAssetDecimals));
        const { icon, symbol, name } = rewardAsset.metadata;

        const dailyAmount = (boostedShares / totalBoostedShares) * totalRewardsPerDay;
        const unclaimedAmount = Number(shrinkToken(farmData.unclaimed_amount, rewardAssetDecimals));

        // new daily amount
        const boosterLogBase = Number(
          shrinkToken(farmData.asset_farm_reward.booster_log_base, app.config.booster_decimals),
        );

        const xBRRRAmount = xBRRR + extraXBRRRAmount;
        const log = Math.log(xBRRRAmount) / Math.log(boosterLogBase);
        const multiplier = log >= 0 ? 1 + log : 1;

        const suppliedShares = Number(
          shrinkToken(
            account.portfolio.supplied[rewardAsset.token_id]?.shares || 0,
            rewardAssetDecimals,
          ),
        );
        const collateralShares = Number(
          shrinkToken(
            account.portfolio.collateral[rewardAsset.token_id]?.shares || 0,
            rewardAssetDecimals,
          ),
        );
        const shares = suppliedShares + collateralShares;
        const newBoostedShares = shares * multiplier;
        const newTotalBoostedShares = totalBoostedShares + newBoostedShares - boostedShares;
        const newDailyAmount = (newBoostedShares / newTotalBoostedShares) * totalRewardsPerDay;

        console.info(
          asset.token_id,
          assetDecimals,
          boosterLogBase,
          multiplier,
          rewardAsset.token_id,
          rewardAssetDecimals,
        );

        return {
          icon,
          name,
          symbol,
          tokenId: rewardTokenId,
          unclaimedAmount,
          dailyAmount,
          boosterLogBase,
          newDailyAmount,
          multiplier,
        };
      });
    };

    const { supplied, borrowed } = account.portfolio.farms;

    const suppliedRewards = Object.entries(supplied).map(computeRewards).flat();
    const borrowedRewards = Object.entries(borrowed).map(computeRewards).flat();

    const sumRewards = [...suppliedRewards, ...borrowedRewards].reduce((rewards, asset) => {
      if (!rewards[asset.tokenId]) return { ...rewards, [asset.tokenId]: asset };

      const updatedAsset = rewards[asset.tokenId];

      updatedAsset.unclaimedAmount += asset.unclaimedAmount;
      updatedAsset.dailyAmount += asset.dailyAmount;

      return { ...rewards, [asset.tokenId]: updatedAsset };
    }, {});

    return {
      brrr: sumRewards[brrrTokenId] || {},
      extra: omit(sumRewards, brrrTokenId) || {},
    } as IAccountRewards;
  },
);
