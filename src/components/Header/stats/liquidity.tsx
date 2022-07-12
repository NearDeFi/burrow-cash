import { useFullDigits } from "../../../hooks/useFullDigits";
import { useAppSelector } from "../../../redux/hooks";
import { getTotalBalance } from "../../../redux/selectors/getTotalBalance";
import { getTotalAccountBalance } from "../../../redux/selectors/getTotalAccountBalance";
import { m, COMPACT_USD_FORMAT } from "../../../store";
import { trackFullDigits } from "../../../telemetry";
import { Stat } from "./components";

export const ProtocolLiquidity = () => {
  const { fullDigits, setDigits } = useFullDigits();
  const protocolDeposited = useAppSelector(getTotalBalance("supplied"));
  const protocolBorrowed = useAppSelector(getTotalBalance("borrowed"));
  const protocolNetLiquidity = protocolDeposited - protocolBorrowed;

  const protocolNetLiquidityValue = fullDigits?.totals
    ? protocolNetLiquidity.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(protocolNetLiquidity)}`;

  const protocolDepositedValue = fullDigits?.totals
    ? protocolDeposited.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(protocolDeposited)}`;

  const protocolBorrowedValue = fullDigits?.totals
    ? protocolBorrowed.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(protocolBorrowed)}`;

  const netLiquidityLabels = [
    {
      value: protocolDepositedValue,
      text: "Deposited",
    },
    {
      value: protocolBorrowedValue,
      text: "Borrowed",
    },
  ];

  const toggleValues = () => {
    const totals = !fullDigits?.totals;
    trackFullDigits({ totals });
    setDigits({ totals });
  };

  return (
    <Stat
      title="Net Liquidity"
      amount={protocolNetLiquidityValue}
      labels={netLiquidityLabels}
      onClick={toggleValues}
    />
  );
};

export const UserLiquidity = () => {
  const { fullDigits, setDigits } = useFullDigits();
  const userDeposited = useAppSelector(getTotalAccountBalance("supplied"));
  const userBorrowed = useAppSelector(getTotalAccountBalance("borrowed"));
  const userNetLiquidity = userDeposited - userBorrowed;

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
      value: userDepositedValue,
      text: "Deposited",
    },
    {
      value: userBorrowedValue,
      text: "Borrowed",
    },
  ];

  const toggleValues = () => {
    const user = !fullDigits?.user;
    trackFullDigits({ user });
    setDigits({ user });
  };

  return (
    <Stat
      title="Net Liquidity"
      amount={userNetLiquidityValue}
      labels={netLiquidityLabels}
      onClick={toggleValues}
    />
  );
};
