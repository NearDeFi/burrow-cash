import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)(({ theme }) => ({
  boxShadow: "4px 4px 4px rgba(0, 7, 65, 0.1)",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  [theme.breakpoints.up("sm")]: {
    top: "calc(50% - 40vh)",
    left: "calc(50% - 210px)",
    display: "flex",
    height: "80vh",
    maxHeight: "620px",
    width: "420px",
  },
}));
