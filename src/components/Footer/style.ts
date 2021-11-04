import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export const Wrapper = styled("div")(({ theme }) => ({
	display: "grid",
	alignItems: "center",
	color: theme.palette.secondary.main,
	[theme.breakpoints.down("sm")]: {
		gridTemplateColumns: "1fr",
		gap: "1rem",
		position: "fixed",
		bottom: 0,
		left: 0,
		right: 0,
	},
	[theme.breakpoints.up("sm")]: {
		gridTemplateColumns: "1fr 1fr",
		width: "100%",
	},
}));

export const CopyWrapper = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	[theme.breakpoints.down("sm")]: {
		justifyContent: "space-around",
	},
	[theme.breakpoints.up("sm")]: {
		margin: theme.spacing(2),
		gap: "1rem",
		paddingLeft: "1rem",
	},
}));

export const LogoWrapper = styled("div")(() => ({
	display: "flex",
}));

export const Copyright = styled(Typography)(({ theme }) => ({
	fontSize: "12px",
	[theme.breakpoints.down("sm")]: {
		gridRow: 1,
		fontWeight: 500,
	},
	[theme.breakpoints.up("sm")]: {
		display: "inline",
	},
}));

export const LinksWrapper = styled("div")(({ theme }) => ({
	fontSize: "12px",
	display: "flex",
	gap: "1rem",
	[theme.breakpoints.down("sm")]: {
		gridRow: 2,
		fontWeight: 500,
		justifyContent: "center",
		marginBottom: theme.spacing(2),
	},
	[theme.breakpoints.up("sm")]: {
		justifySelf: "end",
		paddingRight: "1rem",
	},
}));
