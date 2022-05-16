import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { hasAssets, toUsd } from "../utils";
import { getExtraDailyTotals } from "./getExtraDailyTotals";
import { AssetsState } from "../assetsSlice";
import { Portfolio } from "../accountSlice";

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
