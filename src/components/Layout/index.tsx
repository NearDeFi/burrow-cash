import { Box } from "@mui/material";
import * as React from "react";
// @ts-ignore
import useMobileDetect from "use-mobile-detect-hook";
import Footer from "../Footer";
import Header from "../Header";
import BackgroundDesktop from "./bg-desktop.svg";
import BackgroundMobile from "./bg-mobile.svg";

const Layout = ({ children }) => {
	const detectMobile = useMobileDetect();
	const Background = detectMobile.isMobile() ? (
		<BackgroundMobile width="100%" />
	) : (
		<BackgroundDesktop width="100%" />
	);
	return (
		<Box sx={{ position: "relative" }}>
			<Box sx={{ position: "absolute", left: 0, right: 0, top: "-20px", bottom: 0, zIndex: 0 }}>
				{Background}
			</Box>
			<Box
				sx={{
					zIndex: 20,
					position: "relative",
					height: "100vh",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Header />
				{children}
				<Footer />
			</Box>
		</Box>
	);
};

export default Layout;
