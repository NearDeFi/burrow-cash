import { Alert, Box, Stack, Typography } from "@mui/material";

import SadHog from "./sad-hog.svg";

const FallbackError = ({ error }) => {
  return (
    <Stack direction="column" alignItems="center" justifyContent="center" height="100vh">
      <SadHog />
      <Typography fontSize="1rem">Ooops! Something went wrong.</Typography>
      <Box maxWidth="400px" mt={2}>
        <Alert severity="error">
          <Typography color="red" fontSize="0.7rem">
            {error.message}
          </Typography>
        </Alert>
      </Box>
    </Stack>
  );
};

export default FallbackError;
