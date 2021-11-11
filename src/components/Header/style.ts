import { styled } from "@mui/material/styles";
import { Toolbar, Button } from "@mui/material";

export const Wrapper = styled(Toolbar)(({ theme }) => ({
  display: "grid",
  [theme.breakpoints.down("sm")]: {
    marginTop: "1rem",
    gridTemplateAreas: `
    "logo wallet"
    "menu menu"`,
  },
  [theme.breakpoints.up("sm")]: {
    gridTemplateAreas: `"logo menu wallet"`,
    gridTemplateColumns: "auto auto 1fr",
    gap: "3rem",
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
  gridTemplateColumns: "1fr 1fr 1fr",
  marginRight: "auto",
  [theme.breakpoints.down("sm")]: {
    margin: "0 auto",
    marginTop: "1rem",
  },
}));

export const ButtonStyled = styled(Button)(({ theme }) => ({
  borderWidth: 2,
  borderColor: "transparent",
  borderRadius: 0,
  color: theme.palette.secondary.main,
  textTransform: "capitalize",
  paddingLeft: 0,
  paddingRight: 0,
  ":hover": {
    borderWidth: 0,
    borderColor: "transparent",
  },
}));
