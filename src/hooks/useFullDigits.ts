import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getFullDigits } from "../redux/appSelectors";
import { setFullDigits } from "../redux/appSlice";

export function useFullDigits() {
  const dispatch = useAppDispatch();
  const fullDigits = useAppSelector(getFullDigits);

  const setDigits = (value) => dispatch(setFullDigits(value));

  return { fullDigits, setDigits };
}
