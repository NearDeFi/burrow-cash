import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { isAssetsLoading } from "../redux/assetsSelectors";
import { isAccountLoading } from "../redux/accountSelectors";
import { getConfig, getSlimStats, getFullDigits } from "../redux/appSelectors";
import { setFullDigits } from "../redux/appSlice";
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
