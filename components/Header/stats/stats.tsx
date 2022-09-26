import { Box, Stack } from "@mui/material";

import { ProtocolLiquidity, UserLiquidity } from "./liquidity";
import { APY } from "./apy";
import { HealthFactor } from "./health";
import { useAccountId } from "../../../hooks/hooks";
import { UserDailyRewards, ProtocolDailyRewards } from "./rewards";
import { useStatsToggle } from "../../../hooks/useStatsToggle";

const UserStats = () => (
  <>
    <UserLiquidity />
    <APY />
    <UserDailyRewards />
    <HealthFactor />
  </>
);

const ProtocolStats = () => (
  <>
    <ProtocolLiquidity />
    <ProtocolDailyRewards />
  </>
);

export const StatsContainer = () => {
  const accountId = useAccountId();
  const { protocolStats } = useStatsToggle();

  return (
    <Box>
      <Stack
        direction="row"
        gap="2rem"
        px="1rem"
        overflow="scroll"
        mx="-1rem"
        pl="2rem"
        sx={{
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        {protocolStats ? <ProtocolStats /> : accountId ? <UserStats /> : <ProtocolStats />}
      </Stack>
    </Box>
  );
};
