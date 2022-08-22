import { Box } from "@mui/material";

import { useFullDigits } from "../../../hooks/useFullDigits";
import { useAppSelector } from "../../../redux/hooks";
import { getTotalAccountBalance } from "../../../redux/selectors/getTotalAccountBalance";
import { m, COMPACT_USD_FORMAT } from "../../../store";
import { trackFullDigits } from "../../../telemetry";
import { Stat } from "./components";
import { getWeightedNetLiquidity } from "../../../redux/selectors/getAccountRewards";
import { useProtocolNetLiquidity } from "../../../hooks/useNetLiquidity";

export const ProtocolLiquidity = () => {
  const { fullDigits, setDigits } = useFullDigits();
  const { protocolBorrowed, protocolDeposited, protocolNetLiquidity } = useProtocolNetLiquidity();

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
    [
      {
        value: protocolDepositedValue,
        text: "Deposited",
      },
      {
        value: protocolBorrowedValue,
        text: "Borrowed",
      },
    ],
  ];

  const toggleValues = () => {
    const totals = !fullDigits?.totals;
    trackFullDigits({ totals });
    setDigits({ totals });
  };

  return (
    <Stat
      title="Net Liquidity"
      titleTooltip="Protocol liquid balance"
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
  const weightedNetLiquidity = useAppSelector(getWeightedNetLiquidity);

  const userNetLiquidityValue = fullDigits?.user
    ? userNetLiquidity.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(userNetLiquidity)}`;

  const userWeightedNetLiquidityValue = fullDigits?.user
    ? weightedNetLiquidity.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(weightedNetLiquidity)}`;

  const userDepositedValue = fullDigits?.user
    ? userDeposited.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(userDeposited)}`;

  const userBorrowedValue = fullDigits?.user
    ? userBorrowed.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(userBorrowed)}`;

  const netLiquidityLabels = [
    [
      {
        value: userDepositedValue,
        text: "Deposited",
      },
      {
        value: userBorrowedValue,
        text: "Borrowed",
      },
    ],
  ];

  const toggleValues = () => {
    const user = !fullDigits?.user;
    trackFullDigits({ user });
    setDigits({ user });
  };

  const title = (
    <Box component="span" maxWidth={120}>
      <Box>Weighted</Box>
      <span>Net Liquidity</span>
    </Box>
  );

  return (
    <Stat
      title={title}
      titleTooltip={`Your full net liquidity is: ${userNetLiquidityValue}`}
      amount={userWeightedNetLiquidityValue}
      labels={netLiquidityLabels}
      onClick={toggleValues}
    />
  );
};
