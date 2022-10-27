import { createTheme } from "@mui/material/styles";

import { ITheme } from "../redux/appSlice";

const defaultTheme = createTheme();

const palette = {
  light: {
    mode: "light",
    primary: {
      main: "#47C880",
      light: "#D5EFE6",
    },
    secondary: {
      main: "#000741",
    },
    info: {
      main: "#444",
    },
    background: {
      default: "#F8F9FF",
      paper: "#fff",
    },
  },
  dark: {
    mode: "light",
    primary: {
      main: "#47C880",
      light: "#000",
    },
    secondary: {
      main: "#fff",
    },
    info: {
      main: "#c1c2ce",
    },
    background: {
      default: "#1b1d3a",
      paper: "#1b1d3a",
    },
  },
};

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      headerGradient: {
        from: string;
        to: string;
      };
      footerText: string;
      footerIcon: string;
    };
  }
}

const custom = {
  light: {
    headerGradient: {
      from: "#000741",
      to: "#226062",
    },
    footerText: "#7f83a0",
    footerIcon: "#000",
  },
  dark: {
    headerGradient: {
      from: "#000242",
      to: "#000242",
    },
    footerText: "#7f83a0",
    footerIcon: "#7f83a0",
  },
};

export const themeOptions = (theme: ITheme) => ({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1080,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: palette[theme],
  custom: custom[theme],
});

export default (t: ITheme) => createTheme(defaultTheme, themeOptions(t));
