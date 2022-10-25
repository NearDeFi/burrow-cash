import { createTheme } from "@mui/material/styles";

import { ITheme } from "../redux/appSlice";

const defaultTheme = createTheme();

const light = {
  mode: "light",
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
};

const dark = {
  mode: "light",
  primary: {
    main: "#47C880",
    light: "#000",
  },
  secondary: {
    main: "#fff",
  },
  info: {
    main: "#ababab",
  },
  background: {
    default: "#F8F9FF",
  },
};

export const themeOptions = (t: ITheme) => ({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1080,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: t === "light" ? light : dark,
});

export default (t: ITheme) => createTheme(defaultTheme, themeOptions(t));
