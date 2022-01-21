import { clone } from "ramda";
import { createSelector } from "@reduxjs/toolkit";

import {
  shrinkToken,
  expandToken,
  USD_FORMAT,
  APY_FORMAT,
  PERCENT_DIGITS,
  NEAR_DECIMALS,
} from "../store";
import type { RootState } from "./store";
import { emptySuppliedAsset, emptyBorrowedAsset, sumReducer } from "./utils";
import { Assets } from "./assetsSlice";
import { AccountState } from "./accountSlice";

export const getAccountId = createSelector(
  (state: RootState) => state.account,
  (account) => account.accountId,
);

export const getCollateralAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (assets.status !== "fulfilled") return 0;
      const collateral = account.portfolio.collateral[tokenId];
      if (!collateral) return 0;
      const { metadata, config } = assets.data[tokenId];
      return Number(shrinkToken(collateral.balance, metadata.decimals + config.extra_decimals));
    },
  );

export const getAccountBalance = createSelector(
  (state: RootState) => state.account.balances,
  (balances) => {
    return balances?.near ? shrinkToken(balances?.near, NEAR_DECIMALS, PERCENT_DIGITS) : "...";
  },
);

export const getNetAPY = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (assets, account) => {
    if (assets.status !== "fulfilled" && assets.status !== "fetching") return undefined;
    const getGains = (source: "supplied" | "collateral" | "borrowed") =>
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

    const [gainCollateral, totalCollateral] = getGains("collateral");
    const [gainSupplied, totalSupplied] = getGains("supplied");
    const [gainBorrowed, totalBorrowed] = getGains("borrowed");

    const netAPY =
      ((gainCollateral + gainSupplied - gainBorrowed) * 100) /
      (totalCollateral + totalSupplied - totalBorrowed);

    return `${(netAPY || 0).toLocaleString(undefined, APY_FORMAT)}%`;
  },
);

export const getTotalAccountBalance = (source: "borrowed" | "supplied") =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (assets.status !== "fulfilled" && assets.status !== "fetching") return undefined;
      const allTokens = {
        ...account.portfolio.collateral,
        ...account.portfolio.supplied,
        ...account.portfolio.borrowed,
      };

      const sourceTokens = account.portfolio[source];
      const { collateral } = account.portfolio;

      return Object.keys(allTokens)
        .map((tokenId) => {
          const { price, metadata, config } = assets.data[tokenId];
          const total =
            Number(
              shrinkToken(
                sourceTokens[tokenId]?.balance || 0,
                metadata.decimals + config.extra_decimals,
              ),
            ) * (price?.usd || 0);

          const totalCollateral =
            Number(
              shrinkToken(
                collateral[tokenId]?.balance || 0,
                metadata.decimals + config.extra_decimals,
              ),
            ) * (price?.usd || 0);

          return source === "supplied" ? total + totalCollateral : total;
        })
        .reduce(sumReducer, 0)
        .toLocaleString(undefined, USD_FORMAT);
    },
  );

export const getPortfolioAssets = createSelector(
  (state: RootState) => state.app,
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (app, assets, account) => {
    if (assets.status !== "fulfilled" && assets.status !== "fetching") return [[], []];
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
        return {
          tokenId,
          symbol: asset.metadata.symbol,
          icon: asset.metadata.icon,
          price: asset.price ? asset.price.usd.toLocaleString(undefined, USD_FORMAT) : "$-.-",
          price$: asset.price?.usd ?? 1,
          apy: Number(portfolioAssets[tokenId].apr) * 100,
          collateral: Number(collateral),
          supplied:
            Number(collateral) +
            Number(
              shrinkToken(suppliedBalance, asset.metadata.decimals + asset.config.extra_decimals),
            ),
          canUseAsCollateral: asset.config.can_use_as_collateral,
        };
      })
      .filter(app.showDust ? Boolean : emptySuppliedAsset);

    const borrowed = Object.keys(account.portfolio.borrowed)
      .map((tokenId) => {
        const asset = assets.data[tokenId];

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
      })
      .filter(app.showDust ? Boolean : emptyBorrowedAsset);

    return [supplied, borrowed];
  },
);

const MAX_RATIO = 10000;

const getCollateralSum = (assets: Assets, account: AccountState) =>
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

const getBorrowedSum = (assets: Assets, account: AccountState) =>
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

export const getMaxBorrowAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!account.accountId || !tokenId) return 0;
      if (assets.status !== "fulfilled" && assets.status !== "fetching") return 0;
      const collateralSum = getCollateralSum(assets.data, account);
      const borrowedSum = getBorrowedSum(assets.data, account);

      const volatiliyRatio = assets.data[tokenId].config.volatility_ratio || 0;
      return (
        (((collateralSum - borrowedSum) * (volatiliyRatio / MAX_RATIO)) /
          (assets.data[tokenId].price?.usd || Infinity)) *
        0.95
      );
    },
  );

export const getHealthFactor = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (assets, account) => {
    if (assets.status !== "fulfilled" && assets.status !== "fetching") return null;
    if (!account.portfolio) return null;
    if (!Object.keys(account.portfolio.borrowed).length) return -1;
    const collateralSum = getCollateralSum(assets.data, account);
    const borrowedSum = getBorrowedSum(assets.data, account);

    const healthFactor = (collateralSum / borrowedSum) * 100;
    return healthFactor < 10000 ? healthFactor : 10000;
  },
);

export const recomputeHealthFactor = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (assets.status !== "fulfilled") return 0;
      if (!account.portfolio || !tokenId) return 0;

      const collateralSum = getCollateralSum(assets.data, account);
      const { metadata, config } = assets.data[tokenId];

      const newBalance = (
        Number(account.portfolio.borrowed[tokenId]?.balance || 0) +
        Number(expandToken(amount, metadata.decimals + config.extra_decimals, 0))
      ).toString();

      const clonedAccount = clone(account);

      if (!clonedAccount.portfolio.borrowed[tokenId]) {
        clonedAccount.portfolio.borrowed[tokenId] = {
          balance: newBalance,
          shares: newBalance,
          apr: "0",
        };
      }

      clonedAccount.portfolio.borrowed[tokenId] = {
        ...clonedAccount.portfolio.borrowed[tokenId],
        balance: newBalance,
      };

      const borrowedSum = getBorrowedSum(assets.data, amount === 0 ? account : clonedAccount);

      if (!Object.keys(account.portfolio.borrowed).length && amount === 0) return -1;

      const healthFactor = (collateralSum / borrowedSum) * 100;
      return healthFactor < 10000 ? healthFactor : 10000;
    },
  );

export const recomputeHealthFactorAdjust = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (assets.status !== "fulfilled") return 0;
      if (!account.portfolio || !tokenId) return 0;

      const { metadata, config } = assets.data[tokenId];

      const newBalance = Number(
        expandToken(amount, metadata.decimals + config.extra_decimals, 0),
      ).toString();

      const clonedAccount = clone(account);

      if (!clonedAccount.portfolio.collateral[tokenId]) {
        clonedAccount.portfolio.collateral[tokenId] = {
          balance: newBalance,
          shares: newBalance,
          apr: "0",
        };
      }

      clonedAccount.portfolio.collateral[tokenId] = {
        ...clonedAccount.portfolio.collateral[tokenId],
        balance: newBalance,
      };

      const collateralSum = getCollateralSum(assets.data, clonedAccount);
      const borrowedSum = getBorrowedSum(assets.data, account);

      const healthFactor = (collateralSum / borrowedSum) * 100;
      return healthFactor < 10000 ? healthFactor : 10000;
    },
  );

export const recomputeHealthFactorWithdraw = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (assets.status !== "fulfilled") return 0;
      if (!account.portfolio || !tokenId) return 0;

      const { metadata, config } = assets.data[tokenId];

      const clonedAccount = clone(account);

      if (!clonedAccount.portfolio.supplied[tokenId]) {
        clonedAccount.portfolio.supplied[tokenId] = {
          balance: "0",
          shares: "0",
          apr: "0",
        };
      }

      if (!clonedAccount.portfolio.collateral[tokenId]) {
        clonedAccount.portfolio.collateral[tokenId] = {
          balance: "0",
          shares: "0",
          apr: "0",
        };
      }

      const collateralBalanceInt = Number(
        shrinkToken(
          clonedAccount.portfolio.collateral[tokenId].balance,
          metadata.decimals + config.extra_decimals,
        ),
      );

      const suppliedBalanceInt = Number(
        shrinkToken(
          clonedAccount.portfolio.supplied[tokenId].balance,
          metadata.decimals + config.extra_decimals,
        ),
      );

      const newBalance = Number(
        expandToken(
          Math.min(collateralBalanceInt, collateralBalanceInt + suppliedBalanceInt - amount),
          metadata.decimals + config.extra_decimals,
          0,
        ),
      ).toString();

      clonedAccount.portfolio.collateral[tokenId].balance = newBalance;

      const collateralSum = getCollateralSum(assets.data, clonedAccount);
      const borrowedSum = getBorrowedSum(assets.data, account);

      const healthFactor = (collateralSum / borrowedSum) * 100;
      return healthFactor < 10000 ? healthFactor : 10000;
    },
  );

export const recomputeHealthFactorSupply = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (state: RootState) => state.app,
    (assets, account, app) => {
      if (assets.status !== "fulfilled") return 0;
      if (!account.portfolio || !tokenId) return 0;

      const { metadata, config } = assets.data[tokenId];

      const clonedAccount = clone(account);

      if (!clonedAccount.portfolio.collateral[tokenId]) {
        clonedAccount.portfolio.collateral[tokenId] = {
          balance: "0",
          shares: "0",
          apr: "0",
        };
      }

      const collateralBalanceInt = Number(
        shrinkToken(
          clonedAccount.portfolio.collateral[tokenId].balance,
          metadata.decimals + config.extra_decimals,
        ),
      );

      const newBalance = Number(
        expandToken(
          collateralBalanceInt + (app.selected.useAsCollateral ? amount : 0),
          metadata.decimals + config.extra_decimals,
          0,
        ),
      ).toString();

      clonedAccount.portfolio.collateral[tokenId].balance = newBalance;

      const collateralSum = getCollateralSum(assets.data, clonedAccount);
      const borrowedSum = getBorrowedSum(assets.data, account);

      const healthFactor = (collateralSum / borrowedSum) * 100;
      return healthFactor < 10000 ? healthFactor : 10000;
    },
  );

export const recomputeHealthFactorRepay = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (assets.status !== "fulfilled") return 0;
      if (!account.portfolio || !tokenId) return 0;

      const collateralSum = getCollateralSum(assets.data, account);
      const { metadata, config } = assets.data[tokenId];

      const newBalance = (
        Number(account.portfolio.borrowed[tokenId].balance) -
        Number(expandToken(amount, metadata.decimals + config.extra_decimals, 0))
      ).toString();

      const clonedAccount = clone(account);
      clonedAccount.portfolio.borrowed[tokenId].balance = newBalance;

      const borrowedSum = getBorrowedSum(assets.data, clonedAccount);

      const healthFactor = (collateralSum / borrowedSum) * 100;
      return healthFactor < 10000 ? healthFactor : 10000;
    },
  );

export const isAccountLoading = createSelector(
  (state: RootState) => state.account,
  (account) => account.status === "pending",
);
