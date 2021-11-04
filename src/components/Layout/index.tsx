import { Box } from "@mui/material";

import { Footer, Header } from "../index";

const Layout = ({ children }) => {
	return (
		<Box>
			<Header />
			{children}
			<Footer />
		</Box>
	);
};

export default Layout;
