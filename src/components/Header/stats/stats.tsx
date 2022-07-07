import { Stack } from "@mui/material";

import { Liquidity } from "./liquidity";
import { APY } from "./apy";
import { HealthFactor } from "./health";
import { useAccountId } from "../../../hooks/hooks";
import { DailyRewards } from "./rewards";

export const StatsContainer = () => {
  const accountId = useAccountId();

  return (
    <Stack direction="row" gap="2rem" px="1rem">
      <Liquidity />
      {accountId && (
        <>
          <APY />
          <DailyRewards />
          <HealthFactor />
        </>
      )}
    </Stack>
  );
};
