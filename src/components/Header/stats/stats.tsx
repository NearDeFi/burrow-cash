import { Box, Stack } from "@mui/material";

import { Liquidity } from "./liquidity";
import { APY } from "./apy";
import { HealthFactor } from "./health";
import { useAccountId } from "../../../hooks/hooks";
import { DailyRewards } from "./rewards";

export const StatsContainer = () => {
  const accountId = useAccountId();

  return (
    <Box>
      <Stack direction="row" gap="2rem" px="1rem" overflow="scroll" mx="-1rem" pl="2rem">
        <Liquidity />
        {accountId && (
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
