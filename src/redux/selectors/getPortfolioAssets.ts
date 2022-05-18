import { createSelector } from "@reduxjs/toolkit";
import Decimal from "decimal.js";

import { RootState } from "../store";
import { emptySuppliedAsset, emptyBorrowedAsset, hasAssets, getRewards, toUsd } from "../utils";
import { shrinkToken, expandToken } from "../../store";
import { Asset, Assets } from "../assetsSlice";
import { Farm } from "../accountState";

export const getPortfolioRewards = (
  type: "supplied" | "borrowed",
  asset: Asset,
  farm: Farm,
  assets: Assets,
) => {
  if (!farm) return [];
  return Object.entries(farm).map(([tokenId, rewards]) => {
    const assetDecimals = asset.metadata.decimals + asset.config.extra_decimals;
    const reardTokendecimals =
      assets[tokenId].metadata.decimals + assets[tokenId].config.extra_decimals;

    const totalRewardsPerDay = Number(
      shrinkToken(asset.farms[type][tokenId]?.["reward_per_day"] || "0", assetDecimals),
    );
    const totalBoostedShares = Number(
      shrinkToken(asset.farms[type][tokenId]?.["boosted_shares"] || "0", assetDecimals),
    );
    const boostedShares = Number(
      shrinkToken(farm?.[tokenId]?.boosted_shares || "0", reardTokendecimals),
    );

    const rewardPerDay = (boostedShares / totalBoostedShares) * totalRewardsPerDay || 0;

    return {
      rewards: { ...rewards, reward_per_day: expandToken(rewardPerDay, reardTokendecimals) },
      metadata: assets[tokenId].metadata,
      config: assets[tokenId].config,
      type: "portfolio",
    };
  });
};

export const getPortfolioAssets = createSelector(
  (state: RootState) => state.app,
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (app, assets, account) => {
    if (!hasAssets(assets)) return [[], []];
    const brrrTokenId = app.config.booster_token_id;
    const portfolioAssets = {
      ...account.portfolio.supplied,
      ...account.portfolio.collateral,
    };
    const supplied = Object.keys(portfolioAssets)
      .map((tokenId) => {
        const asset = assets.data[tokenId];
        const collateral = shrinkToken(
          account.portfolio.collateral[tokenId]?.balance || 0,
          asset.metadata.decimals + asset.config.extra_decimals,
        );
        const suppliedBalance = account.portfolio.supplied[tokenId]?.balance || 0;
        const totalSupplyD = new Decimal(asset.supplied.balance)
          .plus(new Decimal(asset.reserved))
          .toFixed();

        return {
          tokenId,
          symbol: asset.metadata.symbol,
          icon: asset.metadata.icon,
          price: asset.price?.usd ?? 0,
          apy: Number(portfolioAssets[tokenId].apr) * 100,
          collateral: Number(collateral),
          supplied:
            Number(collateral) +
            Number(
              shrinkToken(suppliedBalance, asset.metadata.decimals + asset.config.extra_decimals),
            ),
          canUseAsCollateral: asset.config.can_use_as_collateral,
          canWithdraw: asset.config.can_withdraw,
          rewards: getPortfolioRewards(
            "supplied",
            asset,
            account.portfolio.farms.supplied[tokenId],
            assets.data,
          ),
          depositRewards: getRewards("supplied", asset, assets.data),
          totalSupplyMoney: toUsd(totalSupplyD, asset),
        };
      })
      .filter(app.showDust ? Boolean : emptySuppliedAsset);

    const borrowed = Object.keys(account.portfolio.borrowed)
      .map((tokenId) => {
        const asset = assets.data[tokenId];

        const borrowedBalance = account.portfolio.borrowed[tokenId].balance;
        const brrrUnclaimedAmount =
          account.portfolio.farms.borrowed[tokenId]?.[brrrTokenId]?.unclaimed_amount || "0";
        const totalSupplyD = new Decimal(asset.supplied.balance)
          .plus(new Decimal(asset.reserved))
          .toFixed();

        return {
          tokenId,
          symbol: asset.metadata.symbol,
          icon: asset.metadata.icon,
          price: asset.price?.usd ?? 0,
          supplyApy: Number(asset.supply_apr) * 100,
          borrowApy: Number(asset.borrow_apr) * 100,
          borrowed: Number(
            shrinkToken(borrowedBalance, asset.metadata.decimals + asset.config.extra_decimals),
          ),
          brrrUnclaimedAmount: Number(
            shrinkToken(brrrUnclaimedAmount, assets.data[brrrTokenId].metadata.decimals),
          ),
          rewards: getPortfolioRewards(
            "borrowed",
            asset,
            account.portfolio.farms.borrowed[tokenId],
            assets.data,
          ),
          borrowRewards: getRewards("borrowed", asset, assets.data),
          totalSupplyMoney: toUsd(totalSupplyD, asset),
        };
      })
      .filter(app.showDust ? Boolean : emptyBorrowedAsset);

    return [supplied, borrowed];
  },
);
