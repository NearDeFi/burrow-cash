import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getDisclaimerAgreed } from "../redux/appSelectors";
import { setDisclaimerAggreed } from "../redux/appSlice";

export function useDisclaimer() {
  const dispatch = useAppDispatch();
  const getDisclaimer = useAppSelector(getDisclaimerAgreed);

  const setDisclaimer = (v: boolean) => {
    dispatch(setDisclaimerAggreed(v));
  };

  return { getDisclaimer, setDisclaimer };
}
