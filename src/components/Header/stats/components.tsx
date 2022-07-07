import { isValidElement } from "react";
import { Box, Stack, ButtonGroup, Button, Typography } from "@mui/material";

const buttonStyles = {
  borderRadius: "3rem",
  px: "1.5rem",
  color: "white",
  borderColor: "#191f53",
  background: "#1f305a",
  fontSize: "1.23rem",
};

const buttonActiveStyles = {
  background: "white",
  border: "2px solid #1f305a !important",
  color: "#191f53",
  "&:hover": {
    background: "white",
  },
};

export const StatsToggleButtons = () => {
  return (
    <ButtonGroup disableElevation variant="text" size="small">
      <Button sx={{ ...buttonStyles, textTransform: "none", ...buttonActiveStyles }}>
        My Stats
      </Button>
      <Button sx={{ ...buttonStyles, textTransform: "none" }}>Protocol</Button>
    </ButtonGroup>
  );
};

export const StatsContainer = () => {
  const netLabels = [
    { value: "18k", text: "Deposited" },
    { value: "12k", text: "Borrowed" },
  ];

  const apyLabels = [
    { value: "3.5%", text: "Global" },
    { value: "1.9%", text: "Net TVL" },
  ];

  const rewardsLabels = [
    { value: "3", text: "NEAR" },
    { value: "11", text: "BRRR" },
    { value: "7", text: "USN" },
    { value: "1.2", text: "USDC" },
    { value: "4.4", text: "Aurora" },
  ];

  const hfLabels = <Box color="rgba(172, 255, 209, 1)">Good</Box>;

  return (
    <Stack direction="row" gap="2rem" px="1rem">
      <Stat title="Net Liquidity" amount="$12K" labels={netLabels} />
      <Stat title="APY" amount="5.4%" labels={apyLabels} />
      <Stat title="Daily Rewards" amount="$32" labels={rewardsLabels} />
      <Stat title="Health Factor" amount="204%" labels={hfLabels} />
    </Stack>
  );
};

const Stat = ({ title, amount, labels }) => {
  return (
    <Stack maxWidth="200px">
      <Typography color="#F8F9FF" fontSize="0.875rem">
        {title}
      </Typography>
      <Typography fontSize="3rem" fontWeight="semibold">
        {amount}
      </Typography>
      {labels && (
        <Stack direction="row" gap="4px" flexWrap="wrap">
          {isValidElement(labels) ? (
            <Label>{labels}</Label>
          ) : (
            labels.map((label, key) => (
              <Label key={key}>
                <Box component="span" color="#ACFFD1" fontWeight={600}>
                  {label.value}
                </Box>
                <Box component="span" fontWeight={400}>
                  {label.text}
                </Box>
              </Label>
            ))
          )}
        </Stack>
      )}
    </Stack>
  );
};

const Label = ({ children }) => (
  <Stack
    direction="row"
    gap="4px"
    bgcolor="rgba(172, 255, 255, 0.1)"
    borderRadius="4px"
    py="4px"
    px="6px"
    fontSize="0.6875rem"
  >
    {children}
  </Stack>
);
