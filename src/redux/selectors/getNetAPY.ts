import Decimal from "decimal.js";
import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { hasAssets, toUsd } from "../utils";
import { getExtraDailyTotals } from "./getExtraDailyTotals";
import { AssetsState } from "../assetState";
import { FarmData, Portfolio } from "../accountState";
import { getAccountRewards } from "./getAccountRewards";

export const getGains = (
  portfolio: Portfolio,
  assets: AssetsState,
  source: "supplied" | "collateral" | "borrowed",
) =>
  Object.keys(portfolio[source])
    .map((id) => {
      const asset = assets.data[id];

      const { balance } = portfolio[source][id];
      const apr = Number(portfolio[source][id].apr);
      const balanceUSD = toUsd(balance, asset);

      return [balanceUSD, apr];
    })
    .reduce(([gain, sum], [balance, apr]) => [gain + balance * apr, sum + balance], [0, 0]);

export const getNetAPY = ({ isStaking = false }: { isStaking: boolean }) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    getExtraDailyTotals({ isStaking }),
    (assets, account, extraDaily) => {
      if (!hasAssets(assets)) return 0;

      const [gainCollateral, totalCollateral] = getGains(account.portfolio, assets, "collateral");
      const [gainSupplied, totalSupplied] = getGains(account.portfolio, assets, "supplied");
      const [gainBorrowed] = getGains(account.portfolio, assets, "borrowed");

      const gainExtra = extraDaily * 365;

      const netGains = gainCollateral + gainSupplied + gainExtra - gainBorrowed;
      const netTotals = totalCollateral + totalSupplied;
      const netAPY = (netGains / netTotals) * 100;

      return netAPY || 0;
    },
  );

export const getNetTvlAPY = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  getAccountRewards,
  (assets, account, rewards) => {
    if (!hasAssets(assets)) return 0;

    const [, totalCollateral] = getGains(account.portfolio, assets, "collateral");
    const [, totalSupplied] = getGains(account.portfolio, assets, "supplied");
    const [, totalBorrowed] = getGains(account.portfolio, assets, "borrowed");

    const netTvlRewards = Object.values(rewards.net).reduce(
      (acc, r) => acc + r.dailyAmount * r.price,
      0,
    );
    const netLiquidity = totalCollateral + totalSupplied - totalBorrowed;
    const apy = (netTvlRewards / netLiquidity) * 100;

    return apy || 0;
  },
);

export const getNetTvlAPY_NEW = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (assets, account) => {
    if (!hasAssets(assets)) return 0;

    const accountNetTvlFarms = account.portfolio.farms.netTvl;

    const apy = Object.entries(accountNetTvlFarms).map(([tokenId, farm]: [string, FarmData]) => {
      // const asset = assets.data[tokenId];
      console.info(tokenId, farm);
      const boostedShares = new Decimal(farm.boosted_shares);
      const totalBoostedShares = new Decimal(farm.asset_farm_reward.boosted_shares);
      const totalRewardsPerDay = new Decimal(farm.asset_farm_reward.reward_per_day);
      const rewardApy = boostedShares.div(totalBoostedShares).times(totalRewardsPerDay).times(365);
      // console.info(rewardApy.toNumber());
      return rewardApy.toFixed();
    });

    console.info(apy);

    return 0;
  },
);
