import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getStaking } from "../redux/selectors/getStaking";
import { getSakingNetAPY } from "../redux/selectors/getSakingNetAPY";
import { setStaking } from "../redux/appSlice";

export function useStaking() {
  const staking = useAppSelector(getStaking);
  const dispatch = useAppDispatch();
  const stakingNetAPY = useAppSelector(getSakingNetAPY);

  const setAmount = (amount) => {
    dispatch(setStaking({ amount }));
  };

  const setMonths = (months) => {
    dispatch(setStaking({ months }));
  };

  return { ...staking, setAmount, setMonths, stakingNetAPY };
}
