import { Typography, Stack, Box, useTheme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useLayoutEffect, useState } from "react";
import { TOKEN_FORMAT } from "../../store";
import { useAppSelector } from "../../redux/hooks";
import { getAccountRewards } from "../../redux/selectors/getAccountRewards";

export const BrrrLogo = ({ color = "#594A42", width = 48, height = 48 }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ width, height }} viewBox="0 0 48 48">
      <path
        d="M24 0C10.733 0 0 10.733 0 24c0 9.667 5.733 18 14 21.8-2.733-4.467-7.667-13.733-7.267-22 .4-9.4 7.334-14.2 13.6-15.533C26.733 6.933 35 7.6 37.067 13.933c2.4 7.4-9.467 11.8-10 12-.6.2-6.134 2.267-9.334.8a4.175 4.175 0 0 1-2.133-2.266c-.533-1.4-.2-2.934.867-4.2 2.6-3.134 9.266-4.534 16.2-3.4-.467 1-1.6 2-2.934 2.866-5.666-.4-9.666 1.134-10.866 2.6-.467.6-.334.934-.334 1.067.067.133.134.333.467.467 1.6.733 5.333-.267 6.933-.867.134-.067 9.534-3.6 8.067-8.067-1.533-4.666-8.933-4.466-13.067-3.6-2.466.534-10.666 3-11.133 12.6-.267 7.4 5.6 18.134 8.8 23.467 1.733.4 3.533.6 5.4.6 13.267 0 24-10.733 24-24S37.267 0 24 0Zm16.467 30.2c-3.934 6-10.134 7.6-15.334 7.6-3.2 0-6-.533-7.866-1.067-.867-.2-1.334-1.066-1.134-1.933.2-.867 1.067-1.333 1.934-1.133 12.2 3.133 17.6-1.934 19.8-5.2.866-1.334 1.2-2.867.866-4.2-.333-1.267-1.066-2.267-2.266-3 .733-.8 1.266-1.734 1.666-2.667 2.267 1.4 3.267 3.333 3.667 5 .467 2.2 0 4.6-1.333 6.6Z"
        fill={color}
      />
    </svg>
  );
};

export const StakingPill = ({ children, sx = {} }) => (
  <Typography
    sx={{
      fontWeight: "semibold",
      fontSize: "0.65rem",
      background: "#9b8579",
      color: "#fff",
      py: "0.5rem",
      px: "0.8rem",
      borderRadius: 100,
      ...sx,
    }}
  >
    {children}
  </Typography>
);

export const StakingCard = ({
  value,
  color = "#9b8579",
  label,
  buttonLabel,
  onClick,
  isDisabled = false,
  isLoading = false,
}) => {
  const theme = useTheme();

  return (
    <Stack
      spacing={2}
      sx={{
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.15)",
        p: "1.5rem",
        minWidth: "200px",
        alignItems: "center",
        borderRadius: "0.5rem",
        bgcolor: theme.custom.stakingCardBg,
      }}
    >
      <BrrrLogo color={color} width={40} height={40} />
      <Typography fontSize="1.2rem" fontWeight="semibold" color={color}>
        {value}
      </Typography>
      <Typography fontSize="0.65rem" color="#767676">
        {label}
      </Typography>
      <LoadingButton
        size="small"
        variant="contained"
        onClick={onClick}
        sx={{ minWidth: 130 }}
        disabled={isDisabled}
        loading={isLoading}
      >
        {buttonLabel}
      </LoadingButton>
    </Stack>
  );
};

export const LiveUnclaimedAmount = ({ addAmount = 0 }) => {
  const rewards = useAppSelector(getAccountRewards);
  const { unclaimedAmount = 0, dailyAmount = 0 } = rewards.brrr;
  const [unclaimed, setUnclaimed] = useState<number>(unclaimedAmount);

  const count = dailyAmount / 24 / 3600 / 10;

  useLayoutEffect(() => {
    setUnclaimed(unclaimedAmount);
    const timer = setInterval(() => setUnclaimed((u) => u + count), 60);
    return () => clearInterval(timer);
  }, [unclaimedAmount]);

  return <span>{(addAmount + unclaimed).toLocaleString(undefined, TOKEN_FORMAT)}</span>;
};

export const Separator = ({ sx = {} }) => (
  <Box
    flex={1}
    mx={1}
    height="1px"
    bgcolor="rgba(0, 0, 0, 0.01)"
    border="0.5px dashed rgba(0, 0, 0, 0.1)"
    sx={sx}
  />
);
