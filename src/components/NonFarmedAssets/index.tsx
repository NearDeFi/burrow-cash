import { Alert, Box, Typography } from "@mui/material";

import { useNonFarmedAssets } from "../../hooks";

function NonFarmedAssets() {
  const hasNonFarmedAssets = useNonFarmedAssets();

  if (!hasNonFarmedAssets) return null;

  return (
    <Box maxWidth={650} width={["auto", "100%"]} mx={[2, "auto"]}>
      <Alert severity="warning">
        <Typography fontSize="0.85rem">
          You have non farmed asssets. Use <b>Claim All Rewards</b> option from the menu to start
          all farms.
        </Typography>
      </Alert>
    </Box>
  );
}

export default NonFarmedAssets;
