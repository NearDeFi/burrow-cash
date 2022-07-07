import { Stack } from "@mui/material";

import { StatsToggleButtons } from "./components";
import { useAccountId } from "../../../hooks/hooks";
import { StatsContainer } from "./stats";
import { InfoHog } from "./infohog";

export const Stats = () => {
  const accountId = useAccountId();

  return (
    <Stack mx={{ xs: "1rem", sm: "1.5rem" }} my={{ xs: "2rem" }} color="white" gap="2rem">
      <StatsToggleButtons />
      <Stack direction={{ xs: "column", [accountId ? "lg" : "sm"]: "row" }} gap="2rem">
        <StatsContainer />
        <InfoHog />
      </Stack>
    </Stack>
  );
};
