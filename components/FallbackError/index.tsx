import { Alert, Box, Stack, Typography, Button } from "@mui/material";

import SadHog from "./sad-hog.svg";

const FallbackError = ({ error }) => {
  const resetSession = () => {
    localStorage.removeItem("persist:root");
    window.location.reload();
  };

  return (
    <Stack gap={0.5} direction="column" alignItems="center" justifyContent="center" height="100vh">
      <SadHog />
      <Typography fontSize="1rem">Ooops! Something went wrong.</Typography>
      <Button size="small" variant="contained" onClick={resetSession}>
        Click here to reload your session
      </Button>
      <Box maxWidth="400px" mt="1rem">
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
