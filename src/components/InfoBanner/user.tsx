import millify from "millify";
import { Box, Typography, useTheme } from "@mui/material";

import { APY_FORMAT } from "../../store";
import { getTotalAccountBalance, getNetAPY, getHealthFactor } from "../../redux/accountSelectors";
import { useAppSelector } from "../../redux/hooks";
import { HealthFactor } from "./health";
import { useSlimStats } from "../../hooks";

export const m = (a) => millify(a, { precision: 2 });

export const UserTotals = () => {
  const theme = useTheme();
  const deposited = useAppSelector(getTotalAccountBalance("supplied"));
  const borrowed = useAppSelector(getTotalAccountBalance("borrowed"));
  const slimStats = useSlimStats();

  return (
    <>
      <Box p={slimStats ? 0 : "0.5rem"} px="1rem">
        <Typography fontWeight="bold" fontSize="1.5rem">
          ${m(borrowed)}
        </Typography>
        {!slimStats && (
          <Typography fontWeight="light" fontSize="0.85rem">
            Your Borrows
          </Typography>
        )}
      </Box>
      <Box p={slimStats ? 0 : "0.5rem"} px="1rem">
        <Typography
          fontWeight="bold"
          fontSize="1.5rem"
          color={theme.palette.primary.main}
          align="right"
        >
          ${m(deposited)}
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

  return (
    <>
      <Box p="0.5rem" px="1rem">
        <Typography fontWeight="bold" fontSize="1.5rem" color={netAPY < 0 ? "red" : "white"}>
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
