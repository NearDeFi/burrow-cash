import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getExtraDailyTotals } from "./getExtraDailyTotals";
import { getAccountRewards, getGains } from "./getAccountRewards";
import { getProtocolRewards } from "./getProtocolRewards";
import { getTotalBalance } from "./getTotalBalance";

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

export const getNetTvlAPY = ({ isStaking = false }) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    getAccountRewards,
    (assets, account, rewards) => {
      if (!hasAssets(assets)) return 0;

      const [, totalCollateral] = getGains(account.portfolio, assets, "collateral", true);
      const [, totalSupplied] = getGains(account.portfolio, assets, "supplied", true);

      const netTvlRewards = Object.values(rewards.net).reduce(
        (acc, r) => acc + (isStaking ? r.newDailyAmount : r.dailyAmount) * r.price,
        0,
      );
      const netLiquidity = totalCollateral + totalSupplied;
      const apy = ((netTvlRewards * 365) / netLiquidity) * 100;

      return apy || 0;
    },
  );

export const getTotalNetTvlAPY = createSelector(
  getProtocolRewards,
  getTotalBalance("supplied", true),
  getTotalBalance("borrowed", true),
  (state: RootState) => state.assets,
  (rewards, supplied, borrowed, assets) => {
    if (!rewards.length) return 0;
    const totalDailyNetTvlRewards = rewards.reduce(
      (acc, r) =>
        acc + (r.dailyAmount * r.price * assets.data[r.tokenId].config.net_tvl_multiplier) / 10000,
      0,
    );
    const totalProtocolLiquidity = supplied - borrowed;
    const apy = ((totalDailyNetTvlRewards * 365) / totalProtocolLiquidity) * 100;
    return apy;
  },
);
