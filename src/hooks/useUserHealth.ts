import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getDailyReturns } from "../redux/selectors/getDailyReturns";
import { getNetAPY, getNetTvlAPY } from "../redux/selectors/getNetAPY";
import { getHealthFactor } from "../redux/selectors/getHealthFactor";
import { getAppState } from "../redux/appSelectors";
import { toggleShowDailyReturns } from "../redux/appSlice";
import { trackShowDailyReturns } from "../telemetry";
import { useSlimStats } from "./hooks";
import { useFullDigits } from "./useFullDigits";

export function useUserHealth() {
  const dispatch = useAppDispatch();
  const { showDailyReturns } = useAppSelector(getAppState);
  const netAPY = useAppSelector(getNetAPY({ isStaking: false }));
  const netTvlAPY = useAppSelector(getNetTvlAPY);
  const dailyReturns = useAppSelector(getDailyReturns);
  const healthFactor = useAppSelector(getHealthFactor);
  const { fullDigits, setDigits } = useFullDigits();
  const slimStats = useSlimStats();

  const toggleDailyReturns = () => {
    trackShowDailyReturns({ showDailyReturns });
    dispatch(toggleShowDailyReturns());
  };

  const toggleDigits = () => {
    setDigits({ dailyReturns: !fullDigits.dailyReturns });
  };

  return {
    netAPY,
    netTvlAPY,
    dailyReturns,
    healthFactor,
    slimStats,
    fullDigits,
    toggleDigits,
    showDailyReturns,
    toggleDailyReturns,
  };
}
