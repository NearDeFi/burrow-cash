import { useEffect, useState } from "react";
import { useInterval } from "react-use";
import { Typography, Box, useTheme } from "@mui/material";

import { getLocalAppVersion, getRemoteAppVersion } from "../../utils";

const REFETCH_INTERVAL = 10 * 60e3;

const CheckNewAppVersion = () => {
  const [isNew, setIsNew] = useState(false);
  const localAppVersion = getLocalAppVersion();
  const theme = useTheme();

  const checkAppVersion = async () => {
    const remoteAppVersion = await getRemoteAppVersion();

    if (remoteAppVersion !== localAppVersion) {
      setIsNew(true);
    }
  };

  useEffect(() => {
    checkAppVersion();
  }, []);

  useInterval(checkAppVersion, REFETCH_INTERVAL);

  if (!isNew) return null;

  return (
    <Box
      position="fixed"
      bottom="0"
      width="100%"
      display="grid"
      bgcolor={theme.palette.background.default}
      justifyContent="center"
      py="0.5rem"
      px="3rem"
    >
      <Typography
        textAlign="center"
        fontSize="0.85rem"
        fontWeight="bold"
        color={theme.palette.primary.main}
        sx={{ cursor: "pointer" }}
        onClick={() => window.location.reload()}
      >
        🚀 A new version of the app is available. Click here to reload! 🚀
      </Typography>
    </Box>
  );
};

export default CheckNewAppVersion;
