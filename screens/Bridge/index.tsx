import { Box, Stack, Link, Card, CardContent, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import RainbowBridgeSvg from "./rainbow-bridge.svg";

const Bridge = () => {
  return (
    <Card sx={{ maxWidth: "500px", mx: ["1rem", "auto"], my: "2rem" }}>
      <CardContent>
        <Stack spacing="1rem">
          <Typography>
            Bridge from <b>Ethereum / Aurora</b>
          </Typography>
          <Typography fontSize="0.85rem" color="grey.700">
            The Rainbow Bridge is the official bridge for transferring tokens between Ethereum, NEAR
            and the Aurora networks.
          </Typography>
          <Link
            href="https://rainbowbridge.app/transfer"
            title="Rainbow Bridge"
            target="_blank"
            color="#000"
            display="flex"
            alignItems="center"
          >
            <Box width="40px" mr="1rem">
              <RainbowBridgeSvg />
            </Box>
            <span>Rainbow Bridge</span>
            <OpenInNewIcon fontSize="small" sx={{ ml: "0.5rem" }} />
          </Link>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Bridge;
