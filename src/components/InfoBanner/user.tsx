import millify from "millify";
import { Box, Typography, useTheme } from "@mui/material";

import { APY_FORMAT, USD_FORMAT } from "../../store";
import { getTotalAccountBalance, getNetAPY, getHealthFactor } from "../../redux/accountSelectors";
import { useAppSelector } from "../../redux/hooks";
import { HealthFactor } from "./health";
import { useFullDigits, useSlimStats } from "../../hooks";
import { trackFullDigits } from "../../telemetry";

export const m = (a) => millify(a, { precision: 2 });

export const UserTotals = () => {
  const theme = useTheme();
  const deposited = useAppSelector(getTotalAccountBalance("supplied"));
  const borrowed = useAppSelector(getTotalAccountBalance("borrowed"));
  const slimStats = useSlimStats();
  const { fullDigits, setDigits } = useFullDigits();

  const handleToggle = () => {
    const user = !fullDigits.user;
    trackFullDigits({ user });
    setDigits({ user });
  };

  const borrowedValue = fullDigits.user
    ? borrowed.toLocaleString(undefined, USD_FORMAT)
    : `$${m(borrowed)}`;

  const depositedValue = fullDigits.user
    ? deposited.toLocaleString(undefined, USD_FORMAT)
    : `$${m(deposited)}`;

  const fontSize = fullDigits.user ? "1.2rem" : "1.5rem";

  return (
    <>
      <Box p={slimStats ? 0 : "0.5rem"} px="1rem" onClick={handleToggle} sx={{ cursor: "pointer" }}>
        <Typography fontWeight="bold" fontSize={fontSize}>
          {borrowedValue}
        </Typography>
        {!slimStats && (
          <Typography fontWeight="light" fontSize="0.85rem">
            Your Borrows
          </Typography>
        )}
      </Box>
      <Box p={slimStats ? 0 : "0.5rem"} px="1rem" onClick={handleToggle} sx={{ cursor: "pointer" }}>
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
            Your deposits
          </Typography>
        )}
      </Box>
    </>
  );
};

export const UserHealth = () => {
  const netAPY = useAppSelector(getNetAPY);
  const healthFactor = useAppSelector(getHealthFactor);
  const slimStats = useSlimStats();
  const { fullDigits } = useFullDigits();

  const fontSize = slimStats && fullDigits.user ? "1.2rem" : "1.5rem";

  return (
    <>
      <Box p="0.5rem" px="1rem">
        <Typography fontWeight="bold" fontSize={fontSize} color={netAPY < 0 ? "red" : "white"}>
          {netAPY.toLocaleString(undefined, APY_FORMAT)}%
        </Typography>
        {!slimStats && (
          <Typography fontWeight="light" fontSize="0.85rem">
            Net APY
          </Typography>
        )}
      </Box>
      <Box p="0.5rem" px="1rem">
        <HealthFactor value={healthFactor} />
      </Box>
    </>
  );
};
