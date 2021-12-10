import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)(({ theme }) => ({
  padding: "1em",
  boxShadow: "1.5rem",
  backgroundColor: "white",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  [theme.breakpoints.up("sm")]: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "460px",
  },
}));
