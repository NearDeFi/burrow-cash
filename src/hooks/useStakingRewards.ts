import { clone } from "ramda";

import { useAppSelector } from "../redux/hooks";
import { getConfig } from "../redux/appSelectors";
import { expandToken, shrinkToken } from "../store";
import { IPortfolioAsset } from "../interfaces/asset";
import { usePortfolioAssets } from "./hooks";
import { getStaking } from "../redux/selectors/getStaking";

export function useStakingRewards() {
  const [suppliedRows, borrowedRows] = usePortfolioAssets() as IPortfolioAsset[][];
  const appConfig = useAppSelector(getConfig);
  const { xBRRR, extraXBRRRAmount } = useAppSelector(getStaking);

  const notBRRRToken = (r) => r.metadata.token_id !== appConfig.booster_token_id;
  const filterRewards = (rewards) => rewards.some(notBRRRToken);
  const extraRewardsOnly = (row) => ({
    ...row,
    rewards: row.rewards.filter(notBRRRToken),
  });

  const computeBoost = (asset) => {
    asset.rewards = asset.rewards.filter(notBRRRToken).map((reward) => {
      const { metadata, rewards, config } = reward;

      const decimals = metadata.decimals + config.extra_decimals;

      const boosterLogBase = Number(
        shrinkToken(rewards.asset_farm_reward.booster_log_base, decimals),
      );

      const totalRewardsPerDay = Number(
        shrinkToken(rewards.asset_farm_reward.reward_per_day, decimals),
      );

      const boostedShares = Number(shrinkToken(rewards.boosted_shares, decimals));

      const totalBoostedShares = Number(
        shrinkToken(rewards.asset_farm_reward.boosted_shares, decimals),
      );

      const log = Math.log(xBRRR + extraXBRRRAmount) / Math.log(boosterLogBase);
      const multiplier = log >= 0 ? 1 + log : 1;
      const newBoostedShares = boostedShares * multiplier;
      const newTotalBoostedShares = totalBoostedShares + newBoostedShares - boostedShares;
      const newDailyAmount = (newBoostedShares / newTotalBoostedShares) * totalRewardsPerDay;

      reward.rewards.reward_per_day = expandToken(newDailyAmount, decimals, 0);

      return reward;
    });
    return asset;
  };

  const supplied = suppliedRows
    .filter((row) => filterRewards(row.depositRewards))
    .map(extraRewardsOnly);

  const borrowed = borrowedRows
    .filter((row) => filterRewards(row.borrowRewards))
    .map(extraRewardsOnly);

  const boosted = {
    supplied: clone(supplied).map(computeBoost),
    borrowed: clone(borrowed).map(computeBoost),
  };

  return { supplied, borrowed, boosted };
}
