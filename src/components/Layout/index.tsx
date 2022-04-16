import { Box, Alert, Link } from "@mui/material";

import { useViewAs } from "../../hooks";
import Footer from "../Footer";
import Header from "../Header";
import Ticker from "../Ticker";

export const Banner = () => (
  <Alert severity="success" sx={{ pl: ["20px", "28px"] }}>
    <Link
      href="https://burrowcash.medium.com/printer-goes-betabrrr-b7faa2ae9bd3"
      title="Printer goes betaBRRR"
      target="_blank"
    >
      We’re announcing betaBRRR, a very, very worthless test token for the public beta release!
    </Link>
  </Alert>
);

const Layout = ({ children }) => {
  const isViewingAs = useViewAs();
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "auto auto 1fr auto",
        gridTemplateColumns: "100%",
        minHeight: "100%",
        border: isViewingAs ? "10px solid #47C880" : "none",
      }}
    >
      <Ticker />
      <Header />
      <main>{children}</main>
      <Footer />
    </Box>
  );
};

export default Layout;
