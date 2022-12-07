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
      default: "#1A3632",
      paper: "#1A1E3A",
    },
  },
};

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      headerBackground: string;
      pageBackground: string;
      footerText: string;
      footerIcon: string;
      text: string;
      textStaking: string;
      background: string;
      backgroundStaking: string;
      notConnectedBg: string;
      scrollbarBg: string;
      tableLabelColor: string;
      tableCellBorderBottomColor: string;
      userMenuColor: string;
      stakingCardBg: string;
    };
  }
}

const custom = {
  light: {
    headerBackground:
      "linear-gradient(225deg, rgba(255, 219, 211, 1) 0%, rgba(79, 141, 199, 1) 100%)",
    pageBackground: "linear-gradient(239.61deg, #FBFAFA 0%, #EDF4F9 101.74%)",
    footerText: "#7f83a0",
    footerIcon: "#000",
    text: "#000",
    textStaking: "#232323",
    background: "#fff",
    backgroundStaking: "#fff",
    notConnectedBg: "rgba(255,255,255,0.85)",
    scrollbarBg: "none",
    tableLabelColor: "#8E9295",
    tableCellBorderBottomColor: "#DBDDE1",
    userMenuColor: "#73A1CE",
    stakingCardBg: "#fff",
  },
  dark: {
    headerBackground: "linear-gradient(225deg, rgba(0, 36, 25, 1) 0%, rgba(0, 4, 36, 1) 100%)",
    pageBackground: "linear-gradient(239.61deg, #1A3732 0%, #1A1E3A 101.74%)",
    footerText: "#7f83a0",
    footerIcon: "#7f83a0",
    text: "#fff",
    textStaking: "#fff",
    background: "#000424",
    backgroundStaking: "#31344E",
    notConnectedBg: "rgba(0,0,0,0.85)",
    scrollbarBg: "rgba(0,0,0,0.5)",
    tableLabelColor: "#767E87",
    tableCellBorderBottomColor: "#313C4C",
    userMenuColor: "#1A1D39",
    stakingCardBg: "#31344E",
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
