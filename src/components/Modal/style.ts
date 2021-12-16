import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)(({ theme }) => ({
  boxShadow: "1.5rem",
  backgroundColor: "white",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  [theme.breakpoints.up("sm")]: {
    top: "10%",
    left: "25%",
    display: "flex",
    height: "80vh",
    width: "460px",
  },
}));
