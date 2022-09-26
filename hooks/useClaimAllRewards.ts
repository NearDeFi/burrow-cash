import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { isClaiming } from "../redux/accountSelectors";
import { trackClaimButton } from "../utils/telemetry";
import { farmClaimAll, fetchAccount } from "../redux/accountSlice";

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
