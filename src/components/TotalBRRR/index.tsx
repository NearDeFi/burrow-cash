import { Box, Alert } from "@mui/material";

import { getTotalBRRR } from "../../redux/accountSelectors";
import { useAppSelector } from "../../redux/hooks";
import { TOKEN_FORMAT } from "../../store";

export default function TotalBRRR() {
  const totalBRRR = useAppSelector(getTotalBRRR);

  return (
    <Box width={["100%", "520px"]} mx="auto" mb="2rem">
      <Alert severity="info">
        You&apos;ve earned: &nbsp;
        <b>{totalBRRR?.toLocaleString(undefined, TOKEN_FORMAT)} BRRR</b>
        <span>&nbsp;&nbsp; 🎉 💪 🌒</span>
      </Alert>
    </Box>
  );
}
