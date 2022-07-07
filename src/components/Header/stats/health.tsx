import { Box } from "@mui/material";

import { useUserHealth } from "../../../hooks/useUserHealth";
import { Stat } from "./components";

export const HealthFactor = () => {
  const { healthFactor } = useUserHealth();

  const amount =
    healthFactor === -1 || healthFactor === null
      ? "N/A"
      : `${healthFactor?.toLocaleString(undefined, {
          maximumFractionDigits: healthFactor <= 105 ? 2 : 0,
        })}%`;

  const color =
    healthFactor === -1 || healthFactor === null
      ? "rgba(172, 255, 209, 1)"
      : healthFactor < 180
      ? "pink"
      : healthFactor < 200
      ? "orange"
      : "rgba(172, 255, 209, 1)";

  const label =
    healthFactor === -1 || healthFactor === null
      ? "n/a"
      : healthFactor < 180
      ? "Low"
      : healthFactor < 200
      ? "Medium"
      : "Good";

  const hfLabels = <Box color={color}>{label}</Box>;

  return <Stat title="Health Factor" amount={amount} labels={hfLabels} />;
};
