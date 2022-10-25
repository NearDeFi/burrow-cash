import { Box } from "@mui/material";

import { useDarkMode } from "../../hooks/hooks";
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
