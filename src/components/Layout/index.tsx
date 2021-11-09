import { Box } from "@mui/material";
import Footer from "../Footer";
import Header from "../Header";
// import BackgroundDesktop from "./bg-desktop.svg";
// import BackgroundMobile from "./bg-mobile.svg";
// import BackgroundFooter from "./bg-footer.svg";

const Layout = ({ children }) => (
	<Box
		sx={{
			display: "grid",
			gridTemplateRows: "64px 1fr 64px",
			gridTemplateColumns: "100%",
			minHeight: "100%",
		}}
	>
		{/* <Box sx={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 0 }}>
			{Background}
		</Box> */}

		<Header />
		<main style={{ zIndex: 100 }}>{children}</main>
		<Footer />

		{/* <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 0 }}>
			<BackgroundFooter />
		</Box> */}
	</Box>
);

export default Layout;
