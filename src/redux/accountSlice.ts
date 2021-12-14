import { omit, clone } from "ramda";
import Decimal from "decimal.js";
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import { MAX_RATIO, PERCENT_DIGITS, NEAR_DECIMALS, TOKEN_FORMAT } from "../store/constants";
import {
  shrinkToken,
  expandToken,
  sharesToAmount,
  fromBalancePrice,
  multRatio,
  divRatio,
  USD_FORMAT,
} from "../store";
import { IAccountDetailed } from "../interfaces";
import type { RootState } from "./store";
import { emptyAsset, sumReducer, sumReducerD } from "./utils";
import { AssetsState } from "./assetsSlice";

interface Balance {
  [tokenId: string]: string;
}

interface PortfolioAsset {
  apr: string;
  balance: string;
  shares: string;
}

export interface Portfolio {
  supplied: {
    [tokenId: string]: PortfolioAsset;
  };
  collateral: {
    [tokenId: string]: PortfolioAsset;
  };
  borrowed: {
    [tokenId: string]: PortfolioAsset;
  };
}
export interface AccountState {
  accountId: string;
  balances: Balance;
  portfolio: Portfolio;
}

const initialState: AccountState = {
  accountId: "",
  balances: {},
  portfolio: {
    supplied: {},
    collateral: {},
    borrowed: {},
  },
};

const listToMap = (list) =>
  list
    .map((asset) => ({ [asset.token_id]: omit(["token_id"], asset) }))
    .reduce((a, b) => ({ ...a, ...b }), {});

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    logoutAccount: () => initialState,
    receivedAccount(
      state,
      action: PayloadAction<{
        accountId: string;
        accountBalance: string;
        balances: string[];
        portfolio: IAccountDetailed;
        tokenIds: string[];
      }>,
    ) {
      const { accountId, accountBalance, balances, portfolio, tokenIds } = action.payload;

      state.accountId = accountId;
      state.balances = {
        ...balances.map((b, i) => ({ [tokenIds[i]]: b })).reduce((a, b) => ({ ...a, ...b }), {}),
        near: accountBalance,
      };

      if (portfolio) {
        const { supplied, borrowed, collateral } = portfolio;
        state.portfolio = {
          supplied: listToMap(supplied),
          borrowed: listToMap(borrowed),
          collateral: listToMap(collateral),
        };
      }
    },
  },
});

export const getAccountId = createSelector(
  (state: RootState) => state.account,
  (account) => account.accountId,
);

export const getCollateralAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      const collateral = account.portfolio.collateral[tokenId];
      if (!collateral) return 0;
      const { metadata, config } = assets[tokenId];
      return Number(shrinkToken(collateral.balance, metadata.decimals + config.extra_decimals));
    },
  );

export const getAccountBalance = createSelector(
  (state: RootState) => state.account.balances,
  (balances) => {
    return balances?.near ? shrinkToken(balances?.near, NEAR_DECIMALS, PERCENT_DIGITS) : "...";
  },
);

export const getTotalAccountBalance = (source: "borrowed" | "supplied") =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      const tokens = account.portfolio[source];
      return Object.keys(tokens)
        .map((tokenId) => {
          const { price, metadata, config } = assets[tokenId];
          return price?.usd
            ? Number(
                shrinkToken(tokens[tokenId].balance, metadata.decimals + config.extra_decimals),
              ) * price.usd
            : 0;
        })
        .reduce(sumReducer, 0)
        .toLocaleString(undefined, USD_FORMAT);
    },
  );

export const getPortfolioAssets = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (assets, account) => {
    const portfolioAssets = {
      ...account.portfolio.supplied,
      ...account.portfolio.collateral,
    };
    const supplied = Object.keys(portfolioAssets)
      .map((tokenId) => {
        const asset = assets[tokenId];
        const collateral = shrinkToken(
          account.portfolio.collateral[tokenId]?.balance || 0,
          asset.metadata.decimals + asset.config.extra_decimals,
        );
        const suppliedBalance = account.portfolio.supplied[tokenId]?.balance || 0;
        return {
          tokenId,
          symbol: asset.metadata.symbol,
          icon: asset.metadata.icon,
          price: asset.price ? asset.price.usd.toLocaleString(undefined, USD_FORMAT) : "$-.-",
          price$: asset.price?.usd ?? 1,
          apy: Number(portfolioAssets[tokenId].apr) * 100,
          collateral: Number(collateral),
          supplied: Number(
            shrinkToken(suppliedBalance, asset.metadata.decimals + asset.config.extra_decimals),
          ),
          canUseAsCollateral: asset.config.can_use_as_collateral,
        };
      })
      .filter(emptyAsset);

    const borrowed = Object.keys(account.portfolio.borrowed).map((tokenId) => {
      const asset = assets[tokenId];

      const borrowedBalance = account.portfolio.borrowed[tokenId].balance;

      return {
        tokenId,
        symbol: asset.metadata.symbol,
        icon: asset.metadata.icon,
        price: asset.price ? asset.price.usd.toLocaleString(undefined, USD_FORMAT) : "$-.-",
        price$: asset.price?.usd ?? 0,
        supplyApy: Number(asset.supply_apr) * 100,
        borrowApy: Number(asset.borrow_apr) * 100,
        borrowed: Number(
          shrinkToken(borrowedBalance, asset.metadata.decimals + asset.config.extra_decimals),
        ),
      };
    });
    return [supplied, borrowed];
  },
);

const getCollateralSum = (assets: AssetsState, account: AccountState) =>
  Object.keys(account.portfolio.collateral)
    .map((id) => {
      const asset = assets[id];
      const balance = Number(account.portfolio.collateral[id].balance) * (asset.price?.usd || 0);
      const volatiliyRatio = asset.config.volatility_ratio || 0;

      return (
        Number(shrinkToken(balance, asset.metadata.decimals + asset.config.extra_decimals)) *
        (volatiliyRatio / MAX_RATIO)
      );
    })
    .reduce(sumReducer, 0);

const getBorrowedSum = (assets: AssetsState, account: AccountState) =>
  Object.keys(account.portfolio.borrowed)
    .map((id) => {
      const asset = assets[id];
      const balance = Number(account.portfolio.borrowed[id].balance) * (asset.price?.usd || 0);
      const volatiliyRatio = asset.config.volatility_ratio || 0;
      return (
        Number(shrinkToken(balance, asset.metadata.decimals + asset.config.extra_decimals)) /
        (volatiliyRatio / MAX_RATIO)
      );
    })
    .reduce(sumReducer, 0);

const getCollateralSumD = (assets: AssetsState, account: AccountState) =>
  Object.keys(account.portfolio.collateral)
    .map((id) => {
      const asset = assets[id];
      const { shares } = account.portfolio.collateral[id];
      const balanceD = sharesToAmount(asset, shares, false);
      const volatiliyRatio = asset.config.volatility_ratio;
      const balancePrice = fromBalancePrice(balanceD, asset.price, asset.config.extra_decimals);
      return multRatio(balancePrice, volatiliyRatio);
    })
    .reduce(sumReducerD, new Decimal(0));

const getBorrowedSumD = (assets: AssetsState, account: AccountState) =>
  Object.keys(account.portfolio.borrowed)
    .map((id) => {
      const asset = assets[id];
      const { shares } = account.portfolio.borrowed[id];
      const balanceD = sharesToAmount(asset, shares, true);
      const volatiliyRatio = asset.config.volatility_ratio;
      const balancePrice = fromBalancePrice(balanceD, asset.price, asset.config.extra_decimals);
      return divRatio(balancePrice, volatiliyRatio);
    })
    .reduce(sumReducerD, new Decimal(0));

export const getMaxBorrowAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!account.accountId || !tokenId) return 0;
      const collateralSum = getCollateralSum(assets, account);
      const borrowedSum = getBorrowedSum(assets, account);

      const collateralSumD = getCollateralSumD(assets, account);
      const borrowedSumD = getBorrowedSumD(assets, account);

      console.log(` c: ${collateralSum} \ncD: ${collateralSumD.toNumber()}`);
      console.log(` b: ${borrowedSum} \nbD: ${borrowedSumD.toNumber()}`);

      const volatiliyRatio = assets[tokenId].config.volatility_ratio;

      const max = (collateralSum - borrowedSum) * (volatiliyRatio / MAX_RATIO);
      // const maxD = collateralSumD.minus(borrowedSumD).mul(volatiliyRatio / MAX_RATIO);
      const maxD = borrowedSumD.minus(collateralSumD).div(borrowedSumD);
      console.log(`max: ${max}\nmaxD: ${maxD.toNumber()}\n${maxD}`);
      console.log(borrowedSum <= collateralSum);
      console.log(borrowedSumD.toNumber() <= collateralSumD.toNumber());

      return max.toLocaleString(undefined, TOKEN_FORMAT);
    },
  );

export const getHealthFactor = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (assets, account) => {
    if (!account.portfolio) return null;
    const collateralSum = getCollateralSum(assets, account);
    const borrowedSum = getBorrowedSum(assets, account);

    const healthFactor = (collateralSum / borrowedSum) * 100;
    return healthFactor < 10000 ? healthFactor : 10000;
  },
);

export const recomputeHealthFactor = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!account.portfolio || !tokenId) return 0;
      const collateralSum = getCollateralSum(assets, account);
      const { metadata, config } = assets[tokenId];

      const newBalance = (
        Number(account.portfolio.borrowed[tokenId].balance) +
        Number(expandToken(amount, metadata.decimals + config.extra_decimals, 0))
      ).toString();

      const clonedAccount = clone(account);
      clonedAccount.portfolio.borrowed[tokenId] = {
        ...clonedAccount.portfolio.borrowed[tokenId],
        balance: newBalance,
      };

      const borrowedSum = getBorrowedSum(assets, clonedAccount);

      const healthFactor = (collateralSum / borrowedSum) * 100;
      return healthFactor < 10000 ? healthFactor : 10000;
    },
  );

export const { receivedAccount, logoutAccount } = accountSlice.actions;
export default accountSlice.reducer;
