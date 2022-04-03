import Decimal from "decimal.js";
import { pick, omit } from "ramda";

import { shrinkToken, USD_FORMAT, TOKEN_FORMAT } from "../store";
import type { Asset, Assets, AssetsState } from "./assetsSlice";
import type { AccountState } from "./accountSlice";
import type { AppState } from "./appSlice";
import { UIAsset } from "../interfaces";

export const sumReducer = (sum: number, a: number) => sum + a;

export const hasAssets = (assets: AssetsState) => Object.entries(assets.data).length > 0;

export const listToMap = (list) =>
  list
    .map((asset) => ({ [asset.token_id]: omit(["token_id"], asset) }))
    .reduce((a, b) => ({ ...a, ...b }), {});

export const transformAccountFarms = (list) => {
  const farms = {
    supplied: {},
    borrowed: {},
  };

  list.forEach((farm) => {
    const [action, token] = Object.entries(farm["farm_id"])
      .flat()
      .map((s: any) => s.toLowerCase());

    farms[action] = {
      ...farms[action],
      [token]: farm.rewards.reduce(
        (o, item) => ({
          ...o,
          [item["reward_token_id"]]: {
            ...pick(["boosted_shares", "unclaimed_amount", "asset_farm_reward"], item),
          },
        }),
        {},
      ),
    };
  });

  return farms;
};

export const transformAssetFarms = (list) => {
  const farms = {
    supplied: {},
    borrowed: {},
  };
  list.forEach((farm) => {
    const [action] = Object.entries(farm["farm_id"])
      .flat()
      .map((s: any) => s.toLowerCase());
    farms[action] = { ...farms[action], ...farm.rewards };
  });
  return farms;
};

export const toUsd = (balance: string, asset: Asset) =>
  asset.price?.usd
    ? Number(shrinkToken(balance, asset.metadata.decimals + asset.config.extra_decimals)) *
      asset.price.usd
    : 0;

export const emptySuppliedAsset = (asset: { supplied: number; collateral: number }): boolean =>
  !(
    asset.supplied.toLocaleString(undefined, TOKEN_FORMAT) ===
      (0).toLocaleString(undefined, TOKEN_FORMAT) &&
    asset.collateral.toLocaleString(undefined, TOKEN_FORMAT) ===
      (0).toLocaleString(undefined, TOKEN_FORMAT)
  );

export const emptyBorrowedAsset = (asset: { borrowed: number }): boolean =>
  !(
    asset.borrowed.toLocaleString(undefined, TOKEN_FORMAT) ===
    (0).toLocaleString(undefined, TOKEN_FORMAT)
  );

export const transformAsset = (
  asset: Asset,
  account: AccountState,
  assets: Assets,
  app: AppState,
): UIAsset => {
  const tokenId = asset.token_id;
  const brrrTokenId = app.config.booster_token_id;
  const totalSupplyD = new Decimal(asset.supplied.balance)
    .plus(new Decimal(asset.reserved))
    .toFixed();

  const totalSupply = Number(
    shrinkToken(totalSupplyD, asset.metadata.decimals + asset.config.extra_decimals),
  );

  // TODO: refactor: remove temp vars using ramda
  const temp1 = new Decimal(asset.supplied.balance)
    .plus(new Decimal(asset.reserved))
    .minus(new Decimal(asset.borrowed.balance));
  const temp2 = temp1.minus(temp1.mul(0.001)).toFixed(0);
  const availableLiquidity = Number(
    shrinkToken(temp2, asset.metadata.decimals + asset.config.extra_decimals),
  );
  const availableLiquidity$ = toUsd(temp2, asset).toLocaleString(undefined, USD_FORMAT);
  const borrowedLiquidityMoney = toUsd(new Decimal(asset.borrowed.balance).toFixed(), asset);
  const totalLiquidityMoney = toUsd(totalSupplyD, asset);

  let accountAttrs = {
    supplied: 0,
    collateral: 0,
    borrowed: 0,
    availableNEAR: 0,
    available: 0,
    extraDecimals: 0,
  };

  // TODO: refactor this without conditional
  if (account.accountId) {
    const supplied = account.portfolio.supplied[tokenId]?.balance || 0;
    const collateral = account.portfolio.collateral[tokenId]?.balance || 0;
    const borrowed = account.portfolio.borrowed[tokenId]?.balance || 0;
    const available = account.balances[tokenId] || 0;
    const availableNEAR = account.balances["near"] || 0;

    const decimals = asset.metadata.decimals + asset.config.extra_decimals;

    accountAttrs = {
      supplied: Number(shrinkToken(supplied, decimals)),
      collateral: Number(shrinkToken(collateral, decimals)),
      borrowed: Number(shrinkToken(borrowed, decimals)),
      available: Number(shrinkToken(available, asset.metadata.decimals)),
      availableNEAR: Number(shrinkToken(availableNEAR, asset.metadata.decimals)),
      extraDecimals: asset.config.extra_decimals,
    };
  }

  const brrrBorrow = Number(
    shrinkToken(
      asset.farms.borrowed[brrrTokenId]?.["reward_per_day"] || "0",
      assets[brrrTokenId].metadata.decimals,
    ),
  );

  const brrrSupply = Number(
    shrinkToken(
      asset.farms.supplied[brrrTokenId]?.["reward_per_day"] || "0",
      assets[brrrTokenId].metadata.decimals,
    ),
  );

  const brrrBorrowEfficiency = borrowedLiquidityMoney
    ? ((brrrBorrow / borrowedLiquidityMoney) * 1000)
    : 0;
  const brrrSupplyEfficiency = totalLiquidityMoney
    ? ((brrrSupply / totalLiquidityMoney) * 1000)
    : 0;

  return {
    tokenId,
    ...pick(["icon", "symbol", "name"], asset.metadata),
    price: asset.price ? asset.price.usd : 0,
    supplyApy: Number(asset.supply_apr) * 100,
    totalSupply,
    totalSupply$: toUsd(totalSupplyD, asset).toLocaleString(undefined, USD_FORMAT),
    borrowApy: Number(asset.borrow_apr) * 100,
    availableLiquidity,
    availableLiquidity$,
    collateralFactor: `${Number(asset.config.volatility_ratio / 100)}%`,
    canUseAsCollateral: asset.config.can_use_as_collateral,
    ...accountAttrs,
    brrrBorrow,
    brrrSupply,
    brrrBorrowEfficiency: brrrBorrowEfficiency.toFixed(2),
    brrrSupplyEfficiency: brrrSupplyEfficiency.toFixed(2),
    brrrEfficiency: (brrrBorrowEfficiency + brrrSupplyEfficiency).toFixed(2),
    brrrEfficiencyWithAPY: Number(asset.borrow_apr)
      ? (
          (brrrBorrowEfficiency * brrrSupplyEfficiency) /
          (Number(asset.borrow_apr) * 100 - Number(asset.supply_apr) * 100)
        ).toFixed(2)
      : "0",
    totalLiquidityMoney,
    borrowedLiquidityMoney,
  };
};

export const getDailyBRRRewards = (
  asset: Asset,
  account: AccountState,
  assets: Assets,
  brrrTokenId: string,
  type: "supplied" | "borrowed",
): number => {
  const totalRewardsPerDay = Number(
    shrinkToken(
      asset.farms.borrowed[brrrTokenId]?.["reward_per_day"] || "0",
      assets[brrrTokenId].metadata.decimals,
    ),
  );
  const totalBoostedShares = Number(
    shrinkToken(
      asset.farms[type][brrrTokenId]?.["boosted_shares"] || "0",
      assets[brrrTokenId].metadata.decimals,
    ),
  );
  const boostedShares = Number(
    shrinkToken(
      account.portfolio.farms[type]?.[asset.token_id]?.[brrrTokenId]?.boosted_shares || "0",
      assets[brrrTokenId].metadata.decimals,
    ),
  );

  return (boostedShares / totalBoostedShares) * totalRewardsPerDay || 0;
};
