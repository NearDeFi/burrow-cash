import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

import { TOKEN_FORMAT } from "../../store";
import { getTotalBRRR, getTotalDailyBRRRewards, isClaiming } from "../../redux/accountSelectors";
import { useAppSelector } from "../../redux/hooks";
import { useSlimStats } from "../../hooks";
import { Wrapper } from "./style";
import Hog from "./hog.svg";

export const Rewards = () => {
  const [total, unclaimed] = useAppSelector(getTotalBRRR);
  const totalDailyBRRRewards = useAppSelector(getTotalDailyBRRRewards);
  const slimStats = useSlimStats();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isClaimingLoading = useAppSelector(isClaiming);

  return (
    <Wrapper
      gridArea="rewards"
      sx={{
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.secondary.main,
        overflow: "hidden",
        justifyContent: "flex-start",
        borderRadius: 0,
        width: slimStats && isMobile ? "100vw" : "auto",
      }}
    >
      <Box top="1rem" left="0.5rem" position="relative">
        <Hog />
      </Box>
      {!slimStats && (
        <Box p="0.5rem" px="1rem">
          <Typography fontSize="0.85rem">Daily rewards:</Typography>
          <Typography fontWeight="bold" fontSize="0.85rem">
            Total Rewards:
          </Typography>
          <Typography fontSize="0.85rem">Unclaimed:</Typography>
        </Box>
      )}
      <Box
        p="0.5rem"
        px="1rem"
        justifySelf="flex-end"
        display="flex"
        flex="1"
        flexDirection={slimStats ? "row-reverse" : "column"}
      >
        {isClaimingLoading ? (
          <Typography>Claiming...</Typography>
        ) : (
          <>
            <Typography
              fontSize={slimStats ? "1.1rem" : "0.85rem"}
              align="right"
              fontWeight="bold"
              ml="1rem"
              title="Daily BRRR rewards"
            >
              {totalDailyBRRRewards.toLocaleString(undefined, TOKEN_FORMAT)}
            </Typography>
            <Typography
              fontWeight="bold"
              fontSize={slimStats ? "1.1rem" : "0.85rem"}
              color={theme.palette.primary.main}
              align="right"
              title="Total claimed BRRR rewards"
            >
              {total.toLocaleString(undefined, TOKEN_FORMAT)}
            </Typography>
            <Typography
              fontWeight="bold"
              fontSize={slimStats ? "1.1rem" : "0.85rem"}
              color={theme.palette.primary.main}
              align="right"
              pr={slimStats ? "0.5rem" : 0}
              title="Unclaimed BRRR rewards"
            >
              {unclaimed.toLocaleString(undefined, TOKEN_FORMAT)}
            </Typography>
          </>
        )}
      </Box>
    </Wrapper>
  );
};
