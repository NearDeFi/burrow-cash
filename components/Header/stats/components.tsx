import { isValidElement } from "react";
import { Box, Stack, ButtonGroup, Button, Typography, Tooltip } from "@mui/material";
import { MdInfoOutline } from "@react-icons/all-files/md/MdInfoOutline";

import { useAccountId } from "../../../hooks/hooks";
import { useStatsToggle } from "../../../hooks/useStatsToggle";
import TokenIcon from "../../TokenIcon";

const buttonStyles = {
  borderRadius: "3rem",
  px: "1.5rem",
  color: "white",
  borderColor: "#191f53",
  background: "#1f305a",
  fontSize: "0.75rem",
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
    <ButtonGroup disableElevation variant="text" size="small" sx={{ height: "2rem" }}>
      <Button sx={msx} onClick={() => setStats(false)}>
        My Stats
      </Button>
      <Button sx={psx} onClick={() => setStats(true)}>
        Protocol
      </Button>
    </ButtonGroup>
  );
};

const COLORS = {
  green: {
    bgcolor: "rgba(172, 255, 255, 0.1)",
    color: "#ACFFD1",
  },
  yellow: {
    bgcolor: "rgba(255, 255, 172, 0.1)",
    color: "#FFAC00",
  },
  red: {
    bgcolor: "rgba(255, 172, 172, 0.1)",
    color: "#FFACAC",
  },
};

const getColor = (color = "green") => COLORS[color];

export const Stat = ({
  title,
  titleTooltip = "",
  amount,
  tooltip = "",
  labels,
  onClick,
}: {
  title: string | React.ReactElement;
  titleTooltip?: string | React.ReactElement;
  amount: string;
  tooltip?: string;
  labels?: any;
  onClick?: () => void;
}) => {
  const renderLabel = (label, key) => (
    <Label
      key={key}
      ml={label.icon ? "10px" : 0}
      bgcolor={getColor(label.color).bgcolor}
      tooltip={label.tooltip}
    >
      {label.icon && (
        <Box position="absolute" top="0" left="-10px" borderRadius={19} border="0.5px solid white">
          <TokenIcon width={19} height={19} icon={label.icon} />
        </Box>
      )}
      <Box
        component="span"
        color={getColor(label.color).color}
        fontWeight={600}
        pl={label.icon ? "10px" : 0}
      >
        {label.value}
      </Box>
      <Box component="span" fontWeight={400}>
        {label.text}
      </Box>
    </Label>
  );

  return (
    <Stack onClick={() => onClick && onClick()} sx={{ cursor: onClick ? "pointer" : "inherit" }}>
      <Stack height={40} justifyContent="end">
        <Tooltip
          title={titleTooltip}
          placement="top"
          arrow
          componentsProps={{
            tooltip: { style: { backgroundColor: "rgba(255,255,255,0.1)" } },
            arrow: { style: { color: "rgba(255,255,255,0.1)" } },
          }}
        >
          <Stack direction="row" alignItems="end" width="max-content">
            {typeof title === "string" ? (
              <Typography color="#F8F9FF" fontSize="0.875rem">
                {title}
              </Typography>
            ) : (
              title
            )}
            {titleTooltip && (
              <MdInfoOutline
                style={{
                  marginLeft: "3px",
                  color: "white",
                  position: "relative",
                  top: "-6px",
                }}
              />
            )}
          </Stack>
        </Tooltip>
      </Stack>
      <Tooltip title={tooltip} placement="top" arrow>
        <Typography
          sx={{
            fontSize: "3rem",
            lineHeight: "4.5rem",
            fontWeight: "semibold",
          }}
        >
          {amount}
        </Typography>
      </Tooltip>
      {labels && (
        <Stack direction="row" gap="4px" flexWrap="wrap">
          {isValidElement(labels) ? (
            <Label>{labels}</Label>
          ) : (
            labels.map((row, key) => (
              <Stack direction="row" flexWrap="wrap" gap="4px" key={key}>
                {row.map(renderLabel)}
              </Stack>
            ))
          )}
        </Stack>
      )}
    </Stack>
  );
};

const Label = ({ children, tooltip = "", bgcolor = "rgba(172, 255, 255, 0.1)", ...props }) => (
  <Tooltip title={tooltip} placement="top" arrow>
    <Stack
      direction="row"
      gap="4px"
      bgcolor={bgcolor}
      borderRadius="4px"
      py="4px"
      px="6px"
      fontSize="0.6875rem"
      position="relative"
      {...props}
    >
      {children}
    </Stack>
  </Tooltip>
);
