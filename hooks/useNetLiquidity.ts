import { useAppSelector } from "../redux/hooks";

import { getTotalBalance } from "../redux/selectors/getTotalBalance";

export function useProtocolNetLiquidity() {
  const protocolDeposited = useAppSelector(getTotalBalance("supplied"));
  const protocolBorrowed = useAppSelector(getTotalBalance("borrowed"));
  const protocolNetLiquidity = protocolDeposited - protocolBorrowed;
  return { protocolDeposited, protocolBorrowed, protocolNetLiquidity };
}
