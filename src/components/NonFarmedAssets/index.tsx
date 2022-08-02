import { Alert, Stack, Typography, Link } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useNonFarmedAssets } from "../../hooks/hooks";
import ClaimAllRewards from "../ClaimAllRewards";
import { USD_FORMAT } from "../../store/constants";

function NonFarmedAssets() {
  const { hasNonFarmedAssets, liquidity, assets } = useNonFarmedAssets();
  const negativeLiquidity = liquidity < 0;

  if (!hasNonFarmedAssets) return null;

  return (
    <Stack gap={1} sx={{ maxWidth: 650, width: ["auto", "100%"], mx: [2, "auto"] }}>
      {negativeLiquidity && (
        <Alert severity="error">
          <Stack gap="1">
            <Typography fontSize="0.85rem">
              Your adjusted net liquidity is{" "}
              <b>{liquidity.toLocaleString(undefined, USD_FORMAT)}</b> which is below 0.
            </Typography>
            <Typography fontSize="0.85rem">
              The following assets have the net liquidity coefficient below 1:
              <Stack gap={1} component="span" direction="row" display="inline-flex" ml={1}>
                {assets.map((asset) => (
                  <span key={asset.token_id}>
                    {asset.metadata.symbol} ({asset.config.net_tvl_multiplier / 10000})
                  </span>
                ))}
              </Stack>
            </Typography>
            <Typography fontSize="0.85rem">
              In order to start farming the net liquidity rewards you need to have a positive
              balance.
            </Typography>
            <Typography fontSize="0.85rem">
              For more information about the net liquidity coefficients{" "}
              <Link
                href="https://burrowcash.medium.com/net-liquidity-farming-part-2-varied-coefficients-6b839ae2178b"
                target="_blank"
                color="#000"
                fontWeight={500}
              >
                click here
              </Link>
            </Typography>
          </Stack>
        </Alert>
      )}
      <Alert severity="warning">
        <Stack direction={["column", "row"]} sx={{ alignItems: "center" }}>
          <Typography fontSize="0.85rem">
            At least one of your farms has started emitting extra rewards. If you are seeing this
            warning, please click &quot;Claim All Rewards&quot; to join the new farm.
          </Typography>
          <ClaimAllRewards
            location="non-farmed-assets"
            Button={ClaimButton}
            disabled={negativeLiquidity}
          />
        </Stack>
      </Alert>
    </Stack>
  );
}

const ClaimButton = (props) => (
  <LoadingButton
    size="small"
    color="secondary"
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
