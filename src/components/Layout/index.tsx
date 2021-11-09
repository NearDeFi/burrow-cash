import { Box, useMediaQuery } from "@mui/material";
import Footer from "../Footer";
import Header from "../Header";
import BackgroundDesktop from "./bg-desktop.svg";
import BackgroundMobile from "./bg-mobile.svg";
import BackgroundFooter from "./bg-footer.svg";

const Layout = ({ children }) => {
	const matches = useMediaQuery("(min-width:1200px)");
	const Background = !matches ? (
		<BackgroundMobile width="100%" />
	) : (
		<BackgroundDesktop width="100%" />
	);
	return (
		<Box sx={{ position: "relative" }}>
			<Box sx={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 0 }}>
				{Background}
			</Box>
			<Box
				sx={{
					zIndex: 20,
					position: "relative",
					// height: "100vh",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Header />
				{children}
				<Footer />
			</Box>
			<Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 0 }}>
				<BackgroundFooter />
			</Box>
		</Box>
	);
};

export default Layout;
