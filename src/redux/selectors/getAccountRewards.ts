import Decimal from "decimal.js";
import { createSelector } from "@reduxjs/toolkit";
import { omit } from "lodash";

import { NEAR_LOGO_SVG, shrinkToken } from "../../store";
import { RootState } from "../store";
import { Asset, AssetsState } from "../assetState";
import { Farm, FarmData, Portfolio } from "../accountState";
import { getStaking } from "./getStaking";
import { INetTvlFarmRewards } from "../../interfaces";
import { hasAssets, toUsd } from "../utils";

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
  price: number;
}

export interface IAccountRewards {
  brrr: IPortfolioReward;
  extra: {
    [tokenId: string]: IPortfolioReward;
  };
  net: {
    [tokenId: string]: IPortfolioReward;
  };
}

export const getGains = (
  portfolio: Portfolio,
  assets: AssetsState,
  source: "supplied" | "collateral" | "borrowed",
  withNetTvlMultiplier = false,
) =>
  Object.keys(portfolio[source])
    .map((id) => {
      const asset = assets.data[id];
      const netTvlMultiplier = asset.config.net_tvl_multiplier / 10000;

      const { balance } = portfolio[source][id];
      const apr = Number(portfolio[source][id].apr);
      const balanceUSD = toUsd(balance, asset);

      return [balanceUSD * (withNetTvlMultiplier ? netTvlMultiplier : 1), apr];
    })
    .reduce(([gain, sum], [balance, apr]) => [gain + balance * apr, sum + balance], [0, 0]);

export const computePoolsDailyAmount = (
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

export const computeNetLiquidityDailyAmount = (
  asset: Asset,
  xBRRRAmount: number,
  netTvlFarm: INetTvlFarmRewards,
  farmData: FarmData,
  boosterDecimals: number,
  netLiquidity: number,
) => {
  const boosterLogBase = Number(
    shrinkToken(farmData.asset_farm_reward.booster_log_base, boosterDecimals),
  );

  const assetDecimals = asset.metadata.decimals + asset.config.extra_decimals;

  const log = Math.log(xBRRRAmount) / Math.log(boosterLogBase);
  const multiplier = log >= 0 ? 1 + log : 1;

  const boostedShares = Number(shrinkToken(farmData.boosted_shares, assetDecimals));

  const totalBoostedShares = Number(
    shrinkToken(netTvlFarm[asset.token_id].boosted_shares, assetDecimals),
  );
  const totalRewardsPerDay = Number(
    shrinkToken(netTvlFarm[asset.token_id].reward_per_day, assetDecimals),
  );

  const dailyAmount = (boostedShares / totalBoostedShares) * totalRewardsPerDay;

  const shares =
    Number(shrinkToken(new Decimal(netLiquidity).mul(10 ** 18).toFixed(), assetDecimals)) || 0;

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
    const xBRRRAmount = xBRRR + extraXBRRRAmount;

    const [, totalCollateral] = getGains(account.portfolio, assets, "collateral");
    const [, totalSupplied] = getGains(account.portfolio, assets, "supplied");
    const [, totalBorrowed] = getGains(account.portfolio, assets, "borrowed");

    const netLiquidity = totalCollateral + totalSupplied - totalBorrowed;

    const computePoolsRewards =
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

          const { dailyAmount, newDailyAmount, multiplier } = computePoolsDailyAmount(
            type,
            asset,
            rewardAsset,
            account.portfolio,
            xBRRRAmount,
            farmData,
            app.config.booster_decimals,
          );

          return {
            icon: icon || `data:image/svg+xml,${NEAR_LOGO_SVG}`,
            name,
            symbol,
            tokenId: rewardTokenId,
            unclaimedAmount,
            dailyAmount,
            newDailyAmount,
            multiplier,
            price: rewardAsset.price?.usd || 0,
          };
        });
      };

    const computeNetLiquidityRewards = ([rewardTokenId, farmData]: [string, FarmData]) => {
      const rewardAsset = assets.data[rewardTokenId];
      const rewardAssetDecimals = rewardAsset.metadata.decimals + rewardAsset.config.extra_decimals;
      const { icon, symbol, name } = rewardAsset.metadata;
      const unclaimedAmount = Number(shrinkToken(farmData.unclaimed_amount, rewardAssetDecimals));

      const { dailyAmount, newDailyAmount, multiplier } = computeNetLiquidityDailyAmount(
        rewardAsset,
        xBRRRAmount,
        assets.netTvlFarm,
        farmData,
        app.config.booster_decimals,
        netLiquidity,
      );

      return {
        icon: icon || `data:image/svg+xml,${NEAR_LOGO_SVG}`,
        name,
        symbol,
        tokenId: rewardTokenId,
        unclaimedAmount,
        dailyAmount,
        newDailyAmount,
        multiplier,
        price: rewardAsset.price?.usd || 0,
      };
    };

    const { supplied, borrowed, netTvl } = account.portfolio.farms;
    const hasNetTvlFarm = !!Object.entries(assets.netTvlFarm).length;

    const suppliedRewards = Object.entries(supplied).map(computePoolsRewards("supplied")).flat();
    const borrowedRewards = Object.entries(borrowed).map(computePoolsRewards("borrowed")).flat();

    const netLiquidityRewards = hasNetTvlFarm
      ? Object.entries(netTvl)
          .filter(([tokenId]) => assets.netTvlFarm[tokenId])
          .map(computeNetLiquidityRewards)
      : [];

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
      net: netLiquidityRewards.reduce(
        (rewards, asset) => ({ ...rewards, [asset.tokenId]: asset }),
        {},
      ),
    } as IAccountRewards;
  },
);

export const getAdjustedNetLiquidity = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (assets, account) => {
    if (!hasAssets(assets)) return 0;

    const [, totalCollateral] = getGains(account.portfolio, assets, "collateral", true);
    const [, totalSupplied] = getGains(account.portfolio, assets, "supplied", true);
    const [, totalBorrowed] = getGains(account.portfolio, assets, "borrowed", true);

    const netLiquidity = totalCollateral + totalSupplied - totalBorrowed;
    return netLiquidity;
  },
);

export const getAdjustedAssets = createSelector(
  (state: RootState) => state.assets,
  (assets) => {
    if (!hasAssets(assets)) return [];
    return Object.entries(assets.data)
      .map(([, asset]) => (asset.config.net_tvl_multiplier < 10000 ? asset : undefined))
      .filter(Boolean) as Asset[];
  },
);
