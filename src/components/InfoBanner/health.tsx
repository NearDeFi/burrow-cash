import { Box, Typography } from "@mui/material";

import { useSlimStats } from "../../hooks";

interface Props {
  value: number | null;
}

export const HealthFactor = ({ value }: Props) => {
  const slimStats = useSlimStats();

  const healthFactorDisplayValue =
    value === -1 || value === null
      ? "N/A"
      : `${value?.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
  const healthFactorColor =
    value === -1 || value === null
      ? "green"
      : value < 180
      ? "red"
      : value < 200
      ? "orange"
      : "green";

  const subtitle =
    value === -1 || value === null ? (
      <>&nbsp;</>
    ) : value < 180 ? (
      "(Low)"
    ) : value < 200 ? (
      "(Medium)"
    ) : (
      "(Good)"
    );

  const dotSize = "0.7rem";

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <Box
          bgcolor={healthFactorColor}
          width={dotSize}
          height={dotSize}
          mr="0.5rem"
          borderRadius={dotSize}
          component="div"
        />
        <Typography fontSize="1.5rem" fontWeight="bold" align="right">
          {healthFactorDisplayValue}
        </Typography>
      </Box>
      {!slimStats && (
        <Typography fontWeight="light" fontSize="0.85rem" align="center">
          Health Factor {subtitle}
        </Typography>
      )}
    </Box>
  );
};
