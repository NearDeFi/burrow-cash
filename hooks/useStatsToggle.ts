import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getProtocolStats } from "../redux/appSelectors";
import { setProtocolStats } from "../redux/appSlice";

export function useStatsToggle() {
  const dispatch = useAppDispatch();
  const protocolStats = useAppSelector(getProtocolStats);

  const setStats = (v: boolean) => dispatch(setProtocolStats(v));

  return { protocolStats, setStats };
}
