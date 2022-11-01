import { Box, Stack } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { useDarkMode } from "../../hooks/hooks";
import { StyledMenuItem } from "../Header/style";
import DarkIcon from "./dark.svg";
import LightIcon from "./light.svg";

export default function DarkSwitch() {
  const { theme, toggle } = useDarkMode();

  return (
    <Box
      sx={{
        display: { xs: "none", sm: "flex" },
        cursor: "pointer",
        ml: "auto",
        alignItems: "center",
      }}
      onClick={toggle}
    >
      {theme === "light" ? <DarkIcon /> : <LightIcon />}
    </Box>
  );
}

export const DarkModeMenuItem = () => {
  const { theme, toggle } = useDarkMode();
  return (
    <StyledMenuItem onClick={toggle}>
      <Stack direction="row" justifyContent="space-between" flex="1">
        <span>Toggle {theme === "light" ? "Dark" : "Light"} Mode</span>
        {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </Stack>
    </StyledMenuItem>
  );
};
