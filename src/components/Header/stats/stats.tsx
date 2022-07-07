import { Box, Stack } from "@mui/material";

// import { useAccountId } from "../../../hooks/hooks";
import { Stat } from "./components";
import { Liquidity } from "./liquidity";

export const StatsContainer = () => {
  // const accountId = useAccountId();

  const apyLabels = [
    { value: "3.5%", text: "Global" },
    { value: "1.9%", text: "Net TVL" },
  ];

  const rewardsLabels = [
    { value: "3", text: "NEAR" },
    { value: "11", text: "BRRR" },
    { value: "7", text: "USN" },
    { value: "1.2", text: "USDC" },
    { value: "4.4", text: "Aurora" },
  ];

  const hfLabels = <Box color="rgba(172, 255, 209, 1)">Good</Box>;

  return (
    <Stack direction="row" gap="2rem" px="1rem">
      <Liquidity />
      <Stat title="APY" amount="5.4%" labels={apyLabels} />
      <Stat title="Daily Rewards" amount="$32" labels={rewardsLabels} />
      <Stat title="Health Factor" amount="204%" labels={hfLabels} />
    </Stack>
  );
};
