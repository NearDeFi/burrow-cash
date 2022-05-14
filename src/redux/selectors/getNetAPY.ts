import Decimal from "decimal.js";
import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { getRewards, hasAssets, toUsd } from "../utils";

export const computeRewardAPY = (rewardsPerDay, decimals, price, totalSupplyMoney) => {
  return new Decimal(rewardsPerDay)
    .div(new Decimal(10).pow(decimals))
    .mul(365)
    .mul(price)
    .div(totalSupplyMoney)
    .toNumber();
};

export const getExtraAPY = (extraRewards, totalSupplyMoney) =>
  extraRewards?.reduce(
    (acc, { rewards, metadata, price, config }) =>
      acc +
      computeRewardAPY(
        rewards.reward_per_day,
        metadata.decimals + config.extra_decimals,
        price || 0,
        totalSupplyMoney,
      ),
    0,
  ) || 0;

export const getGains = (
  account,
  assets,
  source: "supplied" | "collateral" | "borrowed",
  boosterTokenId,
) =>
  Object.keys(account.portfolio[source])
    .map((id) => {
      const asset = assets.data[id];
      const { balance } = account.portfolio[source][id];
      const apr = Number(account.portfolio[source][id].apr);
      const balanceUSD = toUsd(balance, asset);

      let extraAPY = 0;
      const sign = source === "borrowed" ? -1 : 1;

      if (source !== "collateral") {
        const rewards = getRewards(source, asset, assets.data);
        const extraRewards = rewards.filter((r) => r.metadata.token_id !== boosterTokenId);
        const totalSupplyD = new Decimal(asset.supplied.balance)
          .plus(new Decimal(asset.reserved))
          .toFixed();
        const totalSupplyMoney = toUsd(totalSupplyD, asset);

        extraAPY = getExtraAPY(extraRewards, totalSupplyMoney);
      }

      return [balanceUSD, apr + sign * extraAPY];
    })
    .reduce(([gain, sum], [balance, apr]) => [gain + balance * apr, sum + balance], [0, 0]);

export const getNetAPY = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (state: RootState) => state.app,
  (assets, account, app) => {
    if (!hasAssets(assets)) return 0;
    const boosterTokenId = app.config.booster_token_id;

    const [gainCollateral, totalCollateral] = getGains(
      account,
      assets,
      "collateral",
      boosterTokenId,
    );
    const [gainSupplied, totalSupplied] = getGains(account, assets, "supplied", boosterTokenId);
    const [gainBorrowed] = getGains(account, assets, "borrowed", boosterTokenId);

    const netGains = gainCollateral + gainSupplied - gainBorrowed;
    const netTotals = totalCollateral + totalSupplied;
    const netAPY = (netGains / netTotals) * 100;
    return netAPY || 0;
  },
);
