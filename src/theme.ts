import { createTheme } from "@mui/material/styles";

const defaultTheme = createTheme();

export const themeOptions = {
  palette: {
    type: "light",
    primary: {
      main: "#47C880",
      light: "#D5EFE6",
    },
    secondary: {
      main: "#000741",
    },
    background: {
      default: "#F8F9FF",
    },
  },
};

export default createTheme(defaultTheme, themeOptions);
