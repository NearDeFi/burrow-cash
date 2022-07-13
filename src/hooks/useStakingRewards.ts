import { clone } from "ramda";

import { useAppSelector } from "../redux/hooks";
import { getConfig } from "../redux/appSelectors";
import { expandToken } from "../store";
import { IPortfolioAsset } from "../interfaces/asset";
import { usePortfolioAssets } from "./hooks";
import { getStaking } from "../redux/selectors/getStaking";
import { computePoolsDailyAmount } from "../redux/selectors/getAccountRewards";
import { getAccountPortfolio } from "../redux/accountSelectors";
import { getAssets } from "../redux/assetsSelectors";

export function useStakingRewards() {
  const [suppliedRows, borrowedRows] = usePortfolioAssets() as IPortfolioAsset[][];
  const { xBRRR, extraXBRRRAmount } = useAppSelector(getStaking);
  const appConfig = useAppSelector(getConfig);
  const portfolio = useAppSelector(getAccountPortfolio);
  const assets = useAppSelector(getAssets);

  const notBRRRToken = (r) => r.metadata.token_id !== appConfig.booster_token_id;
  const filterRewards = (rewards) => rewards.some(notBRRRToken);
  const extraRewardsOnly = (row) => ({
    ...row,
    rewards: row.rewards.filter(notBRRRToken),
  });

  const computeBoost = (type: "supplied" | "borrowed") => (asset: IPortfolioAsset) => {
    asset.rewards = asset.rewards.filter(notBRRRToken).map((reward) => {
      const { metadata, rewards, config } = reward;

      const decimals = metadata.decimals + config.extra_decimals;

      const { newDailyAmount } = computePoolsDailyAmount(
        type,
        assets.data[asset.tokenId],
        assets.data[metadata.token_id],
        portfolio,
        xBRRR + extraXBRRRAmount,
        rewards,
        appConfig.booster_decimals,
      );

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
    supplied: clone(supplied).map(computeBoost("supplied")),
    borrowed: clone(borrowed).map(computeBoost("borrowed")),
  };

  return { supplied, borrowed, boosted };
}
