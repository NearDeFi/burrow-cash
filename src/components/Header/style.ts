import { styled } from "@mui/material/styles";
import { Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { isTestnet } from "../../utils";

export const Wrapper = styled(Toolbar)(({ theme }) => ({
  display: "grid",
  [theme.breakpoints.down("sm")]: {
    alignItems: "start",
    marginTop: "1rem",
    gridTemplateAreas: `
    "logo wallet"
    "menu menu"`,
  },
  [theme.breakpoints.up("sm")]: {
    gridTemplateAreas: `"logo menu wallet"`,
    gridTemplateColumns: "auto auto 1fr",
    gap: "2rem",
  },
}));

export const Logo = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  gridArea: "logo",
  justifySelf: "start",
}));

export const Menu = styled("div")(({ theme }) => ({
  display: "grid",
  gridArea: "menu",
  gap: "0.5rem",
  gridTemplateColumns: isTestnet ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr",
  marginRight: "auto",
  [theme.breakpoints.down("sm")]: {
    margin: "0 auto",
    marginTop: "1rem",
  },
}));

export const LinkStyled = styled(Link)(({ theme }) => ({
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: "transparent",
  color: theme.palette.secondary.main,
  textDecoration: "none",
  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  textAlign: "center",
  fontWeight: 500,
  fontSize: "0.875rem",
  lineHeight: 1.75,
  letterSpacing: "0.02857rem",
  paddingTop: 4,
  paddingBottom: 4,
  ":hover": {
    borderWidth: 2,
    borderBottomColor: theme.palette.primary.main,
  },
}));
