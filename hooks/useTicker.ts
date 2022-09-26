import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getShowTicker } from "../redux/appSelectors";
import { toggleShowTicker } from "../redux/appSlice";
import { trackShowTicker } from "../utils/telemetry";

export function useTicker() {
  const dispatch = useAppDispatch();
  const hasTicker = useAppSelector(getShowTicker);

  const toggleTicker = () => {
    trackShowTicker({ hasTicker });
    dispatch(toggleShowTicker());
  };

  return { hasTicker, toggleTicker };
}
