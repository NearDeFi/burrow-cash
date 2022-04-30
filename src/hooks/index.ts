import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getAvailableAssets, isAssetsLoading } from "../redux/assetsSelectors";
import {
  getAccountId,
  getAccountRewards,
  getHasNonFarmedAssets,
  getPortfolioAssets,
  isAccountLoading,
} from "../redux/accountSelectors";
import {
  getConfig,
  getSlimStats,
  getFullDigits,
  getShowTicker,
  getTableSorting,
} from "../redux/appSelectors";
import { IOrder, setFullDigits, setTableSorting, toggleShowTicker } from "../redux/appSlice";
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
