import { Box, Alert } from "@mui/material";

import { getTotalBRRR } from "../../redux/accountSelectors";
import { useAppSelector } from "../../redux/hooks";
import { TOKEN_FORMAT } from "../../store";

export default function TotalBRRR() {
  const [total, unclaimed] = useAppSelector(getTotalBRRR);

  return (
    <Box width={["100%", "520px"]} mx="auto" mb="2rem">
      <Alert severity="info">
        You&apos;ve earned: &nbsp;
        <b>{total.toLocaleString(undefined, TOKEN_FORMAT)} BRRR</b>&nbsp;
        <span>(unclaimed: {unclaimed.toLocaleString(undefined, TOKEN_FORMAT)})</span>
        <span>&nbsp;&nbsp; 🎉 💪 🌒</span>
      </Alert>
    </Box>
  );
}
