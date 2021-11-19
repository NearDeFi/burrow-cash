import Decimal from "decimal.js";
import { Account, Contract } from "near-api-js";

import { DECIMAL_OVERRIDES, DEFAULT_PRECISION, NANOS_PER_YEAR, TOKEN_DECIMALS } from "./constants";
import { getBurrow } from "../utils";
import {
  ViewMethodsOracle,
  IAssetPrice,
  IPrices,
  IAccountDetailed,
  IAssetDetailed,
  IMetadata,
} from "../interfaces";

Decimal.set({ precision: DEFAULT_PRECISION });

export const sumReducer = (sum: number, a: number) => sum + a;

export const aprToRate = (apr: string): string => {
  console.log("Input APR", apr);
  const exp = new Decimal(1).dividedBy(new Decimal(NANOS_PER_YEAR));
  const base = new Decimal(apr).dividedBy(new Decimal(100));
  const result: Decimal = base.plus(new Decimal(1)).pow(exp);
  console.log("R", result.toPrecision(DEFAULT_PRECISION));
  console.log("R ** n", result.pow(new Decimal(NANOS_PER_YEAR)).toPrecision(DEFAULT_PRECISION));

  const roundRes: Decimal = result.mul(new Decimal(10).pow(new Decimal(27)));
  console.log("rate", roundRes.toPrecision(12));
  return roundRes.toPrecision(12);
};

export const rateToApr = (rate: string): string => {
  console.log("Input rate", rate);

  const apr = new Decimal(100)
    .mul(new Decimal(rate).div(new Decimal(10).pow(new Decimal(27))).pow(NANOS_PER_YEAR))
    .sub(100);

  return apr.toFixed(2);
};

export const getPrices = async (tokenIds: string[]): Promise<IPrices | undefined> => {
  const { view, oracleContract } = await getBurrow();

  try {
    const priceResponse: IPrices = (await view(
      oracleContract,
      ViewMethodsOracle[ViewMethodsOracle.get_price_data],
      {
        asset_ids: tokenIds,
      },
    )) as IPrices;

    console.log("prices", priceResponse);

    if (priceResponse) {
      priceResponse.prices = priceResponse?.prices.map((assetPrice: IAssetPrice) => ({
        ...assetPrice,
        price: assetPrice.price
          ? {
              ...assetPrice.price,
              usd: new Decimal(assetPrice.price?.multiplier || 0).div(10000).toNumber(),
            }
          : null,
      }))!;
    }

    console.log("prices", priceResponse);

    return priceResponse;
  } catch (err: any) {
    console.log("Getting prices failed: ", err.message);
    return undefined;
  }
};

export const expandToken = (value: string | number, decimals: string | number): string => {
  return new Decimal(value).mul(new Decimal(10).pow(decimals)).toFixed();
};

export const shrinkToken = (value: string | number, decimals: string | number): string => {
  return new Decimal(value).div(new Decimal(10).pow(decimals)).toFixed();
};

export const toUsd = (value: string, asset: IAssetDetailed & IMetadata): number => {
  return asset.price?.usd
    ? Number(shrinkToken(value, DECIMAL_OVERRIDES[asset.symbol] || TOKEN_DECIMALS)) *
        asset.price.usd
    : 0;
};

export const getAvailableAmount = (asset: IAssetDetailed): string => {
  let amount = new Decimal(asset.supplied.balance)
    .plus(new Decimal(asset.reserved))
    .minus(new Decimal(asset.borrowed.balance));

  amount = amount.minus(amount.mul(0.001));
  const result = amount.toFixed(0);

  console.log("availableAmount", result);
  return result;
};

export const computeMaxDiscount = (
  assets: IAssetDetailed[],
  portfolio: IAccountDetailed,
): number => {
  const collateralSum = portfolio.collateral
    .map(
      (collateral) =>
        Number(collateral.balance) *
        (assets.find((a) => a.token_id === collateral.token_id)?.price?.usd || 0),
    )
    .reduce(sumReducer, 0);

  const borrowSum = portfolio.borrowed
    .map(
      (borrowed) =>
        Number(borrowed.balance) *
        (assets.find((a) => a.token_id === borrowed.token_id)?.price?.usd || 0),
    )
    .reduce(sumReducer, 0);

  const discount = borrowSum <= collateralSum ? 0 : (borrowSum - collateralSum) / borrowSum;

  console.log("max discount", "c", collateralSum, "b", borrowSum, discount);

  return discount;
};

export const computeHealthFactor = (
  assets: IAssetDetailed[],
  portfolio: IAccountDetailed,
): number => {
  const collateralSum = portfolio.collateral
    .map((collateral) => {
      const asset = assets.find((a) => a.token_id === collateral.token_id)!;
      return (
        Number(collateral.balance) * (asset.price?.usd || 0) * (asset.config.volatility_ratio / 100)
      );
    })
    .reduce(sumReducer, 0);

  const borrowedSum = portfolio.borrowed
    .map((borrowed) => {
      const asset = assets.find((a) => a.token_id === borrowed.token_id)!;
      return (
        (Number(borrowed.balance) * (asset?.price?.usd || 0)) /
        (asset.config.volatility_ratio / 100)
      );
    })
    .reduce(sumReducer, 0);

  const healthFactor = collateralSum / borrowedSum;

  console.log("healthFactor", "c", collateralSum, "b", borrowedSum, healthFactor);

  return !Number.isNaN(healthFactor) ? healthFactor : 100;
};

export const getContract = async (
  account: Account,
  contractAddress: string,
  viewMethods: any,
  changeMethods: any,
): Promise<Contract> => {
  const contract: Contract = new Contract(account, contractAddress, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: Object.values(viewMethods)
      .filter((m) => typeof m === "string")
      .map((m) => m as string),
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: Object.values(changeMethods)
      .filter((m) => typeof m === "string")
      .map((m) => m as string),
  });

  return contract;
};
