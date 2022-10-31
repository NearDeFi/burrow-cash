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
      light: "#c1c2ce",
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
      light: "#3F4361",
    },
    info: {
      main: "#c1c2ce",
    },
    background: {
      default: "#1A1D3A",
      paper: "#1A1D3A",
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
      text: string;
      textStaking: string;
      background: string;
      backgroundStaking: string;
      notConnectedBg: string;
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
    text: "#000",
    textStaking: "#232323",
    background: "#fff",
    backgroundStaking: "#fff",
    notConnectedBg: "rgba(255,255,255,0.85)",
  },
  dark: {
    headerGradient: {
      from: "#000424",
      to: "#000424",
    },
    footerText: "#7f83a0",
    footerIcon: "#7f83a0",
    text: "#fff",
    textStaking: "#fff",
    background: "#000424",
    backgroundStaking: "#31344E",
    notConnectedBg: "rgba(0,0,0,0.85)",
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
