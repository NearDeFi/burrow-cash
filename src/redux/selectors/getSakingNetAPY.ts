import { createSelector } from "@reduxjs/toolkit";

import { shrinkToken } from "../../store/helper";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { Asset } from "../assetsSlice";
import { Portfolio } from "../accountSlice";
import { getAccountRewards } from "./getAccountRewards";

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
      const balance = Number(account.portfolio[source][id].balance);
      const apr = Number(account.portfolio[source][id].apr);
      const balance$ =
        Number(shrinkToken(balance, asset.metadata.decimals + asset.config.extra_decimals)) *
        (asset.price?.usd || 0);

      return [balance$, apr];
    })
    .reduce(([gain, sum], [balance, apr]) => [gain + balance * apr, sum + balance], [0, 0]);

export const getSakingNetAPY = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  getAccountRewards,
  (assets, account, rewards) => {
    if (!hasAssets(assets)) return 0;
    const [gainCollateral, totalCollateral] = getGains(account, assets, "collateral");
    const [gainSupplied, totalSupplied] = getGains(account, assets, "supplied");
    const [gainBorrowed] = getGains(account, assets, "borrowed");

    const { extra } = rewards;

    const gainExtra = Object.keys(extra).reduce((acc, tokenId) => {
      const price = assets.data[tokenId]?.price?.usd || 0;
      return acc + extra[tokenId].newDailyAmount * price;
    }, 0);

    const netGains = gainCollateral + gainSupplied - gainBorrowed + gainExtra * 365;
    const netTotals = totalCollateral + totalSupplied;
    const netAPY = (netGains * 100) / netTotals;
    return netAPY || 0;
  },
);
