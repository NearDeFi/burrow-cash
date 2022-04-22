import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { isAssetsLoading } from "../redux/assetsSelectors";
import { getAccountRewards, isAccountLoading } from "../redux/accountSelectors";
import { getConfig, getSlimStats, getFullDigits, getShowTicker } from "../redux/appSelectors";
import { setFullDigits, toggleShowTicker } from "../redux/appSlice";
import { getViewAs } from "../utils";
import { trackShowTicker } from "../telemetry";

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
