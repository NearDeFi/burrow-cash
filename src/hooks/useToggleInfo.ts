import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getShowInfo } from "../redux/appSelectors";
import { setShowInfo } from "../redux/appSlice";

export function useToggleInfo() {
  const dispatch = useAppDispatch();
  const showInfo = useAppSelector(getShowInfo);

  const set = (v: boolean) => dispatch(setShowInfo(v));

  return { showInfo, setShowInfo: set };
}
