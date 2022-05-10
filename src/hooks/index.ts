import { clone } from "ramda";

import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getAvailableAssets, isAssetsLoading } from "../redux/assetsSelectors";
import {
  getAccountId,
  getHasNonFarmedAssets,
  getStaking,
  isAccountLoading,
  isClaiming,
} from "../redux/accountSelectors";
import { getDailyReturns } from "../redux/selectors/getDailyReturns";
import { getNetAPY } from "../redux/selectors/getNetAPY";
import { getPortfolioAssets } from "../redux/selectors/getPortfolioAssets";
import { getHealthFactor } from "../redux/selectors/getHealthFactor";
import { getAccountRewards } from "../redux/selectors/getAccountRewards";
import {
  getConfig,
  getSlimStats,
  getFullDigits,
  getShowTicker,
  getTableSorting,
  getAppState,
} from "../redux/appSelectors";
import {
  IOrder,
  setFullDigits,
  setTableSorting,
  toggleShowTicker,
  toggleShowDailyReturns,
} from "../redux/appSlice";
import { getViewAs } from "../utils";
import { trackClaimButton, trackShowDailyReturns, trackShowTicker } from "../telemetry";
import { farmClaimAll, fetchAccount } from "../redux/accountSlice";
import { expandToken, shrinkToken } from "../store";
import { IPortfolioAsset } from "../interfaces/asset";

export function useLoading() {
  const isLoadingAssets = useAppSelector(isAssetsLoading);
  const isLoadingAccount = useAppSelector(isAccountLoading);
  return isLoadingAssets || isLoadingAccount;
}

export function useIsBurrowToken(tokenId) {
  const config = useAppSelector(getConfig);
  return config.booster_token_id === tokenId;
}

export function useSlimStats() {
  return useAppSelector(getSlimStats);
}

export function useFullDigits() {
  const dispatch = useAppDispatch();
  const fullDigits = useAppSelector(getFullDigits);

  const setDigits = (value) => dispatch(setFullDigits(value));

  return { fullDigits, setDigits };
}

export function useUserHealth() {
  const dispatch = useAppDispatch();
  const { showDailyReturns } = useAppSelector(getAppState);
  const netAPY = useAppSelector(getNetAPY);
  const dailyReturns = useAppSelector(getDailyReturns);
  const healthFactor = useAppSelector(getHealthFactor);
  const { fullDigits, setDigits } = useFullDigits();
  const slimStats = useSlimStats();

  const toggleDailyReturns = () => {
    trackShowDailyReturns({ showDailyReturns });
    dispatch(toggleShowDailyReturns());
  };

  const toggleDigits = () => {
    setDigits({ dailyReturns: !fullDigits.dailyReturns });
  };

  return {
    netAPY,
    dailyReturns,
    healthFactor,
    slimStats,
    fullDigits,
    toggleDigits,
    showDailyReturns,
    toggleDailyReturns,
  };
}

export function useViewAs() {
  const viewAs = getViewAs();
  return !!viewAs;
}

export function useTicker() {
  const dispatch = useAppDispatch();
  const hasTicker = useAppSelector(getShowTicker);

  const toggleTicker = () => {
    trackShowTicker({ hasTicker });
    dispatch(toggleShowTicker());
  };

  return { hasTicker, toggleTicker };
}

export function useRewards() {
  const rewards = useAppSelector(getAccountRewards);
  const { brrr } = rewards;
  const extra = Object.entries(rewards.extra);

  return { brrr, extra };
}

export function useTableSorting() {
  const sorting = useAppSelector(getTableSorting);
  const dispatch = useAppDispatch();

  const setSorting = (name: string, property: string, order: IOrder) => {
    dispatch(setTableSorting({ name, property, order }));
  };

  return {
    sorting,
    setSorting,
  };
}

export function useConfig() {
  return useAppSelector(getConfig);
}

export function useAccountId() {
  return useAppSelector(getAccountId);
}

export function useNonFarmedAssets() {
  return useAppSelector(getHasNonFarmedAssets);
}

export function useAvailableAssets(type: "supply" | "borrow") {
  return useAppSelector(getAvailableAssets(type));
}

export function usePortfolioAssets() {
  return useAppSelector(getPortfolioAssets);
}

export function useClaimAllRewards(location: string) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(isClaiming);

  const handleClaimAll = () => {
    trackClaimButton(location);
    dispatch(farmClaimAll()).then(() => {
      dispatch(fetchAccount());
    });
  };

  return { handleClaimAll, isLoading };
}

export function useStaking() {
  const staking = useAppSelector(getStaking);
  const config = useAppSelector(getConfig);

  const BRRR = Number(shrinkToken(staking["staked_booster_amount"], config.booster_decimals));
  const xBRRR = Number(shrinkToken(staking["x_booster_amount"], config.booster_decimals));

  return { BRRR, xBRRR, staking, config };
}

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
