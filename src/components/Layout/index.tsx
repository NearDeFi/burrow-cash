import { Box } from "@mui/material";

import { Footer, Header } from "../index";

export const Layout = ({ children }) => {
	return (
		<Box>
			<Header />
			{children}
			<Footer />
		</Box>
	);
};
