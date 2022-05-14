import Decimal from "decimal.js";
import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { hasAssets, toUsd } from "../utils";
import { getExtraDailyTotals } from "./getExtraDailyTotals";
import { shrinkToken } from "../../store/helper";
import { Asset } from "../assetsSlice";
import { Portfolio } from "../accountSlice";

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

export const computeStakingBoostedAPY = (
  type: "supplied" | "borrowed",
  asset: Asset,
  portfolio: Portfolio,
  newDailyAmount: number,
) => {
  const assetDecimals = asset.metadata.decimals + asset.config.extra_decimals;

  const supplied = Number(
    shrinkToken(portfolio.supplied[asset.token_id]?.balance || 0, assetDecimals),
  );
  const collateral = Number(
    shrinkToken(portfolio.collateral[asset.token_id]?.balance || 0, assetDecimals),
  );
  const borrowed = Number(
    shrinkToken(portfolio.borrowed[asset.token_id]?.balance || 0, assetDecimals),
  );
  const totalAmount = type === "supplied" ? supplied + collateral : borrowed;
  const newAPY = ((newDailyAmount * 365) / totalAmount) * 100;

  return newAPY;
};

export const getGains = (account, assets, source: "supplied" | "collateral" | "borrowed") =>
  Object.keys(account.portfolio[source])
    .map((id) => {
      const asset = assets.data[id];

      const { balance } = account.portfolio[source][id];
      const apr = Number(account.portfolio[source][id].apr);
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

      const [gainCollateral, totalCollateral] = getGains(account, assets, "collateral");
      const [gainSupplied, totalSupplied] = getGains(account, assets, "supplied");
      const [gainBorrowed] = getGains(account, assets, "borrowed");

      const gainExtra = extraDaily * 365;

      const netGains = gainCollateral + gainSupplied + gainExtra - gainBorrowed;
      const netTotals = totalCollateral + totalSupplied;
      const netAPY = (netGains / netTotals) * 100;

      return netAPY || 0;
    },
  );
