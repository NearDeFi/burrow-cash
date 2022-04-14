import { Box, Typography, useTheme } from "@mui/material";

import { USD_FORMAT } from "../../store/constants";
import { getTotalBalance } from "../../redux/assetsSelectors";
import { useAppSelector } from "../../redux/hooks";
import { useFullDigits, useSlimStats } from "../../hooks";
import { trackFullDigits } from "../../telemetry";
import { m } from "./user";

const COMPACT_USD_FORMAT = {
  ...USD_FORMAT,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

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
        <Typography fontWeight="bold" fontSize={fontSize}>
          {borrowedValue}
        </Typography>
        {!slimStats && (
          <Typography fontWeight="light" fontSize="0.85rem">
            Total Borrowed
          </Typography>
        )}
      </Box>
      <Box p="0.5rem" px="1rem" onClick={handleToggle} sx={{ cursor: "pointer" }}>
        <Typography
          fontWeight="bold"
          fontSize={fontSize}
          color={theme.palette.primary.main}
          align="right"
        >
          {depositedValue}
        </Typography>
        {!slimStats && (
          <Typography
            fontWeight="light"
            fontSize="0.85rem"
            color={theme.palette.primary.main}
            align="right"
          >
            Total Deposited
          </Typography>
        )}
      </Box>
    </>
  );
};
