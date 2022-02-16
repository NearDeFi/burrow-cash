import { Box, Alert, Skeleton, Button } from "@mui/material";

import { getTotalBRRR } from "../../redux/accountSelectors";
import { useAppSelector } from "../../redux/hooks";
import { TOKEN_FORMAT } from "../../store";
import { useLoading } from "../../hooks";
import { farmClaimAll } from "../../api/farms";

export default function TotalBRRR({ showAction = false }) {
  const [total, unclaimed] = useAppSelector(getTotalBRRR);
  const isLoading = useLoading();

  const handleClaimAll = async () => {
    await farmClaimAll();
  };

  return (
    <Box width={["100%", "520px"]} mx="auto" mb="2rem">
      <Alert severity="info">
        <Box display="flex" alignItems="center">
          <span>You&apos;ve earned: &nbsp;</span>
          {isLoading ? (
            <Skeleton sx={{ bgcolor: "gray" }} width={70} />
          ) : (
            <b>{total.toLocaleString(undefined, TOKEN_FORMAT)} BRRR</b>
          )}
          &nbsp;
          <span>(unclaimed: &nbsp;</span>
          {isLoading ? (
            <Skeleton sx={{ bgcolor: "gray" }} width={70} />
          ) : (
            <span>{unclaimed.toLocaleString(undefined, TOKEN_FORMAT)}</span>
          )}
          <Box mr="1rem">)</Box>
          {showAction && (
            <Button size="small" color="secondary" variant="outlined" onClick={handleClaimAll}>
              Claim all
            </Button>
          )}
        </Box>
      </Alert>
    </Box>
  );
}
