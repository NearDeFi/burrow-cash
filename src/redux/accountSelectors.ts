import { clone } from "ramda";
import { createSelector } from "@reduxjs/toolkit";
import { omit } from "lodash";

import { shrinkToken, expandToken, PERCENT_DIGITS, NEAR_DECIMALS } from "../store";
import type { RootState } from "./store";
import { emptySuppliedAsset, emptyBorrowedAsset, sumReducer, hasAssets } from "./utils";
import { Asset, Assets } from "./assetsSlice";
import { AccountState, Farm } from "./accountSlice";

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
          rewards: getPortfolioRewards(
            "supplied",
            asset,
            account.portfolio.farms.supplied[tokenId],
            assets.data,
          ),
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
          rewards: getPortfolioRewards(
            "borrowed",
            asset,
            account.portfolio.farms.borrowed[tokenId],
            assets.data,
          ),
        };
      })
      .filter(app.showDust ? Boolean : emptyBorrowedAsset);

    return [supplied, borrowed];
  },
);

const getPortfolioRewards = (
  type: "supplied" | "borrowed",
  asset: Asset,
  farm: Farm,
  assets: Assets,
) => {
  if (!farm) return [];
  return Object.entries(farm).map(([tokenId, rewards]) => {
    const decimals = assets[tokenId].metadata.decimals + assets[tokenId].config.extra_decimals;

    const totalRewardsPerDay = Number(
      shrinkToken(asset.farms.borrowed[tokenId]?.["reward_per_day"] || "0", decimals),
    );
    const totalBoostedShares = Number(
      shrinkToken(asset.farms[type][tokenId]?.["boosted_shares"] || "0", decimals),
    );
    const boostedShares = Number(shrinkToken(farm?.[tokenId]?.boosted_shares || "0", decimals));

    const rewardPerDay = (boostedShares / totalBoostedShares) * totalRewardsPerDay || 0;

    return {
      rewards: { ...rewards, reward_per_day: expandToken(rewardPerDay, decimals) },
      metadata: assets[tokenId].metadata,
      config: assets[tokenId].config,
      type: "portfolio",
    };
  });
};

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

interface IPortfolioReward {
  icon: string;
  tokenId: string;
  totalAmount: number;
  dailyAmount: number;
  unclaimedAmount: number;
}

interface IAccountRewards {
  brrr: IPortfolioReward;
  extra: {
    [tokenId: string]: IPortfolioReward;
  };
}

export const getAccountRewards = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (state: RootState) => state.app,
  (assets, account, app) => {
    const brrrTokenId = app.config.booster_token_id;

    const computeRewards = ([tokenId, farm]: [string, Farm]) => {
      return Object.entries(farm).map(([rewardTokenId, farmData]) => {
        const asset = assets.data[tokenId];
        const assetDecimals = asset.metadata.decimals + asset.config.extra_decimals;
        const rewardAsset = assets.data[rewardTokenId];
        const rewardAssetDecimals =
          rewardAsset.metadata.decimals + rewardAsset.config.extra_decimals;

        const totalRewardsPerDay = Number(
          shrinkToken(farmData.asset_farm_reward.reward_per_day, assetDecimals),
        );

        const totalBoostedShares = Number(
          shrinkToken(farmData.asset_farm_reward.boosted_shares, assetDecimals),
        );

        const boostedShares = Number(shrinkToken(farmData.boosted_shares, rewardAssetDecimals));
        const dailyAmount = (boostedShares / totalBoostedShares) * totalRewardsPerDay;

        return {
          tokenId: rewardTokenId,
          icon: rewardAsset.metadata.icon,
          unclaimedAmount: Number(shrinkToken(farmData.unclaimed_amount, rewardAssetDecimals)),
          dailyAmount,
        };
      });
    };

    const { supplied, borrowed } = account.portfolio.farms;

    const suppliedRewards = Object.entries(supplied).map(computeRewards).flat();
    const borrowedRewards = Object.entries(borrowed).map(computeRewards).flat();

    const sumRewards = [...suppliedRewards, ...borrowedRewards].reduce((rewards, asset) => {
      if (!rewards[asset.tokenId]) return { ...rewards, [asset.tokenId]: asset };

      const updatedAsset = rewards[asset.tokenId];

      updatedAsset.unclaimedAmount += asset.unclaimedAmount;
      updatedAsset.dailyAmount += asset.dailyAmount;

      return { ...rewards, [asset.tokenId]: updatedAsset };
    }, {});

    return {
      brrr: sumRewards[brrrTokenId],
      extra: omit(sumRewards, brrrTokenId),
    } as IAccountRewards;
  },
);
