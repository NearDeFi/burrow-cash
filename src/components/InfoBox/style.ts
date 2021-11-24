import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  backgroundColor: theme.palette.secondary.main,
  color: "white",
  boxShadow: "0px 2px 4px rgba(0, 7, 65, 0.2)",
  borderRadius: "4px",
  padding: "0.75rem 1rem",
  margin: "0.75rem",
  width: "100%",
  maxWidth: "250px",
  minWidth: "250px",
  height: "100%",
  minHeight: "110px",
}));

export const Title = styled(Typography)(() => ({
  fontSize: "1rem",
  fontWeight: 400,
  marginBottom: "0.5rem",
}));

export const Value = styled(Typography)(() => ({
  fontSize: "1.35rem",
  fontWeight: "bold",
}));

export const Subtitle = styled(Typography)(() => ({
  fontSize: "0.75rem",
}));

export const InfoWrapper = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "auto auto",
  margin: "3rem auto",
  justifyContent: "center",
  alignContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "auto",
    rowGap: "1rem",
  },
}));
