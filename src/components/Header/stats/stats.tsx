import { Box, Stack } from "@mui/material";

import { Liquidity } from "./liquidity";
import { APY } from "./apy";
import { HealthFactor } from "./health";
import { useAccountId } from "../../../hooks/hooks";
import { DailyRewards } from "./rewards";
import { useStatsToggle } from "../../../hooks/useStatsToggle";

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
        }}
      >
        <Liquidity />
        {accountId && !protocolStats && (
          <>
            <APY />
            <DailyRewards />
            <HealthFactor />
          </>
        )}
      </Stack>
    </Box>
  );
};
