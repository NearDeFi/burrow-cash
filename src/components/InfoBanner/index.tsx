import millify from "millify";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

import { APY_FORMAT, TOKEN_FORMAT } from "../../store";
import {
  getTotalAccountBalance,
  getNetAPY,
  getHealthFactor,
  getTotalBRRR,
  getTotalDailyBRRRewards,
} from "../../redux/accountSelectors";
import { getTotalBalance } from "../../redux/assetsSelectors";
import { useAppSelector } from "../../redux/hooks";
import { HealthFactor } from "./health";
import { Wrapper } from "./style";
import Hog from "./hog.svg";

const m = (a) => millify(a, { precision: 2 });

const Totals = () => {
  const deposited = useAppSelector(getTotalBalance("supplied"));
  const borrowed = useAppSelector(getTotalBalance("borrowed"));
  const theme = useTheme();

  return (
    <Wrapper gridArea="totals">
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
    <>
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
    </>
  );
};

const UserHealth = () => {
  const netAPY = useAppSelector(getNetAPY);
  const healthFactor = useAppSelector(getHealthFactor);

  return (
    <>
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
    </>
  );
};

const Rewards = () => {
  const [total, unclaimed] = useAppSelector(getTotalBRRR);
  const totalDailyBRRRewards = useAppSelector(getTotalDailyBRRRewards);
  const theme = useTheme();

  return (
    <Wrapper
      gridArea="rewards"
      sx={{
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.secondary.main,
        overflow: "hidden",
        justifyContent: "flex-start",
      }}
    >
      <Box top="1rem" left="0.5rem" position="relative">
        <Hog />
      </Box>
      <Box p="0.5rem" px="1rem">
        <Typography fontSize="0.85rem">Daily rewards:</Typography>
        <Typography fontWeight="bold" fontSize="0.85rem">
          Total Rewards:
        </Typography>
      </Box>
      <Box p="0.5rem" px="1rem" justifySelf="flex-end" flex="1">
        <Typography fontSize="0.85rem" align="right" fontWeight="bold">
          {totalDailyBRRRewards.toLocaleString(undefined, TOKEN_FORMAT)} BRRR
        </Typography>
        <Typography
          fontWeight="bold"
          fontSize="0.85rem"
          color={theme.palette.primary.main}
          align="right"
        >
          {(total + unclaimed).toLocaleString(undefined, TOKEN_FORMAT)} BRRR
        </Typography>
      </Box>
    </Wrapper>
  );
};

const InfoBanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const areas = [
    `"totals" "user" "rewards"`,
    `"totals" "user" "rewards"`,
    `"totals user" "health rewards"`,
    `"totals user health" ". rewards ."`,
    `"totals user health rewards"`,
  ];
  const columns = [
    "1fr",
    "1fr",
    "repeat(2, minmax(320px, 320px))",
    "repeat(3, minmax(320px, 320px))",
    "repeat(4, minmax(320px, 320px))",
  ];
  return (
    <Box
      display="grid"
      gridTemplateAreas={areas}
      gridTemplateColumns={columns}
      gap={2}
      mx="2rem"
      my="1rem"
    >
      <Totals />
      {isMobile ? (
        <Wrapper gridArea="user" sx={{ flexDirection: "column" }}>
          <Box display="flex" justifyContent="space-between" width="100%">
            <UserTotals />
          </Box>
          <Box display="flex" justifyContent="space-between" width="100%">
            <UserHealth />
          </Box>
        </Wrapper>
      ) : (
        <>
          <Wrapper gridArea="user">
            <UserTotals />
          </Wrapper>
          <Wrapper gridArea="health">
            <UserHealth />
          </Wrapper>
        </>
      )}
      <Rewards />
    </Box>
  );
};

export default InfoBanner;
