import { useEffect, useState } from "react";

import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getBlocked } from "../redux/appSelectors";
import { setBlocked } from "../redux/appSlice";

export function useBlocked() {
  const dispatch = useAppDispatch();
  const [ip, setIp] = useState();
  const isBlocked = useAppSelector(getBlocked(ip));

  const getIp = async () => {
    const ipInfo = await fetch("https://api.ipify.org?format=json").then((r) => r.json());
    setIp(ipInfo.ip);
  };

  const checkBlocked = async () => {
    if (isBlocked !== undefined) return;
    const ipInfo = await fetch("https://brrr.burrow.cash/api/is-blocked").then((r) => r.json());
    dispatch(setBlocked(ipInfo));
  };

  useEffect(() => {
    checkBlocked();
    getIp();
  }, []);

  return !!isBlocked;
}
