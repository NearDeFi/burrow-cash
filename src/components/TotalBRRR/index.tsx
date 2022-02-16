import { Box, Alert, Skeleton } from "@mui/material";

import { getTotalBRRR } from "../../redux/accountSelectors";
import { useAppSelector } from "../../redux/hooks";
import { TOKEN_FORMAT } from "../../store";
import { useLoading } from "../../hooks";

export default function TotalBRRR() {
  const [total, unclaimed] = useAppSelector(getTotalBRRR);
  const isLoading = useLoading();

  return (
    <Box width={["100%", "520px"]} mx="auto" mb="2rem">
      <Alert severity="info">
        <Box display="flex" justifyItems="center">
          <span>You&apos;ve earned: &nbsp;</span>
          {isLoading ? (
            <Skeleton sx={{ bgcolor: "gray", justifyItems: "center" }} width={80} />
          ) : (
            <b>{total.toLocaleString(undefined, TOKEN_FORMAT)} BRRR</b>
          )}
          &nbsp;
          <span>(unclaimed: &nbsp;</span>
          {isLoading ? (
            <Skeleton sx={{ bgcolor: "gray", justifyItems: "center" }} width={80} />
          ) : (
            <span>{unclaimed.toLocaleString(undefined, TOKEN_FORMAT)}</span>
          )}
          <span>)&nbsp;&nbsp; 🎉 💪 🌒</span>
        </Box>
      </Alert>
    </Box>
  );
}
