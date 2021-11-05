import { Box } from "@mui/material";

import Footer from "../Footer";
import Header from "../Header";
import Background from "./bg.svg";

const Layout = ({ children }) => {
	return (
		<Box sx={{ position: "relative", backgroundColor: "yellow" }}>
			<Box sx={{ position: "fixed", left: 0, right: 0, top: 0, bottom: 0, zIndex: 0 }}>
				<Background width="100%" />
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
