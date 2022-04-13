import { Box, Typography, useTheme } from "@mui/material";

import { getTotalBalance } from "../../redux/assetsSelectors";
import { useAppSelector } from "../../redux/hooks";
import { useSlimStats } from "../../hooks";
import { m } from "./user";

export const Totals = () => {
  const theme = useTheme();
  const deposited = useAppSelector(getTotalBalance("supplied"));
  const borrowed = useAppSelector(getTotalBalance("borrowed"));
  const slimStats = useSlimStats();

  return (
    <>
      <Box p="0.5rem" px="1rem">
        <Typography fontWeight="bold" fontSize="1.5rem">
          ${m(borrowed)}
        </Typography>
        {!slimStats && (
          <Typography fontWeight="light" fontSize="0.85rem">
            Total Borrowed
          </Typography>
        )}
      </Box>
      <Box p="0.5rem" px="1rem">
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
            Total Deposited
          </Typography>
        )}
      </Box>
    </>
  );
};
