import { useAppSelector } from "../redux/hooks";
import { isAssetsLoading } from "../redux/assetsSelectors";
import { isAccountLoading } from "../redux/accountSelectors";
import { getConfig, getSlimStats } from "../redux/appSelectors";

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
