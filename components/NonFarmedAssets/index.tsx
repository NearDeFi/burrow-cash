import { Alert, Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useNonFarmedAssets } from "../../hooks/hooks";
import ClaimAllRewards from "../ClaimAllRewards";

function NonFarmedAssets() {
  const { hasNonFarmedAssets, hasNegativeNetLiquidity } = useNonFarmedAssets();

  if (!hasNonFarmedAssets || hasNegativeNetLiquidity) return null;

  return (
    <Stack gap={1} sx={{ maxWidth: 650, width: ["auto", "100%"], mx: [2, "auto"] }}>
      <Alert severity="warning">
        <Stack direction={["column", "row"]} sx={{ alignItems: "center" }}>
          <Typography fontSize="0.85rem">
            At least one of your farms has started emitting extra rewards. If you are seeing this
            warning, please click &quot;Claim All Rewards&quot; to join the new farm.
          </Typography>
          <ClaimAllRewards
            location="non-farmed-assets"
            Button={ClaimButton}
            disabled={hasNegativeNetLiquidity}
          />
        </Stack>
      </Alert>
    </Stack>
  );
}

const ClaimButton = (props) => (
  <LoadingButton
    size="small"
    color="primary"
    variant="outlined"
    sx={{
      display: "flex",
      width: "260px",
      height: "40px",
      alignItems: "center",
      justifyContent: "center",
      mt: [2, 0],
      ml: [0, 1],
    }}
    {...props}
  >
    <Typography sx={{ display: "flex", fontSize: "0.8rem", textTransform: "none" }}>
      Claim All Rewards
    </Typography>
  </LoadingButton>
);

export default NonFarmedAssets;
