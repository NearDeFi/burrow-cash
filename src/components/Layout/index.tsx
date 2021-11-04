import { Box } from "@mui/material";

import { Footer, Header } from "../index";
import Background from "./bg.svg";

export const Layout = ({ children }) => {
	return (
		<Box>
			<Box sx={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
				<Background />
			</Box>
			<Header />
			{children}
			<Footer />
		</Box>
	);
};
