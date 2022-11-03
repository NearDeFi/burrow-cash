import { Box, Button, Stack, Typography, Link } from "@mui/material";

import { useToggleInfo } from "../../../hooks/useToggleInfo";
import { useDarkMode } from "../../../hooks/hooks";
import HogSvg from "./hog.svg";
import HogLowSvg from "./hog-low.svg";
import HogLowFaceSvg from "./hog-low-face.svg";

export const InfoHog = () => {
  const { showInfo, setShowInfo } = useToggleInfo();
  const { isDark } = useDarkMode();

  return (
    <Stack ml="auto" direction="row" position="relative" width={{ sx: "auto", md: "400px" }}>
      <Stack
        bgcolor="background.default"
        p="1rem"
        gap="0.3rem"
        borderRadius="1rem"
        display={showInfo ? "inherit" : "none"}
      >
        <Typography color="secondary.main" fontSize="1rem" fontWeight="semibold">
          Introducing Net Liquidity Farming
        </Typography>
        <Typography color="info.main" fontSize="0.875rem" lineHeight="1.125rem">
          Effective from July 13th, Burrow will transition its rewards distribution model from
          “total deposits farming” to “net liquidity farming.{" "}
          <Link
            href="https://burrowcash.medium.com/introducing-net-liquidity-farming-on-burrow-cbacbfdebd97"
            target="blank"
          >
            Read more
          </Link>
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
        sx={{
          position: "absolute",
          right: "20px",
          bottom: "-32px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            cursor: "pointer",
            mb: isDark ? "-4px" : "-20px",
          }}
          onClick={() => setShowInfo(true)}
        >
          {isDark ? <HogLowSvg /> : <HogSvg />}
        </Box>
      </Box>
      {isDark && (
        <Box
          sx={{ position: "absolute", right: "37px", bottom: "-44px", cursor: "pointer" }}
          onClick={() => setShowInfo(true)}
        >
          <HogLowFaceSvg />
        </Box>
      )}
    </Stack>
  );
};
