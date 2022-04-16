import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

import { TOKEN_FORMAT } from "../../store";
import { getTotalBRRR, getTotalDailyBRRRewards } from "../../redux/accountSelectors";
import { useAppSelector } from "../../redux/hooks";
import { useSlimStats, useTicker } from "../../hooks";
import { Wrapper } from "./style";
import Hog from "./hog.svg";
import HogCool from "./hog-cool.svg";

export const Rewards = () => {
  const [total, unclaimed] = useAppSelector(getTotalBRRR);
  const totalDailyBRRRewards = useAppSelector(getTotalDailyBRRRewards);
  const slimStats = useSlimStats();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { hasTicker, toggleTicker } = useTicker();

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
      <Box
        top="0.8rem"
        left="0.5rem"
        position="relative"
        sx={{ cursor: "pointer" }}
        onClick={toggleTicker}
      >
        {hasTicker ? <HogCool /> : <Hog />}
      </Box>
      {!slimStats && (
        <Box p="0.5rem" px="1rem">
          <Typography fontSize="0.85rem">Daily rewards:</Typography>
          <Typography fontWeight="bold" fontSize="0.85rem">
            Total Rewards:
          </Typography>
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
        <Typography
          fontSize={slimStats ? "1.1rem" : "0.85rem"}
          align="right"
          fontWeight="bold"
          ml="1rem"
        >
          {totalDailyBRRRewards.toLocaleString(undefined, TOKEN_FORMAT)}
        </Typography>
        <Typography
          fontWeight="bold"
          fontSize={slimStats ? "1.1rem" : "0.85rem"}
          color={theme.palette.primary.main}
          align="right"
        >
          {(total + unclaimed).toLocaleString(undefined, TOKEN_FORMAT)}
        </Typography>
      </Box>
    </Wrapper>
  );
};
