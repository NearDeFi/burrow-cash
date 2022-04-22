import { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery, Stack } from "@mui/material";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { take } from "lodash";

import { TOKEN_FORMAT } from "../../store";
import { getAccountRewards, isClaiming } from "../../redux/accountSelectors";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useSlimStats, useTicker } from "../../hooks";
import { orderFeed } from "../../redux/feedSlice";
import { Wrapper } from "./style";
import Hog from "./hog.svg";
import HogCool from "./hog-cool.svg";
import { isTestnet } from "../../utils";
import TokenIcon from "../TokenIcon";
import { CloseButton } from "../Modal/components";

export const Rewards = () => {
  const [isOpen, setOpen] = useState(false);
  const rewards = useAppSelector(getAccountRewards);
  const slimStats = useSlimStats();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { hasTicker, toggleTicker } = useTicker();
  const hogControls = useAnimation();
  const rewardsControls = useAnimation();
  const dispatch = useAppDispatch();
  const { brrr } = rewards;

  const hogVariants = {
    small: {
      top: "1.5rem",
      transition: { duration: 0.5 },
    },
    cool: {
      top: "1rem",
      transition: { duration: 0.5 },
    },
  };

  const rewardsVariants = {
    closed: {
      scaleY: 0,
      scaleX: 0,
      transition: { duration: 0.2 },
    },
    open: {
      scaleY: 1,
      scaleX: 1,
      transition: { duration: 0.2 },
    },
  };

  const handleClickHog = () => {
    if (isTestnet) return;
    toggleTicker();
    if (!hasTicker) {
      dispatch(orderFeed());
      hogControls.start("cool");
    } else {
      hogControls.start("small");
    }
  };

  const handleClose = () => {
    rewardsControls.start("closed");
    setOpen(false);
  };

  const handleOpen = () => {
    rewardsControls.start("open");
    setOpen(true);
  };

  const isClaimingLoading = useAppSelector(isClaiming);
  const extra = Object.entries(rewards.extra);

  return (
    <Wrapper
      gridArea="rewards"
      sx={{
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.secondary.main,
        overflow: isOpen ? "visible" : "hidden",
        justifyContent: "flex-start",
        width: slimStats && isMobile ? "100vw" : "auto",
        position: "relative",
      }}
    >
      <Box top="0" bottom="0" height="100%" width="70px" overflow="hidden">
        <Box
          top="0.8rem"
          left="0.5rem"
          position="relative"
          sx={{ cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
          onClick={handleClickHog}
          component={motion.div}
          variants={hogVariants}
          initial={hasTicker ? "cool" : "small"}
          animate={hogControls}
        >
          <AnimatePresence>{hasTicker ? <HogCool /> : <Hog />}</AnimatePresence>
        </Box>
      </Box>
      <Stack ml="1rem" spacing="0.2rem">
        {!slimStats && <Typography fontWeight="bold">Daily Rewards</Typography>}
        {isClaimingLoading ? (
          <Typography fontSize="0.85rem">Claiming...</Typography>
        ) : (
          <Stack direction="row" alignItems="center" spacing="0.5rem">
            <Reward {...brrr} />
            {take(extra, slimStats ? extra.length : 1).map(([tokenId, r]) => (
              <Reward key={tokenId} {...r} />
            ))}
            <Typography
              fontSize="0.85rem"
              color={theme.palette.primary.main}
              sx={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={handleOpen}
            >
              more...
            </Typography>
          </Stack>
        )}
      </Stack>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.light,
          boxShadow: "0px 2px 4px rgba(0, 7, 65, 0.2)",
          color: theme.palette.secondary.main,
          alignItems: "center",
          flexDirection: "column",
          position: "absolute",
          width: "100%",
          borderRadius: "4px",
          display: "flex",
          transformOrigin: "top left",
          zIndex: 1,
          top: 0,
          p: "0.5rem",
        }}
        component={motion.div}
        variants={rewardsVariants}
        animate={rewardsControls}
        initial="closed"
      >
        <CloseButton onClose={handleClose} right="0.5rem" />
        <Box
          display="grid"
          my="0.5rem"
          gridTemplateColumns="14px 1fr 1fr"
          alignItems="center"
          textAlign="right"
          gap={1}
        >
          <Box />
          <Typography fontSize="0.85rem" fontWeight="bold">
            Daily
          </Typography>
          <Typography fontSize="0.85rem" fontWeight="bold">
            Unclaimed
          </Typography>
          <RewardGridRow {...brrr} />
          {extra.map(([tokenId, r]) => (
            <RewardGridRow key={tokenId} {...r} />
          ))}
        </Box>
      </Box>
    </Wrapper>
  );
};

const Reward = ({ dailyAmount, icon }) => (
  <Stack direction="row" alignItems="center" spacing="0.3rem">
    <TokenIcon width={14} height={14} icon={icon} />
    <Typography fontSize="0.85rem">
      {dailyAmount.toLocaleString(undefined, TOKEN_FORMAT)}
    </Typography>
  </Stack>
);

const RewardGridRow = ({ icon, dailyAmount, unclaimedAmount }) => (
  <>
    <TokenIcon width={14} height={14} icon={icon} />
    <Typography fontSize="0.85rem">
      {dailyAmount.toLocaleString(undefined, TOKEN_FORMAT)}
    </Typography>
    <Typography fontSize="0.85rem">
      {unclaimedAmount.toLocaleString(undefined, TOKEN_FORMAT)}
    </Typography>
  </>
);
