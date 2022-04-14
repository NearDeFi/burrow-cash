import { clone } from "ramda";
import { createSelector } from "@reduxjs/toolkit";

import { shrinkToken, expandToken, PERCENT_DIGITS, NEAR_DECIMALS } from "../store";
import type { RootState } from "./store";
import {
  emptySuppliedAsset,
  emptyBorrowedAsset,
  sumReducer,
  hasAssets,
  getDailyBRRRewards,
} from "./utils";
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
      if (!hasAssets(assets)) return 0;
      const collateral = account.portfolio.collateral[tokenId];
      if (!collateral) return 0;
      const { metadata, config } = assets.data[tokenId];
      return Number(
        shrinkToken(collateral.balance, metadata.decimals + config.extra_decimals, PERCENT_DIGITS),
      );
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
    if (!hasAssets(assets)) return 0;
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
    const [gainBorrowed] = getGains("borrowed");

    const netGains = gainCollateral + gainSupplied - gainBorrowed;
    const netTotals = totalCollateral + totalSupplied;
    const netAPY = (netGains * 100) / netTotals;
    return netAPY || 0;
  },
);

export const getNetAPY_NEW = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (state: RootState) => state.app,
  (assets, account, app) => {
    if (!hasAssets(assets)) return 0;
    const brrrTokenId = app.config.booster_token_id;
    const sum = Object.keys(assets.data)
      .filter((t) => t !== brrrTokenId)
      .map((tokenId) => {
        const asset = assets.data[tokenId];
        const decimals = asset.metadata.decimals + asset.config.extra_decimals;

        const depositBalance = Number(account.portfolio.supplied?.[tokenId]?.balance) || 0;
        const depositApr = Number(account.portfolio.supplied?.[tokenId]?.apr) || 0;
        const depositBalanceUSD =
          Number(shrinkToken(depositBalance, decimals)) * (asset.price?.usd || 0);

        const collateralBalance = Number(account.portfolio.collateral?.[tokenId]?.balance) || 0;
        const collateralBalanceUSD =
          Number(shrinkToken(collateralBalance, decimals)) * (asset.price?.usd || 0);

        const borrowBalance = Number(account.portfolio.borrowed?.[tokenId]?.balance) || 0;
        const borrowApr = Number(account.portfolio.borrowed?.[tokenId]?.apr) || 0;
        const borrowBalanceUSD =
          Number(shrinkToken(borrowBalance, decimals)) * (asset.price?.usd || 0);

        const amount =
          (depositBalanceUSD + collateralBalanceUSD) * depositApr - borrowBalanceUSD * borrowApr;
        return amount;
      })
      .reduce(sumReducer, 0);

    const getTotalValue = (source: "borrowed" | "supplied") =>
      Object.entries(account.portfolio[source])
        .map(([tokenId, { balance }]) => {
          if (tokenId === brrrTokenId) return 0;
          const asset = assets.data[tokenId];
          const decimals = asset.metadata.decimals + asset.config.extra_decimals;
          return Number(shrinkToken(balance, decimals)) * (asset.price?.usd || 0);
        })
        .reduce(sumReducer, 0);

    const totalSuppliedValue = getTotalValue("supplied");
    const totalBorrowedValue = getTotalValue("borrowed");

    const total = sum > 0 ? totalSuppliedValue : totalBorrowedValue;

    if (sum === 0) return 0;

    return 100 * (sum / total);
  },
);

export const getTotalAccountBalance = (source: "borrowed" | "supplied") =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return 0;
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
        .reduce(sumReducer, 0);
    },
  );

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
        return {
          tokenId,
          symbol: asset.metadata.symbol,
          icon: asset.metadata.icon,
          price: asset.price?.usd ?? 1,
          apy: Number(portfolioAssets[tokenId].apr) * 100,
          collateral: Number(collateral),
          supplied:
            Number(collateral) +
            Number(
              shrinkToken(suppliedBalance, asset.metadata.decimals + asset.config.extra_decimals),
            ),
          canUseAsCollateral: asset.config.can_use_as_collateral,
          canWithdraw: asset.config.can_withdraw,
          dailyBRRRewards: getDailyBRRRewards(asset, account, assets.data, brrrTokenId, "supplied"),
        };
      })
      .filter(app.showDust ? Boolean : emptySuppliedAsset);

    const borrowed = Object.keys(account.portfolio.borrowed)
      .map((tokenId) => {
        const asset = assets.data[tokenId];

        const borrowedBalance = account.portfolio.borrowed[tokenId].balance;
        const brrrUnclaimedAmount =
          account.portfolio.farms.borrowed[tokenId]?.[brrrTokenId]?.unclaimed_amount || "0";

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
          dailyBRRRewards: getDailyBRRRewards(asset, account, assets.data, brrrTokenId, "borrowed"),
        };
      })
      .filter(app.showDust ? Boolean : emptyBorrowedAsset);

    return [supplied, borrowed];
  },
);

const MAX_RATIO = 10000;

export const getCollateralSum = (assets: Assets, account: AccountState) =>
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

export const getBorrowedSum = (assets: Assets, account: AccountState) =>
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
      if (!hasAssets(assets)) return 0;
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
    if (!hasAssets(assets)) return null;
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
      if (!hasAssets(assets)) return 0;
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
      if (!hasAssets(assets)) return 0;
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
      if (!hasAssets(assets)) return 0;
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
          Math.min(
            collateralBalanceInt,
            collateralBalanceInt + suppliedBalanceInt - Number(amount),
          ),
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
      if (!hasAssets(assets)) return 0;
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
          collateralBalanceInt + (app.selected.useAsCollateral ? Number(amount) : 0),
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
      if (!hasAssets(assets)) return 0;
      if (!account.portfolio || !tokenId || !account.portfolio.borrowed[tokenId]) return 0;

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

export const getTotalBRRR = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (state: RootState) => state.app,
  (assets, account, app) => {
    const brrrTokenId = app.config.booster_token_id;
    if (!account.accountId || !assets.data[brrrTokenId]) return [0, 0];
    const { farms } = account.portfolio;
    const { decimals } = assets.data[brrrTokenId].metadata;
    const unclaimedSupplied = Object.keys(farms.supplied)
      .map((token) => farms.supplied[token]?.[brrrTokenId]?.unclaimed_amount || "0")
      .map((token) => Number(shrinkToken(token, decimals)))
      .reduce(sumReducer, 0);
    const unclaimedBorrowed = Object.keys(farms.borrowed)
      .map((token) => farms.borrowed[token]?.[brrrTokenId]?.unclaimed_amount || "0")
      .map((token) => Number(shrinkToken(token, decimals)))
      .reduce(sumReducer, 0);

    const totalBrrr = Number(
      shrinkToken(account.portfolio.supplied[brrrTokenId]?.balance || "0", decimals),
    );

    return [totalBrrr, unclaimedSupplied + unclaimedBorrowed];
  },
);

export const isClaiming = createSelector(
  (state: RootState) => state.account,
  (account) => account.isClaiming === "pending",
);

export const getStaking = createSelector(
  (state: RootState) => state.account,
  (account) => account.portfolio.staking,
);

export const getTotalDailyBRRRewards = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (state: RootState) => state.app,
  (assets, account, app) => {
    const brrrTokenId = app.config.booster_token_id;
    if (!account.accountId || !assets.data[brrrTokenId]) return 0;
    const suppliedRewards = Object.entries(assets.data)
      .map(([, asset]) => getDailyBRRRewards(asset, account, assets.data, brrrTokenId, "supplied"))
      .reduce((prev, current) => prev + current, 0);
    const borrowedRewards = Object.entries(assets.data)
      .map(([, asset]) => getDailyBRRRewards(asset, account, assets.data, brrrTokenId, "borrowed"))
      .reduce((prev, current) => prev + current, 0);

    return suppliedRewards + borrowedRewards;
  },
);
