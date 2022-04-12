import millify from "millify";
import { Box, Typography, useTheme } from "@mui/material";

import { APY_FORMAT } from "../../store";
import { getTotalAccountBalance, getNetAPY, getHealthFactor } from "../../redux/accountSelectors";
import { getTotalBalance } from "../../redux/assetsSelectors";
import { useAppSelector } from "../../redux/hooks";
import { HealthFactor } from "./health";
import { Wrapper } from "./style";

const m = (a) => millify(a, { precision: 2 });

const Totals = () => {
  const deposited = useAppSelector(getTotalBalance("supplied"));
  const borrowed = useAppSelector(getTotalBalance("borrowed"));
  const theme = useTheme();

  return (
    <Wrapper>
      <Box p="0.5rem" px="1rem">
        <Typography fontWeight="bold" fontSize="1.5rem">
          ${m(borrowed)}
        </Typography>
        <Typography fontWeight="light" fontSize="0.85rem">
          Total Borrowed
        </Typography>
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
        <Typography
          fontWeight="light"
          fontSize="0.85rem"
          color={theme.palette.primary.main}
          align="right"
        >
          Total Deposited
        </Typography>
      </Box>
    </Wrapper>
  );
};

const UserTotals = () => {
  const deposited = useAppSelector(getTotalAccountBalance("supplied"));
  const borrowed = useAppSelector(getTotalAccountBalance("borrowed"));
  const theme = useTheme();

  return (
    <Wrapper>
      <Box p="0.5rem" px="1rem">
        <Typography fontWeight="bold" fontSize="1.5rem">
          ${m(borrowed)}
        </Typography>
        <Typography fontWeight="light" fontSize="0.85rem">
          Your Borrows
        </Typography>
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
        <Typography
          fontWeight="light"
          fontSize="0.85rem"
          color={theme.palette.primary.main}
          align="right"
        >
          Your deposits
        </Typography>
      </Box>
    </Wrapper>
  );
};

const UserHealth = () => {
  const netAPY = useAppSelector(getNetAPY);
  const healthFactor = useAppSelector(getHealthFactor);

  return (
    <Wrapper>
      <Box p="0.5rem" px="1rem">
        <Typography fontWeight="bold" fontSize="1.5rem" color={netAPY < 0 ? "red" : "white"}>
          {netAPY.toLocaleString(undefined, APY_FORMAT)}%
        </Typography>
        <Typography fontWeight="light" fontSize="0.85rem">
          Net APY
        </Typography>
      </Box>
      <Box p="0.5rem" px="1rem">
        <HealthFactor value={healthFactor} />
      </Box>
    </Wrapper>
  );
};

const InfoBanner = () => {
  const cols = ["1fr", "1fr 1fr 1fr"];
  return (
    <Box display="grid" gridTemplateColumns={cols} gap={2} mx="2rem" my="1rem">
      <Totals />
      <UserTotals />
      <UserHealth />
    </Box>
  );
};

export default InfoBanner;
