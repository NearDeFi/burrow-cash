import { Box, Alert, Link, useTheme } from "@mui/material";

import { isBeta } from "../../store";

const BetaInfo = () => {
  const theme = useTheme();
  const width = ["100%", "580px"];

  if (!isBeta) return null;
  return (
    <Box width={width} mx="auto" mt="1rem" mb="1rem">
      <Alert severity="error">
        This page loads the <b>beta contract</b>. Withdraw your funds from the beta and move to
        mainnet:{" "}
        <Link
          href="https://app.burrow.cash"
          title="Burrow Cash"
          target="_blank"
          fontWeight="bold"
          color={theme.palette.primary.main}
        >
          app.burrow.cash
        </Link>
      </Alert>
    </Box>
  );
};

export default BetaInfo;
