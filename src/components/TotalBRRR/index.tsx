import { Box, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { getTotalBRRR, isClaiming } from "../../redux/accountSelectors";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { TOKEN_FORMAT } from "../../store";
import { fetchAccount, farmClaimAll } from "../../redux/accountSlice";

export default function TotalBRRR({ showAction = false }) {
  const [total, unclaimed] = useAppSelector(getTotalBRRR);
  const isClaimingLoading = useAppSelector(isClaiming);
  const dispatch = useAppDispatch();

  const handleClaimAll = async () => {
    dispatch(farmClaimAll()).then(() => {
      dispatch(fetchAccount());
    });
  };

  return (
    <Box width={["100%", "520px"]} mx="auto" mb="2rem">
      <Alert severity="info">
        <Box display="flex" alignItems="center">
          <span>You&apos;ve earned: &nbsp;</span>
          <b>{total.toLocaleString(undefined, TOKEN_FORMAT)} BRRR</b>
          &nbsp;
          <span>(unclaimed: &nbsp;</span>
          <span>{unclaimed.toLocaleString(undefined, TOKEN_FORMAT)}</span>
          <Box mr="1rem">)</Box>
          {showAction && (
            <LoadingButton
              size="small"
              color="secondary"
              variant="outlined"
              onClick={handleClaimAll}
              loading={isClaimingLoading}
            >
              Claim all
            </LoadingButton>
          )}
        </Box>
      </Alert>
    </Box>
  );
}
