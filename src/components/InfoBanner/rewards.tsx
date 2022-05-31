import { useLayoutEffect, useState } from "react";
import { Box, Typography, useTheme, useMediaQuery, Stack } from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import { take } from "lodash";

import { TOKEN_FORMAT } from "../../store";
import { isClaiming } from "../../redux/accountSelectors";
import { useAppSelector } from "../../redux/hooks";
import { useSlimStats } from "../../hooks/hooks";
import { useRewards } from "../../hooks/useRewards";
import { Wrapper } from "./style";
import TokenIcon from "../TokenIcon";
import { CloseButton } from "../Modal/components";
import { BurrowHog } from "./hog";

export const Rewards = () => {
  const theme = useTheme();
  const slimStats = useSlimStats();
  const rewardsControls = useAnimation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    rewardsControls.start("closed");
  };

  const handleOpen = () => {
    rewardsControls.start("open");
  };

  const isClaimingLoading = useAppSelector(isClaiming);

  return (
    <Wrapper
      gridArea="rewards"
      sx={{
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.secondary.main,
        justifyContent: "flex-start",
        width: slimStats && isMobile ? "100vw" : "auto",
        height: !slimStats ? "64px" : "auto",
        position: "relative",
      }}
    >
      <BurrowHog />
      <Stack ml="0.5rem" spacing="0.2rem" mt={slimStats ? "1.2rem" : "0.7rem"}>
        {!slimStats && (
          <Typography fontWeight="bold" fontSize="0.85rem">
            Total Daily Rewards
          </Typography>
        )}
        {isClaimingLoading ? (
          <Typography fontSize="0.85rem">Claiming...</Typography>
        ) : (
          <RewardsDaily onOpen={handleOpen} />
        )}
      </Stack>
      <RewardsDetailed onClose={handleClose} controls={rewardsControls} />
    </Wrapper>
  );
};

const RewardsDaily = ({ onOpen }) => {
  const { brrr, extra } = useRewards();
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems="center" spacing="0.5rem">
      <Reward {...brrr} />
      {take(extra, 1).map(([tokenId, r]) => (
        <Reward key={tokenId} {...r} />
      ))}
      <Typography
        fontSize="0.85rem"
        color={theme.palette.primary.main}
        sx={{ textDecoration: "underline", cursor: "pointer" }}
        onClick={onOpen}
      >
        more...
      </Typography>
    </Stack>
  );
};

const Reward = ({ dailyAmount = 0, icon }) => (
  <Stack direction="row" alignItems="center" spacing="0.3rem">
    <TokenIcon width={14} height={14} icon={icon} />
    <Typography fontSize="0.85rem">
      {dailyAmount.toLocaleString(undefined, TOKEN_FORMAT)}
    </Typography>
  </Stack>
);

const rewardsVariants = {
  closed: {
    scaleY: 0,
  },
  open: {
    scaleY: 1,
    transition: { duration: 0.5, type: "spring" },
  },
};

const RewardsDetailed = ({ onClose, controls }) => {
  const { brrr, extra } = useRewards();
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.light,
        boxShadow: "0px 2px 4px rgba(0, 7, 65, 0.2)",
        color: theme.palette.secondary.main,
        flexDirection: "column",
        transformOrigin: "top",
        alignItems: "center",
        position: "absolute",
        borderRadius: "4px",
        display: "flex",
        width: "100%",
        p: "0.5rem",
        zIndex: 2,
        top: 0,
      }}
      component={motion.div}
      variants={rewardsVariants}
      animate={controls}
      initial="closed"
    >
      <CloseButton onClose={onClose} right="0.5rem" />
      <Box
        display="grid"
        my="0.5rem"
        gridTemplateColumns="1fr 14px 1fr 1fr"
        alignItems="center"
        textAlign="right"
        gap={1}
      >
        <Box />
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
  );
};

const RewardGridRow = ({ icon, dailyAmount = 0, unclaimedAmount = 0, symbol }) => {
  const [unclaimed, setUnclaimed] = useState<number>(unclaimedAmount);

  const count = dailyAmount / 24 / 3600 / 10;

  useLayoutEffect(() => {
    setUnclaimed(unclaimedAmount);
    const timer = setInterval(() => setUnclaimed((u) => u + count), 100);
    return () => clearInterval(timer);
  }, [unclaimedAmount]);

  return (
    <>
      <Typography fontSize="0.85rem">{symbol}</Typography>
      <TokenIcon width={18} height={18} icon={icon} />
      <Typography fontSize="0.85rem">
        {dailyAmount.toLocaleString(undefined, TOKEN_FORMAT)}
      </Typography>
      <Typography fontSize="0.85rem">
        {unclaimed.toLocaleString(undefined, TOKEN_FORMAT)}
      </Typography>
    </>
  );
};
