import { styled } from "@mui/material/styles";
import { OutlinedInput } from "@mui/material";

export const Input = styled(OutlinedInput)(({ theme }) => ({
  width: "100%",
  color: theme.palette.secondary.main,
  fontWeight: "bold",
  "&.MuiOutlinedInput-root": {
    "& > fieldset": {
      borderWidth: 1,
      borderColor: theme.palette.secondary.light,
    },
  },
  "&.MuiOutlinedInput-root:hover": {
    "& > fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));
