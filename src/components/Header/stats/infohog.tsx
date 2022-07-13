import { Box, Button, Stack, Typography, Link } from "@mui/material";

import { useToggleInfo } from "../../../hooks/useToggleInfo";
import HogSvg from "./hog.svg";

export const InfoHog = () => {
  const { showInfo, setShowInfo } = useToggleInfo();

  return (
    <Stack ml="auto" direction="row" position="relative" width={{ sx: "auto", md: "400px" }}>
      <Stack
        bgcolor="white"
        p="1rem"
        gap="0.3rem"
        borderRadius="1rem"
        display={showInfo ? "inherit" : "none"}
      >
        <Typography color="#444444" fontSize="1rem" fontWeight="semibold">
          Introducing Net Liquidity Farming
        </Typography>
        <Typography color="rgba(68, 68, 68, 0.6)" fontSize="0.875rem" lineHeight="1.125rem">
          Effective from July 12th, Burrow will transition its rewards distribution model from
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
        sx={{ position: "absolute", cursor: "pointer", bottom: "-50px", right: "20px" }}
        onClick={() => setShowInfo(true)}
      >
        <HogSvg />
      </Box>
    </Stack>
  );
};
