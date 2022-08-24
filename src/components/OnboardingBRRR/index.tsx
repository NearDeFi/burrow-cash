import { Box, Stack, useTheme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

export default function OnboardingBRRR() {
  const theme = useTheme();

  return (
    <Box
      width={["full", "full", "600px"]}
      mx={["1rem", "2rem", "auto"]}
      mb="2rem"
      bgcolor="#e5f6fd"
      px="1rem"
      py={["1.5rem", "0.75rem"]}
      boxShadow="0px 2px 4px rgba(0, 7, 65, 0.1)"
      borderRadius="4px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexDirection={["column", "row"]}
      fontSize="0.87rem"
    >
      <Stack spacing={1} mb={["1rem", 0]} mr={[0, "0.5rem"]}>
        <Box textAlign="left">
          <span style={{ fontWeight: "bold", color: theme.palette.primary.main }}>
            Earn $BRRR rewards
          </span>{" "}
          by supplying and borrowing assets on Burrow.
          <Box textAlign="left" pt="0.75rem">
            Up to 50% of the total supply will be distributed to users and supporters!
          </Box>
        </Box>
      </Stack>
      <LoadingButton
        size="small"
        color="secondary"
        variant="outlined"
        target="_blank"
        href="https://burrowcash.medium.com/a-high-level-overview-of-brrr-tokenomics-b9b12abec3b6"
      >
        <Box whiteSpace="nowrap" px="1rem">
          LEARN MORE
        </Box>
      </LoadingButton>
    </Box>
  );
}
