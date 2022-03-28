import { useAppSelector } from "../redux/hooks";
import { isAssetsLoading } from "../redux/assetsSelectors";
import { isAccountLoading } from "../redux/accountSelectors";

export function useLoading() {
  const isLoadingAssets = useAppSelector(isAssetsLoading);
  const isLoadingAccount = useAppSelector(isAccountLoading);
  return isLoadingAssets || isLoadingAccount;
}
