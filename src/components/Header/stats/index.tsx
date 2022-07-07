import { Stack } from "@mui/material";

import { StatsToggleButtons, StatsContainer } from "./components";

export const Stats = () => {
  return (
    <Stack mx={{ xs: "1rem", sm: "1.5rem" }} my={{ xs: "2rem" }} color="white" gap="2rem">
      <StatsToggleButtons />
      <StatsContainer />
    </Stack>
  );
};
