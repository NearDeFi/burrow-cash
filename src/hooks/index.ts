import { useAppSelector } from "../redux/hooks";
import { isAssetsLoading } from "../redux/assetsSelectors";
import { isAccountLoading } from "../redux/accountSelectors";
import { getConfig } from "../redux/appSelectors";
import { getViewAs } from "../utils";

export function useLoading() {
  const isLoadingAssets = useAppSelector(isAssetsLoading);
  const isLoadingAccount = useAppSelector(isAccountLoading);
  return isLoadingAssets || isLoadingAccount;
}

export function useIsBurrowToken(tokenId) {
  const config = useAppSelector(getConfig);
  return config.booster_token_id === tokenId;
}

export function useViewAs() {
  const viewAs = getViewAs();
  return !!viewAs;
}
