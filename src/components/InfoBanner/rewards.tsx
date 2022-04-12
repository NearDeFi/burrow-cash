import { Box, Typography, useTheme } from "@mui/material";

import { TOKEN_FORMAT } from "../../store";
import { getTotalBRRR, getTotalDailyBRRRewards } from "../../redux/accountSelectors";
import { useAppSelector } from "../../redux/hooks";
import { Wrapper } from "./style";
import Hog from "./hog.svg";

export const Rewards = () => {
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
