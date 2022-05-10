import { clone } from "ramda";

import { useAppSelector } from "../redux/hooks";
import { getConfig } from "../redux/appSelectors";
import { expandToken, shrinkToken } from "../store";
import { IPortfolioAsset } from "../interfaces/asset";
import { usePortfolioAssets } from "./hooks";

export function useStakingRewards(amount) {
  const [suppliedRows, borrowedRows] = usePortfolioAssets() as IPortfolioAsset[][];
  const appConfig = useAppSelector(getConfig);

  const notBRRRToken = (r) => r.metadata.token_id !== appConfig.booster_token_id;
  const filterRewards = (rewards) => rewards.some(notBRRRToken);
  const extraRewardsOnly = (row) => ({
    ...row,
    rewards: row.rewards.filter(notBRRRToken),
  });

  const computeBoost = (asset) => {
    asset.rewards = asset.rewards.filter(notBRRRToken).map((reward) => {
      const { metadata, rewards, config } = reward;

      const dailyRewards = Number(
        shrinkToken(rewards.reward_per_day || 0, metadata.decimals + config.extra_decimals),
      );

      const multiplier =
        1 +
        Math.log(amount || 1) / Math.log(Number(rewards.asset_farm_reward.booster_log_base) || 100);

      const boostedDailyRewards = expandToken(
        dailyRewards * multiplier,
        metadata.decimals + config.extra_decimals,
        0,
      );

      reward.rewards.reward_per_day = boostedDailyRewards;

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
