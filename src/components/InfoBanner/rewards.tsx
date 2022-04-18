import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

import { TOKEN_FORMAT } from "../../store";
import { getTotalBRRR, getTotalDailyBRRRewards, isClaiming } from "../../redux/accountSelectors";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useSlimStats, useTicker } from "../../hooks";
import { orderFeed } from "../../redux/feedSlice";
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
  const controls = useAnimation();
  const dispatch = useAppDispatch();

  const variants = {
    small: {
      top: "1.5rem",
      transition: { duration: 0.5 },
    },
    cool: {
      top: slimStats || isMobile ? "0.4rem" : "0.8rem",
      transition: { duration: 0.5 },
    },
  };

  const handleClickHog = () => {
    toggleTicker();
    if (!hasTicker) {
      dispatch(orderFeed());
      controls.start("cool");
    } else {
      controls.start("small");
    }
  };
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
      <Box
        top="0.8rem"
        left="0.5rem"
        position="relative"
        sx={{ cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
        onClick={handleClickHog}
        component={motion.div}
        variants={variants}
        initial={hasTicker ? "cool" : "small"}
        animate={controls}
      >
        <AnimatePresence>{hasTicker ? <HogCool /> : <Hog />}</AnimatePresence>
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
