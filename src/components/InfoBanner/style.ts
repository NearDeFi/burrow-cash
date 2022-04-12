import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Wrapper = styled(Box)(({ theme, style }) => ({
  display: "flex",
  flexGrow: "0",
  flexShrink: "1",
  flexBasis: "auto",
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: style?.flexDirection || "row",
  backgroundColor: theme.palette.secondary.main,
  color: "white",
  boxShadow: "0px 2px 4px rgba(0, 7, 65, 0.2)",
  borderRadius: "4px",
}));
