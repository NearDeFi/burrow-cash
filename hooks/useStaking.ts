import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getStaking } from "../redux/selectors/getStaking";
import { setStaking } from "../redux/appSlice";
import { getNetAPY, getNetTvlAPY } from "../redux/selectors/getNetAPY";

export function useStaking() {
  const staking = useAppSelector(getStaking);
  const dispatch = useAppDispatch();
  const stakingNetAPY = useAppSelector(getNetAPY({ isStaking: true }));
  const stakingNetTvlAPY = useAppSelector(getNetTvlAPY({ isStaking: true }));

  const setAmount = (amount) => {
    dispatch(setStaking({ amount }));
  };

  const setMonths = (months) => {
    dispatch(setStaking({ months }));
  };

  return { ...staking, setAmount, setMonths, stakingNetAPY, stakingNetTvlAPY };
}
