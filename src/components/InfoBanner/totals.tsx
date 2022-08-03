import { Box, Typography, useTheme } from "@mui/material";

import { COMPACT_USD_FORMAT } from "../../store/constants";
import { getTotalBalance } from "../../redux/selectors/getTotalBalance";
import { useAppSelector } from "../../redux/hooks";
import { useSlimStats } from "../../hooks/hooks";
import { useFullDigits } from "../../hooks/useFullDigits";
import { trackFullDigits } from "../../telemetry";
import { m } from "./user";

// const COMPACT_USD_FORMAT = {
//   ...USD_FORMAT,
//   minimumFractionDigits: 0,
//   maximumFractionDigits: 0,
// };

export const Totals = () => {
  const theme = useTheme();
  const deposited = useAppSelector(getTotalBalance("supplied"));
  const borrowed = useAppSelector(getTotalBalance("borrowed"));
  const slimStats = useSlimStats();
  const { fullDigits, setDigits } = useFullDigits();

  const handleToggle = () => {
    const totals = !fullDigits?.totals;
    trackFullDigits({ totals });
    setDigits({ totals });
  };

  const borrowedValue = fullDigits?.totals
    ? borrowed.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(borrowed)}`;

  const depositedValue = fullDigits?.totals
    ? deposited.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(deposited)}`;

  const fontSize = "1.2rem";

  return (
    <>
      <Box p="0.5rem" px="1rem" onClick={handleToggle} sx={{ cursor: "pointer" }}>
        <Typography fontWeight="bold" fontSize={fontSize} color={theme.palette.primary.main}>
          {depositedValue}
        </Typography>
        {!slimStats && (
          <Typography fontWeight="light" fontSize="0.85rem" color={theme.palette.primary.main}>
            Total Deposited
          </Typography>
        )}
      </Box>
      <Box p="0.5rem" px="1rem" onClick={handleToggle} sx={{ cursor: "pointer" }}>
        <Typography fontWeight="bold" fontSize={fontSize} align="right">
          {borrowedValue}
        </Typography>
        {!slimStats && (
          <Typography fontWeight="light" fontSize="0.85rem" align="right">
            Total Borrowed
          </Typography>
        )}
      </Box>
    </>
  );
};
