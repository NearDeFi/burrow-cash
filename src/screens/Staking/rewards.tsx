import { Box, Stack, Typography, Tooltip } from "@mui/material";
import { FcInfo } from "@react-icons/all-files/fc/FcInfo";

import { TOKEN_FORMAT } from "../../store/constants";
import { useRewards } from "../../hooks";
import TokenIcon from "../../components/TokenIcon";

export const StakingRewards = ({ amount }) => {
  const { extra } = useRewards();

  return (
    <Stack direction="column" px={[1, 2]} p={1.5} bgcolor="white">
      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr" alignItems="center" gap={1}>
        <Typography fontSize="0.75rem" textAlign="left" fontWeight="bold">
          Extra Rewards
        </Typography>
        <Typography fontSize="0.75rem" textAlign="right" fontWeight="bold">
          Daily Total
        </Typography>
        <Typography fontSize="0.75rem" textAlign="center" fontWeight="bold">
          Multiplier
          <Info title="New farming multiplier" />
        </Typography>
        <Typography fontSize="0.75rem" textAlign="right" fontWeight="bold">
          <Info title="Boosted daily rewards after staking" style={{ marginRight: "5px" }} />
          🚀 Boost 🚀
        </Typography>
        {extra.map(([tokenId, r]) => (
          <Reward key={tokenId} {...r} amount={amount} />
        ))}
      </Box>
    </Stack>
  );
};

const Reward = ({ icon, dailyAmount, symbol, amount, boosterLogBase }) => {
  const multiplier = 1 + Math.log(amount || 1) / Math.log(boosterLogBase || 100);

  return (
    <>
      <Stack direction="row" gap={1}>
        <TokenIcon width={18} height={18} icon={icon} />
        <Typography fontSize="0.75rem" textAlign="left">
          {symbol}
        </Typography>
      </Stack>
      <Typography fontSize="0.75rem" textAlign="right">
        {dailyAmount.toLocaleString(undefined, TOKEN_FORMAT)}
      </Typography>
      <Typography fontSize="0.75rem" textAlign="center">
        {multiplier.toFixed(2)}x
      </Typography>
      <Typography fontSize="0.75rem" textAlign="right" fontWeight="bold">
        {(dailyAmount * multiplier).toLocaleString(undefined, TOKEN_FORMAT)}
      </Typography>
    </>
  );
};

const Info = ({ title, style }: { title: string; style?: React.CSSProperties }) => (
  <Tooltip title={title}>
    <Box component="span">
      <FcInfo style={{ marginLeft: "5px", ...style }} />
    </Box>
  </Tooltip>
);
