import { Box, Button, Stack, Typography } from "@mui/material";

import { useToggleInfo } from "../../../hooks/useToggleInfo";
import { useAccountId } from "../../../hooks/hooks";
import HogSvg from "./hog.svg";

export const InfoHog = () => {
  const { showInfo, setShowInfo } = useToggleInfo();
  const accountId = useAccountId();

  return (
    <Stack
      ml={{ xs: 0, [accountId ? "lg" : "sm"]: "auto" }}
      direction="row"
      position="relative"
      width="300px"
    >
      <Stack
        bgcolor="white"
        p="1rem"
        gap="0.5rem"
        borderRadius="1rem"
        display={showInfo ? "block" : "none"}
      >
        <Typography color="#444444" fontSize="1rem" fontWeight="semibold">
          Lorem ipsum!
        </Typography>
        <Typography color="rgba(68, 68, 68, 0.6)" fontSize="0.875rem" lineHeight="1.125rem">
          Dolor sit amet, consectetur adipiscin elit. Integer ultricies fringilla urna pulvinar
          efficitur.
        </Typography>
        <Button
          variant="text"
          sx={{ width: "40px", ml: "-0.5rem" }}
          onClick={() => setShowInfo(false)}
        >
          Got it
        </Button>
      </Stack>
      <Box
        sx={{ position: "absolute", cursor: "pointer", bottom: "-50px", right: "20px" }}
        onClick={() => setShowInfo(true)}
      >
        <HogSvg />
      </Box>
    </Stack>
  );
};
