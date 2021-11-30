import { Box } from "@mui/material";
import Footer from "../Footer";
import Header from "../Header";

const Layout = ({ children }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateRows: "auto 1fr auto",
      gridTemplateColumns: "100%",
      minHeight: "100%",
    }}
  >
    <Header />
    <main>{children}</main>
    <Footer />
  </Box>
);

export default Layout;
