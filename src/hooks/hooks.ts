import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAvailableAssets, isAssetsLoading } from "../redux/assetsSelectors";
import { getAccountId, getHasNonFarmedAssets, isAccountLoading } from "../redux/accountSelectors";
import { getPortfolioAssets } from "../redux/selectors/getPortfolioAssets";
import { getConfig, getSlimStats, getDegenMode } from "../redux/appSelectors";
import { setRepayFrom, toggleDegenMode } from "../redux/appSlice";
import { getViewAs } from "../utils";
import { getAdjustedAssets, getAdjustedNetLiquidity } from "../redux/selectors/getAccountRewards";

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

export function useViewAs() {
  const viewAs = getViewAs();
  return !!viewAs;
}

export function useConfig() {
  return useAppSelector(getConfig);
}

export function useAccountId() {
  return useAppSelector(getAccountId);
}

export function useNonFarmedAssets() {
  const liquidity = useAppSelector(getAdjustedNetLiquidity);
  const assets = useAppSelector(getAdjustedAssets);
  const hasNonFarmedAssets = useAppSelector(getHasNonFarmedAssets);
  return { hasNonFarmedAssets, liquidity, assets };
}

export function useAvailableAssets(type: "supply" | "borrow") {
  return useAppSelector(getAvailableAssets(type));
}

export function usePortfolioAssets() {
  return useAppSelector(getPortfolioAssets);
}

export function useDegenMode() {
  const degenMode = useAppSelector(getDegenMode);
  const dispatch = useAppDispatch();

  const setDegenMode = () => {
    dispatch(toggleDegenMode());
  };

  const setRepayFromDeposits = (repayFromDeposits: boolean) => {
    dispatch(setRepayFrom({ repayFromDeposits }));
  };

  const isRepayFromDeposits = degenMode.enabled && degenMode.repayFromDeposits;

  return { degenMode, setDegenMode, isRepayFromDeposits, setRepayFromDeposits };
}
