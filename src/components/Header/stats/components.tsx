import { isValidElement } from "react";
import { Box, Stack, ButtonGroup, Button, Typography } from "@mui/material";

import { useAccountId } from "../../../hooks/hooks";
import { useStatsToggle } from "../../../hooks/useStatsToggle";

const buttonStyles = {
  borderRadius: "3rem",
  px: "1.5rem",
  color: "white",
  borderColor: "#191f53",
  background: "#1f305a",
  fontSize: "1.23rem",
  textTransform: "none",
} as any;

const buttonActiveStyles = {
  background: "white",
  border: "2px solid #1f305a !important",
  color: "#191f53",
  "&:hover": {
    background: "white",
  },
};

export const StatsToggleButtons = () => {
  const { protocolStats, setStats } = useStatsToggle();
  const accountId = useAccountId();

  const msx = {
    ...buttonStyles,
    ...(protocolStats ? {} : buttonActiveStyles),
  };

  const psx = {
    ...buttonStyles,
    ...(protocolStats ? buttonActiveStyles : {}),
  };

  if (!accountId) return null;

  return (
    <ButtonGroup disableElevation variant="text" size="small">
      <Button sx={msx} onClick={() => setStats(false)}>
        My Stats
      </Button>
      <Button sx={psx} onClick={() => setStats(true)}>
        Protocol
      </Button>
    </ButtonGroup>
  );
};

export const Stat = ({
  title,
  amount,
  labels,
  onClick,
}: {
  title: string;
  amount: string;
  labels: any;
  onClick?: () => void;
}) => {
  const amountSize = amount.length < 9 ? "3rem" : "2rem";

  const amountSx = {
    fontSize: amountSize,
    lineHeight: "4.5rem",
  };

  return (
    <Stack
      maxWidth="260px"
      onClick={() => onClick && onClick()}
      sx={{ cursor: onClick ? "pointer" : "inherit" }}
    >
      <Typography color="#F8F9FF" fontSize="0.875rem">
        {title}
      </Typography>
      <Typography sx={amountSx} fontWeight="semibold">
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
