import { Box, useTheme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import ClaimAllRewards from "../ClaimAllRewards";
import { getAccountRewards, getTotalBRRR } from "../../redux/accountSelectors";
import { useAppSelector } from "../../redux/hooks";
import { TOKEN_FORMAT } from "../../store";

const ClaimButton = (props) => (
  <LoadingButton size="small" color="secondary" variant="outlined" {...props}>
    Claim all
  </LoadingButton>
);

export default function TotalBRRR() {
  const [total] = useAppSelector(getTotalBRRR);
  const rewards = useAppSelector(getAccountRewards);
  const theme = useTheme();

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
      justifyContent="space-between"
      flexDirection={["column", "row"]}
      fontSize="0.87rem"
    >
      <Box textAlign="center" mb={[2, 0]}>
        You&apos;ve earned: &nbsp;
        <b>{total.toLocaleString(undefined, TOKEN_FORMAT)} BRRR </b>
        <Box display={["block", "inline"]} mt={[0.5, 0]} color={theme.palette.grey[800]}>
          (unclaimed: {rewards.brrr?.unclaimedAmount.toLocaleString(undefined, TOKEN_FORMAT)})
        </Box>
      </Box>
      <ClaimAllRewards location="staking" Button={ClaimButton} />
    </Box>
  );
}
