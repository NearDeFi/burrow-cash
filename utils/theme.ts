import { createTheme } from "@mui/material/styles";

const defaultTheme = createTheme();

export const themeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1080,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    type: "light",
    primary: {
      main: "#47C880",
      light: "#D5EFE6",
    },
    secondary: {
      main: "#000741",
    },
    info: {
      main: "#ababab",
    },
    background: {
      default: "#F8F9FF",
    },
  },
};

export default createTheme(defaultTheme, themeOptions);
