import { useEffect } from "react";

import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getBlocked } from "../redux/appSelectors";
import { setBlocked } from "../redux/appSlice";

export function useBlocked() {
  const dispatch = useAppDispatch();
  const isBlocked = useAppSelector(getBlocked);

  const checkBlocked = async () => {
    if (isBlocked !== undefined) return;
    const ip = await fetch("https://brrr.burrow.cash/api/is-blocked").then((r) => r.json());

    if (ip?.blocked) {
      dispatch(setBlocked(true));
    }
  };

  useEffect(() => {
    checkBlocked();
  }, []);

  return !!isBlocked;
}
