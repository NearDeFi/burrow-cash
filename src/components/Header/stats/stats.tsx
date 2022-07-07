import { Stack } from "@mui/material";

import { Stat } from "./components";
import { Liquidity } from "./liquidity";
import { APY } from "./apy";
import { HealthFactor } from "./health";
import { useAccountId } from "../../../hooks/hooks";

export const StatsContainer = () => {
  const accountId = useAccountId();

  const rewardsLabels = [
    { value: "3", text: "NEAR" },
    { value: "11", text: "BRRR" },
    { value: "7", text: "USN" },
    { value: "1.2", text: "USDC" },
    { value: "4.4", text: "Aurora" },
  ];

  return (
    <Stack direction="row" gap="2rem" px="1rem">
      <Liquidity />
      {accountId && (
        <>
          <APY />
          <Stat title="Daily Rewards" amount="$32" labels={rewardsLabels} />
          <HealthFactor />
        </>
      )}
    </Stack>
  );
};
