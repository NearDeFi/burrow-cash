import { styled } from "@mui/material/styles";
import { OutlinedInput } from "@mui/material";

export const Input = styled(OutlinedInput)(({ theme }) => ({
	width: "100%",
	color: theme.palette.primary.main,
	fontWeight: "bold",
	border: "2px solid",
	borderColor: theme.palette.secondary.main,
}));
