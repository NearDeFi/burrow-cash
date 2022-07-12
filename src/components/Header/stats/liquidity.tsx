import { useAccountId } from "../../../hooks/hooks";
import { useFullDigits } from "../../../hooks/useFullDigits";
import { useStatsToggle } from "../../../hooks/useStatsToggle";
import { useAppSelector } from "../../../redux/hooks";
import { getTotalBalance } from "../../../redux/selectors/getTotalBalance";
import { getTotalAccountBalance } from "../../../redux/selectors/getTotalAccountBalance";
import { m, COMPACT_USD_FORMAT } from "../../../store";
import { trackFullDigits } from "../../../telemetry";
import { Stat } from "./components";

export const Liquidity = () => {
  const accountId = useAccountId();
  const { protocolStats } = useStatsToggle();
  const { fullDigits, setDigits } = useFullDigits();
  const protocolDeposited = useAppSelector(getTotalBalance("supplied"));
  const protocolBorrowed = useAppSelector(getTotalBalance("borrowed"));
  const protocolNetLiquidity = protocolDeposited - protocolBorrowed;
  const userDeposited = useAppSelector(getTotalAccountBalance("supplied"));
  const userBorrowed = useAppSelector(getTotalAccountBalance("borrowed"));
  const userNetLiquidity = userDeposited - userBorrowed;

  const protocolNetLiquidityValue = fullDigits?.totals
    ? protocolNetLiquidity.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(protocolNetLiquidity)}`;

  const protocolDepositedValue = fullDigits?.totals
    ? protocolDeposited.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(protocolDeposited)}`;

  const protocolBorrowedValue = fullDigits?.totals
    ? protocolBorrowed.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(protocolBorrowed)}`;

  const userNetLiquidityValue = fullDigits?.user
    ? userNetLiquidity.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(userNetLiquidity)}`;

  const userDepositedValue = fullDigits?.user
    ? userDeposited.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(userDeposited)}`;

  const userBorrowedValue = fullDigits?.user
    ? userBorrowed.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(userBorrowed)}`;

  const netLiquidityLabels = [
    {
      value: !accountId
        ? protocolDepositedValue
        : protocolStats
        ? protocolDepositedValue
        : userDepositedValue,
      text: "Deposited",
    },
    {
      value: !accountId
        ? protocolBorrowedValue
        : protocolStats
        ? protocolBorrowedValue
        : userBorrowedValue,
      text: "Borrowed",
    },
  ];

  const amount = !accountId
    ? protocolNetLiquidityValue
    : protocolStats
    ? protocolNetLiquidityValue
    : userNetLiquidityValue;

  const toggleValues = () => {
    const totals = !fullDigits?.totals;
    const user = !fullDigits?.user;

    if (protocolStats || !accountId) {
      trackFullDigits({ totals });
      setDigits({ totals });
    } else {
      trackFullDigits({ user });
      setDigits({ user });
    }
  };

  return (
    <Stat
      title="Net Liquidity"
      amount={amount}
      labels={netLiquidityLabels}
      onClick={toggleValues}
    />
  );
};
