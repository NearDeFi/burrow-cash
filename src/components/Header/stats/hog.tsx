import { Box, Button, Stack, Typography } from "@mui/material";

import HogSvg from "./hog.svg";

export const Hog = () => {
  return (
    <Stack
      bgcolor="white"
      width="300px"
      p="1rem"
      gap="0.5rem"
      borderRadius="1rem"
      position="relative"
      ml={{ xs: 0, lg: "auto" }}
    >
      <Typography color="#444444" fontSize="1rem" fontWeight="semibold">
        Lorem ipsum!
      </Typography>
      <Typography color="rgba(68, 68, 68, 0.6)" fontSize="0.875rem" lineHeight="1.125rem">
        Dolor sit amet, consectetur adipiscin elit. Integer ultricies fringilla urna pulvinar
        efficitur.
      </Typography>
      <Button variant="text" sx={{ width: "40px", ml: "-0.5rem" }}>
        Got it
      </Button>
      <Box position="absolute" right="20px" bottom="-50px">
        <HogSvg />
      </Box>
    </Stack>
  );
};
