import { Box } from "@mui/material";
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
    <Box
      width={["100%", "580px"]}
      mx="auto"
      mb="2rem"
      bgcolor="#e5f6fd"
      px="1rem"
      py={["1.5rem", "0.75rem"]}
      boxShadow="0px 1px 1px rgba(0, 7, 65, 0.1)"
      borderRadius="0.3rem"
      display="flex"
      alignItems="center"
      justifyContent={showAction ? "space-between" : "center"}
      flexDirection={["column", "row"]}
      fontSize="0.87rem"
    >
      <Box textAlign="center" mb={[showAction ? "1rem" : 0, 0]}>
        You&apos;ve earned: &nbsp;
        <b>{total.toLocaleString(undefined, TOKEN_FORMAT)} BRRR </b>
        (unclaimed: &nbsp;
        <span>{unclaimed.toLocaleString(undefined, TOKEN_FORMAT)}</span>)
      </Box>
      {showAction && (
        <LoadingButton
          size="small"
          color="secondary"
          variant="outlined"
          onClick={handleClaimAll}
          loading={isClaimingLoading}
          disabled={!unclaimed}
        >
          Claim all
        </LoadingButton>
      )}
    </Box>
  );
}
