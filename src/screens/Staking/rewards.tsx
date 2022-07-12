import { Box, Stack, Typography, Tooltip } from "@mui/material";
import { MdInfoOutline } from "@react-icons/all-files/md/MdInfoOutline";

import { TOKEN_FORMAT } from "../../store/constants";
import { useRewards } from "../../hooks/useRewards";
import TokenIcon from "../../components/TokenIcon";
import { Separator } from "./components";

export const StakingRewards = () => {
  const { extra, net } = useRewards();

  return (
    <Box>
      <Typography fontSize="0.8rem" color="gray" mt={1}>
        Net Liquidity Rewards
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns="auto 1fr"
        alignItems="center"
        gap={1.5}
        mt={1}
        mb={3}
      >
        {net.map(([tokenId, r]) => (
          <Reward key={tokenId} {...r} />
        ))}
      </Box>
      <Typography fontSize="0.8rem" color="gray">
        Asset Rewards
      </Typography>
      <Box display="grid" gridTemplateColumns="auto 1fr" alignItems="center" gap={1.5} mt={1}>
        {extra.map(([tokenId, r]) => (
          <Reward key={tokenId} {...r} />
        ))}
      </Box>
    </Box>
  );
};

const Reward = ({ icon, dailyAmount, symbol, multiplier, newDailyAmount }) => {
  return (
    <>
      <Stack direction="row" gap={1.5} alignItems="center">
        <TokenIcon width={24} height={24} icon={icon} />
        <Typography fontSize="0.75rem" textAlign="left">
          {symbol}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Separator sx={{ position: "relative", top: "10px", mx: "20px" }} />
        <Typography
          position="relative"
          fontSize="0.75rem"
          textAlign="right"
          fontWeight="bold"
          alignItems="center"
        >
          {newDailyAmount.toLocaleString(undefined, TOKEN_FORMAT)} 💰
          <Info daily={dailyAmount} multiplier={multiplier} />
        </Typography>
      </Stack>
    </>
  );
};

export const Info = ({ daily, multiplier }) => (
  <Tooltip
    title={
      <Stack width="140px" spacing={0.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize="0.625rem">Current daily</Typography>
          <Typography fontSize="0.625rem" fontWeight="medium">
            {daily.toLocaleString(undefined, TOKEN_FORMAT)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize="0.625rem">Multiplier</Typography>
          <Typography fontSize="0.625rem" fontWeight="medium">
            {multiplier.toLocaleString(undefined, TOKEN_FORMAT)}
          </Typography>
        </Stack>
      </Stack>
    }
    placement="right"
    arrow
  >
    <Box component="span">
      <MdInfoOutline
        style={{ marginLeft: "3px", color: "#909090", position: "relative", top: "2px" }}
      />
    </Box>
  </Tooltip>
);
