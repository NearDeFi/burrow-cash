import Decimal from "decimal.js";
import { Account, Contract } from "near-api-js";

import { DEFAULT_PRECISION, NANOS_PER_YEAR, MAX_RATIO, NUM_DECIMALS } from "./constants";
import { getBurrow } from "../utils";
import { ViewMethodsOracle, IAssetPrice, IPrices } from "../interfaces";
import { Asset } from "../redux/assetsSlice";

Decimal.set({ precision: DEFAULT_PRECISION });

interface Price {
  multiplier: string;
  decimals: number;
  usd: number;
}

export const aprToRate = (apr: string): string => {
  const exp = new Decimal(1).dividedBy(new Decimal(NANOS_PER_YEAR));
  const base = new Decimal(apr).dividedBy(new Decimal(100));
  const result: Decimal = base.plus(new Decimal(1)).pow(exp);
  const roundRes: Decimal = result.mul(new Decimal(10).pow(new Decimal(27)));
  return roundRes.toPrecision(12);
};

export const rateToApr = (rate: string): string => {
  const apr = new Decimal(100)
    .mul(new Decimal(rate).div(new Decimal(10).pow(new Decimal(27))).pow(NANOS_PER_YEAR))
    .sub(100);

  return apr.toFixed(2);
};

export const getPrices = async (tokenIds: string[]): Promise<IPrices> => {
  const { view, oracleContract } = await getBurrow();

  try {
    const priceResponse: IPrices = (await view(
      oracleContract,
      ViewMethodsOracle[ViewMethodsOracle.get_price_data],
      {
        asset_ids: tokenIds,
      },
    )) as IPrices;

    if (priceResponse) {
      priceResponse.prices = priceResponse?.prices.map((assetPrice: IAssetPrice) => ({
        ...assetPrice,
        price: {
          ...assetPrice.price,
          usd: new Decimal(assetPrice.price?.multiplier || 0).div(10000).toNumber(),
        },
      }))!;
    }

    return priceResponse;
  } catch (err: any) {
    console.error("Getting prices failed: ", err.message);
    throw new Error(err);
  }
};

export const expandToken = (
  value: string | number,
  decimals: string | number,
  fixed?: number,
): string => {
  return new Decimal(value).mul(new Decimal(10).pow(decimals)).toFixed(fixed);
};

export const shrinkToken = (
  value: string | number,
  decimals: string | number,
  fixed?: number,
): string => {
  return new Decimal(value).div(new Decimal(10).pow(decimals)).toFixed(fixed);
};

export const shrinkTokenD = (value: Decimal, decimals: number): Decimal => {
  return new Decimal(value).div(new Decimal(10).pow(decimals));
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

export const sharesToAmount = (asset: Asset, shares: string, roundUp: boolean): Decimal => {
  const sharesD = new Decimal(shares);
  const assetSuppliedBalanceD = new Decimal(asset.supplied.balance);
  const assetSuppliedSharesD = new Decimal(asset.supplied.shares);

  if (
    sharesD.comparedTo(assetSuppliedBalanceD) >= 0 ||
    sharesD.comparedTo(assetSuppliedSharesD) === 0
  ) {
    return assetSuppliedBalanceD;
  }

  const extra = roundUp ? assetSuppliedSharesD.minus(new Decimal(1)) : new Decimal(0);
  return assetSuppliedBalanceD.mul(sharesD).plus(extra).div(assetSuppliedSharesD);
};

export const fromBalancePrice = (balance: Decimal, price: Price, extraDecimals: number) => {
  const num = new Decimal(price.multiplier).mul(balance);
  const denominatorDecimals = price.decimals + extraDecimals;
  if (denominatorDecimals > NUM_DECIMALS) {
    return num.div(new Decimal(10).pow(denominatorDecimals - NUM_DECIMALS));
  }
  return num.mul(new Decimal(10).pow(NUM_DECIMALS - denominatorDecimals));
};

export const multRatio = (balance: Decimal, ratio: number) =>
  balance
    .mul(ratio)
    .plus(new Decimal(MAX_RATIO / 2))
    .div(new Decimal(MAX_RATIO));

export const divRatio = (balance: Decimal, ratio: number) =>
  balance
    .mul(new Decimal(MAX_RATIO))
    .plus(new Decimal(MAX_RATIO / 2))
    .div(ratio);
