import Decimal from "decimal.js";
import { pick } from "ramda";

import { shrinkToken, USD_FORMAT, TOKEN_FORMAT, PERCENT_DIGITS } from "../store";
import type { Asset } from "./assetsSlice";
import type { AccountState } from "./accountSlice";

export const sumReducer = (sum: number, a: number) => sum + a;

export const toUsd = (balance: string, asset: Asset) =>
  asset.price?.usd
    ? Number(shrinkToken(balance, asset.metadata.decimals + asset.config.extra_decimals)) *
      asset.price.usd
    : 0;

export const emptyAsset = (asset: { supplied: string; collateral: string }): boolean =>
  (asset.supplied !== (0).toLocaleString(undefined, TOKEN_FORMAT) &&
    asset.collateral !== (0).toLocaleString(undefined, TOKEN_FORMAT)) ||
  (asset.supplied !== (0).toLocaleString(undefined, TOKEN_FORMAT) &&
    asset.collateral === (0).toLocaleString(undefined, TOKEN_FORMAT));

export interface UIAsset {
  tokenId: string;
  icon: string;
  symbol: string;
  name: string;
  price: number;
  price$: number;
  supplyApy: string;
  totalSupply: number;
  totalSupply$: string;
  borrowApy: string;
  availableLiquidity: number;
  availableLiquidity$: string;
  collateralFactor: string;
  canUseAsCollateral: boolean;
  supplied: number;
  collateral: number;
  borrowed: number;
  available: number;
  available$: string;
  extraDecimals: number;
}

export const transformAsset = (asset: Asset, account: AccountState): UIAsset => {
  const tokenId = asset.token_id;
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

  let accountAttrs = {
    supplied: 0,
    collateral: 0,
    borrowed: 0,
    available: 0,
    available$: "0",
    extraDecimals: 0,
  };

  // TODO: refactor this without conditional
  if (account.accountId) {
    const supplied = account.portfolio.supplied[tokenId]?.balance || 0;
    const collateral = account.portfolio.collateral[tokenId]?.balance || 0;
    const borrowed = account.portfolio.borrowed[tokenId]?.balance || 0;
    const available = Number(
      shrinkToken(
        account.balances[tokenId === "wrap.testnet" ? "near" : tokenId],
        asset.metadata.decimals + asset.config.extra_decimals,
      ),
    );

    accountAttrs = {
      supplied: Number(
        shrinkToken(supplied, asset.metadata.decimals + asset.config.extra_decimals),
      ),
      collateral: Number(
        shrinkToken(collateral, asset.metadata.decimals + asset.config.extra_decimals),
      ),
      borrowed: Number(
        shrinkToken(borrowed, asset.metadata.decimals + asset.config.extra_decimals),
      ),
      available,
      available$: (Number(available) * (asset.price?.usd || 0)).toLocaleString(
        undefined,
        USD_FORMAT,
      ),
      extraDecimals: asset.config.extra_decimals,
    };
  }

  return {
    tokenId,
    ...pick(["icon", "symbol", "name"], asset.metadata),
    price: asset.price ? asset.price.usd : 0,
    price$: asset.price ? asset.price.usd : 0,
    supplyApy: `${(Number(asset.supply_apr) * 100).toFixed(PERCENT_DIGITS)}%`,
    totalSupply,
    totalSupply$: toUsd(totalSupplyD, asset).toLocaleString(undefined, USD_FORMAT),
    borrowApy: `${(Number(asset.borrow_apr) * 100).toFixed(PERCENT_DIGITS)}%`,
    availableLiquidity,
    availableLiquidity$,
    collateralFactor: `${Number(asset.config.volatility_ratio / 100)}%`,
    canUseAsCollateral: asset.config.can_use_as_collateral,
    ...accountAttrs,
  };
};
