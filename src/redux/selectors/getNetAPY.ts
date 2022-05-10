import { createSelector } from "@reduxjs/toolkit";

import { shrinkToken } from "../../store/helper";
import { RootState } from "../store";
import { hasAssets } from "../utils";

export const getGains = (account, assets, source: "supplied" | "collateral" | "borrowed") =>
  Object.keys(account.portfolio[source])
    .map((id) => {
      const asset = assets.data[id];
      const balance = Number(account.portfolio[source][id].balance);
      const apr = Number(account.portfolio[source][id].apr);
      const balance$ =
        Number(shrinkToken(balance, asset.metadata.decimals + asset.config.extra_decimals)) *
        (asset.price?.usd || 0);

      return [balance$, apr];
    })
    .reduce(([gain, sum], [balance, apr]) => [gain + balance * apr, sum + balance], [0, 0]);

export const getNetAPY = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (assets, account) => {
    if (!hasAssets(assets)) return 0;

    const [gainCollateral, totalCollateral] = getGains(account, assets, "collateral");
    const [gainSupplied, totalSupplied] = getGains(account, assets, "supplied");
    const [gainBorrowed] = getGains(account, assets, "borrowed");

    const netGains = gainCollateral + gainSupplied - gainBorrowed;
    const netTotals = totalCollateral + totalSupplied;
    const netAPY = (netGains * 100) / netTotals;
    return netAPY || 0;
  },
);
